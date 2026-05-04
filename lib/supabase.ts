import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

// Lazy singleton – createClient wird erst beim ersten DB-Aufruf ausgeführt,
// nicht beim Modul-Import (wichtig für Next.js build ohne .env.local)
let _client: SupabaseClient<Database> | undefined;

export function getSupabase(): SupabaseClient<Database> {
  if (!_client) {
    _client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _client;
}
