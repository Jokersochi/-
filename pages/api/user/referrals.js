import { withApiAuth } from '../../../middleware/withAuth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.user.id;

  try {
    // Get users who were referred by this user
    const { data: referrals, error } = await supabase
      .from('profiles')
      .select('id, created_at')
      .eq('referred_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get user emails (simplified - in production join with auth.users)
    const referralsWithEmail = (referrals || []).map((ref, idx) => ({
      ...ref,
      email: `user${idx + 1}@example.com`, // Placeholder
    }));

    return res.status(200).json({
      referrals: referralsWithEmail,
      totalEarned: referralsWithEmail.length * 2, // 2 credits per referral
    });
  } catch (error) {
    console.error('[User Referrals] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch referrals' });
  }
}

export default withApiAuth(handler);
