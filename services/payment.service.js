/**
 * Payment service for handling Yookassa payments
 */

import { API_ROUTES } from '../config/constants';
import { AppError, logError } from '../utils/errors';

/**
 * Creates a payment with Yookassa
 * @param {Object} params - Payment parameters
 * @param {number} params.amount - Amount in rubles
 * @param {string} params.description - Payment description
 * @param {Object} params.metadata - Additional metadata
 * @returns {Promise<Object>} Payment data including confirmation URL
 */
export async function createPayment({ amount, description, metadata = {} }) {
  try {
    const response = await fetch(API_ROUTES.PAYMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        description,
        metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(
        errorData.error || 'Не удалось создать платёж',
        response.status,
        'PAYMENT_CREATION_FAILED'
      );
    }

    const data = await response.json();
    
    if (!data.confirmationUrl) {
      throw new AppError(
        'Не получена ссылка для оплаты',
        500,
        'NO_CONFIRMATION_URL'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logError(error, 'createPayment');
    throw new AppError(
      'Не удалось создать платёж',
      500,
      'PAYMENT_CREATION_FAILED'
    );
  }
}

/**
 * Checks payment status
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Payment status
 */
export async function checkPaymentStatus(paymentId) {
  try {
    const response = await fetch(`${API_ROUTES.PAYMENT}/${paymentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new AppError(
        'Не удалось проверить статус платежа',
        response.status,
        'PAYMENT_STATUS_CHECK_FAILED'
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logError(error, 'checkPaymentStatus');
    throw new AppError(
      'Не удалось проверить статус платежа',
      500,
      'PAYMENT_STATUS_CHECK_FAILED'
    );
  }
}
