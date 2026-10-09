/**
 * Tag cache konten publik. Getter di `lib/content.ts` mengisinya, server action
 * di `lib/actions/` membatalkannya — satu sumber string supaya keduanya tidak
 * pernah beda (tag yang salah tulis gagal tanpa error).
 */
export const CACHE_TAGS = {
  news: "news",
  events: "events",
  programs: "programs",
  schedules: "schedules",
  playlists: "playlists",
  siteSettings: "site-settings",
} as const;
