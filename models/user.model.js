/**
 * User Model
 * Database operations for user profiles
 */

import { supabase } from '../lib/supabase';

export const UserModel = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user statistics
   */
  async getStatistics(userId) {
    const { data, error } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deduct credits from user
   */
  async deductCredits(userId, amount = 1) {
    const { data, error } = await supabase.rpc('deduct_credits', {
      user_id: userId,
      amount,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Add credits to user
   */
  async addCredits(userId, amount) {
    const { data: profile } = await this.getProfile(userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ credits: (profile.credits || 0) + amount })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Check if user has credits
   */
  async hasCredits(userId, required = 1) {
    const profile = await this.getProfile(userId);
    return (profile.credits || 0) >= required;
  },
};
