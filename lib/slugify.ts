/**
 * "Semesta Pagi!" → "semesta-pagi". Dipakai form CMS untuk mengisi slug dari
 * judul; aksen dinormalisasi (é → e) supaya slug tetap ASCII.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
