/**
 * Generation Model
 * Database operations for image generations
 */

import { supabase } from '../lib/supabase';

export const GenerationModel = {
  /**
   * Create new generation record
   */
  async create({ userId, originalImageUrl, style, metadata = {} }) {
    const { data, error } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        original_image_url: originalImageUrl,
        style,
        status: 'pending',
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update generation record
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('generations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark generation as completed
   */
  async markCompleted(id, generatedImageUrl) {
    return this.update(id, {
      status: 'completed',
      generated_image_url: generatedImageUrl,
      completed_at: new Date().toISOString(),
    });
  },

  /**
   * Mark generation as failed
   */
  async markFailed(id, errorMessage) {
    return this.update(id, {
      status: 'failed',
      error_message: errorMessage,
      completed_at: new Date().toISOString(),
    });
  },

  /**
   * Get generation by ID
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user's generations with pagination
   */
  async getUserGenerations(userId, { page = 1, limit = 10, status = null } = {}) {
    let query = supabase
      .from('generations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

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
   * Delete generation
   */
  async delete(id) {
    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Get popular styles
   */
  async getPopularStyles() {
    const { data, error } = await supabase
      .from('popular_styles')
      .select('*');

    if (error) throw error;
    return data;
  },
};
