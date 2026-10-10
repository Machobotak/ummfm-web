import { z } from "zod";

import { mockSiteSettings } from "../data";
import type { SiteSettings } from "../types";
import type { SettingRow } from "./rows";

// Bentuk nilai jsonb di tabel `site_settings`, dipakai dua arah:
// - baca (`lib/content.ts`): `safeParse` → bila gagal/tidak ada, fallback mock.
// - tulis (`lib/actions/settings.ts`): `parse` → pesan validasi per field.
// Aturan `min(1)` disengaja: nilai kosong dianggap "belum diatur" dan jatuh ke
// default, bukan ditampilkan sebagai teks kosong.

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  label: z.string().min(1),
  url: z.string().min(1),
});

export const aboutSchema = z.object({
  intro: z.string().min(1),
  history: z.string().min(1),
  vision: z.string().min(1),
  mission: z.array(z.string().min(1)).min(1),
});

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const socialLinksSchema = z.array(socialLinkSchema).min(1);
export const textSchema = z.string().min(1);
export const emailSchema = z.email();
export const urlSchema = z.string().min(1);
/**
 * Daftar link embed seksi "UMMFM on Music's". Berbeda dari nilai teks lain,
 * daftar kosong itu sah dan berarti tabnya belum diisi — jadi tidak jatuh ke
 * default mock, melainkan ke array kosong.
 */
export const embedListSchema = z.array(z.string().min(1));

/**
 * Susun `SiteSettings` dari baris tabel `site_settings`. Nilai hilang, kosong,
 * atau berbentuk lain jatuh ke default mock (dipakai halaman publik dan form CMS).
 */
export function assembleSiteSettings(rows: SettingRow[]): SiteSettings {
  const value = (key: string) => rows.find((row) => row.key === key)?.value;

  const tagline = textSchema.safeParse(value("tagline"));
  const heroBannerUrl = textSchema.safeParse(value("hero_banner_url"));
  const contactEmail = emailSchema.safeParse(value("contact_email"));
  const socialLinks = socialLinksSchema.safeParse(value("social_links"));
  const about = aboutSchema.safeParse(value("about"));
  const seo = seoSchema.safeParse(value("seo"));
  const streamUrl = textSchema.safeParse(value("stream_url"));
  const playlistEmbeds = embedListSchema.safeParse(value("playlist_embeds"));
  const chartEmbeds = embedListSchema.safeParse(value("chart_embeds"));

  return {
    tagline: tagline.success ? tagline.data : mockSiteSettings.tagline,
    heroBannerUrl: heroBannerUrl.success ? heroBannerUrl.data : mockSiteSettings.heroBannerUrl,
    contactEmail: contactEmail.success ? contactEmail.data : mockSiteSettings.contactEmail,
    socialLinks: socialLinks.success ? socialLinks.data : mockSiteSettings.socialLinks,
    about: about.success ? about.data : mockSiteSettings.about,
    streamUrl: streamUrl.success ? streamUrl.data : undefined,
    seo: seo.success ? seo.data : mockSiteSettings.seo,
    playlistEmbeds: playlistEmbeds.success ? playlistEmbeds.data : [],
    chartEmbeds: chartEmbeds.success ? chartEmbeds.data : [],
  };
}
