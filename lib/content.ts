import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "./cache-tags";
import {
  mockEvents,
  mockNews,
  mockPlaylists,
  mockPrograms,
  mockSchedules,
  mockSiteSettings,
} from "./data";
import { LIVE_CHAT_PUBLIC_LIMIT } from "./live-chat";
import { getAdmin } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/config";
import { mapEvent, mapLiveMessage, mapNews, mapPlaylist, mapProgram, mapSchedule } from "./supabase/mappers";
import type {
  EventRow,
  LiveMessageRow,
  NewsRow,
  PlaylistRow,
  ProgramRow,
  ScheduleRow,
  SettingRow,
} from "./supabase/rows";
import { assembleSiteSettings } from "./supabase/settings-schema";
import type {
  LiveMessage,
  NewsArticle,
  Playlist,
  Program,
  ProgramSchedule,
  RadioEvent,
  SiteSettings,
} from "./types";

// Lapisan akses konten: satu-satunya seam ke Supabase untuk situs publik.
// Halaman memanggil fungsi-fungsi ini dan tidak tahu asal datanya.
//
// Bacaan memakai klien service role (`getAdmin`) karena `"use cache"` tidak
// boleh menyentuh `cookies()`. Bila Supabase belum dikonfigurasi, tiap getter
// mengembalikan data mock (lib/data.ts) supaya situs tetap build dan tampil.

export async function getPublishedNews(): Promise<NewsArticle[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.news);

  if (!isSupabaseConfigured()) {
    return mockNews
      .filter((article) => article.status === "published")
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  const { data, error } = await getAdmin()
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return ((data ?? []) as NewsRow[]).map(mapNews);
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.news);

  if (!isSupabaseConfigured()) {
    return (
      mockNews.find((article) => article.slug === slug && article.status === "published") ?? null
    );
  }

  const { data, error } = await getAdmin()
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? mapNews(data as NewsRow) : null;
}

export async function getPublishedEvents(): Promise<RadioEvent[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.events);

  if (!isSupabaseConfigured()) {
    return mockEvents
      .filter((event) => event.isPublished)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }

  const { data, error } = await getAdmin()
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as EventRow[]).map(mapEvent);
}

export async function getEventBySlug(slug: string): Promise<RadioEvent | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.events);

  if (!isSupabaseConfigured()) {
    return mockEvents.find((event) => event.slug === slug && event.isPublished) ?? null;
  }

  const { data, error } = await getAdmin()
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapEvent(data as EventRow) : null;
}

export async function getPrograms(): Promise<Program[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.programs);

  if (!isSupabaseConfigured()) {
    return mockPrograms.filter((program) => program.isPublished);
  }

  const { data, error } = await getAdmin().from("programs").select("*").eq("is_published", true);
  if (error) throw error;
  return ((data ?? []) as ProgramRow[]).map(mapProgram);
}

export async function getSchedules(): Promise<ProgramSchedule[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.schedules);

  if (!isSupabaseConfigured()) {
    return mockSchedules.filter((schedule) => schedule.isActive);
  }

  const { data, error } = await getAdmin()
    .from("program_schedules")
    .select("*")
    .eq("is_active", true)
    .order("day_of_week")
    .order("start_time");
  if (error) throw error;
  return ((data ?? []) as ScheduleRow[]).map(mapSchedule);
}

export async function getPlaylists(): Promise<Playlist[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.playlists);

  if (!isSupabaseConfigured()) {
    return mockPlaylists
      .filter((playlist) => playlist.isPublished)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const { data, error } = await getAdmin()
    .from("playlists")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as PlaylistRow[]).map(mapPlaylist);
}

/** Setelan situs disusun dari baris `site_settings` (key → value jsonb). */
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.siteSettings);

  if (!isSupabaseConfigured()) return mockSiteSettings;

  const { data, error } = await getAdmin().from("site_settings").select("*");
  if (error) throw error;

  return assembleSiteSettings((data ?? []) as SettingRow[]);
}

/**
 * Pesan live chat untuk Home. Tanpa `"use cache"` — chat harus segar tiap
 * request karena dibaca ulang oleh polling — dan sengaja tidak melempar: tabel
 * baru ada setelah `0002_live_messages.sql` dijalankan, dan situs publik tidak
 * boleh mati hanya karena chat belum siap (kegagalan terbaca di log server).
 */
export async function getLiveMessages(): Promise<LiveMessage[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await getAdmin()
    .from("live_messages")
    .select("*")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(LIVE_CHAT_PUBLIC_LIMIT);
  if (error) {
    console.warn(`Live chat: pesan gagal dibaca (${error.message}).`);
    return [];
  }

  // Urutan tampil chat: terlama di atas, terbaru di bawah.
  return ((data ?? []) as LiveMessageRow[]).map(mapLiveMessage).reverse();
}
