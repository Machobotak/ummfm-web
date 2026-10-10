"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAdmin } from "@/lib/supabase/admin";
import { fieldChecked, fieldText } from "./fields";
import { optionalIdSchema, timeSchema } from "./form-schema";
import { databaseErrors, fieldErrors, type ActionResult } from "./result";

const scheduleSchema = z.object({
  id: optionalIdSchema,
  programId: z.string().trim().min(1, "Program wajib dipilih"),
  dayOfWeek: z
    .string()
    .trim()
    .regex(/^[0-6]$/, "Hari tidak valid")
    .transform(Number),
  startTime: timeSchema,
  endTime: timeSchema,
  hostName: z.string().trim(),
  isActive: z.boolean(),
});

/** `redirectTo` mengembalikan editor ke halaman asal (jadwal global atau detail program). */
function redirectTarget(formData: FormData): string {
  const target = fieldText(formData, "redirectTo");
  return target.startsWith("/admin") ? target : "/admin/schedules";
}

export async function saveSchedule(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("editor");

  const parsed = scheduleSchema.safeParse({
    id: fieldText(formData, "id") || undefined,
    programId: fieldText(formData, "programId"),
    dayOfWeek: fieldText(formData, "dayOfWeek"),
    startTime: fieldText(formData, "startTime"),
    endTime: fieldText(formData, "endTime"),
    hostName: fieldText(formData, "hostName"),
    isActive: fieldChecked(formData, "isActive"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const { id, ...values } = parsed.data;
  const payload = {
    program_id: values.programId,
    day_of_week: values.dayOfWeek,
    start_time: values.startTime,
    end_time: values.endTime,
    host_name: values.hostName,
    is_active: values.isActive,
  };

  const admin = getAdmin();
  const { error } = id
    ? await admin.from("program_schedules").update(payload).eq("id", id)
    : await admin.from("program_schedules").insert(payload);
  if (error) return { ok: false, errors: databaseErrors(error) };

  updateTag(CACHE_TAGS.schedules);
  redirect(redirectTarget(formData));
}

export async function deleteSchedule(formData: FormData): Promise<void> {
  await requireRole("editor");

  const id = fieldText(formData, "id");
  if (id) {
    const { error } = await getAdmin().from("program_schedules").delete().eq("id", id);
    if (error) throw new Error(`Gagal menghapus slot jadwal: ${error.message}`);
  }

  updateTag(CACHE_TAGS.schedules);
  redirect(redirectTarget(formData));
}
