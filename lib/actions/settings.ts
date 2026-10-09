"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAdmin } from "@/lib/supabase/admin";
import { fieldText, fieldTexts } from "./fields";
import { httpUrlSchema, optionalHttpUrlSchema } from "./form-schema";
import { databaseErrors, fieldErrors, type ActionResult } from "./result";

const settingsSchema = z.object({
  tagline: z.string().trim().min(1, "Tagline wajib diisi"),
  contactEmail: z.email("Email tidak valid"),
  streamUrl: optionalHttpUrlSchema,
  seoTitle: z.string().trim().min(1, "Judul SEO wajib diisi"),
  seoDescription: z.string().trim().min(1, "Deskripsi SEO wajib diisi"),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().trim().min(1, "Nama platform wajib diisi"),
        label: z.string().trim().min(1, "Label wajib diisi"),
        url: httpUrlSchema,
      }),
    )
    .min(1, "Minimal satu tautan sosial"),
  about: z.object({
    intro: z.string().trim().min(1, "Deskripsi singkat wajib diisi"),
    history: z.string().trim().min(1, "Sejarah wajib diisi"),
    vision: z.string().trim().min(1, "Visi wajib diisi"),
    mission: z
      .array(z.string().trim().min(1, "Misi tidak boleh kosong"))
      .min(1, "Minimal satu misi"),
  }),
});

export async function saveSettings(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireRole("editor");

  // Social link dan misi adalah daftar: field bernama sama diulang, urut dokumen.
  const platforms = fieldTexts(formData, "socialLinkPlatform");
  const labels = fieldTexts(formData, "socialLinkLabel");
  const urls = fieldTexts(formData, "socialLinkUrl");

  const parsed = settingsSchema.safeParse({
    tagline: fieldText(formData, "tagline"),
    contactEmail: fieldText(formData, "contactEmail").trim(),
    streamUrl: fieldText(formData, "streamUrl"),
    seoTitle: fieldText(formData, "seoTitle"),
    seoDescription: fieldText(formData, "seoDescription"),
    socialLinks: platforms.map((platform, index) => ({
      platform,
      label: labels[index] ?? "",
      url: urls[index] ?? "",
    })),
    about: {
      intro: fieldText(formData, "aboutIntro"),
      history: fieldText(formData, "aboutHistory"),
      vision: fieldText(formData, "aboutVision"),
      mission: fieldTexts(formData, "mission"),
    },
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const updatedAt = new Date().toISOString();
  const rows = [
    { key: "tagline", value: parsed.data.tagline },
    { key: "contact_email", value: parsed.data.contactEmail },
    { key: "social_links", value: parsed.data.socialLinks },
    { key: "about", value: parsed.data.about },
    { key: "stream_url", value: parsed.data.streamUrl },
    {
      key: "seo",
      value: { title: parsed.data.seoTitle, description: parsed.data.seoDescription },
    },
  ].map((row) => ({ ...row, updated_by: user.id, updated_at: updatedAt }));

  const { error } = await getAdmin().from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) return { ok: false, errors: databaseErrors(error) };

  updateTag(CACHE_TAGS.siteSettings);
  redirect("/admin/settings");
}
