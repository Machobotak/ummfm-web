import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { connection } from "next/server";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";

// Sesi dibaca dari cookie saat request; halaman ini tidak punya shell statis.
export const instant = false;

export const metadata: Metadata = {
  title: "Masuk CMS",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  await connection();
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-[420px]">
        <p className="text-sm font-semibold text-ink-500">93.4 UMMFM</p>
        <h1 className="mt-1 text-2xl font-bold">Masuk ke Dashboard CMS</h1>
        <p className="mt-2 text-sm text-ink-700">
          Akun CMS dibuat oleh admin lewat menu Pengguna. Akun tanpa profil aktif tidak bisa masuk.
        </p>
        <LoginForm isConfigured={isSupabaseAuthConfigured()} />
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          Kembali ke situs publik
        </Link>
      </div>
    </main>
  );
}
