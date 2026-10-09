"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { MEDIA_MAX_BYTES, isAllowedImageType } from "@/lib/media";
import { uploadMediaFile } from "@/lib/media-client";
import { FormField, inputClass } from "./FormField";
import { buttonClass } from "./SubmitButton";

/** Pesan gagal yang sama untuk semua jalur validasi klien. */
const TYPE_ERROR = "Format harus JPEG, PNG, atau WebP.";
const SIZE_ERROR = "Ukuran file maksimal 5 MB.";

/**
 * Unggah langsung ke Media Library (design.md §8.5). Tipe dan ukuran diperiksa
 * di klien sebelum berkas dikirim, lalu `uploadMediaFile` menangani Storage dan
 * pencatatan metadatanya. Daftar media di halaman dimuat ulang lewat
 * `router.refresh()` setelah sukses.
 */
export function MediaUploader() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!file) {
      setError("Pilih berkas gambar terlebih dahulu.");
      return;
    }
    if (!isAllowedImageType(file.type)) {
      setError(TYPE_ERROR);
      return;
    }
    if (file.size > MEDIA_MAX_BYTES) {
      setError(SIZE_ERROR);
      return;
    }

    setUploading(true);
    try {
      const result = await uploadMediaFile(file, altText);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      setNotice(`"${file.name}" berhasil diunggah.`);
      setFile(null);
      setAltText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch {
      setError("Unggahan gagal karena gangguan tak terduga. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="mb-6 rounded-card border border-border bg-surface p-5 shadow-card">
      <h2 className="text-lg font-semibold text-ink-950">Unggah media baru</h2>
      <p className="mt-1 text-sm text-ink-700">
        JPEG, PNG, atau WebP, maksimal 5 MB. Teks alternatif dipakai pembaca layar.
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Berkas gambar" htmlFor="media-file" hint="Maksimal 5 MB per berkas.">
            <input
              ref={fileInputRef}
              id="media-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploading}
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setError("");
                setNotice("");
              }}
              className={inputClass()}
            />
          </FormField>

          <FormField label="Teks alternatif" htmlFor="media-alt" hint="Kosongkan bila ingin memakai nama berkas.">
            <input
              id="media-alt"
              type="text"
              value={altText}
              disabled={isUploading}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Deskripsi singkat gambar"
              className={inputClass()}
            />
          </FormField>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isUploading} className={buttonClass("primary")}>
            {isUploading ? "Mengunggah…" : "Unggah"}
          </button>
          {notice ? (
            <p role="status" className="text-sm font-medium text-success">
              {notice}
            </p>
          ) : null}
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {isUploading ? "Mengunggah…" : ""}
        </p>

        {error ? (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
