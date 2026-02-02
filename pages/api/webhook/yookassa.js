/**
 * Yookassa Webhook Handler
 * Handles payment notifications from Yookassa
 */

import { supabase } from '../../../lib/supabase';
import { UserModel } from '../../../models/user.model';
import { EmailService } from '../../../services/email.service';
import { env } from '../../../config/env';
import { logError } from '../../../utils/errors';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;

    // Verify webhook signature (optional but recommended)
    const signature = req.headers['x-yookassa-signature'];
    if (signature && !verifySignature(event, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Handle different event types
    switch (event.event) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.object);
        break;
      
      case 'payment.canceled':
        await handlePaymentCanceled(event.object);
        break;
      
      case 'payment.waiting_for_capture':
        // Payment is on hold, waiting for capture
        await handlePaymentWaiting(event.object);
        break;
      
      case 'refund.succeeded':
        await handleRefundSucceeded(event.object);
        break;
      
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logError(error, 'yookassa webhook');
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(payment) {
  try {
    const paymentId = payment.id;
    const metadata = payment.metadata || {};
    const amount = parseFloat(payment.amount.value);

    // Find payment record
    const { data: paymentRecord } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', paymentId)
      .single();

    if (!paymentRecord) {
      // Create new payment record if not exists
      const userId = metadata.user_id;
      const credits = metadata.credits || 0;

      await supabase.from('payments').insert({
        payment_id: paymentId,
        user_id: userId,
        amount,
        status: 'succeeded',
        plan: metadata.plan,
        credits,
        metadata,
      });

      // Add credits to user
      if (credits > 0 && userId) {
        await UserModel.addCredits(userId, credits);

        // Get user info for email
        const profile = await UserModel.getProfile(userId);
        
        // Send confirmation email
        await EmailService.sendPaymentSuccessEmail(
          profile.email,
          profile.name,
          amount,
          credits
        );
      }
    } else {
      // Update existing record
      await supabase
        .from('payments')
        .update({ status: 'succeeded' })
        .eq('payment_id', paymentId);

      // Add credits if not already added
      if (paymentRecord.status !== 'succeeded' && paymentRecord.credits > 0) {
        await UserModel.addCredits(paymentRecord.user_id, paymentRecord.credits);

        const profile = await UserModel.getProfile(paymentRecord.user_id);
        await EmailService.sendPaymentSuccessEmail(
          profile.email,
          profile.name,
          amount,
          paymentRecord.credits
        );
      }
    }

    // Track analytics
    await supabase.from('analytics').insert({
      event_type: 'payment_succeeded',
      user_id: metadata.user_id,
      metadata: { payment_id: paymentId, amount, credits: metadata.credits },
    });
  } catch (error) {
    logError(error, 'handlePaymentSucceeded');
    throw error;
  }
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(payment) {
  try {
    await supabase
      .from('payments')
      .update({ status: 'canceled' })
      .eq('payment_id', payment.id);

    await supabase.from('analytics').insert({
      event_type: 'payment_canceled',
      metadata: { payment_id: payment.id },
    });
  } catch (error) {
    logError(error, 'handlePaymentCanceled');
    throw error;
  }
}

/**
 * Handle payment waiting for capture
 */
async function handlePaymentWaiting(payment) {
  try {
    await supabase
      .from('payments')
      .update({ status: 'pending' })
      .eq('payment_id', payment.id);
  } catch (error) {
    logError(error, 'handlePaymentWaiting');
    throw error;
  }
}

/**
 * Handle successful refund
 */
async function handleRefundSucceeded(refund) {
  try {
    const paymentId = refund.payment_id;

    // Find payment record
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', paymentId)
      .single();

    if (payment && payment.credits > 0) {
      // Deduct credits from user
      const profile = await UserModel.getProfile(payment.user_id);
      if (profile.credits >= payment.credits) {
        await supabase
          .from('profiles')
          .update({ credits: profile.credits - payment.credits })
          .eq('id', payment.user_id);
      }
    }

    // Update payment status
    await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('payment_id', paymentId);

    await supabase.from('analytics').insert({
      event_type: 'payment_refunded',
      user_id: payment?.user_id,
      metadata: { payment_id: paymentId, refund_id: refund.id },
    });
  } catch (error) {
    logError(error, 'handleRefundSucceeded');
    throw error;
  }
}

/**
 * Verify webhook signature
 */
function verifySignature(event, signature) {
  // Implement signature verification based on Yookassa documentation
  // This is a placeholder - implement actual verification
  const crypto = require('crypto');
  
  if (!env.yookassa.secretKey) return true; // Skip if no secret key
  
  const hmac = crypto.createHmac('sha256', env.yookassa.secretKey);
  hmac.update(JSON.stringify(event));
  const calculatedSignature = hmac.digest('hex');
  
  return calculatedSignature === signature;
}
