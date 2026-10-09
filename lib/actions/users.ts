"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { getAdmin } from "@/lib/supabase/admin";
import { fieldChecked, fieldText } from "./fields";
import { databaseErrors, fieldErrors, type ActionResult } from "./result";

// Role tidak memengaruhi konten publik, jadi tidak ada tag cache yang dibatalkan;
// halaman /admin/users sendiri tidak di-cache.

const createUserSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
  displayName: z.string().trim().min(1, "Nama tampilan wajib diisi"),
  role: z.enum(["admin", "editor"], { message: "Role tidak valid" }),
});

const roleSchema = z.enum(["admin", "editor"], { message: "Role tidak valid" });

export async function createUser(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = createUserSchema.safeParse({
    email: fieldText(formData, "email").trim(),
    password: fieldText(formData, "password"),
    displayName: fieldText(formData, "displayName"),
    role: fieldText(formData, "role"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const admin = getAdmin();
  // email_confirm: akun internal CMS, tidak lewat verifikasi surel.
  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });
  if (error || !data.user) {
    return { ok: false, errors: { form: `Gagal membuat pengguna: ${error?.message ?? ""}` } };
  }

  // Trigger handle_new_user sudah membuat baris profil (role default editor).
  const { error: profileError } = await admin
    .from("profiles")
    .update({ display_name: parsed.data.displayName, role: parsed.data.role })
    .eq("id", data.user.id);
  if (profileError) return { ok: false, errors: databaseErrors(profileError) };

  redirect("/admin/users");
}

export async function setUserRole(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const currentUser = await requireRole("admin");

  const id = fieldText(formData, "id");
  const parsed = roleSchema.safeParse(fieldText(formData, "role"));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  // Penjaga: admin terakhir bisa mengunci dirinya sendiri keluar dari CMS.
  if (id === currentUser.id && parsed.data !== "admin") {
    return { ok: false, errors: { form: "Role akun sendiri tidak bisa diturunkan." } };
  }

  const { error } = await getAdmin().from("profiles").update({ role: parsed.data }).eq("id", id);
  if (error) return { ok: false, errors: databaseErrors(error) };

  return { ok: true };
}

export async function setUserActive(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const currentUser = await requireRole("admin");

  const id = fieldText(formData, "id");
  const isActive = fieldChecked(formData, "isActive");
  if (id === currentUser.id && !isActive) {
    return { ok: false, errors: { form: "Akun sendiri tidak bisa dinonaktifkan." } };
  }

  const admin = getAdmin();
  // ban_duration adalah satu-satunya cara Supabase Auth memblokir login.
  const { error } = await admin.auth.admin.updateUserById(id, {
    ban_duration: isActive ? "none" : "876000h",
  });
  if (error) return { ok: false, errors: { form: `Gagal mengubah status akun: ${error.message}` } };

  const { error: profileError } = await admin
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", id);
  if (profileError) return { ok: false, errors: databaseErrors(profileError) };

  return { ok: true };
}
