import { LIVE_CHAT_ADMIN_LIMIT } from "../live-chat";
import { getAdmin } from "../supabase/admin";
import {
  mapEvent,
  mapLiveMessage,
  mapMedia,
  mapNews,
  mapPlaylist,
  mapProfile,
  mapProgram,
  mapSchedule,
} from "../supabase/mappers";
import type {
  EventRow,
  LiveMessageRow,
  MediaRow,
  NewsRow,
  PlaylistRow,
  ProfileRow,
  ProgramRow,
  ScheduleRow,
  SettingRow,
} from "../supabase/rows";
import { assembleSiteSettings } from "../supabase/settings-schema";
import type {
  LiveMessage,
  MediaAsset,
  NewsArticle,
  Playlist,
  Profile,
  Program,
  ProgramSchedule,
  RadioEvent,
  SiteSettings,
} from "../types";

// Bacaan untuk dashboard CMS: selalu data terbaru, tanpa cache (di belakang
// auth, trafik rendah). Memakai klien service role yang sama dengan seam publik.

export async function listPrograms(): Promise<Program[]> {
  const { data, error } = await getAdmin()
    .from("programs")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as ProgramRow[]).map(mapProgram);
}

export async function getProgram(id: string): Promise<Program | null> {
  const { data, error } = await getAdmin().from("programs").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapProgram(data as ProgramRow) : null;
}

export async function listSchedules(): Promise<ProgramSchedule[]> {
  const { data, error } = await getAdmin()
    .from("program_schedules")
    .select("*")
    .order("day_of_week")
    .order("start_time");
  if (error) throw error;
  return ((data ?? []) as ScheduleRow[]).map(mapSchedule);
}

export async function listPlaylists(): Promise<Playlist[]> {
  const { data, error } = await getAdmin()
    .from("playlists")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as PlaylistRow[]).map(mapPlaylist);
}

export async function listNews(): Promise<NewsArticle[]> {
  const { data, error } = await getAdmin()
    .from("news")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as NewsRow[]).map(mapNews);
}

export async function getNews(id: string): Promise<NewsArticle | null> {
  const { data, error } = await getAdmin().from("news").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapNews(data as NewsRow) : null;
}

/** Baris `news` apa adanya — form edit butuh `published_at` mentah (ISO), bukan hasil map. */
export async function getNewsRow(id: string): Promise<NewsRow | null> {
  const { data, error } = await getAdmin().from("news").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as NewsRow | null) ?? null;
}

export async function listEvents(): Promise<RadioEvent[]> {
  const { data, error } = await getAdmin()
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as EventRow[]).map(mapEvent);
}

export async function listMedia(): Promise<MediaAsset[]> {
  const { data, error } = await getAdmin()
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as MediaRow[]).map(mapMedia);
}

export async function listProfiles(): Promise<Profile[]> {
  const { data, error } = await getAdmin()
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as ProfileRow[]).map(mapProfile);
}

export interface RecentUpdate {
  id: string;
  type: "program" | "playlist" | "news" | "event";
  title: string;
  updatedAt: string;
  href: string;
}

export interface DashboardStats {
  newsPublished: number;
  newsDraft: number;
  activePrograms: number;
  upcomingEvents: number;
  recent: RecentUpdate[];
}

const RECENT_LIMIT = 5;

/**
 * Ringkasan dashboard (design.md §8.3). Hanya menghitung data nyata dari tabel;
 * tidak ada metrik pengunjung.
 */
