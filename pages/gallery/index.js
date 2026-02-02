import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Header, Footer } from '../../components/layout';
import { Card, Button, Select } from '../../components/ui';
import { DESIGN_STYLES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import { Heart, Download, Eye, Filter, Loader2 } from 'lucide-react';

export default function GalleryPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, [filter, sort]);

  const fetchDesigns = async (append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        style: filter !== 'all' ? filter : '',
        sort,
        page: append ? page + 1 : 1,
        limit: 12,
      });

      const response = await fetch(`/api/gallery?${params}`);
      const data = await response.json();

      if (append) {
        setDesigns(prev => [...prev, ...data.designs]);
        setPage(prev => prev + 1);
      } else {
        setDesigns(data.designs || []);
        setPage(1);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    // Optimistic update
    setDesigns(prev => prev.map(d => 
      d.id === id ? { ...d, likes: d.likes + 1, liked: true } : d
    ));

    try {
      await fetch(`/api/gallery/${id}/like`, { method: 'POST' });
    } catch (error) {
      // Revert on error
      setDesigns(prev => prev.map(d => 
        d.id === id ? { ...d, likes: d.likes - 1, liked: false } : d
      ));
    }
  };

  const styleOptions = [
    { id: 'all', label: 'Все стили' },
    ...DESIGN_STYLES,
  ];

  const sortOptions = [
    { id: 'newest', label: 'Новые' },
    { id: 'popular', label: 'Популярные' },
    { id: 'trending', label: 'В тренде' },
  ];

  return (
    <>
      <Head>
        <title>Галерея дизайнов | RoomGenius AI</title>
        <meta name="description" content="Вдохновляйтесь лучшими дизайнами интерьеров, созданными нашим сообществом с помощью ИИ." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Галерея дизайнов
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Вдохновляйтесь работами нашего сообщества. Все дизайны созданы с помощью RoomGenius AI.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select
                options={styleOptions}
                value={filter}
                onChange={setFilter}
                className="w-40"
              />
            </div>
            <Select
              options={sortOptions}
              value={sort}
              onChange={setSort}
              className="w-40"
            />
          </div>

          {/* Gallery Grid */}
          {loading && designs.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : designs.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-400">Дизайны не найдены</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {designs.map((design) => (
                  <Card key={design.id} padding="none" className="overflow-hidden group">
                    <div className="aspect-square relative">
                      <img
                        src={design.image_url}
                        alt={`${design.style} design`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleLike(design.id)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                design.liked 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-white/20 text-white hover:bg-white/30'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${design.liked ? 'fill-current' : ''}`} />
                              <span className="text-sm">{design.likes}</span>
                            </button>
                            <div className="flex gap-2">
                              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                <Eye className="w-4 h-4 text-white" />
                              </button>
                              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                <Download className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full capitalize">
                          {design.style}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                          <span className="text-gray-400 text-xs">{design.author}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    onClick={() => fetchDesigns(true)}
                    loading={loading}
                  >
                    Загрузить ещё
                  </Button>
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
