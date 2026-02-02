import { createClient } from '@supabase/supabase-js';

let client = null;

export function getSupabaseClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Avoid throwing during server build/SSR when env isn't configured.
  if (!supabaseUrl || !supabaseAnonKey) return null;

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
