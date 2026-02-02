import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { withAuth } from '../../middleware/withAuth';
import { DashboardSidebar, ReferralCard } from '../../components/dashboard';
import { Card } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/helpers';
import { Users, Gift } from 'lucide-react';

function ReferralsPage() {
  const { profile } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await fetch('/api/user/referrals');
      const data = await response.json();
      setReferrals(data.referrals || []);
    } catch (error) {
      console.error('Failed to fetch referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Реферальная программа | RoomGenius AI</title>
      </Head>

      <div className="min-h-screen bg-black flex">
        <DashboardSidebar className="hidden lg:flex" />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-8">Реферальная программа</h1>

            {/* Referral Card */}
            <ReferralCard
              referralCode={profile?.referral_code || 'XXXXXX'}
              stats={{
                totalReferrals: referrals.length,
                earnedCredits: referrals.length * 2,
                conversionRate: 15,
              }}
            />

            {/* How it works */}
            <Card className="mt-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Как это работает
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h4 className="text-white font-medium mb-2">Поделитесь ссылкой</h4>
                  <p className="text-gray-400 text-sm">
                    Отправьте вашу реферальную ссылку друзьям
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h4 className="text-white font-medium mb-2">Друг регистрируется</h4>
                  <p className="text-gray-400 text-sm">
                    Друг создаёт аккаунт по вашей ссылке
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h4 className="text-white font-medium mb-2">Получаете награду</h4>
                  <p className="text-gray-400 text-sm">
                    Вы оба получаете по 2 бесплатных кредита!
                  </p>
                </div>
              </div>
            </Card>

            {/* Referrals List */}
            <Card className="mt-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Ваши рефералы ({referrals.length})
              </h3>

              {referrals.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  У вас пока нет рефералов. Поделитесь ссылкой с друзьями!
                </p>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {referral.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-white">{referral.email}</p>
                          <p className="text-gray-500 text-sm">
                            {formatDate(referral.created_at)}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        +2 кредита
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

export default withAuth(ReferralsPage, { requireAuth: true });
