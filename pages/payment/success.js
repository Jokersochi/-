import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, Button } from '../../components/ui';
import { CheckCircle, XCircle, Loader2, Home, RefreshCw } from 'lucide-react';
import { paymentApi } from '../../services/api';

export default function PaymentSuccess() {
  const router = useRouter();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const checkPayment = async () => {
      // Get payment ID from URL or localStorage
      const paymentId = router.query.paymentId || localStorage.getItem('lastPaymentId');
      
      if (!paymentId) {
        // No payment ID, assume success from redirect
        setStatus('success');
        return;
      }

      try {
        const { data, error } = await paymentApi.checkPaymentStatus(paymentId);
        
        if (error) {
          setStatus('error');
          return;
        }

        setPaymentData(data);
        setStatus(data.paid ? 'success' : 'pending');
      } catch (err) {
        console.error('Error checking payment:', err);
        setStatus('error');
      }
    };

    if (router.isReady) {
      checkPayment();
    }
  }, [router.isReady, router.query.paymentId]);

  return (
    <>
      <Head>
        <title>Оплата - RoomGenius AI</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center p-8">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-2">
                Проверяем оплату...
              </h1>
              <p className="text-gray-400">
                Пожалуйста, подождите
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Оплата успешна!
              </h1>
              <p className="text-gray-400 mb-8">
                Спасибо за покупку. Ваши кредиты уже добавлены на аккаунт.
              </p>
              <Link href="/">
                <Button fullWidth icon={Home}>
                  Вернуться к генерации
                </Button>
              </Link>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-12 h-12 text-yellow-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Обработка платежа
              </h1>
              <p className="text-gray-400 mb-8">
                Ваш платёж обрабатывается. Кредиты будут добавлены автоматически.
              </p>
              <Link href="/">
                <Button fullWidth variant="outline" icon={Home}>
                  Вернуться на главную
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Ошибка оплаты
              </h1>
              <p className="text-gray-400 mb-8">
                К сожалению, не удалось обработать платёж. Попробуйте снова или обратитесь в поддержку.
              </p>
              <div className="space-y-3">
                <Link href="/">
                  <Button fullWidth icon={Home}>
                    На главную
                  </Button>
                </Link>
                <Button 
                  fullWidth 
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Проверить снова
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
