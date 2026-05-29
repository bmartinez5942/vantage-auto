// Supabase access for the public site.
//   - publicReadClient: anon key. RLS (vehicles_public_read) restricts anon to
//     listing_status='live' rows, so this can only ever read approved/live data.
//     Used server-side to pull admin-approved pricing for catalog cards.
//   - serverClient: service role, server-only. Used by form server actions to
//     write host submissions / source requests / contact messages past RLS.
//     NEVER import into a client component.
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/** Read-only client. RLS limits anon to live vehicles — safe for public data. */
export function publicReadClient() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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
