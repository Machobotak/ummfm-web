/**
 * Link embed untuk seksi "UMMFM on Music's" (design.md §6.4). CMS hanya
 * menyimpan teks yang ditempel pengelola; halaman publik menerjemahkannya di
 * sini. Hanya Spotify dan Instagram yang dikenali: host, jenis konten, dan
 * kode diperiksa satu per satu, jadi nilai apa pun selain tautan yang sah
 * ditolak sebelum masuk ke `src` iframe.
 */

export type EmbedKind = "spotify" | "instagram";

export interface EmbedLink {
  /** URL siap pakai untuk `src` iframe. */
  src: string;
  /** Tautan biasa ke halaman aslinya, dipakai sebagai fallback bila iframe gagal. */
  webUrl: string;
  kind: EmbedKind;
}

const SPOTIFY_HOST = "open.spotify.com";
const INSTAGRAM_HOST = "www.instagram.com";
const INSTAGRAM_HOSTS = new Set(["instagram.com", INSTAGRAM_HOST]);

/** Jenis konten Spotify yang punya halaman embed. */
const SPOTIFY_TYPES = new Set(["playlist", "album", "track", "artist", "episode", "show"]);
/** Jenis kiriman Instagram yang bisa di-embed. */
const INSTAGRAM_TYPES = new Set(["p", "reel", "tv"]);

/** ID Spotify dan kode kiriman Instagram: huruf, angka, `-`, `_`. */
const ID_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;

/**
 * Tautan biasa maupun tautan embed yang sudah jadi sama-sama diterima, mis.
 * `https://open.spotify.com/playlist/ID?si=…` dan
 * `https://www.instagram.com/reel/CODE/embed/`.
 */
export function parseEmbedLink(raw: string): EmbedLink | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const segments = url.pathname.split("/").filter(Boolean);
  const host = url.hostname.toLowerCase();

  if (host === SPOTIFY_HOST) {
    const [type, id] = segments[0] === "embed" ? segments.slice(1) : segments;
    if (!type || !id || !SPOTIFY_TYPES.has(type) || !ID_PATTERN.test(id)) return null;
    return {
      src: `https://${SPOTIFY_HOST}/embed/${type}/${id}`,
      webUrl: `https://${SPOTIFY_HOST}/${type}/${id}`,
      kind: "spotify",
    };
  }

  if (INSTAGRAM_HOSTS.has(host)) {
    const [type, code, suffix] = segments;
    if (!type || !code || !INSTAGRAM_TYPES.has(type) || !ID_PATTERN.test(code)) return null;
    if (suffix && suffix !== "embed") return null;
    return {
      src: `https://${INSTAGRAM_HOST}/${type}/${code}/embed`,
      webUrl: `https://${INSTAGRAM_HOST}/${type}/${code}`,
      kind: "instagram",
    };
  }

  return null;
}

/** Isi textarea CMS → daftar link: satu link per baris, baris kosong dibuang. */
export function splitEmbedLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}
