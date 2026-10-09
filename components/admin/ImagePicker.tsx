"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CardImage } from "@/components/ui/CardImage";
import { uploadMediaFile } from "@/lib/media-client";
import type { MediaAsset } from "@/lib/types";
import { FormField, inputClass } from "./FormField";
import { buttonClass } from "./buttonClass";

/**
 * Pemilih gambar: pakai aset yang sudah ada di Media Library atau unggah baru
 * (design.md §8.5). Nilai form adalah URL publik, disimpan di input hidden.
 */
export function ImagePicker({
  name,
  label,
  initialUrl,
  media,
  error,
  hint,
}: {
  name: string;
  label: string;
  initialUrl: string;
  media: MediaAsset[];
  error?: string;
  hint?: string;
}) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [altText, setAltText] = useState("");
  const [isLibraryOpen, setLibraryOpen] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function upload(file: File) {
    setUploadError("");
    setUploading(true);
    try {
      const result = await uploadMediaFile(file, altText);
      if (!result.ok) {
        setUploadError(result.message);
        return;
      }

      setUrl(result.url);
      setLibraryOpen(false);
      // Daftar media ikut diperbarui supaya aset baru bisa dipakai lagi tanpa reload.
      router.refresh();
    } finally {
      setUploading(false);
    }
  }

  return (
    <FormField label={label} error={error} hint={hint}>
      <input type="hidden" name={name} value={url} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="w-full max-w-[240px]">
          <CardImage src={url} alt={altText || label} ratio="16/9" sizes="240px" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLibraryOpen((open) => !open)}
            aria-expanded={isLibraryOpen}
            className={buttonClass("secondary")}
          >
            Pilih dari media
          </button>
          <label className={buttonClass("secondary", "cursor-pointer")}>
            {isUploading ? "Mengunggah…" : "Unggah gambar"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void upload(file);
              }}
            />
          </label>
          {url ? (
            <button type="button" onClick={() => setUrl("")} className={buttonClass("secondary")}>
              Kosongkan
            </button>
          ) : null}
        </div>
      </div>

      {uploadError ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {uploadError}
        </p>
      ) : null}

      {isLibraryOpen ? (
        <div className="flex flex-col gap-3 rounded-control border border-border bg-canvas p-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Teks alternatif untuk unggahan berikutnya
            <input
              type="text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Deskripsi singkat gambar"
              className={inputClass()}
            />
          </label>
          {media.length === 0 ? (
            <p className="text-sm text-ink-500">
              Media Library masih kosong. Unggah gambar pertama lewat tombol di atas.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {media.map((asset) => (
                <li key={asset.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setUrl(asset.publicUrl);
                      setAltText(asset.altText);
                      setLibraryOpen(false);
                    }}
                    className={`w-full rounded-control border p-1 text-left ${
                      url === asset.publicUrl ? "border-brand-700" : "border-border"
                    }`}
                  >
                    <CardImage src={asset.publicUrl} alt={asset.altText || asset.fileName} ratio="1/1" sizes="160px" />
                    <span className="mt-1 block truncate text-xs text-ink-700">{asset.fileName}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </FormField>
  );
}
