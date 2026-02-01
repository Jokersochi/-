/**
 * Payment API Route
 * Handles Yookassa payment creation
 */

import { env } from '../../config/env';
import { createErrorResponse, logError, AppError } from '../../utils/errors';

/**
 * Creates a payment with Yookassa
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description, metadata = {} } = req.body;

    // Validate input
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new AppError('Invalid amount', 400, 'INVALID_AMOUNT');
    }

    if (!description || typeof description !== 'string') {
      throw new AppError('Description is required', 400, 'MISSING_DESCRIPTION');
    }

    // Check if Yookassa credentials are configured
    if (!env.yookassa.shopId || !env.yookassa.secretKey) {
      throw new AppError(
        'Payment system not configured',
        500,
        'PAYMENT_NOT_CONFIGURED'
      );
    }

    // Generate idempotence key for Yookassa
    const idempotenceKey = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    // Create payment with Yookassa
    const paymentData = {
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
      },
      capture: true,
      description,
      metadata,
    };

    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        'Authorization': `Basic ${Buffer.from(
          `${env.yookassa.shopId}:${env.yookassa.secretKey}`
        ).toString('base64')}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logError(new Error(JSON.stringify(errorData)), 'Yookassa API');
      throw new AppError(
        'Failed to create payment',
        response.status,
        'YOOKASSA_ERROR'
      );
    }

    const payment = await response.json();

    res.status(200).json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation.confirmation_url,
      status: payment.status,
    });
  } catch (error) {
    logError(error, 'payment API');
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.statusCode).json({
      error: errorResponse.error,
      code: errorResponse.code,
    });
  }
}
