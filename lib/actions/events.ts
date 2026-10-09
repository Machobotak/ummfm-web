"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAdmin } from "@/lib/supabase/admin";
import { fieldChecked, fieldText } from "./fields";
import { localDateTimeSchema, optionalHttpUrlSchema, optionalIdSchema, slugSchema } from "./form-schema";
import { databaseErrors, fieldErrors, type ActionResult } from "./result";

const eventSchema = z
  .object({
    id: optionalIdSchema,
    title: z.string().trim().min(1, "Judul event wajib diisi"),
    slug: slugSchema,
    description: z.string().trim(),
    posterUrl: z.string().trim(),
    location: z.string().trim(),
    startsAt: localDateTimeSchema,
    endsAt: localDateTimeSchema,
    registrationUrl: optionalHttpUrlSchema,
    status: z.enum(["upcoming", "ongoing", "completed", "cancelled"], {
      message: "Status tidak valid",
    }),
    isPublished: z.boolean(),
  })
  .refine((value) => new Date(value.endsAt) > new Date(value.startsAt), {
    path: ["endsAt"],
    message: "Waktu selesai harus setelah waktu mulai",
  });

export async function saveEvent(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireRole("editor");

  const parsed = eventSchema.safeParse({
    id: fieldText(formData, "id") || undefined,
    title: fieldText(formData, "title"),
    slug: fieldText(formData, "slug"),
    description: fieldText(formData, "description"),
    posterUrl: fieldText(formData, "posterUrl"),
    location: fieldText(formData, "location"),
    startsAt: fieldText(formData, "startsAt"),
    endsAt: fieldText(formData, "endsAt"),
    registrationUrl: fieldText(formData, "registrationUrl"),
    status: fieldText(formData, "status"),
    isPublished: fieldChecked(formData, "isPublished"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const { id, ...values } = parsed.data;
  const payload = {
    title: values.title,
    slug: values.slug,
    description: values.description,
    poster_url: values.posterUrl,
    location: values.location,
    starts_at: values.startsAt,
    ends_at: values.endsAt,
    registration_url: values.registrationUrl,
    status: values.status,
    is_published: values.isPublished,
  };

  const admin = getAdmin();
  const { error } = id
    ? await admin.from("events").update(payload).eq("id", id)
    : await admin.from("events").insert(payload);
  if (error) return { ok: false, errors: databaseErrors(error, "slug") };

  updateTag(CACHE_TAGS.events);
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData): Promise<void> {
  await requireRole("editor");

  const id = fieldText(formData, "id");
  if (id) {
    const { error } = await getAdmin().from("events").delete().eq("id", id);
    if (error) throw new Error(`Gagal menghapus event: ${error.message}`);
  }

  updateTag(CACHE_TAGS.events);
  redirect("/admin/events");
}
