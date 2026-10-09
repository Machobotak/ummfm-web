import { connection } from "next/server";
import { STATION_TZ } from "./format";
import type { Program, ProgramSchedule } from "./types";

export function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const JAKARTA_WALL_CLOCK = new Intl.DateTimeFormat("en-US", {
  timeZone: STATION_TZ,
  weekday: "short",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});

const ENGLISH_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Jam dinding Asia/Jakarta dari sebuah instan. */
export function getJakartaParts(now: Date): { weekday: number; minutes: number } {
  const parts = JAKARTA_WALL_CLOCK.formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  // hour12:false dapat mengembalikan "24" untuk tengah malam pada sebagian ICU.
  const hour = Number(value("hour")) % 24;
  return {
    weekday: ENGLISH_WEEKDAYS.indexOf(value("weekday")),
    minutes: hour * 60 + Number(value("minute")),
  };
}

function jakartaDateKey(instant: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: STATION_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

/** Slot jadwal yang sedang berjalan, termasuk slot yang melewati tengah malam. */
export function isScheduleActive(
  schedule: ProgramSchedule,
  weekday: number,
  minutes: number,
): boolean {
  const start = parseTimeToMinutes(schedule.startTime);
  const end = parseTimeToMinutes(schedule.endTime);

  if (end > start) {
    return weekday === schedule.dayOfWeek && minutes >= start && minutes < end;
  }
  // end <= start → lintas tengah malam.
  if (weekday === schedule.dayOfWeek) return minutes >= start;
  return weekday === (schedule.dayOfWeek + 1) % 7 && minutes < end;
}

/** Slot yang boleh tayang: jadwal aktif + program aktif dan terbit. */
export function isBroadcastable(
  schedule: ProgramSchedule,
  programById: Record<string, Program>,
): boolean {
  const program = programById[schedule.programId];
  return Boolean(program && schedule.isActive && program.isActive && program.isPublished);
}

function indexPrograms(programs: Program[]): Record<string, Program> {
  return Object.fromEntries(programs.map((program) => [program.id, program]));
}

/** Program yang sedang tayang menurut jadwal Asia/Jakarta (null bila di luar jadwal). */
export function getActiveProgram(
  programs: Program[],
  schedules: ProgramSchedule[],
  now: Date,
): { program: Program; schedule: ProgramSchedule } | null {
  const { weekday, minutes } = getJakartaParts(now);
  const programById = indexPrograms(programs);

  const active = schedules
    .filter(
      (schedule) =>
        isBroadcastable(schedule, programById) &&
        isScheduleActive(schedule, weekday, minutes),
    )
    .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));

  const schedule = active[0];
  if (!schedule) return null;
  return { program: programById[schedule.programId], schedule };
}

/** Mulai tayang berikutnya untuk setiap slot aktif, urut menaik. */
export function getUpcomingPrograms(
  programs: Program[],
  schedules: ProgramSchedule[],
  now: Date,
  limit: number,
): { program: Program; schedule: ProgramSchedule; startsAt: Date }[] {
  const { weekday, minutes } = getJakartaParts(now);
  const programById = indexPrograms(programs);
  const upcoming: { program: Program; schedule: ProgramSchedule; startsAt: Date }[] = [];

  for (const schedule of schedules) {
    if (!isBroadcastable(schedule, programById)) continue;

    const start = parseTimeToMinutes(schedule.startTime);
    let daysAhead = (schedule.dayOfWeek - weekday + 7) % 7;
    if (daysAhead === 0 && start <= minutes) daysAhead = 7; // slot hari ini sudah lewat
    const dateKey = jakartaDateKey(new Date(now.getTime() + daysAhead * 86_400_000));
    upcoming.push({
      program: programById[schedule.programId],
      schedule,
      startsAt: new Date(`${dateKey}T${schedule.startTime}:00+07:00`),
    });
  }

  upcoming.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  return upcoming.slice(0, limit);
}

/** Slot jadwal satu hari (0=Minggu … 6=Sabtu), urut jam mulai. */
export function getSchedulesForDay(
  schedules: ProgramSchedule[],
  dayOfWeek: number,
): ProgramSchedule[] {
  return schedules
    .filter((schedule) => schedule.isActive && schedule.dayOfWeek === dayOfWeek)
    .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
}

/**
 * Waktu server saat ini. `connection()` dulu supaya nilainya runtime, bukan hasil prerender
 * (Cache Components), dan supaya komponen pemanggil wajib berada di dalam <Suspense>.
 */
export async function getRequestNow(): Promise<Date> {
  await connection();
  return new Date();
}

const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = MINUTES_PER_DAY * 7;

export interface ScheduleConflict {
  /** Hari slot pertama (0=Minggu … 6=Sabtu). */
  dayOfWeek: number;
  a: ProgramSchedule;
  b: ProgramSchedule;
}

interface ScheduleSpan {
  schedule: ProgramSchedule;
  start: number;
  end: number;
}

/**
 * Slot yang saling bertabrakan (jam tayang tumpang tindih). Rentang dihitung
 * pada garis waktu mingguan, jadi slot lintas tengah malam ikut dibandingkan
 * dengan slot hari berikutnya (mis. Jumat 22:00–01:00 vs Sabtu 00:30).
 * Hasilnya hanya peringatan di editor jadwal — tidak pernah memblokir simpan.
 */
export function findScheduleConflicts(schedules: ProgramSchedule[]): ScheduleConflict[] {
  const spans = schedules.filter((schedule) => schedule.isActive).map(toSpan);
  const conflicts: ScheduleConflict[] = [];

  for (let i = 0; i < spans.length; i += 1) {
    for (let j = i + 1; j < spans.length; j += 1) {
      const first = spans[i];
      const second = spans[j];
      if (
        overlaps(first, second) ||
        overlaps(first, shifted(second, MINUTES_PER_WEEK)) ||
        overlaps(first, shifted(second, -MINUTES_PER_WEEK))
      ) {
        conflicts.push({
          dayOfWeek: first.schedule.dayOfWeek,
          a: first.schedule,
          b: second.schedule,
        });
      }
    }
  }

  return conflicts.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
}

function toSpan(schedule: ProgramSchedule): ScheduleSpan {
  const startMinute = parseTimeToMinutes(schedule.startTime);
  const endMinute = parseTimeToMinutes(schedule.endTime);
  // end <= start → slot lintas tengah malam (durasi sampai jam yang sama besoknya).
  const duration =
    endMinute > startMinute ? endMinute - startMinute : MINUTES_PER_DAY - startMinute + endMinute;
  const start = schedule.dayOfWeek * MINUTES_PER_DAY + startMinute;

  return { schedule, start, end: start + duration };
}

function shifted(span: ScheduleSpan, offset: number): ScheduleSpan {
  return { ...span, start: span.start + offset, end: span.end + offset };
}

function overlaps(a: ScheduleSpan, b: ScheduleSpan): boolean {
  return a.start < b.end && b.start < a.end;
}
