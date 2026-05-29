// Server-only Supabase access for the public site. The public pages render
// from the static catalog (lib/autoCatalog.ts), so there is no client-side
// Supabase read anymore — only server actions write intake rows.
//   - serverClient: service role, server-only. Used by form server actions to
//     write host submissions / source requests / contact messages past RLS.
//     NEVER import into a client component.
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/** Server-only client for form inserts. Bypasses RLS — use carefully. */
export function serverClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
