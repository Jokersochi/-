import { createClient } from '@supabase/supabase-js';

let admin = null;

export function getSupabaseAdmin() {
  if (admin) return admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Do not throw at import-time; allow builds without env.
  if (!url || !serviceKey) return null;

  admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}

