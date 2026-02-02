import React from 'react';
import { Card, Button } from '../ui';
import { SUBSCRIPTION_TIERS } from '../../config';
import { formatPrice, formatDate } from '../../utils/helpers';
import { Crown, Check, Zap, ArrowRight } from 'lucide-react';

export function SubscriptionCard({ currentPlan = 'free', expiresAt, onUpgrade }) {
  const tier = SUBSCRIPTION_TIERS[currentPlan] || SUBSCRIPTION_TIERS.free;
  const isUnlimited = currentPlan === 'unlimited';

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient for premium */}
      {isUnlimited && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              isUnlimited 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                : 'bg-gray-700'
            }`}>
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{tier.name}</h3>
              <p className="text-sm text-gray-400">Текущий план</p>
            </div>
          </div>
          {tier.price > 0 && (
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{formatPrice(tier.price)}</p>
              <p className="text-sm text-gray-400">
                {tier.period ? `/ ${tier.period === 'month' ? 'месяц' : tier.period}` : 'единоразово'}
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Expiration */}
        {expiresAt && (
          <div className="p-4 bg-white/5 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Активен до:</span>
              <span className="text-white font-medium">{formatDate(expiresAt)}</span>
            </div>
          </div>
        )}

        {/* Upgrade Buttons */}
        {currentPlan !== 'unlimited' && (
          <div className="space-y-3">
            {currentPlan === 'free' && (
              <>
                <Button
                  fullWidth
                  variant="primary"
                  icon={Zap}
                  onClick={() => onUpgrade?.('starter')}
                >
                  Получить Starter — {formatPrice(SUBSCRIPTION_TIERS.starter.price)}
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  icon={Crown}
                  onClick={() => onUpgrade?.('unlimited')}
                >
                  Unlimited — {formatPrice(SUBSCRIPTION_TIERS.unlimited.price)}/мес
                </Button>
              </>
            )}
            {(currentPlan === 'starter' || currentPlan === 'pro') && (
              <Button
                fullWidth
                variant="primary"
                icon={Crown}
                onClick={() => onUpgrade?.('unlimited')}
              >
                Перейти на Unlimited
              </Button>
            )}
          </div>
        )}

        {/* Unlimited badge */}
        {isUnlimited && (
          <div className="text-center py-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
            <p className="text-white font-medium">✨ Максимальный план</p>
            <p className="text-sm text-gray-400">Безлимитный доступ ко всем функциям</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default SubscriptionCard;
