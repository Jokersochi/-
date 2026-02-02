/**
 * Referral Model
 * Database operations for referral program
 */

import { supabase } from '../lib/supabase';
import { UserModel } from './user.model';

export const ReferralModel = {
  /**
   * Generate referral code for user
   */
  async generateCode(userId) {
    // Check if user already has a code
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existing) throw new Error('User not found');

    // Generate unique code
    const code = generateUniqueCode();

    // Store in user profile metadata
    const { error } = await supabase
      .from('profiles')
      .update({
        metadata: supabase.raw(`metadata || '{"referral_code": "${code}"}'::jsonb`),
      })
      .eq('id', userId);

    if (error) throw error;

    return code;
  },

  /**
   * Apply referral code
   */
  async applyCode(referredId, code) {
    // Find referrer by code
    const { data: referrer } = await supabase
      .from('profiles')
      .select('id, metadata')
      .filter('metadata->>referral_code', 'eq', code)
      .single();

    if (!referrer) {
      throw new Error('Invalid referral code');
    }

    // Check if user already used a referral code
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', referredId)
      .maybeSingle();

    if (existingReferral) {
      throw new Error('Referral code already used');
    }

    // Create referral record
    const { error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.id,
        referred_id: referredId,
        code,
        status: 'pending',
      });

    if (error) throw error;

    return referrer.id;
  },

  /**
   * Complete referral (when referred user makes first payment)
   */
  async completeReferral(referredId) {
    const { data: referral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_id', referredId)
      .eq('status', 'pending')
      .single();

    if (!referral) return;

    // Update referral status
    await supabase
      .from('referrals')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', referral.id);

    // Reward referrer
    const rewardCredits = 5;
    await UserModel.addCredits(referral.referrer_id, rewardCredits);

    // Update referral with reward info
    await supabase
      .from('referrals')
      .update({
        status: 'rewarded',
        reward_credits: rewardCredits,
      })
      .eq('id', referral.id);

    // Reward referred user
    await UserModel.addCredits(referredId, 3);

    return { referrerId: referral.referrer_id, reward: rewardCredits };
  },

  /**
   * Get user's referrals
   */
  async getUserReferrals(userId) {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        profiles!referrals_referred_id_fkey(name, email, created_at)
      `)
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get referral stats
   */
  async getStats(userId) {
    const { data, error } = await supabase
      .from('referrals')
      .select('status, reward_credits')
      .eq('referrer_id', userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(r => r.status === 'pending').length,
      completed: data.filter(r => r.status === 'completed').length,
      rewarded: data.filter(r => r.status === 'rewarded').length,
      totalRewards: data.reduce((sum, r) => sum + (r.reward_credits || 0), 0),
    };

    return stats;
  },
};

/**
 * Generate unique referral code
 */
function generateUniqueCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
