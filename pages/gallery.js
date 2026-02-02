/**
 * Public Gallery Page
 * Browse public designs with filters
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { DESIGN_STYLES, STYLE_LABELS } from '../config/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

export default function GalleryPage() {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    style: 'all',
    sortBy: 'recent',
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadGenerations();
  }, [filters, page]);

  const loadGenerations = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('generations')
        .select(`
          *,
          profiles (name, avatar_url),
          likes (count),
          comments (count)
        `)
        .eq('status', 'completed')
        .range((page - 1) * 12, page * 12 - 1);

      // Apply filters
      if (filters.style !== 'all') {
        query = query.eq('style', filters.style);
      }

      // Apply sorting
      if (filters.sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (filters.sortBy === 'popular') {
        // This would require a computed field or view
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      if (page === 1) {
        setGenerations(data);
      } else {
        setGenerations([...generations, ...data]);
      }

      setHasMore(data.length === 12);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <>
      <SEO
        title="Галерея - RoomGenius AI"
        description="Исследуйте тысячи AI-дизайнов интерьера, созданных пользователями RoomGenius AI"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              RoomGenius AI
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-400 hover:text-white transition">
                Главная
              </Link>
              <Link href="/gallery" className="text-white">
                Галерея
              </Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition">
                Тарифы
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Галерея дизайнов
            </h1>
            <p className="text-xl text-gray-400">
              Вдохновитесь работами других пользователей
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
            <div className="flex flex-wrap gap-4">
              {/* Style Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2 text-white">
                  Стиль
                </label>
                <select
                  value={filters.style}
                  onChange={(e) => handleFilterChange('style', e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-white/20 rounded-lg text-white"
                >
                  <option value="all">Все стили</option>
                  {Object.entries(DESIGN_STYLES).map(([key, value]) => (
                    <option key={value} value={value}>
                      {STYLE_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2 text-white">
                  Сортировка
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-white/20 rounded-lg text-white"
                >
                  <option value="recent">Недавние</option>
                  <option value="popular">Популярные</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {loading && page === 1 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generations.map((gen) => (
                  <GalleryCard key={gen.id} generation={gen} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                  >
                    {loading ? 'Загрузка...' : 'Загрузить ещё'}
                  </button>
                </div>
              )}

              {generations.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  Пока нет дизайнов с такими фильтрами
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

function GalleryCard({ generation }) {
  return (
    <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition group">
      <div className="aspect-square bg-gray-800 relative overflow-hidden">
        <img
          src={generation.generated_image_url}
          alt={`${generation.style} design`}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <Link
            href={`/designs/${generation.id}`}
            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Подробнее
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {generation.profiles?.avatar_url ? (
              <img
                src={generation.profiles.avatar_url}
                alt={generation.profiles.name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
            )}
            <span className="text-sm text-gray-300">{generation.profiles?.name || 'Anonymous'}</span>
          </div>
          <span className="text-xs text-gray-500 capitalize">{generation.style}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{generation.likes?.length || 0}</span>
          </span>
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>{generation.comments?.length || 0}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
