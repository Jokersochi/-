import { useState, useCallback } from 'react';
import { paymentApi } from '../services/api';
import { PAYMENT_AMOUNTS } from '../utils/constants';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const createPayment = useCallback(async (packageType, generationId = null) => {
    setLoading(true);
    setError(null);

    try {
      const amount = PAYMENT_AMOUNTS[packageType];
      if (!amount) {
        throw new Error('Неверный тип пакета');
      }

      const descriptions = {
        singleGeneration: 'Одна генерация дизайна',
        pack5: 'Пакет 5 генераций',
        pack10: 'Пакет 10 генераций',
        unlimited: 'Безлимитный доступ на месяц',
      };

      const { data, error: apiError } = await paymentApi.createPayment(
        amount,
        descriptions[packageType],
        {
          packageType,
          generationId,
        }
      );

      if (apiError) {
        throw new Error(apiError);
      }

      setPaymentUrl(data.paymentUrl);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async (paymentId) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: apiError } = await paymentApi.checkPaymentStatus(paymentId);
      
      if (apiError) {
        throw new Error(apiError);
      }

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const redirectToPayment = useCallback(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentUrl(null);
  }, []);

  return {
    createPayment,
    checkStatus,
    redirectToPayment,
    reset,
    loading,
    error,
    paymentUrl,
    packages: PAYMENT_AMOUNTS,
  };
}

export default usePayment;
