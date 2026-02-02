/**
 * Pricing Page
 */

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { usePayment } from '../hooks/usePayment';
import SEO from '../components/SEO';

const plans = [
  {
    name: 'Starter',
    price: 299,
    credits: 10,
    features: [
      '10 генераций',
      'Все стили дизайна',
      'HD качество',
      'Базовая поддержка',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: 799,
    credits: 30,
    features: [
      '30 генераций',
      'Все стили дизайна',
      '4K качество',
      'Приоритетная поддержка',
      'Эксклюзивные стили',
    ],
    popular: true,
  },
  {
    name: 'Business',
    price: 1999,
    credits: 100,
    features: [
      '100 генераций',
      'Все стили дизайна',
      '4K качество',
      'VIP поддержка 24/7',
      'Эксклюзивные стили',
      'API доступ',
      'Брендинг',
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { initiatePayment, loading } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePurchase = async (plan) => {
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }

    setSelectedPlan(plan.name);
    
    try {
      await initiatePayment({
        amount: plan.price,
        description: `RoomGenius AI - ${plan.name} (${plan.credits} кредитов)`,
        metadata: {
          plan: plan.name,
          credits: plan.credits,
        },
      });
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setSelectedPlan(null);
    }
  };

  return (
    <>
      <SEO
        title="Тарифы - RoomGenius AI"
        description="Выберите подходящий тариф для создания потрясающих дизайнов интерьера с помощью AI"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              RoomGenius AI
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Выберите ваш план
            </h1>
            <p className="text-xl text-gray-400">
              Создавайте потрясающие дизайны по доступным ценам
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white/5 rounded-2xl p-8 border ${
                  plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Популярный
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-5xl font-bold text-white mb-2">
                    {plan.price} ₽
                  </div>
                  <p className="text-gray-400">{plan.credits} кредитов</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={loading && selectedPlan === plan.name}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  } disabled:opacity-50`}
                >
                  {loading && selectedPlan === plan.name ? 'Обработка...' : 'Купить'}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Часто задаваемые вопросы
            </h2>
            
            <div className="space-y-6">
              <FAQItem
                question="Что такое кредиты?"
                answer="Каждая генерация дизайна стоит 1 кредит. Кредиты не сгорают и остаются на вашем аккаунте."
              />
              <FAQItem
                question="Могу ли я вернуть деньги?"
                answer="Да, мы предоставляем возврат средств в течение 14 дней, если вы не использовали кредиты."
              />
              <FAQItem
                question="Какие способы оплаты доступны?"
                answer="Мы принимаем все основные банковские карты через Yookassa."
              />
              <FAQItem
                question="Могу ли я обновить план?"
                answer="Да, вы можете купить дополнительные кредиты в любое время."
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition"
      >
        <span className="text-white font-semibold">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-400">{answer}</p>
        </div>
      )}
    </div>
  );
}
