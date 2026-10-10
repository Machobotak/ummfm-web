// Bentuk tipe mengikuti PRD §11 (rancangan data awal). Tipe ini adalah bentuk
// yang dipakai UI; `lib/supabase/mappers.ts` yang menerjemahkan baris Postgres
// (snake_case) ke sini.

export type ContentStatus = "draft" | "published" | "unpublished" | "archived";

/** Role CMS (MVP): admin bisa mengelola pengguna, editor tidak. */
export type UserRole = "admin" | "editor";

export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string; // "" → MediaPlaceholder
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramSchedule {
  id: string;
  programId: string;
  dayOfWeek: number; // 0=Minggu … 6=Sabtu
  startTime: string; // "HH:MM" Asia/Jakarta
  endTime: string; // "HH:MM"; endTime <= startTime → lintas tengah malam
  hostName: string; // penyiar slot ini; "" berarti belum diisi
  timezone: "Asia/Jakarta";
  isActive: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  externalUrl: string;
  sortOrder: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string; // ringkasan untuk kartu berita
  body: string; // Markdown — dirender components/ui/SafeMarkdown
  thumbnailUrl: string;
  coverImageUrl: string;
  authorName: string; // pengganti join author_id sampai Supabase/profiles ada
  status: ContentStatus;
  publishedAt: string; // ISO
  updatedAt: string;
}

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface RadioEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl: string;
  location: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  registrationUrl?: string;
  status: EventStatus;
  isPublished: boolean;
  updatedAt: string;
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
}

export interface AboutContent {
  intro: string;
  history: string;
  vision: string;
  mission: string[];
}

/** SEO dasar situs (site_settings key `seo`). */
export interface SeoSettings {
  title: string;
  description: string;
}

export interface SiteSettings {
  tagline: string;
  /** Banner hero di Home; "" berarti hero tampil tanpa gambar. */
  heroBannerUrl: string;
  contactEmail: string;
  socialLinks: SocialLink[];
  about: AboutContent;
  /** URL siaran dari CMS; undefined → pakai NEXT_PUBLIC_STREAM_URL (lib/stream.ts). */
  streamUrl?: string;
  seo: SeoSettings;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  fileSize: number;
  altText: string;
  uploadedBy: string | null;
  createdAt: string;
}

export interface Profile {
  id: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

/** Pesan live chat pendengar (tabel `live_messages`). */
export interface LiveMessage {
  id: string;
  name: string;
  body: string;
  isHidden: boolean;
  createdAt: string;
}
