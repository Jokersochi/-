/**
 * Favorites Page
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { FavoriteModel } from '../models/collection.model';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
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
      loadFavorites();
    }
  }, [user, page]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await FavoriteModel.getUserFavorites(user.id, { page, limit: 12 });
      setFavorites(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load favorites:', error);
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
    <>
      <SEO
        title="Избранное - RoomGenius AI"
        description="Ваши любимые дизайны интерьера"
        noindex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              RoomGenius AI
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                Дашборд
              </Link>
              <Link href="/collections" className="text-gray-400 hover:text-white transition">
                Коллекции
              </Link>
              <Link href="/favorites" className="text-white hover:text-blue-400 transition">
                Избранное
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Избранное</h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-6xl mb-4">⭐</div>
              <p className="text-gray-400 mb-4">У вас пока нет избранных дизайнов</p>
              <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
                Перейти к генерациям →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((fav) => (
                  <FavoriteCard key={fav.id} favorite={fav} onRemove={loadFavorites} />
                ))}
              </div>

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
        </main>
      </div>
    </>
  );
}

function FavoriteCard({ favorite, onRemove }) {
  const { user } = useAuth();
  const generation = favorite.generations;

  const handleRemove = async () => {
    try {
      await FavoriteModel.remove(user.id, generation.id);
      onRemove();
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  return (
    <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition group">
      <div className="aspect-square bg-gray-800 relative overflow-hidden">
        <img
          src={generation.generated_image_url}
          alt="Favorite design"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full transition opacity-0 group-hover:opacity-100"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 capitalize">{generation.style}</span>
          <span className="text-xs text-gray-500">
            {new Date(favorite.created_at).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
    </div>
  );
}
