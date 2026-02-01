import { useState, useEffect, useCallback } from 'react';
import { generationsService } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useHistory(autoFetch = true) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });
  const { user } = useAuth();

  const fetchHistory = useCallback(async (options = {}) => {
    if (!user) {
      setHistory([]);
      return;
    }

    const limit = options.limit || pagination.limit;
    const offset = options.offset || 0;
    const append = options.append || false;

    setLoading(true);
    setError(null);

    try {
      const { data, count } = await generationsService.getHistory(user.id, limit, offset);
      
      if (append) {
        setHistory(prev => [...prev, ...data]);
      } else {
        setHistory(data);
      }

      setPagination({
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, pagination.limit]);

  const loadMore = useCallback(async () => {
    if (!pagination.hasMore || loading) return;
    
    await fetchHistory({
      offset: pagination.offset + pagination.limit,
      append: true,
    });
  }, [fetchHistory, pagination, loading]);

  const deleteItem = useCallback(async (id) => {
    if (!user) return false;

    try {
      await generationsService.deleteGeneration(id, user.id);
      setHistory(prev => prev.filter(item => item.id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [user]);

  const refresh = useCallback(() => {
    return fetchHistory({ offset: 0 });
  }, [fetchHistory]);

  useEffect(() => {
    if (autoFetch && user) {
      fetchHistory();
    }
  }, [user, autoFetch]);

  return {
    history,
    loading,
    error,
    pagination,
    fetchHistory,
    loadMore,
    deleteItem,
    refresh,
  };
}

export default useHistory;
