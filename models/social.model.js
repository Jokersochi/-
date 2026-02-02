/**
 * Social Model
 * Database operations for social features
 */

import { supabase } from '../lib/supabase';

export const LikeModel = {
  /**
   * Toggle like on generation
   */
  async toggle(userId, generationId) {
    // Check if already liked
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('generation_id', generationId)
      .maybeSingle();

    if (existing) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('generation_id', generationId);

      if (error) throw error;
      return { liked: false };
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: userId, generation_id: generationId });

      if (error) throw error;
      return { liked: true };
    }
  },

  /**
   * Get likes for generation
   */
  async getForGeneration(generationId) {
    const { data, error } = await supabase
      .from('likes')
      .select('*, profiles(id, name, avatar_url)')
      .eq('generation_id', generationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Check if user liked generation
   */
  async isLiked(userId, generationId) {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('generation_id', generationId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};

export const CommentModel = {
  /**
   * Add comment
   */
  async create({ userId, generationId, content, parentId = null }) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: userId,
        generation_id: generationId,
        content,
        parent_id: parentId,
      })
      .select('*, profiles(id, name, avatar_url)')
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get comments for generation
   */
  async getForGeneration(generationId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(id, name, avatar_url)')
      .eq('generation_id', generationId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get replies for each comment
    for (const comment of data) {
      const { data: replies } = await supabase
        .from('comments')
        .select('*, profiles(id, name, avatar_url)')
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true });

      comment.replies = replies || [];
    }

    return data;
  },

  /**
   * Update comment
   */
  async update(commentId, content) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete comment
   */
  async delete(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },
};

export const FollowModel = {
  /**
   * Toggle follow
   */
  async toggle(followerId, followingId) {
    const { data: existing } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (existing) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) throw error;
      return { following: false };
    } else {
      // Follow
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: followerId, following_id: followingId });

      if (error) throw error;
      return { following: true };
    }
  },

  /**
   * Get followers
   */
  async getFollowers(userId, { page = 1, limit = 20 } = {}) {
    const { data, error, count } = await supabase
      .from('follows')
      .select('follower_id, profiles!follows_follower_id_fkey(*)', { count: 'exact' })
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;
    return {
      data: data.map(f => f.profiles),
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    };
  },

  /**
   * Get following
   */
  async getFollowing(userId, { page = 1, limit = 20 } = {}) {
    const { data, error, count } = await supabase
      .from('follows')
      .select('following_id, profiles!follows_following_id_fkey(*)', { count: 'exact' })
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;
    return {
      data: data.map(f => f.profiles),
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    };
  },

  /**
   * Check if following
   */
  async isFollowing(followerId, followingId) {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};

export const NotificationModel = {
  /**
   * Get user notifications
   */
  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return {
      data,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    };
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count;
  },
};

export const ShareModel = {
  /**
   * Track share
   */
  async track(userId, generationId, platform) {
    const { error } = await supabase
      .from('shares')
      .insert({ user_id: userId, generation_id: generationId, platform });

    if (error) throw error;
  },

  /**
   * Get share stats
   */
  async getStats(generationId) {
    const { data, error } = await supabase
      .from('shares')
      .select('platform')
      .eq('generation_id', generationId);

    if (error) throw error;

    const stats = {};
    data.forEach(share => {
      stats[share.platform] = (stats[share.platform] || 0) + 1;
    });

    return stats;
  },
};
