/**
 * Custom hook for handling payments
 */

import { useState, useCallback } from 'react';
import { createPayment } from '../services/payment.service';
import { formatErrorMessage, logError } from '../utils/errors';

/**
 * Hook for managing payment state and operations
 * @returns {Object} State and functions for payments
 */
export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Initiates payment process
   * @param {Object} params - Payment parameters
   * @param {number} params.amount - Amount in rubles
   * @param {string} params.description - Payment description
   * @param {Object} params.metadata - Additional metadata
   */
  const initiatePayment = useCallback(async ({ amount, description, metadata = {} }) => {
    setLoading(true);
    setError(null);

    try {
      const paymentData = await createPayment({
        amount,
        description,
        metadata,
      });

      // Redirect to payment page
      if (paymentData.confirmationUrl) {
        window.location.href = paymentData.confirmationUrl;
      }

      return paymentData;
    } catch (err) {
      logError(err, 'usePayment.initiatePayment');
      setError(formatErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clears error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    initiatePayment,
    clearError,
  };
}
