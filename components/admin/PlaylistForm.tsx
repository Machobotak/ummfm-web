"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { savePlaylist } from "@/lib/actions/playlists";
import { EMPTY_ACTION_RESULT } from "@/lib/actions/result";
import type { MediaAsset } from "@/lib/types";
import { buttonClass } from "./buttonClass";
import { FormCheckbox, FormField, inputClass } from "./FormField";
import { ImagePicker } from "./ImagePicker";
import { SubmitButton } from "./SubmitButton";

export interface PlaylistFormValues {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  externalUrl: string;
  sortOrder: number;
  isPublished: boolean;
}

const EMPTY_VALUES: PlaylistFormValues = {
  id: "",
  title: "",
  description: "",
  coverImageUrl: "",
  externalUrl: "",
  sortOrder: 0,
  isPublished: false,
};

export function PlaylistForm({
  media,
  initial = EMPTY_VALUES,
}: {
  media: MediaAsset[];
  initial?: PlaylistFormValues;
}) {
  const [state, formAction] = useActionState(savePlaylist, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      {errors.form ? <ErrorState message={errors.form} /> : null}

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <FormField label="Judul" htmlFor="playlist-title" error={errors.title}>
          <input
            id="playlist-title"
            name="title"
            defaultValue={initial.title}
            aria-invalid={Boolean(errors.title)}
            className={inputClass(errors.title)}
          />
        </FormField>

        <FormField
          label="Deskripsi"
          htmlFor="playlist-description"
          error={errors.description}
          hint="Tampil sebagai keterangan singkat di bawah judul playlist."
        >
          <textarea
            id="playlist-description"
            name="description"
            rows={4}
            defaultValue={initial.description}
            className={inputClass(errors.description)}
          />
        </FormField>

        <FormField
          label="Urutan"
          htmlFor="playlist-sort-order"
          error={errors.sortOrder}
          hint="Angka kecil tampil lebih dahulu."
        >
          <input
            id="playlist-sort-order"
            name="sortOrder"
            type="number"
            min={0}
            step={1}
            defaultValue={initial.sortOrder}
            className={inputClass(errors.sortOrder)}
          />
        </FormField>

        <FormField
          label="URL playlist"
          htmlFor="playlist-external-url"
          error={errors.externalUrl}
          hint="Tautan Spotify embed/playlist, mis. https://open.spotify.com/playlist/..."
        >
          <input
            id="playlist-external-url"
            name="externalUrl"
            type="url"
            placeholder="https://open.spotify.com/playlist/..."
            defaultValue={initial.externalUrl}
            aria-invalid={Boolean(errors.externalUrl)}
            className={inputClass(errors.externalUrl)}
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Sampul</h2>
        <ImagePicker
          name="coverImageUrl"
          label="Gambar sampul"
          initialUrl={initial.coverImageUrl}
          media={media}
          error={errors.coverImageUrl}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Publikasi</h2>
        <FormCheckbox
          label="Terbitkan playlist di situs publik"
          name="isPublished"
          defaultChecked={initial.isPublished}
          error={errors.isPublished}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <SubmitButton label="Simpan" />
        <Link href="/admin/playlists" className={buttonClass("secondary")}>
          Batal
        </Link>
      </div>
    </form>
  );
}
