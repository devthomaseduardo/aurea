import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '@/core/config/env';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!ENV.isSocialOAuthEnabled) return null;
  if (!client) {
    client = createClient(ENV.supabaseUrl!, ENV.supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

export function isSupabaseConfigured() {
  return ENV.isSocialOAuthEnabled;
}
