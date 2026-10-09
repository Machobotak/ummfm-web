"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { mediaUsage } from "@/lib/admin/data";
import { MEDIA_MAX_BYTES, MEDIA_MIME_TYPES, type MediaUpload } from "@/lib/media";
import { getAdmin } from "@/lib/supabase/admin";
import { fieldText } from "./fields";
import { databaseErrors, fieldErrors, type ActionResult } from "./result";

const mediaSchema = z.object({
  fileName: z.string().trim().min(1, "Nama file tidak terbaca"),
  storagePath: z.string().trim().min(1, "Path storage tidak terbaca"),
  publicUrl: z
    .string()
    .trim()
    .regex(/^https?:\/\/\S+$/, "URL media tidak valid"),
  mimeType: z.enum(MEDIA_MIME_TYPES, { message: "Hanya JPEG, PNG, atau WebP" }),
  fileSize: z
    .number()
    .int()
    .positive()
    .max(MEDIA_MAX_BYTES, "Ukuran file maksimal 5 MB"),
  altText: z.string().trim(),
});

/** Dipanggil klien setelah unggahan ke Storage berhasil (Step 14). */
export async function createMediaAsset(input: MediaUpload): Promise<ActionResult> {
  const user = await requireRole("editor");

  const parsed = mediaSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const { error } = await getAdmin()
    .from("media_assets")
    .insert({
      file_name: parsed.data.fileName,
      storage_path: parsed.data.storagePath,
      public_url: parsed.data.publicUrl,
      mime_type: parsed.data.mimeType,
      file_size: parsed.data.fileSize,
      alt_text: parsed.data.altText,
      uploaded_by: user.id,
    });
  if (error) return { ok: false, errors: databaseErrors(error) };

  return { ok: true };
}

/**
 * Hapus aset + objek Storage-nya. Aset yang masih dipakai konten tidak dihapus:
 * nama kontennya dikembalikan lewat `usedBy` supaya UI bisa menjelaskan.
 */
export async function deleteMediaAsset(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("editor");

  const id = fieldText(formData, "id");
  if (!id) return { ok: false, errors: { form: "Aset tidak ditemukan." } };

  const usage = await mediaUsage();
  const usedBy = usage[id];
  if (usedBy && usedBy.length > 0) {
    return {
      ok: false,
      errors: { form: "Media masih dipakai konten lain, jadi tidak dihapus." },
      usedBy,
    };
  }

  const admin = getAdmin();
  const { data: asset } = await admin
    .from("media_assets")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  const storagePath = (asset as { storage_path: string } | null)?.storage_path;

  const { error } = await admin.from("media_assets").delete().eq("id", id);
  if (error) return { ok: false, errors: databaseErrors(error) };

  if (storagePath) {
    // Baris database sudah hilang; objek storage yang gagal terhapus jadi orphan
    // dan tidak boleh menggagalkan aksi.
    await admin.storage.from("media").remove([storagePath]);
  }

  redirect("/admin/media");
}
