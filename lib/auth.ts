import { redirect } from "next/navigation";
import { getAdmin } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/config";
import type { ProfileRow } from "./supabase/rows";
import { createSessionClient } from "./supabase/server";
import type { UserRole } from "./types";

export interface CmsUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

/**
 * Sesi CMS dari cookie. null bila Supabase belum dikonfigurasi, tidak ada sesi,
 * profil belum ada, atau akun dinonaktifkan (`profiles.is_active = false`).
 */
export async function getCurrentUser(): Promise<CmsUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await getAdmin().from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = data as ProfileRow | null;
  if (!profile || !profile.is_active) return null;

  const email = user.email ?? "";
  return {
    id: user.id,
    email,
    displayName: profile.display_name || email,
    role: profile.role,
  };
}

/**
 * Guard untuk Server Component dan server action. `min: "admin"` membatasi ke
 * role admin; `"editor"` mengizinkan admin maupun editor.
 */
export async function requireRole(min: UserRole): Promise<CmsUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (min === "admin" && user.role !== "admin") redirect("/admin");
  return user;
}
