import Link from "next/link";
import { deleteSchedule } from "@/lib/actions/schedules";
import type { ScheduleConflict } from "@/lib/schedule";
import type { Program, ProgramSchedule } from "@/lib/types";
import { WEEKDAY_NAMES_ID, WEEK_ORDER } from "@/lib/weekdays";
import { ConfirmDelete } from "./ConfirmDelete";

function conflictLine(conflict: ScheduleConflict, nameById: Map<string, string>): string {
  const a = nameById.get(conflict.a.programId) ?? "Program";
  const b = nameById.get(conflict.b.programId) ?? "Program";
  return `${WEEKDAY_NAMES_ID[conflict.dayOfWeek]}: ${a} (${conflict.a.startTime}–${conflict.a.endTime}) bertabrakan dengan ${b} (${conflict.b.startTime}–${conflict.b.endTime})`;
}

/**
 * Jadwal dikelompokkan per hari WIB (design.md §8.7). Konflik dihitung di server
 * (`lib/schedule.ts` mengimpor `next/server`) lalu ditampilkan sebagai peringatan.
 */
export function ScheduleBoard({
  schedules,
  programs,
  conflicts,
  redirectTo,
}: {
  schedules: ProgramSchedule[];
  programs: Program[];
  conflicts: ScheduleConflict[];
  redirectTo: string;
}) {
  const nameById = new Map(programs.map((program) => [program.id, program.name]));
  const conflictingIds = new Set(
    conflicts.flatMap((conflict) => [conflict.a.id, conflict.b.id]),
  );

  if (schedules.length === 0) {
    return (
      <p className="rounded-card border border-border bg-surface px-5 py-6 text-ink-700">
        Belum ada slot jadwal. Tambahkan slot pertama lewat tombol di atas.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {conflicts.length > 0 ? (
        <div role="status" className="rounded-card border border-warning/40 bg-warning/10 px-5 py-4">
          <p className="font-semibold text-warning">
            {conflicts.length} jam tayang bertabrakan — periksa lagi sebelum mengudara.
          </p>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-ink-700">
            {conflicts.map((conflict) => (
              <li key={`${conflict.a.id}-${conflict.b.id}`}>{conflictLine(conflict, nameById)}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {WEEK_ORDER.map((day) => {
        const daySchedules = schedules.filter((schedule) => schedule.dayOfWeek === day);
        if (daySchedules.length === 0) return null;

        return (
          <section key={day} className="rounded-card border border-border bg-surface p-5">
            <h3 className="text-lg font-semibold">{WEEKDAY_NAMES_ID[day]}</h3>
            <ul className="mt-4 flex flex-col divide-y divide-border">
              {daySchedules.map((schedule) => (
                <li
                  key={schedule.id}
                  className={`flex flex-wrap items-center gap-x-4 gap-y-2 py-3 ${
                    conflictingIds.has(schedule.id) ? "border-l-4 border-warning pl-3" : ""
                  }`}
                >
                  <span className="w-[120px] font-mono text-sm text-ink-700">
                    {schedule.startTime}–{schedule.endTime}
                  </span>
                  <span className="flex-1 font-semibold">
                    {nameById.get(schedule.programId) ?? "Program terhapus"}
                  </span>
                  {schedule.hostName ? (
                    <span className="text-sm text-ink-500">{schedule.hostName}</span>
                  ) : null}
                  <span className="text-xs font-semibold text-ink-500">
                    {schedule.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/schedules/${schedule.id}`}
                      className="min-h-11 rounded-control px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      Ubah
                    </Link>
                    <ConfirmDelete
                      action={deleteSchedule}
                      id={schedule.id}
                      redirectTo={redirectTo}
                      title="Hapus slot jadwal?"
                      description={`${nameById.get(schedule.programId) ?? "Program"} · ${schedule.startTime}–${schedule.endTime}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
