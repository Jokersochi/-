import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { style, sort = 'newest', page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = supabase
      .from('gallery')
      .select('id, style, image_url, author, likes, created_at', { count: 'exact' })
      .eq('is_public', true);

    // Filter by style
    if (style && style !== 'all') {
      query = query.eq('style', style);
    }

    // Sort
    if (sort === 'popular') {
      query = query.order('likes', { ascending: false });
    } else if (sort === 'trending') {
      // Trending = most likes in last 7 days
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      query = query
        .gte('created_at', weekAgo.toISOString())
        .order('likes', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return res.status(200).json({
      designs: data || [],
      total: count || 0,
      hasMore: offset + parseInt(limit) < (count || 0),
    });
  } catch (error) {
    console.error('[Gallery] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery' });
  }
}
