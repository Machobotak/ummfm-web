import { Suspense } from "react";
import { LiveRadioPlayer, type OnAirInfo } from "@/components/player/LiveRadioPlayer";
import { CardImage } from "@/components/ui/CardImage";
import { Container } from "@/components/ui/Container";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDateWithWeekday, formatTimeRange } from "@/lib/format";
import { getActiveProgram, getRequestNow, getUpcomingPrograms } from "@/lib/schedule";
import type { Program, ProgramSchedule } from "@/lib/types";

/**
 * Section live. Isi jadwal dibaca di server per request (`getRequestNow` +
 * <Suspense>): status koneksi stream tetap urusan player di klien (design.md §6.2).
 */
export function OnAirSection({
  programs,
  schedules,
}: {
  programs: Program[];
  schedules: ProgramSchedule[];
}) {
  return (
    <section id="live" className="border-b border-border bg-canvas py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Siaran Sekarang"
          description="Jadwal siaran dan status koneksi stream ditampilkan terpisah: program bisa terjadwal tanpa berarti stream sedang tersedia."
        />
        <Suspense fallback={<LoadingSkeleton className="h-72" />}>
          <OnAirContent programs={programs} schedules={schedules} />
        </Suspense>
      </Container>
    </section>
  );
}

async function OnAirContent({
  programs,
  schedules,
}: {
  programs: Program[];
  schedules: ProgramSchedule[];
}) {
  const now = await getRequestNow();
  const active = getActiveProgram(programs, schedules, now);
  const upcoming = getUpcomingPrograms(programs, schedules, now, 3);

  let onAir: OnAirInfo | undefined;
  if (active) {
    onAir = {
      name: active.program.name,
      hostName: active.program.hostName,
      timeRange: formatTimeRange(active.schedule.startTime, active.schedule.endTime),
    };
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <LiveRadioPlayer variant="hero" activeProgram={onAir} />

      <div className="space-y-6">
        {active ? (
          <article className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
            <CardImage
              src={active.program.coverImageUrl}
              alt={`Cover program ${active.program.name}`}
              ratio="4/5"
              className="rounded-none"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold">{active.program.name}</h3>
              <p className="mt-1 text-sm text-ink-500">{active.program.hostName}</p>
              <p className="mt-2 font-semibold tabular-nums text-brand-700">
                {formatTimeRange(active.schedule.startTime, active.schedule.endTime)}
              </p>
            </div>
          </article>
        ) : (
          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="text-xl font-semibold">Belum ada program aktif</h3>
            <p className="mt-2 text-ink-700">
              Saat ini tidak ada program terjadwal. Program berikutnya ada pada daftar di bawah —
              semua waktu dalam WIB.
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
            Program berikutnya
          </h3>
          <ul className="mt-3 space-y-3">
            {upcoming.map(({ program, schedule, startsAt }) => (
              <li
                key={schedule.id}
                className="rounded-card border border-border bg-surface px-4 py-3"
              >
                <p className="font-semibold">{program.name}</p>
                <p className="text-sm text-ink-500">
                  {formatDateWithWeekday(startsAt.toISOString())} ·{" "}
                  {formatTimeRange(schedule.startTime, schedule.endTime)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
