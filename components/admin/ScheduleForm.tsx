"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { saveSchedule } from "@/lib/actions/schedules";
import { EMPTY_ACTION_RESULT } from "@/lib/actions/result";
import type { Program } from "@/lib/types";
import { WEEKDAY_NAMES_ID, WEEK_ORDER } from "@/lib/weekdays";
import { buttonClass } from "./buttonClass";
import { FormCheckbox, FormField, inputClass } from "./FormField";
import { SubmitButton } from "./SubmitButton";

export interface ScheduleFormValues {
  id: string;
  programId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export function ScheduleForm({
  programs,
  initial,
  redirectTo,
  submitLabel = "Simpan slot",
}: {
  programs: Program[];
  initial?: ScheduleFormValues;
  /** Halaman yang dibuka setelah simpan/hapus, mis. halaman detail program. */
  redirectTo: string;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(saveSchedule, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <FormField label="Program" htmlFor="schedule-program" error={errors.programId}>
        <select
          id="schedule-program"
          name="programId"
          defaultValue={initial?.programId ?? ""}
          aria-invalid={Boolean(errors.programId)}
          className={inputClass(errors.programId)}
        >
          <option value="">Pilih program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Hari" htmlFor="schedule-day" error={errors.dayOfWeek}>
        <select
          id="schedule-day"
          name="dayOfWeek"
          defaultValue={String(initial?.dayOfWeek ?? 1)}
          className={inputClass(errors.dayOfWeek)}
        >
          {WEEK_ORDER.map((day) => (
            <option key={day} value={day}>
              {WEEKDAY_NAMES_ID[day]}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Jam mulai (WIB)" htmlFor="schedule-start" error={errors.startTime}>
          <input
            id="schedule-start"
            type="time"
            name="startTime"
            defaultValue={initial?.startTime ?? "06:00"}
            aria-invalid={Boolean(errors.startTime)}
            className={inputClass(errors.startTime)}
          />
        </FormField>
        <FormField label="Jam selesai (WIB)" htmlFor="schedule-end" error={errors.endTime}>
          <input
            id="schedule-end"
            type="time"
            name="endTime"
            defaultValue={initial?.endTime ?? "08:00"}
            aria-invalid={Boolean(errors.endTime)}
            className={inputClass(errors.endTime)}
          />
        </FormField>
      </div>

      <FormCheckbox label="Slot aktif" name="isActive" defaultChecked={initial?.isActive ?? true} />

      <p className="text-xs text-ink-500">
        Jam selesai yang tidak lebih besar dari jam mulai berarti slot lintas tengah malam. Jam yang
        bertabrakan tetap bisa disimpan, tetapi tampil sebagai peringatan.
      </p>

      {state.ok ? null : <ErrorState message={errors.form ?? "Periksa kembali isian di atas."} />}

      <div className="flex flex-wrap gap-2">
        <SubmitButton label={submitLabel} />
        <Link href={redirectTo} className={buttonClass("secondary")}>
          Batal
        </Link>
      </div>
    </form>
  );
}
