"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAdmin } from "@/lib/supabase/admin";
import { fieldChecked, fieldText } from "./fields";
import { countSchema, httpUrlSchema, optionalIdSchema } from "./form-schema";
import { databaseErrors, fieldErrors, type ActionResult } from "./result";

const playlistSchema = z.object({
  id: optionalIdSchema,
  title: z.string().trim().min(1, "Judul playlist wajib diisi"),
  description: z.string().trim(),
  coverImageUrl: z.string().trim(),
  externalUrl: httpUrlSchema,
  sortOrder: countSchema,
  isPublished: z.boolean(),
});

export async function savePlaylist(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("editor");

  const parsed = playlistSchema.safeParse({
    id: fieldText(formData, "id") || undefined,
    title: fieldText(formData, "title"),
    description: fieldText(formData, "description"),
    coverImageUrl: fieldText(formData, "coverImageUrl"),
    externalUrl: fieldText(formData, "externalUrl"),
    sortOrder: fieldText(formData, "sortOrder") || "0",
    isPublished: fieldChecked(formData, "isPublished"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const { id, ...values } = parsed.data;
  const payload = {
    title: values.title,
    description: values.description,
    cover_image_url: values.coverImageUrl,
    external_url: values.externalUrl,
    sort_order: values.sortOrder,
    is_published: values.isPublished,
  };

  const admin = getAdmin();
  const { error } = id
    ? await admin.from("playlists").update(payload).eq("id", id)
    : await admin.from("playlists").insert(payload);
  if (error) return { ok: false, errors: databaseErrors(error) };

  updateTag(CACHE_TAGS.playlists);
  redirect("/admin/playlists");
}

export async function deletePlaylist(formData: FormData): Promise<void> {
  await requireRole("editor");

  const id = fieldText(formData, "id");
  if (id) {
    const { error } = await getAdmin().from("playlists").delete().eq("id", id);
    if (error) throw new Error(`Gagal menghapus playlist: ${error.message}`);
  }

  updateTag(CACHE_TAGS.playlists);
  redirect("/admin/playlists");
}
