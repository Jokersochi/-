/**
 * Collection Model
 * Database operations for collections and favorites
 */

import { supabase } from '../lib/supabase';

export const CollectionModel = {
  /**
   * Create new collection
   */
  async create({ userId, name, description = '', isPublic = false }) {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        user_id: userId,
        name,
        description,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user's collections
   */
  async getUserCollections(userId) {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        collection_items (
          id,
          generation_id
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(collection => ({
      ...collection,
      itemCount: collection.collection_items.length,
    }));
  },

  /**
   * Get collection by ID with items
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        collection_items (
          id,
          added_at,
          generations (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Add item to collection
   */
  async addItem(collectionId, generationId) {
    const { data, error } = await supabase
      .from('collection_items')
      .insert({
        collection_id: collectionId,
        generation_id: generationId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Remove item from collection
   */
  async removeItem(collectionId, generationId) {
    const { error } = await supabase
      .from('collection_items')
      .delete()
      .eq('collection_id', collectionId)
      .eq('generation_id', generationId);

    if (error) throw error;
  },

  /**
   * Update collection
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete collection
   */
  async delete(id) {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const FavoriteModel = {
  /**
   * Add to favorites
   */
  async add(userId, generationId) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        generation_id: generationId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Remove from favorites
   */
  async remove(userId, generationId) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('generation_id', generationId);

    if (error) throw error;
  },

  /**
   * Get user's favorites
   */
  async getUserFavorites(userId, { page = 1, limit = 10 } = {}) {
    const { data, error, count } = await supabase
      .from('favorites')
      .select(`
        *,
        generations (*)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;
    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  /**
   * Check if generation is favorited
   */
  async isFavorited(userId, generationId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('generation_id', generationId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};
