import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { withAuth } from '../../middleware/withAuth';
import { DashboardSidebar, DashboardStats, ReferralCard, SubscriptionCard } from '../../components/dashboard';
import { Card, Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/helpers';
import { ImageIcon, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentGenerations, setRecentGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/dashboard');
      const data = await response.json();
      
      setStats(data.stats);
      setRecentGenerations(data.recentGenerations || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Личный кабинет | RoomGenius AI</title>
      </Head>

      <div className="min-h-screen bg-black flex">
        {/* Sidebar */}
        <DashboardSidebar className="hidden lg:flex" />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">RoomGenius</span>
              </Link>
            </div>
          </header>

          <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Welcome */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Привет, {user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-gray-400">
                У вас {profile?.credits === -1 ? 'безлимитный доступ' : `${profile?.credits || 0} кредитов`}
              </p>
            </div>

            {/* Stats */}
            <DashboardStats stats={stats} />

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Design CTA */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Создать новый дизайн
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Преобразите вашу комнату с помощью ИИ прямо сейчас
                  </p>
                  <Link href="/">
                    <Button icon={ArrowRight} iconPosition="right">
                      Начать генерацию
                    </Button>
                  </Link>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
              </Card>

              {/* Subscription */}
              <SubscriptionCard
                currentPlan={profile?.subscription_type || 'free'}
                expiresAt={profile?.subscription_expires_at}
                onUpgrade={(plan) => console.log('Upgrade to:', plan)}
              />
            </div>

            {/* Recent Generations */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Последние генерации</h2>
                <Link href="/dashboard/history" className="text-blue-400 text-sm hover:text-blue-300">
                  Смотреть все →
                </Link>
              </div>

              {recentGenerations.length === 0 ? (
                <Card className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">У вас пока нет генераций</p>
                  <Link href="/">
                    <Button size="sm">Создать первый дизайн</Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recentGenerations.slice(0, 4).map((gen) => (
                    <Card key={gen.id} padding="none" hover className="overflow-hidden group">
                      <div className="aspect-square relative">
                        <img
                          src={gen.generated_image_url}
                          alt={gen.style}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" variant="ghost">
                            Открыть
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-white text-sm font-medium capitalize">{gen.style}</p>
                        <p className="text-gray-500 text-xs">{formatDate(gen.created_at)}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Referral Program */}
            <div className="mt-8">
              <ReferralCard
                referralCode={profile?.referral_code || 'XXXXXX'}
                stats={{
                  totalReferrals: profile?.referral_count || 0,
                  earnedCredits: (profile?.referral_count || 0) * 2,
                  conversionRate: 15,
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default withAuth(Dashboard, { requireAuth: true });
