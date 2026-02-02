/**
 * Referral Program Page
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { ReferralModel } from '../models/referral.model';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

export default function ReferralPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    try {
      setLoading(true);

      // Generate or get referral code
      const code = await ReferralModel.generateCode(user.id);
      setReferralCode(code);

      // Load referrals and stats
      const [referralsData, statsData] = await Promise.all([
        ReferralModel.getUserReferrals(user.id),
        ReferralModel.getStats(user.id),
      ]);

      setReferrals(referralsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/auth/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Реферальная программа - RoomGenius AI"
        description="Приглашайте друзей и получайте бонусы"
        noindex={true}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              RoomGenius AI
            </Link>
            
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
              ← Назад к дашборду
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Реферальная программа 🎁
            </h1>
            <p className="text-xl text-gray-400">
              Приглашайте друзей и получайте бонусные кредиты
            </p>
          </div>

          {/* Referral Link */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ваша реферальная ссылка</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/signup?ref=${referralCode}`}
                readOnly
                className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white"
              />
              <button
                onClick={copyReferralLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                {copied ? '✓ Скопировано!' : 'Копировать'}
              </button>
            </div>
            <p className="mt-4 text-gray-300 text-sm">
              Ваш код: <span className="font-mono bg-white/10 px-3 py-1 rounded">{referralCode}</span>
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Всего приглашено" value={stats.total} icon="👥" />
              <StatCard title="Активных" value={stats.rewarded} icon="✓" />
              <StatCard title="В ожидании" value={stats.pending} icon="⏳" />
              <StatCard title="Получено кредитов" value={stats.totalRewards} icon="💎" />
            </div>
          )}

          {/* How it works */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Как это работает</h2>
            <div className="space-y-4">
              <Step number="1" text="Поделитесь своей реферальной ссылкой с друзьями" />
              <Step number="2" text="Ваш друг регистрируется по ссылке и получает 3 бонусных кредита" />
              <Step number="3" text="Когда друг совершает первую покупку, вы получаете 5 кредитов" />
              <Step number="4" text="Без ограничений! Приглашайте сколько угодно друзей" />
            </div>
          </div>

          {/* Referrals List */}
          {referrals.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Ваши рефералы</h2>
              <div className="space-y-3">
                {referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                    <div>
                      <div className="text-white font-medium">{ref.profiles?.name || 'Пользователь'}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(ref.created_at).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={ref.status} />
                      {ref.reward_credits > 0 && (
                        <span className="text-green-400 font-semibold">
                          +{ref.reward_credits} 💎
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold">{number}</span>
      </div>
      <p className="text-gray-300 pt-1">{text}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    rewarded: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  const labels = {
    pending: 'Ожидание',
    completed: 'Завершено',
    rewarded: 'Вознаграждено',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}
