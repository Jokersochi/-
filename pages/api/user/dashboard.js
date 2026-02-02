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
    // Fetch user data in parallel
    const [
      { count: totalGenerations },
      { data: recentGenerations },
      { data: profile },
    ] = await Promise.all([
      // Total generations
      supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      // Recent generations
      supabase
        .from('generations')
        .select('id, style, generated_image_url, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(8),
      // Profile
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),
    ]);

    return res.status(200).json({
      stats: {
        totalGenerations: totalGenerations || 0,
        totalDownloads: profile?.download_count || 0,
        totalShares: profile?.share_count || 0,
        avgGenerationTime: 45, // Placeholder
      },
      recentGenerations: recentGenerations || [],
      profile,
    });
  } catch (error) {
    console.error('[User Dashboard] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}

export default withApiAuth(handler);
