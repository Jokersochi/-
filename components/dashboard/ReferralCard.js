import React, { useState } from 'react';
import { Card, Button } from '../ui';
import { Copy, Check, Users, Gift, ExternalLink } from 'lucide-react';
import { config } from '../../config';

export function ReferralCard({ referralCode, stats }) {
  const [copied, setCopied] = useState(false);
  
  const referralLink = `${config.app.url}?ref=${referralCode}`;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RoomGenius AI - Дизайн интерьера с ИИ',
          text: `Получи бесплатную генерацию дизайна! Регистрируйся по моей ссылке:`,
          url: referralLink,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Реферальная программа</h3>
            <p className="text-sm text-gray-400">
              Получайте {config.referral.creditReward} кредита за каждого друга
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-2xl font-bold text-white">{stats?.totalReferrals || 0}</p>
            <p className="text-xs text-gray-400">Приглашено</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-2xl font-bold text-green-400">{stats?.earnedCredits || 0}</p>
            <p className="text-xs text-gray-400">Кредитов</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-2xl font-bold text-purple-400">{stats?.conversionRate || 0}%</p>
            <p className="text-xs text-gray-400">Конверсия</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Ваша ссылка:</label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-800 rounded-xl text-gray-300 text-sm truncate border border-white/10">
              {referralLink}
            </div>
            <Button
              variant={copied ? 'success' : 'primary'}
              icon={copied ? Check : Copy}
              onClick={handleCopy}
            >
              {copied ? 'Скопировано' : 'Копировать'}
            </Button>
          </div>
        </div>

        {/* Share Button */}
        <Button
          fullWidth
          variant="outline"
          icon={ExternalLink}
          onClick={handleShare}
        >
          Поделиться ссылкой
        </Button>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Когда друг регистрируется по вашей ссылке, вы оба получаете {config.referral.creditReward} бесплатных кредита!
        </p>
      </div>
    </Card>
  );
}

export default ReferralCard;
