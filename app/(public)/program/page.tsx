import type { Metadata } from "next";
import { ProgramCard } from "@/components/content/ProgramCard";
import { ScheduleList } from "@/components/content/ScheduleList";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPrograms, getSchedules } from "@/lib/content";
import { getSchedulesForDay } from "@/lib/schedule";
import type { Program } from "@/lib/types";
import { WEEK_ORDER, WEEKDAY_NAMES_ID } from "@/lib/weekdays";

export const metadata: Metadata = {
  title: "Program",
  description:
    "Daftar program 93.4 UMMFM beserta jadwal siaran mingguan radio kampus Universitas Muhammadiyah Malang.",
};

export default async function ProgramPage() {
  const [programs, schedules] = await Promise.all([getPrograms(), getSchedules()]);

  const programById: Record<string, Program> = Object.fromEntries(
    programs.map((program) => [program.id, program]),
  );

  const week = WEEK_ORDER.map((day) => ({
    day,
    entries: getSchedulesForDay(schedules, day).map((schedule) => ({
      program: programById[schedule.programId],
      schedule,
    })),
  })).filter((day) => day.entries.length > 0);

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <SectionHeading
        as="h1"
        title="Program"
        description="Program harian UMMFM, dari siaran pagi sampai acara malam."
      />
      <p className="mb-8 max-w-[720px] text-ink-700">
        Kenali penyiar dan karakter setiap program, lalu simak jam tayangnya di jadwal mingguan.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      <h2 className="mt-12 mb-6 text-2xl font-bold">Jadwal Mingguan</h2>
      <p className="mb-6 text-ink-500">Semua waktu dalam WIB (Asia/Jakarta).</p>

      <div className="space-y-8">
        {week.map(({ day, entries }) => (
          <div key={day}>
            <h3 className="mb-3 text-lg font-semibold">{WEEKDAY_NAMES_ID[day]}</h3>
            <ScheduleList entries={entries} />
          </div>
        ))}
      </div>
    </Container>
  );
}
