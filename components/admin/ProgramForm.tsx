"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { EMPTY_ACTION_RESULT } from "@/lib/actions/result";
import { saveProgram } from "@/lib/actions/programs";
import { slugify } from "@/lib/slugify";
import type { MediaAsset } from "@/lib/types";
import { FormCheckbox, FormField, inputClass } from "./FormField";
import { ImagePicker } from "./ImagePicker";
import { SubmitButton, buttonClass } from "./SubmitButton";

export interface ProgramFormValues {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  hostName: string;
  isActive: boolean;
  isPublished: boolean;
}

const EMPTY_VALUES: ProgramFormValues = {
  id: "",
  name: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  hostName: "",
  isActive: true,
  isPublished: false,
};

export function ProgramForm({
  media,
  initial = EMPTY_VALUES,
}: {
  media: MediaAsset[];
  initial?: ProgramFormValues;
}) {
  const [state, formAction] = useActionState(saveProgram, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  // Slug yang sudah diubah manual tidak ditimpa perubahan nama.
  const [isSlugEdited, setSlugEdited] = useState(initial.slug !== "");

  function onNameChange(value: string) {
    setName(value);
    if (initial.id === "" && !isSlugEdited) setSlug(slugify(value));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      {errors.form ? <ErrorState message={errors.form} /> : null}

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <FormField label="Nama program" htmlFor="program-name" error={errors.name}>
          <input
            id="program-name"
            name="name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            className={inputClass(errors.name)}
          />
        </FormField>

        <FormField
          label="Slug"
          htmlFor="program-slug"
          error={errors.slug}
          hint="Penanda unik program. Huruf kecil, angka, dan tanda minus."
        >
          <input
            id="program-slug"
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
          label="Host / penyiar"
          htmlFor="program-host"
          error={errors.hostName}
          hint="Nama penyiar yang tampil bersama program."
        >
          <input
            id="program-host"
            name="hostName"
            defaultValue={initial.hostName}
            className={inputClass(errors.hostName)}
          />
        </FormField>

        <FormField
          label="Deskripsi"
          htmlFor="program-description"
          error={errors.description}
          hint="Tampil di halaman Program situs publik."
        >
          <textarea
            id="program-description"
            name="description"
            rows={4}
            defaultValue={initial.description}
            className={inputClass(errors.description)}
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Gambar</h2>
        <ImagePicker
          name="coverImageUrl"
          label="Gambar sampul (16:9)"
          initialUrl={initial.coverImageUrl}
          media={media}
          error={errors.coverImageUrl}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Status</h2>
        <FormCheckbox
          label="Program aktif"
          name="isActive"
          defaultChecked={initial.isActive}
          error={errors.isActive}
        />
        <FormCheckbox
          label="Terbit di situs publik"
          name="isPublished"
          defaultChecked={initial.isPublished}
          error={errors.isPublished}
        />
        <p className="text-xs text-ink-500">
          Program nonaktif tidak ikut tayang meski punya slot jadwal aktif.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <SubmitButton label="Simpan" />
        <Link href="/admin/programs" className={buttonClass("secondary")}>
          Batal
        </Link>
      </div>
    </form>
  );
}
