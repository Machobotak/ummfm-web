import { formatTimeRange } from "@/lib/format";
import type { Program, ProgramSchedule } from "@/lib/types";

export interface ScheduleEntry {
  program: Program;
  schedule: ProgramSchedule;
}

/** Daftar jam siaran: "06:00–09:00 WIB — Semesta Pagi". */
export function ScheduleList({ entries }: { entries: ScheduleEntry[] }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-card border border-border bg-surface">
      {entries.map(({ program, schedule }) => (
        <li
          key={schedule.id}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4"
        >
          <span className="font-semibold tabular-nums">
            {formatTimeRange(schedule.startTime, schedule.endTime)}
          </span>
          <span className="text-ink-700">
            {program.name}
            {schedule.hostName ? (
              <span className="text-ink-500"> · {schedule.hostName}</span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
