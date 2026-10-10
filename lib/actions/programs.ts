"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAdmin } from "@/lib/supabase/admin";
import { fieldChecked, fieldText } from "./fields";
import { optionalIdSchema, slugSchema } from "./form-schema";
import { databaseErrors, fieldErrors, type ActionResult } from "./result";

const programSchema = z.object({
  id: optionalIdSchema,
  name: z.string().trim().min(1, "Nama program wajib diisi"),
  slug: slugSchema,
  description: z.string().trim(),
  coverImageUrl: z.string().trim(),
  isActive: z.boolean(),
  isPublished: z.boolean(),
});

export async function saveProgram(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("editor");

  const parsed = programSchema.safeParse({
    id: fieldText(formData, "id") || undefined,
    name: fieldText(formData, "name"),
    slug: fieldText(formData, "slug"),
    description: fieldText(formData, "description"),
    coverImageUrl: fieldText(formData, "coverImageUrl"),
    isActive: fieldChecked(formData, "isActive"),
    isPublished: fieldChecked(formData, "isPublished"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const { id, ...values } = parsed.data;
  const payload = {
    name: values.name,
    slug: values.slug,
    description: values.description,
    cover_image_url: values.coverImageUrl,
    is_active: values.isActive,
    is_published: values.isPublished,
  };

  const admin = getAdmin();
  const { error } = id
    ? await admin.from("programs").update(payload).eq("id", id)
    : await admin.from("programs").insert(payload);
  if (error) return { ok: false, errors: databaseErrors(error, "slug") };

  updateTag(CACHE_TAGS.programs);
  redirect("/admin/programs");
}

export async function deleteProgram(formData: FormData): Promise<void> {
  await requireRole("editor");

  const id = fieldText(formData, "id");
  if (id) {
    const { error } = await getAdmin().from("programs").delete().eq("id", id);
    if (error) throw new Error(`Gagal menghapus program: ${error.message}`);
  }

  updateTag(CACHE_TAGS.programs);
  // Jadwal program ikut terhapus lewat on delete cascade.
  updateTag(CACHE_TAGS.schedules);
  redirect("/admin/programs");
}
