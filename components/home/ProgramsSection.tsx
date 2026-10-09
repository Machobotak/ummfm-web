import { Suspense } from "react";
import { ProgramCard } from "@/components/content/ProgramCard";
import { ScheduleList } from "@/components/content/ScheduleList";
import { Container } from "@/components/ui/Container";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getJakartaParts, getRequestNow, getSchedulesForDay } from "@/lib/schedule";
import type { Program, ProgramSchedule } from "@/lib/types";
import { WEEKDAY_NAMES_ID } from "@/lib/weekdays";

export function ProgramsSection({
  programs,
  schedules,
}: {
  programs: Program[];
  schedules: ProgramSchedule[];
}) {
  const programById: Record<string, Program> = Object.fromEntries(
    programs.map((program) => [program.id, program]),
  );

  return (
    <section className="border-b border-border bg-surface py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Program & Jadwal"
          description="Program harian UMMFM beserta jam siaran dalam WIB."
          href="/program"
        />
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="grid gap-5 sm:grid-cols-2">
            {programs.slice(0, 4).map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
              Jadwal hari ini
            </h3>
            <div className="mt-3">
              <Suspense fallback={<LoadingSkeleton className="h-64" />}>
                <TodaySchedule schedules={schedules} programById={programById} />
              </Suspense>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

async function TodaySchedule({
  schedules,
  programById,
}: {
  schedules: ProgramSchedule[];
  programById: Record<string, Program>;
}) {
  const { weekday } = getJakartaParts(await getRequestNow());
  const entries = getSchedulesForDay(schedules, weekday).map((schedule) => ({
    program: programById[schedule.programId],
    schedule,
  }));

  if (entries.length === 0) {
    return (
      <p className="rounded-card border border-border bg-canvas px-5 py-4 text-ink-700">
        Tidak ada jadwal siaran pada hari {WEEKDAY_NAMES_ID[weekday]}.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-ink-500">Hari {WEEKDAY_NAMES_ID[weekday]}</p>
      <ScheduleList entries={entries} />
    </div>
  );
}
