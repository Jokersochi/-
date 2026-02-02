/**
 * User Dashboard
 * Shows user's generations, statistics, and profile
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { GenerationModel } from '../models/generation.model';
import { UserModel } from '../models/user.model';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [generations, setGenerations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, page]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [generationsData, statsData] = await Promise.all([
        GenerationModel.getUserGenerations(user.id, { page, limit: 12 }),
        UserModel.getStatistics(user.id),
      ]);
      
      setGenerations(generationsData.data);
      setPagination(generationsData.pagination);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <LoadingSpinner message="Загрузка..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            RoomGenius AI
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-white hover:text-blue-400 transition">
              Дашборд
            </Link>
            <Link href="/collections" className="text-gray-400 hover:text-white transition">
              Коллекции
            </Link>
            <Link href="/favorites" className="text-gray-400 hover:text-white transition">
              Избранное
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition"
            >
              Выйти
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Кредиты"
            value={stats?.credits || 0}
            icon="💎"
            color="blue"
          />
          <StatCard
            title="Генераций"
            value={stats?.total_generations || 0}
            icon="🎨"
            color="purple"
          />
          <StatCard
            title="Коллекций"
            value={stats?.total_collections || 0}
            icon="📁"
            color="green"
          />
          <StatCard
            title="Избранное"
            value={stats?.total_favorites || 0}
            icon="⭐"
            color="yellow"
          />
        </div>

        {/* Actions */}
        <div className="mb-8 flex space-x-4">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            + Создать дизайн
          </Link>
          <Link
            href="/pricing"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition border border-white/20"
          >
            Купить кредиты
          </Link>
        </div>

        {/* Generations Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Ваши генерации</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : generations.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400 mb-4">У вас пока нет генераций</p>
              <Link href="/" className="text-blue-400 hover:text-blue-300">
                Создать первый дизайн →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {generations.map((gen) => (
                  <GenerationCard key={gen.id} generation={gen} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-lg text-white"
                  >
                    ← Назад
                  </button>
                  <span className="px-4 py-2 text-white">
                    {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-lg text-white"
                  >
                    Вперед →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
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

function GenerationCard({ generation }) {
  const statusColors = {
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    pending: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition group">
      <div className="aspect-square bg-gray-800 relative overflow-hidden">
        {generation.generated_image_url ? (
          <img
            src={generation.generated_image_url}
            alt="Generated design"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <LoadingSpinner message="" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 capitalize">{generation.style}</span>
          <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[generation.status]}`}>
            {generation.status}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {new Date(generation.created_at).toLocaleDateString('ru-RU')}
        </p>
      </div>
    </div>
  );
}
