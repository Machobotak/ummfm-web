import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseAuthConfigured } from "@/lib/supabase/config";

/** Redirect 307 ke /admin/login; dipakai jalur tanpa sesi maupun tanpa kredensial. */
function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

/**
 * Guard area /admin. Selain memblokir request tanpa sesi, proxy ini juga
 * me-refresh token: Server Component tidak boleh menulis cookie, jadi cookie
 * sesi yang diperbarui ditulis di sini. Tanpa kredensial Supabase tidak ada
 * sesi yang bisa divalidasi, jadi semua halaman CMS diarahkan ke /admin/login
 * yang menjelaskan konfigurasi yang kurang.
 */
export async function proxy(request: NextRequest) {
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!isSupabaseAuthConfigured()) {
    return isLoginRoute ? NextResponse.next() : redirectToLogin(request);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginRoute) return redirectToLogin(request);

  return response;
}

export const config = { matcher: ["/admin/:path*"] };
