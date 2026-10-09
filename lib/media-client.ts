"use client";

import { createMediaAsset } from "@/lib/actions/media";
import {
  MEDIA_BUCKET,
  MEDIA_MAX_BYTES,
  extensionForMimeType,
  isAllowedImageType,
} from "@/lib/media";
import { getBrowserSupabase } from "@/lib/supabase/client";

export type UploadResult = { ok: true; url: string } | { ok: false; message: string };

/**
 * Unggah satu berkas gambar ke Storage, lalu catat metadatanya lewat
 * `createMediaAsset`. Dipakai Media Library dan ImagePicker supaya validasi serta
 * alur unggah hanya ada di satu tempat.
 */
export async function uploadMediaFile(file: File, altText: string): Promise<UploadResult> {
  if (!isAllowedImageType(file.type)) {
    return { ok: false, message: "Format harus JPEG, PNG, atau WebP." };
  }
  if (file.size > MEDIA_MAX_BYTES) {
    return { ok: false, message: "Ukuran file maksimal 5 MB." };
  }

  const supabase = getBrowserSupabase();
  const storagePath = `${crypto.randomUUID()}.${extensionForMimeType(file.type)}`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, file, { contentType: file.type });
  if (error) {
    return { ok: false, message: `Unggahan gagal: ${error.message}` };
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
  const created = await createMediaAsset({
    fileName: file.name,
    storagePath,
    publicUrl: data.publicUrl,
    mimeType: file.type,
    fileSize: file.size,
    altText: altText.trim() || file.name,
  });
  if (!created.ok) {
    return {
      ok: false,
      message: Object.values(created.errors).join(" ") || "Metadata media gagal disimpan.",
    };
  }

  return { ok: true, url: data.publicUrl };
}
