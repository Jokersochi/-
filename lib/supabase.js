/**
 * Supabase Client Configuration
 * Centralized client instance for storage and database operations
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Create Supabase client
export const supabase = createClient(env.supabase.url, env.supabase.anonKey, {
  auth: {
    persistSession: false,
  },
});
