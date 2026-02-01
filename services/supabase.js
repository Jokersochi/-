// Supabase Service Layer

import { createClient } from '@supabase/supabase-js';
import { STORAGE_BUCKETS } from '../utils/constants';
import { generateFileName } from '../utils/helpers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Storage Service
 */
export const storageService = {
  /**
   * Upload image to storage
   */
  async uploadImage(file, bucket = STORAGE_BUCKETS.rooms) {
    const fileName = generateFileName(file.name);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { fileName, publicUrl };
  },

  /**
   * Delete image from storage
   */
  async deleteImage(fileName, bucket = STORAGE_BUCKETS.rooms) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
    return true;
  },

  /**
   * Get signed URL for temporary access
   */
  async getSignedUrl(fileName, bucket = STORAGE_BUCKETS.rooms, expiresIn = 3600) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileName, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  },
};

/**
 * Auth Service
 */
export const authService = {
  /**
   * Sign up new user
   */
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign in user
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  /**
   * Reset password
   */
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  },
};

/**
 * Database Service for Generations History
 */
export const generationsService = {
  /**
   * Save generation record
   */
  async saveGeneration(userId, data) {
    const { data: record, error } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        original_image_url: data.originalImageUrl,
        generated_image_url: data.generatedImageUrl,
        style: data.style,
        prompt: data.prompt,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return record;
  },

  /**
   * Get user's generation history
   */
  async getHistory(userId, limit = 20, offset = 0) {
    const { data, error, count } = await supabase
      .from('generations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  },

  /**
   * Get single generation by ID
   */
  async getGeneration(id) {
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete generation record
   */
  async deleteGeneration(id, userId) {
    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },
};

/**
 * User Profile Service
 */
export const profileService = {
  /**
   * Get user profile
   */
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user credits
   */
  async getCredits(userId) {
    const profile = await this.getProfile(userId);
    return profile?.credits || 0;
  },

  /**
   * Update user credits
   */
  async updateCredits(userId, credits) {
    return this.updateProfile(userId, { credits });
  },

  /**
   * Decrement credits after generation
   */
  async decrementCredits(userId) {
    const { data, error } = await supabase.rpc('decrement_credits', {
      user_id: userId,
    });

    if (error) throw error;
    return data;
  },
};

export default supabase;
