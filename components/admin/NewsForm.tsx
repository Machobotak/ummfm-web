"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { slugify } from "@/lib/slugify";
import { EMPTY_ACTION_RESULT } from "@/lib/actions/result";
import { saveNews } from "@/lib/actions/news";
import type { ContentStatus, MediaAsset } from "@/lib/types";
import { FormField, inputClass } from "./FormField";
import { ImagePicker } from "./ImagePicker";
import { MarkdownEditor } from "./MarkdownEditor";
import { SubmitButton, buttonClass } from "./SubmitButton";

export interface NewsFormValues {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  thumbnailUrl: string;
  coverImageUrl: string;
  status: ContentStatus;
  /** Nilai `datetime-local` jam dinding WIB; "" berarti belum diatur. */
  publishedAt: string;
}

const EMPTY_VALUES: NewsFormValues = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  thumbnailUrl: "",
  coverImageUrl: "",
  status: "draft",
  publishedAt: "",
};

const STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: "draft", label: "Draf" },
  { value: "published", label: "Terbit" },
  { value: "unpublished", label: "Tidak terbit" },
  { value: "archived", label: "Arsip" },
];

export function NewsForm({
  media,
  initial = EMPTY_VALUES,
}: {
  media: MediaAsset[];
  initial?: NewsFormValues;
}) {
  const [state, formAction] = useActionState(saveNews, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  // Slug yang sudah diubah manual tidak ditimpa perubahan judul.
  const [isSlugEdited, setSlugEdited] = useState(initial.slug !== "");
  const statusRef = useRef<HTMLSelectElement>(null);

  function onTitleChange(value: string) {
    setTitle(value);
    if (initial.id === "" && !isSlugEdited) setSlug(slugify(value));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      {errors.form ? <ErrorState message={errors.form} /> : null}

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <FormField label="Judul" htmlFor="news-title" error={errors.title}>
          <input
            id="news-title"
            name="title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            aria-invalid={Boolean(errors.title)}
            className={inputClass(errors.title)}
          />
        </FormField>

        <FormField
          label="Slug"
          htmlFor="news-slug"
          error={errors.slug}
          hint="Dipakai di URL: /news/slug-berita. Huruf kecil, angka, dan tanda minus."
        >
          <input
            id="news-slug"
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setSlugEdited(true);
            }}
            aria-invalid={Boolean(errors.slug)}
            className={inputClass(errors.slug)}
          />
        </FormField>

        <FormField
          label="Ringkasan"
          htmlFor="news-excerpt"
          error={errors.excerpt}
          hint="Tampil di kartu berita dan daftar /news."
        >
          <textarea
            id="news-excerpt"
            name="excerpt"
            rows={3}
            defaultValue={initial.excerpt}
            className={inputClass(errors.excerpt)}
          />
        </FormField>

        <MarkdownEditor
          name="body"
          label="Isi berita (Markdown)"
          initialValue={initial.body}
          error={errors.body}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Publikasi</h2>

        <FormField label="Status" htmlFor="news-status" error={errors.status}>
          <select
            id="news-status"
            name="status"
            ref={statusRef}
            defaultValue={initial.status}
            className={inputClass(errors.status)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Tanggal terbit (WIB)"
          htmlFor="news-published-at"
          error={errors.publishedAt}
          hint="Kosongkan untuk memakai waktu sekarang saat status Terbit."
        >
          <input
            id="news-published-at"
            type="datetime-local"
            name="publishedAt"
            defaultValue={initial.publishedAt}
            className={inputClass(errors.publishedAt)}
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Gambar</h2>
        <ImagePicker
          name="coverImageUrl"
          label="Gambar utama (16:9)"
          initialUrl={initial.coverImageUrl}
          media={media}
          error={errors.coverImageUrl}
        />
        <ImagePicker
          name="thumbnailUrl"
          label="Thumbnail (1:1)"
          initialUrl={initial.thumbnailUrl}
          media={media}
          error={errors.thumbnailUrl}
          hint="Opsional; dipakai di kartu kecil."
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <SubmitButton label="Simpan" />
        <SubmitButton
          label="Simpan Draf"
          variant="secondary"
          onClick={() => {
            if (statusRef.current) statusRef.current.value = "draft";
          }}
        />
        <SubmitButton
          label="Publikasikan"
          onClick={() => {
            if (statusRef.current) statusRef.current.value = "published";
          }}
        />
        <Link href="/admin/news" className={buttonClass("secondary")}>
          Batal
        </Link>
      </div>
    </form>
  );
}
