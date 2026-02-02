import React, { useState } from 'react';
import Head from 'next/head';
import { Header, Footer } from '../components/layout';
import { Card, Button } from '../components/ui';
import { SUBSCRIPTION_TIERS } from '../config';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../hooks/usePayment';
import { Check, Zap, Crown, Sparkles, Star } from 'lucide-react';

const tierOrder = ['free', 'starter', 'pro', 'unlimited'];

const tierIcons = {
  free: Sparkles,
  starter: Zap,
  pro: Star,
  unlimited: Crown,
};

const tierColors = {
  free: 'from-gray-500 to-gray-700',
  starter: 'from-blue-500 to-blue-700',
  pro: 'from-purple-500 to-purple-700',
  unlimited: 'from-yellow-400 to-orange-500',
};

export default function PricingPage() {
  const { isAuthenticated, profile } = useAuth();
  const { createPayment, loading } = usePayment();
  const [selectedTier, setSelectedTier] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const handleSelectPlan = async (tierId) => {
    if (tierId === 'free') return;

    if (!isAuthenticated) {
      // Show auth modal
      window.location.href = `/?auth=true&plan=${tierId}`;
      return;
    }

    setSelectedTier(tierId);
    const result = await createPayment(tierId);
    if (result?.paymentUrl) {
      window.location.href = result.paymentUrl;
    }
  };

  const currentPlan = profile?.subscription_type || 'free';

  return (
    <>
      <Head>
        <title>Тарифы | RoomGenius AI</title>
        <meta name="description" content="Выберите подходящий тариф для дизайна интерьеров с помощью ИИ. От бесплатной пробной генерации до безлимитного доступа." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Простые и прозрачные цены
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Выберите подходящий план
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Начните бесплатно и масштабируйтесь по мере роста. Без скрытых платежей.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center p-1 bg-white/10 rounded-xl">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-lg transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Ежемесячно
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-3 rounded-lg transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Годовой <span className="text-green-400 text-sm ml-1">-20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tierOrder.map((tierId) => {
              const tier = SUBSCRIPTION_TIERS[tierId];
              const Icon = tierIcons[tierId];
              const isPopular = tierId === 'pro';
              const isCurrent = currentPlan === tierId;
              const price = billingPeriod === 'yearly' && tier.price > 0
                ? Math.round(tier.price * 0.8 * 12)
                : tier.price;

              return (
                <Card
                  key={tierId}
                  className={`relative ${isPopular ? 'ring-2 ring-blue-500' : ''} ${
                    isCurrent ? 'ring-2 ring-green-500' : ''
                  }`}
                  padding="lg"
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 rounded-full text-white text-sm font-medium">
                      Популярный
                    </div>
                  )}

                  {/* Current Badge */}
                  {isCurrent && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 rounded-full text-white text-sm font-medium">
                      Текущий
                    </div>
                  )}

                  {/* Icon & Name */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${tierColors[tierId]} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    {tier.price === 0 ? (
                      <p className="text-4xl font-bold text-white">Бесплатно</p>
                    ) : (
                      <>
                        <p className="text-4xl font-bold text-white">
                          {formatPrice(price)}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {tier.period 
                            ? (billingPeriod === 'yearly' ? '/ год' : '/ месяц')
                            : 'единоразово'
                          }
                        </p>
                      </>
                    )}
                  </div>

                  {/* Credits */}
                  {tier.credits && (
                    <div className="text-center mb-6 py-3 bg-white/5 rounded-xl">
                      <p className="text-2xl font-bold text-blue-400">
                        {tier.credits === -1 ? '∞' : tier.credits}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {tier.credits === -1 ? 'Безлимит' : 'генераций'}
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    fullWidth
                    variant={isPopular ? 'primary' : 'outline'}
                    disabled={isCurrent || (tierId === 'free' && isAuthenticated)}
                    loading={loading && selectedTier === tierId}
                    onClick={() => handleSelectPlan(tierId)}
                  >
                    {isCurrent 
                      ? 'Текущий план' 
                      : tierId === 'free' 
                        ? 'Начать бесплатно'
                        : 'Выбрать'
                    }
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Часто задаваемые вопросы
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Как работают кредиты?',
                  a: '1 кредит = 1 генерация дизайна в HD качестве. Кредиты не сгорают и остаются на вашем аккаунте навсегда.',
                },
                {
                  q: 'Могу ли я получить возврат?',
                  a: 'Да, мы предоставляем полный возврат в течение 14 дней, если вы не использовали кредиты.',
                },
                {
                  q: 'Что такое безлимитный план?',
                  a: 'С безлимитным планом вы можете создавать неограниченное количество дизайнов в течение месяца подписки.',
                },
                {
                  q: 'Как отменить подписку?',
                  a: 'Вы можете отменить подписку в любой момент в личном кабинете. Доступ сохранится до конца оплаченного периода.',
                },
              ].map((faq, idx) => (
                <Card key={idx}>
                  <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                  <p className="text-gray-400 text-sm">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-24 text-center">
            <Card className="inline-block max-w-2xl mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">
                Остались вопросы?
              </h3>
              <p className="text-gray-400 mb-6">
                Напишите нам, и мы поможем выбрать подходящий план
              </p>
              <Button variant="primary">
                Связаться с нами
              </Button>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
