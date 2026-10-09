"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Klien browser (anon key) untuk form login dan upload media ke Storage.
 * Service role tidak pernah sampai ke browser.
 */
let client: SupabaseClient | null = null;

export function getBrowserSupabase() {
  client ??= createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}
