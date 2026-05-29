// Two Supabase clients, same pattern as the Vantage Stays public site:
//   - browserClient: anon key. RLS on `vehicles` limits anon to listing_status='live',
//     so this can only ever read live inventory. Safe for read-only public data.
//   - serverClient: service role, server-only. Used by form server actions to write
//     bookings / host submissions / source requests past RLS. NEVER import into a
//     client component.
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser-safe client. Reads only — RLS restricts anon to live vehicles. */
export function browserClient() {
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Server-only client for form inserts. Bypasses RLS — use carefully. */
export function serverClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
