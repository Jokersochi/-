import React from 'react';
import { Modal, Button, Card } from '../ui';
import { usePayment } from '../../hooks/usePayment';
import { formatPrice } from '../../utils/helpers';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const packages = [
  {
    id: 'singleGeneration',
    name: 'Одна генерация',
    icon: Sparkles,
    features: ['1 HD изображение', 'Скачивание без водяного знака'],
    popular: false,
  },
  {
    id: 'pack5',
    name: 'Пакет 5',
    icon: Zap,
    features: ['5 HD изображений', 'Все стили дизайна', 'Приоритетная генерация'],
    popular: true,
  },
  {
    id: 'pack10',
    name: 'Пакет 10',
    icon: Zap,
    features: ['10 HD изображений', 'Все стили дизайна', 'Приоритетная генерация', 'Экономия 30%'],
    popular: false,
  },
  {
    id: 'unlimited',
    name: 'Безлимит',
    icon: Crown,
    features: ['Безлимитные генерации', 'Все стили дизайна', 'Максимальный приоритет', 'Действует 1 месяц'],
    popular: false,
  },
];

export function PaymentModal({ isOpen, onClose, generationId = null }) {
  const { createPayment, redirectToPayment, loading, error, packages: prices } = usePayment();

  const handleSelectPackage = async (packageId) => {
    const result = await createPayment(packageId, generationId);
    if (result?.paymentUrl) {
      window.location.href = result.paymentUrl;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Выберите пакет" size="xl">
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          const price = prices[pkg.id];

          return (
            <Card
              key={pkg.id}
              className={`relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}
              padding="md"
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 rounded-full text-white text-xs font-medium">
                  Популярный
                </div>
              )}

              <div className="text-center mb-4">
                <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                <p className="text-2xl font-bold text-white mt-2">
                  {formatPrice(price)}
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                variant={pkg.popular ? 'primary' : 'outline'}
                onClick={() => handleSelectPackage(pkg.id)}
                loading={loading}
              >
                Выбрать
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Безопасная оплата через Yookassa</p>
        <p className="mt-1">Visa, MasterCard, Mir, СБП</p>
      </div>
    </Modal>
  );
}

export default PaymentModal;
