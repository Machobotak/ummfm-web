// Satu-satunya modul yang membaca konfigurasi stream (PRD §6.2).
// Nilai kosong → player masuk status "error" (lihat RadioPlayerProvider).
export const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL ?? "";
