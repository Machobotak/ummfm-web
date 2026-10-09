/**
 * Batas unggahan media (design.md §8.5). Dipakai dua sisi: klien menolak file
 * sebelum mengunggah, server memvalidasi metadata yang dikirim balik.
 */
export const MEDIA_BUCKET = "media";

export const MEDIA_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export type MediaMimeType = (typeof MEDIA_MIME_TYPES)[number];

export interface MediaUpload {
  fileName: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  fileSize: number;
  altText: string;
}

export function isAllowedImageType(mimeType: string): mimeType is MediaMimeType {
  return (MEDIA_MIME_TYPES as readonly string[]).includes(mimeType);
}

/** Ekstensi file dari MIME (dipakai untuk nama objek di storage). */
export function extensionForMimeType(mimeType: MediaMimeType): string {
  return mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
}
