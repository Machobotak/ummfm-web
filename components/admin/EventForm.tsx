"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { EMPTY_ACTION_RESULT } from "@/lib/actions/result";
import { saveEvent } from "@/lib/actions/events";
import { slugify } from "@/lib/slugify";
import type { EventStatus, MediaAsset } from "@/lib/types";
import { FormCheckbox, FormField, inputClass } from "./FormField";
import { ImagePicker } from "./ImagePicker";
import { SubmitButton, buttonClass } from "./SubmitButton";

export interface EventFormValues {
  id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl: string;
  location: string;
  /** Nilai `datetime-local` jam dinding WIB; "" berarti belum diatur. */
  startsAt: string;
  endsAt: string;
  registrationUrl: string;
  status: EventStatus;
  isPublished: boolean;
}

const EMPTY_VALUES: EventFormValues = {
  id: "",
  title: "",
  slug: "",
  description: "",
  posterUrl: "",
  location: "",
  startsAt: "",
  endsAt: "",
  registrationUrl: "",
  status: "upcoming",
  isPublished: false,
};

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: "upcoming", label: "Akan datang" },
  { value: "ongoing", label: "Berlangsung" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export function EventForm({
  media,
  initial = EMPTY_VALUES,
}: {
  media: MediaAsset[];
  initial?: EventFormValues;
}) {
  const [state, formAction] = useActionState(saveEvent, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  // Slug yang sudah diubah manual tidak ditimpa perubahan judul.
  const [isSlugEdited, setSlugEdited] = useState(initial.slug !== "");

  function onTitleChange(value: string) {
    setTitle(value);
    if (initial.id === "" && !isSlugEdited) setSlug(slugify(value));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      {errors.form ? <ErrorState message={errors.form} /> : null}

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Informasi event</h2>

        <FormField label="Judul" htmlFor="event-title" error={errors.title}>
          <input
            id="event-title"
            name="title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            aria-invalid={Boolean(errors.title)}
            className={inputClass(errors.title)}
          />
        </FormField>

        <FormField
          label="Slug"
          htmlFor="event-slug"
          error={errors.slug}
          hint="Dipakai di URL: /events/slug-event. Huruf kecil, angka, dan tanda minus."
        >
          <input
            id="event-slug"
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
          label="Deskripsi"
          htmlFor="event-description"
          error={errors.description}
          hint="Tampil di halaman detail event."
        >
          <textarea
            id="event-description"
            name="description"
            rows={4}
            defaultValue={initial.description}
            aria-invalid={Boolean(errors.description)}
            className={inputClass(errors.description)}
          />
        </FormField>

        <FormField
          label="Lokasi"
          htmlFor="event-location"
          error={errors.location}
          hint="Contoh: Aula UMM, Malang."
        >
          <input
            id="event-location"
            name="location"
            defaultValue={initial.location}
            aria-invalid={Boolean(errors.location)}
            className={inputClass(errors.location)}
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Jadwal</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Mulai (WIB)" htmlFor="event-starts-at" error={errors.startsAt}>
            <input
              id="event-starts-at"
              type="datetime-local"
              name="startsAt"
              defaultValue={initial.startsAt}
              aria-invalid={Boolean(errors.startsAt)}
              className={inputClass(errors.startsAt)}
            />
          </FormField>

          <FormField label="Selesai (WIB)" htmlFor="event-ends-at" error={errors.endsAt}>
            <input
              id="event-ends-at"
              type="datetime-local"
              name="endsAt"
              defaultValue={initial.endsAt}
              aria-invalid={Boolean(errors.endsAt)}
              className={inputClass(errors.endsAt)}
            />
          </FormField>
        </div>

        <FormField
          label="Link pendaftaran"
          htmlFor="event-registration-url"
          error={errors.registrationUrl}
          hint="Opsional. Harus dimulai http:// atau https://."
        >
          <input
            id="event-registration-url"
            type="url"
            name="registrationUrl"
            defaultValue={initial.registrationUrl}
            placeholder="https://"
            aria-invalid={Boolean(errors.registrationUrl)}
            className={inputClass(errors.registrationUrl)}
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Poster dan publikasi</h2>

        <ImagePicker
          name="posterUrl"
          label="Poster event"
          initialUrl={initial.posterUrl}
          media={media}
          error={errors.posterUrl}
          hint="Opsional; tampil di kartu dan halaman detail event."
        />

        <FormField label="Status" htmlFor="event-status" error={errors.status}>
          <select
            id="event-status"
            name="status"
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

        <FormCheckbox
          label="Terbit di situs publik"
          name="isPublished"
          defaultChecked={initial.isPublished}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <SubmitButton label="Simpan" />
        <Link href="/admin/events" className={buttonClass("secondary")}>
          Batal
        </Link>
      </div>
    </form>
  );
}
