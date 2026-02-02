import { createClient } from '@supabase/supabase-js';
import { config } from '../../../config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { referralCode, newUserId } = req.body;

  if (!referralCode || !newUserId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find referrer by code
    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id, credits, referral_count')
      .eq('referral_code', referralCode)
      .single();

    if (referrerError || !referrer) {
      console.log('[Referral] Invalid referral code:', referralCode);
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Check if user is not referring themselves
    if (referrer.id === newUserId) {
      return res.status(400).json({ error: 'Cannot refer yourself' });
    }

    // Check referral limit
    if (referrer.referral_count >= config.referral.maxReferrals) {
      return res.status(400).json({ error: 'Referrer has reached maximum referrals' });
    }

    // Start transaction - update both users
    const creditReward = config.referral.creditReward;

    // Update referrer: add credits and increment count
    const { error: updateReferrerError } = await supabase
      .from('profiles')
      .update({
        credits: referrer.credits + creditReward,
        referral_count: (referrer.referral_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', referrer.id);

    if (updateReferrerError) throw updateReferrerError;

    // Update new user: set referred_by and add credits
    const { data: newUser, error: newUserError } = await supabase
      .from('profiles')
      .update({
        referred_by: referrer.id,
        credits: creditReward, // Give new user credits too
        updated_at: new Date().toISOString(),
      })
      .eq('id', newUserId)
      .select()
      .single();

    if (newUserError) throw newUserError;

    // Record referral event
    await supabase.from('referral_events').insert({
      referrer_id: referrer.id,
      referred_id: newUserId,
      credits_awarded: creditReward,
      created_at: new Date().toISOString(),
    });

    // Send notification email to referrer (async, don't wait)
    if (process.env.SENDGRID_API_KEY) {
      import('../../../lib/email').then(({ emailService }) => {
        emailService.sendReferralSignup(referrer.email, {
          credits: creditReward,
          totalReferrals: (referrer.referral_count || 0) + 1,
          dashboardUrl: `${config.app.url}/dashboard/referrals`,
        });
      }).catch(console.error);
    }

    console.log(`[Referral] Success: ${referrer.id} -> ${newUserId}, +${creditReward} credits each`);

    return res.status(200).json({
      success: true,
      creditsAwarded: creditReward,
    });
  } catch (error) {
    console.error('[Referral] Error:', error);
    return res.status(500).json({ error: 'Failed to process referral' });
  }
}
