import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Klien ber-cookie untuk memeriksa sesi (`auth.getUser`). Buat klien baru per
 * request — jangan simpan di variabel modul.
 *
 * `setAll` hanya berhasil di Server Action/Route Handler. Di Server Component
 * penulisan cookie tidak diizinkan; kegagalan diabaikan karena refresh token
 * ditangani `proxy.ts` lebih dulu pada request yang sama.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component: cookie tidak bisa ditulis di sini.
        }
      },
    },
  });
}
