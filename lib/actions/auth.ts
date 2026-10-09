"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseAuthConfigured, isSupabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";
import { fieldText } from "./fields";
import { fieldErrors, type ActionResult } from "./result";

const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export async function login(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseAuthConfigured()) {
    return {
      ok: false,
      errors: {
        form: "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.",
      },
    };
  }

  const parsed = loginSchema.safeParse({
    email: fieldText(formData, "email").trim(),
    password: fieldText(formData, "password"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, errors: { form: "Email atau kata sandi salah." } };

  const user = await getCurrentUser();
  if (!user) {
    await supabase.auth.signOut();
    return {
      ok: false,
      errors: {
        form: isSupabaseConfigured()
          ? "Akun ini tidak punya akses ke dashboard."
          : "Konfigurasi Supabase belum lengkap (butuh SUPABASE_SERVICE_ROLE_KEY).",
      },
    };
  }

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
