// Satu-satunya modul yang membaca konfigurasi Supabase dari environment.
// Semua nilai kosong → situs memakai fallback mock (lib/data.ts) dan /admin
// menampilkan pesan "Supabase belum dikonfigurasi".
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** Ketiga nilai terisi → backend nyata dipakai (baca publik + tulis CMS). */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Cukup untuk alur auth (anon key saja). Dipakai proxy dan halaman login supaya
 * service role tidak pernah dibutuhkan di jalur yang berjalan di edge/browser.
 */
export function isSupabaseAuthConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
