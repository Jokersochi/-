/**
 * Admin Dashboard
 * Analytics and platform management
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Get various statistics
      const [usersCount, generationsCount, paymentsSum, popularStyles] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('generations').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('amount').eq('status', 'succeeded'),
        supabase.from('popular_styles').select('*'),
      ]);

      const totalRevenue = paymentsSum.data?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

      setStats({
        totalUsers: usersCount.count || 0,
        totalGenerations: generationsCount.count || 0,
        totalRevenue,
        popularStyles: popularStyles.data || [],
      });
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Всего пользователей"
                value={stats.totalUsers}
                icon="👥"
                color="blue"
              />
              <StatCard
                title="Всего генераций"
                value={stats.totalGenerations}
                icon="🎨"
                color="purple"
              />
              <StatCard
                title="Доход"
                value={`${stats.totalRevenue.toFixed(2)} ₽`}
                icon="💰"
                color="green"
              />
              <StatCard
                title="Конверсия"
                value={stats.totalUsers > 0 ? `${((stats.totalGenerations / stats.totalUsers) * 100).toFixed(1)}%` : '0%'}
                icon="📈"
                color="yellow"
              />
            </div>

            {/* Popular Styles */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Популярные стили (30 дней)</h2>
              <div className="space-y-3">
                {stats.popularStyles.map((style) => (
                  <div key={style.style} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🎨</div>
                      <div>
                        <div className="text-white font-medium capitalize">{style.style}</div>
                        <div className="text-sm text-gray-400">
                          Успешно: {style.completed_count} | Ошибки: {style.failed_count}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{style.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 backdrop-blur-md`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-300">{title}</div>
    </div>
  );
}
