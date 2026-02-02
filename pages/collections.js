/**
 * Collections Page
 * Manage user collections
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { CollectionModel } from '../models/collection.model';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function CollectionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadCollections();
    }
  }, [user]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await CollectionModel.getUserCollections(user.id);
      setCollections(data);
    } catch (err) {
      setError('Не удалось загрузить коллекции');
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            RoomGenius AI
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
              Дашборд
            </Link>
            <Link href="/collections" className="text-white hover:text-blue-400 transition">
              Коллекции
            </Link>
            <Link href="/favorites" className="text-gray-400 hover:text-white transition">
              Избранное
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Мои коллекции</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            + Создать коллекцию
          </button>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-400 mb-4">У вас пока нет коллекций</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-blue-400 hover:text-blue-300"
            >
              Создать первую коллекцию →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onDelete={() => loadCollections()}
              />
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateCollectionModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadCollections();
            }}
          />
        )}
      </main>
    </div>
  );
}

function CollectionCard({ collection, onDelete }) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">📁</div>
          <div className="flex space-x-2">
            {collection.is_public && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                Публичная
              </span>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
          {collection.name}
        </h3>
        
        {collection.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {collection.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {collection.itemCount} элемент{collection.itemCount !== 1 ? 'ов' : ''}
          </span>
          <span className="text-gray-500">
            {new Date(collection.created_at).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
    </Link>
  );
}

function CreateCollectionModal({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await CollectionModel.create({
        userId: user.id,
        name,
        description,
        isPublic,
      });
      onSuccess();
    } catch (err) {
      setError('Не удалось создать коллекцию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Создать коллекцию</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Название
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Моя коллекция"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Описание (необязательно)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 bg-gray-800 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Описание коллекции..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="isPublic" className="text-sm text-white">
              Сделать публичной
            </label>
          </div>

          <ErrorMessage message={error} onDismiss={() => setError(null)} />

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
