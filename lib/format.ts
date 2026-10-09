import { SITE_URL } from "./site";

export const STATION_TZ = "Asia/Jakarta";

/** Tanggal lengkap Asia/Jakarta, mis. "1 Oktober 2026". */
export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: STATION_TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(iso));
}

/** "Sabtu, 20 Oktober 2026" */
export function formatDateWithWeekday(iso: string): string {
  return formatDate(iso, { weekday: "long" });
}

/** Jam Asia/Jakarta, mis. "10.00". */
export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: STATION_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** "HH:MM–HH:MM WIB" untuk jam jadwal yang sudah berupa jam dinding. */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}–${endTime} WIB`;
}

/** "Sabtu, 20 Oktober 2026 · 10.00–15.00 WIB" */
export function formatEventPeriod(startsAt: string, endsAt: string): string {
  return `${formatDateWithWeekday(startsAt)} · ${formatTime(startsAt)}–${formatTime(endsAt)} WIB`;
}

/** URL absolut untuk metadata/sitemap. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

// WIB tidak memakai DST, jadi offset tetap aman untuk konversi dua arah antara
// nilai input `datetime-local` (jam dinding Jakarta) dan instan ISO.
const JAKARTA_OFFSET = "+07:00";

/** "2026-10-20T14:00" (jam dinding WIB) → "2026-10-20T07:00:00.000Z". */
export function jakartaLocalToIso(local: string): string {
  const wallClock = local.length === 16 ? `${local}:00` : local;
  return new Date(`${wallClock}${JAKARTA_OFFSET}`).toISOString();
}

/** ISO → nilai `datetime-local` jam dinding WIB, mis. "2026-10-20T14:00". */
export function isoToJakartaLocal(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: STATION_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("year")}-${value("month")}-${value("day")}T${value("hour")}:${value("minute")}`;
}
