/**
 * Batas, jeda, dan interval live chat. Modul ini sengaja tanpa impor server apa
 * pun supaya dipakai bersama oleh komponen klien (`maxLength`, interval
 * polling), server action (validasi zod), dan `supabase/migrations/0002_live_messages.sql`
 * (check constraint) tanpa menyeret klien Supabase ke bundel browser.
 */
export const LIVE_CHAT_MAX_NAME = 40;
export const LIVE_CHAT_MAX_BODY = 300;

/** Jeda kirim per IP (hash) supaya satu pengunjung tidak membanjiri chat. */
export const LIVE_CHAT_COOLDOWN_MS = 15_000;

/** Interval polling pesan terbaru di halaman publik. */
export const LIVE_CHAT_POLL_MS = 10_000;

export const LIVE_CHAT_PUBLIC_LIMIT = 50;
export const LIVE_CHAT_ADMIN_LIMIT = 200;

/** Nama field jebakan bot: manusia tidak pernah melihat, apalagi mengisinya. */
export const LIVE_CHAT_HONEYPOT = "website";

/**
 * Hasil kirim pesan. Terpisah dari `ActionResult` karena klien perlu tahu kapan
 * sebuah kiriman benar-benar tersimpan (`postedAt`), bukan sekadar `ok: true`
 * yang juga jadi keadaan awal form.
 */
export type LiveChatResult =
  | { ok: true; postedAt: string }
  | { ok: false; errors: Record<string, string> };

export const EMPTY_LIVE_CHAT_RESULT: LiveChatResult = { ok: true, postedAt: "" };
