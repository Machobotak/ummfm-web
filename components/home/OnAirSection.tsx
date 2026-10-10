import { Suspense } from "react";
import { LiveRadioPlayer, type OnAirInfo } from "@/components/player/LiveRadioPlayer";
import { Container } from "@/components/ui/Container";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLiveMessages } from "@/lib/content";
import { formatDateWithWeekday, formatTimeRange } from "@/lib/format";
import { getActiveProgram, getRequestNow, getUpcomingPrograms } from "@/lib/schedule";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Program, ProgramSchedule } from "@/lib/types";
import { LiveChat } from "./LiveChat";

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
  const messages = await getLiveMessages();

  let onAir: OnAirInfo | undefined;
  if (active) {
    onAir = {
      name: active.program.name,
      hostName: active.program.hostName,
      timeRange: formatTimeRange(active.schedule.startTime, active.schedule.endTime),
      coverImageUrl: active.program.coverImageUrl,
    };
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <LiveRadioPlayer variant="hero" activeProgram={onAir} />

      <div className="space-y-6">
        <LiveChat initialMessages={messages} canPost={isSupabaseConfigured()} />

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