export async function dashboardStats(): Promise<DashboardStats> {
  const admin = getAdmin();
  const now = new Date().toISOString();

  const [published, drafts, activePrograms, upcoming, news, playlists, events, programRows] = await Promise.all([
    admin.from("news").select("id", { count: "exact", head: true }).eq("status", "published"),
    admin.from("news").select("id", { count: "exact", head: true }).eq("status", "draft"),
    admin.from("programs").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin.from("events").select("id", { count: "exact", head: true }).gt("starts_at", now),
    admin.from("news").select("id,title,updated_at").order("updated_at", { ascending: false }).limit(RECENT_LIMIT),
    admin.from("playlists").select("id,title,updated_at").order("updated_at", { ascending: false }).limit(RECENT_LIMIT),
    admin.from("events").select("id,title,updated_at").order("updated_at", { ascending: false }).limit(RECENT_LIMIT),
    admin.from("programs").select("id,name,updated_at").order("updated_at", { ascending: false }).limit(RECENT_LIMIT),
  ]);
  for (const result of [published, drafts, activePrograms, upcoming, news, playlists, events, programRows]) {
    if (result.error) throw result.error;
  }

  const recent: RecentUpdate[] = [
    ...(programRows.data ?? []).map((row) => ({
      id: row.id as string,
      type: "program" as const,
      title: row.name as string,
      updatedAt: row.updated_at as string,
      href: `/admin/programs/${row.id as string}`,
    })),
    ...(news.data ?? []).map((row) => ({
      id: row.id as string,
      type: "news" as const,
      title: row.title as string,
      updatedAt: row.updated_at as string,
      href: `/admin/news/${row.id as string}`,
    })),
    ...(playlists.data ?? []).map((row) => ({
      id: row.id as string,
      type: "playlist" as const,
      title: row.title as string,
      updatedAt: row.updated_at as string,
      href: `/admin/playlists/${row.id as string}`,
    })),
    ...(events.data ?? []).map((row) => ({
      id: row.id as string,
      type: "event" as const,
      title: row.title as string,
      updatedAt: row.updated_at as string,
      href: `/admin/events/${row.id as string}`,
    })),
  ];

  return {
    newsPublished: published.count ?? 0,
    newsDraft: drafts.count ?? 0,
    activePrograms: activePrograms.count ?? 0,
    upcomingEvents: upcoming.count ?? 0,
    recent: recent
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, RECENT_LIMIT),
  };
}

interface ImageReference {
  label: string;
  url: string;
}

/** Semua gambar yang dipakai konten, lengkap dengan label untuk editor. */
async function imageReferences(): Promise<ImageReference[]> {
  const admin = getAdmin();
  const [programs, news, events, playlists, settings] = await Promise.all([
    admin.from("programs").select("name,cover_image_url"),
    admin.from("news").select("title,thumbnail_url,cover_image_url"),
    admin.from("events").select("title,poster_url"),
    admin.from("playlists").select("title,cover_image_url"),
    admin.from("site_settings").select("*"),
  ]);
  for (const result of [programs, news, events, playlists, settings]) {
    if (result.error) throw result.error;
  }

  const references: ImageReference[] = [];
  for (const row of programs.data ?? []) {
    references.push({ label: `Program "${row.name}"`, url: row.cover_image_url });
  }
  for (const row of news.data ?? []) {
    references.push({ label: `Berita "${row.title}" (sampul)`, url: row.cover_image_url });
    references.push({ label: `Berita "${row.title}" (thumbnail)`, url: row.thumbnail_url });
  }
  for (const row of events.data ?? []) {
    references.push({ label: `Event "${row.title}"`, url: row.poster_url });
  }
  for (const row of playlists.data ?? []) {
    references.push({ label: `Playlist "${row.title}"`, url: row.cover_image_url });
  }

  // Banner hero disimpan di `site_settings`, bukan di tabel konten.
  const { heroBannerUrl } = assembleSiteSettings((settings.data ?? []) as SettingRow[]);
  references.push({ label: "Banner hero (Pengaturan)", url: heroBannerUrl });

  return references.filter((reference) => reference.url !== "");
}

/** Peta id aset media → konten yang memakainya (peringatan sebelum hapus). */
export async function mediaUsage(): Promise<Record<string, string[]>> {
  const [assets, references] = await Promise.all([listMedia(), imageReferences()]);
  const usage: Record<string, string[]> = {};

  for (const asset of assets) {
    const labels = references
      .filter((reference) => reference.url.includes(asset.publicUrl))
      .map((reference) => reference.label);
    if (labels.length > 0) usage[asset.id] = labels;
  }

  return usage;
}

/**
 * Nilai settings untuk form CMS: dibaca tanpa cache supaya form tidak menampilkan
 * nilai lama (dan menimpanya saat disimpan).
 */
export async function getSettingsForEdit(): Promise<SiteSettings> {
  const { data, error } = await getAdmin().from("site_settings").select("*");
  if (error) throw error;
  return assembleSiteSettings((data ?? []) as SettingRow[]);
}

/** Semua pesan live chat, termasuk yang disembunyikan, untuk moderasi CMS. */
export async function listLiveMessages(): Promise<LiveMessage[]> {
  const { data, error } = await getAdmin()
    .from("live_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(LIVE_CHAT_ADMIN_LIMIT);
  if (error) throw error;
  return ((data ?? []) as LiveMessageRow[]).map(mapLiveMessage);
}
