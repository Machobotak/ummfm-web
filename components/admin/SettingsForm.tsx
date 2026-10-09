"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { EMPTY_ACTION_RESULT } from "@/lib/actions/result";
import { saveSettings } from "@/lib/actions/settings";
import type { SiteSettings } from "@/lib/types";
import { buttonClass } from "./buttonClass";
import { FormField, inputClass } from "./FormField";
import { SubmitButton } from "./SubmitButton";

interface SocialLinkRow {
  platform: string;
  label: string;
  url: string;
}

/** Panjang teks yang nyaman di hasil pencarian (hanya masukan, bukan aturan). */
const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 160;

const EMPTY_SOCIAL_LINK: SocialLinkRow = { platform: "", label: "", url: "" };

/**
 * Form setelan situs. Daftar media sosial dan misi dikelola sebagai baris
 * dinamis; tiga field media sosial dikirim sebagai tiga daftar sejajar dengan
 * urut dokumen yang sama (`fieldTexts` di server action).
 */
export function SettingsForm({
  initial,
  fallbackStreamUrl,
}: {
  initial: SiteSettings;
  fallbackStreamUrl: string;
}) {
  const [state, formAction] = useActionState(saveSettings, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  const [socialLinks, setSocialLinks] = useState<SocialLinkRow[]>(
    initial.socialLinks.length > 0 ? initial.socialLinks : [EMPTY_SOCIAL_LINK],
  );
  const [mission, setMission] = useState<string[]>(
    initial.about.mission.length > 0 ? initial.about.mission : [""],
  );
  const [seoTitle, setSeoTitle] = useState(initial.seo.title);
  const [seoDescription, setSeoDescription] = useState(initial.seo.description);

  function updateSocialLink(index: number, patch: Partial<SocialLinkRow>) {
    setSocialLinks((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function updateMission(index: number, text: string) {
    setMission((rows) => rows.map((row, i) => (i === index ? text : row)));
  }

  const streamHint = fallbackStreamUrl
    ? `Kosongkan untuk memakai ${fallbackStreamUrl} dari NEXT_PUBLIC_STREAM_URL.`
    : "Kosongkan untuk memakai NEXT_PUBLIC_STREAM_URL.";

  return (
    // noValidate: pesan error datang dari server action supaya tampil inline,
    // bukan gelembung validasi bawaan peramban.
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {errors.form ? <ErrorState message={errors.form} /> : null}

      <section className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Identitas</h2>

        <FormField
          label="Tagline"
          htmlFor="settings-tagline"
          error={errors.tagline}
          hint="Tampil di samping nama situs pada header dan metadata."
        >
          <input
            id="settings-tagline"
            name="tagline"
            defaultValue={initial.tagline}
            aria-invalid={Boolean(errors.tagline)}
            className={inputClass(errors.tagline)}
          />
        </FormField>

        <FormField
          label="Email kontak"
          htmlFor="settings-contact-email"
          error={errors.contactEmail}
          hint="Alamat email pada bagian Kontak halaman Tentang."
        >
          <input
            id="settings-contact-email"
            name="contactEmail"
            type="email"
            autoComplete="email"
            defaultValue={initial.contactEmail}
            aria-invalid={Boolean(errors.contactEmail)}
            className={inputClass(errors.contactEmail)}
          />
        </FormField>

        <FormField
          label="URL siaran"
          htmlFor="settings-stream-url"
          error={errors.streamUrl}
          hint={streamHint}
        >
          <input
            id="settings-stream-url"
            name="streamUrl"
            type="url"
            defaultValue={initial.streamUrl ?? ""}
            placeholder="https://stream.example.com/live"
            aria-invalid={Boolean(errors.streamUrl)}
            className={inputClass(errors.streamUrl)}
          />
        </FormField>
      </section>

      <section className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Media sosial</h2>
            <p className="text-sm text-ink-700">Tautan yang tampil di footer situs publik.</p>
          </div>
          <button
            type="button"
            onClick={() => setSocialLinks((rows) => [...rows, { ...EMPTY_SOCIAL_LINK }])}
            className={buttonClass("secondary")}
          >
            Tambah tautan
          </button>
        </div>

        {errors.socialLinks ? (
          <p role="alert" className="text-sm font-medium text-danger">
            {errors.socialLinks}
          </p>
        ) : null}

        {socialLinks.map((row, index) => {
          const platformError = errors[`socialLinks.${index}.platform`];
          const labelError = errors[`socialLinks.${index}.label`];
          const urlError = errors[`socialLinks.${index}.url`];

          return (
            <fieldset
              key={index}
              className="flex flex-col gap-4 rounded-control border border-border p-4"
            >
              <legend className="px-1 text-sm font-semibold text-ink-950">
                Tautan {index + 1}
              </legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Platform"
                  htmlFor={`social-platform-${index}`}
                  error={platformError}
                >
                  <input
                    id={`social-platform-${index}`}
                    name="socialLinkPlatform"
                    value={row.platform}
                    onChange={(event) => updateSocialLink(index, { platform: event.target.value })}
                    placeholder="Instagram"
                    aria-invalid={Boolean(platformError)}
                    className={inputClass(platformError)}
                  />
                </FormField>

                <FormField
                  label="Label tampil"
                  htmlFor={`social-label-${index}`}
                  error={labelError}
                >
                  <input
                    id={`social-label-${index}`}
                    name="socialLinkLabel"
                    value={row.label}
                    onChange={(event) => updateSocialLink(index, { label: event.target.value })}
                    placeholder="@ummfm_malang"
                    aria-invalid={Boolean(labelError)}
                    className={inputClass(labelError)}
                  />
                </FormField>
              </div>

              <FormField
                label="URL"
                htmlFor={`social-url-${index}`}
                error={urlError}
                hint="Mulai dengan http:// atau https://"
              >
                <input
                  id={`social-url-${index}`}
                  name="socialLinkUrl"
                  type="url"
                  value={row.url}
                  onChange={(event) => updateSocialLink(index, { url: event.target.value })}
                  placeholder="https://www.instagram.com/ummfm_malang"
                  aria-invalid={Boolean(urlError)}
                  className={inputClass(urlError)}
                />
              </FormField>

              <div>
                <button
                  type="button"
                  onClick={() => setSocialLinks((rows) => rows.filter((_, i) => i !== index))}
                  disabled={socialLinks.length <= 1}
                  className={buttonClass("secondary")}
                >
                  Hapus tautan {index + 1}
                </button>
              </div>
            </fieldset>
          );
        })}
      </section>

      <section className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Tentang</h2>

        <FormField
          label="Deskripsi singkat"
          htmlFor="settings-about-intro"
          error={errors["about.intro"]}
          hint="Paragraf pembuka halaman Tentang."
        >
          <textarea
            id="settings-about-intro"
            name="aboutIntro"
            rows={3}
            defaultValue={initial.about.intro}
            aria-invalid={Boolean(errors["about.intro"])}
            className={inputClass(errors["about.intro"])}
          />
        </FormField>

        <FormField
          label="Sejarah"
          htmlFor="settings-about-history"
          error={errors["about.history"]}
        >
          <textarea
            id="settings-about-history"
            name="aboutHistory"
            rows={5}
            defaultValue={initial.about.history}
            aria-invalid={Boolean(errors["about.history"])}
            className={inputClass(errors["about.history"])}
          />
        </FormField>

        <FormField label="Visi" htmlFor="settings-about-vision" error={errors["about.vision"]}>
          <textarea
            id="settings-about-vision"
            name="aboutVision"
            rows={3}
            defaultValue={initial.about.vision}
            aria-invalid={Boolean(errors["about.vision"])}
            className={inputClass(errors["about.vision"])}
          />
        </FormField>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink-950">Misi</h3>
            <button
              type="button"
              onClick={() => setMission((rows) => [...rows, ""])}
              className={buttonClass("secondary")}
            >
              Tambah misi
            </button>
          </div>

          {errors["about.mission"] ? (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors["about.mission"]}
            </p>
          ) : null}

          {mission.map((text, index) => {
            const missionError = errors[`about.mission.${index}`];

            return (
              <div key={index} className="flex flex-col gap-3">
                <FormField
                  label={`Misi ${index + 1}`}
                  htmlFor={`mission-${index}`}
                  error={missionError}
                >
                  <textarea
                    id={`mission-${index}`}
                    name="mission"
                    rows={2}
                    value={text}
                    onChange={(event) => updateMission(index, event.target.value)}
                    aria-invalid={Boolean(missionError)}
                    className={inputClass(missionError)}
                  />
                </FormField>

                <div>
                  <button
                    type="button"
                    onClick={() => setMission((rows) => rows.filter((_, i) => i !== index))}
                    disabled={mission.length <= 1}
                    className={buttonClass("secondary")}
                  >
                    Hapus misi {index + 1}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">SEO</h2>

        <FormField
          label="Judul SEO"
          htmlFor="settings-seo-title"
          error={errors.seoTitle}
          hint={`${seoTitle.length} dari ${SEO_TITLE_MAX} karakter.`}
        >
          <input
            id="settings-seo-title"
            name="seoTitle"
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
            aria-invalid={Boolean(errors.seoTitle)}
            className={inputClass(errors.seoTitle)}
          />
        </FormField>

        <FormField
          label="Deskripsi SEO"
          htmlFor="settings-seo-description"
          error={errors.seoDescription}
          hint={`${seoDescription.length} dari ${SEO_DESCRIPTION_MAX} karakter.`}
        >
          <textarea
            id="settings-seo-description"
            name="seoDescription"
            rows={3}
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            aria-invalid={Boolean(errors.seoDescription)}
            className={inputClass(errors.seoDescription)}
          />
        </FormField>
      </section>

      <div className="flex flex-wrap gap-2">
        <SubmitButton label="Simpan" />
        <Link href="/admin" className={buttonClass("secondary")}>
          Batal
        </Link>
      </div>
    </form>
  );
}
