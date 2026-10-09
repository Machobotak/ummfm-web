import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./config";

/**
 * Klien service role. Hanya dipakai di server: `lib/content.ts` (baca publik)
 * dan server action (tulis). Tidak butuh cookie store, jadi aman dipanggil di
 * dalam `"use cache"` — `createServerClient` (ber-cookie) tidak.
 */
let client: SupabaseClient | null = null;

export function getAdmin() {
  client ??= createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
