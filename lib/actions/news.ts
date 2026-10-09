"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAdmin } from "@/lib/supabase/admin";
import { fieldText } from "./fields";
import { optionalIdSchema, optionalLocalDateTimeSchema, slugSchema } from "./form-schema";
import { databaseErrors, fieldErrors, type ActionResult } from "./result";

const newsSchema = z.object({
  id: optionalIdSchema,
  title: z.string().trim().min(1, "Judul berita wajib diisi"),
  slug: slugSchema,
  excerpt: z.string().trim(),
  body: z.string().trim().min(1, "Isi berita wajib diisi"),
  thumbnailUrl: z.string().trim(),
  coverImageUrl: z.string().trim(),
  status: z.enum(["draft", "published", "unpublished", "archived"], {
    message: "Status tidak valid",
  }),
  publishedAt: optionalLocalDateTimeSchema,
});

export async function saveNews(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireRole("editor");

  const parsed = newsSchema.safeParse({
    id: fieldText(formData, "id") || undefined,
    title: fieldText(formData, "title"),
    slug: fieldText(formData, "slug"),
    excerpt: fieldText(formData, "excerpt"),
    body: fieldText(formData, "body"),
    thumbnailUrl: fieldText(formData, "thumbnailUrl"),
    coverImageUrl: fieldText(formData, "coverImageUrl"),
    status: fieldText(formData, "status"),
    publishedAt: fieldText(formData, "publishedAt"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const { id, ...values } = parsed.data;
  const isPublished = values.status === "published";
  const payload = {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    body: values.body,
    thumbnail_url: values.thumbnailUrl,
    cover_image_url: values.coverImageUrl,
    status: values.status,
    // Terbit tanpa tanggal → pakai waktu sekarang; draft menyimpan null.
    published_at: values.publishedAt ?? (isPublished ? new Date().toISOString() : null),
    // Penulis dicatat saat terbit supaya berita yang tayang selalu bernama.
    ...(isPublished ? { author_id: user.id, author_name: user.displayName } : {}),
  };

  const admin = getAdmin();
  const { error } = id
    ? await admin.from("news").update(payload).eq("id", id)
    : await admin.from("news").insert(payload);
  if (error) return { ok: false, errors: databaseErrors(error, "slug") };

  updateTag(CACHE_TAGS.news);
  redirect("/admin/news");
}

export async function deleteNews(formData: FormData): Promise<void> {
  await requireRole("editor");

  const id = fieldText(formData, "id");
  if (id) {
    const { error } = await getAdmin().from("news").delete().eq("id", id);
    if (error) throw new Error(`Gagal menghapus berita: ${error.message}`);
  }

  updateTag(CACHE_TAGS.news);
  redirect("/admin/news");
}
