/**
 * Nama dan urutan hari untuk jadwal. Modul ini sengaja bebas dari `next/server`
 * supaya bisa dipakai komponen klien (editor jadwal di CMS).
 */

/** Nama hari Indonesia, indeks 0 = Minggu (sama dengan `day_of_week` jadwal). */
export const WEEKDAY_NAMES_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

/** Urutan tampil jadwal mingguan: Senin … Sabtu, Minggu. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;
