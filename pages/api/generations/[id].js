import { getSupabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({
      error: 'Server is not configured: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
    });
  }

  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: 'id is required' });

  const { data, error } = await supabase.from('generation_jobs').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });

  return res.status(200).json({ job: data });
}

