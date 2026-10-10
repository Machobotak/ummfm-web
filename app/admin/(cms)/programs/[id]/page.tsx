import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { ScheduleBoard } from "@/components/admin/ScheduleBoard";
import { buttonClass } from "@/components/admin/buttonClass";
import { getProgram, listMedia, listSchedules } from "@/lib/admin/data";
import { findScheduleConflicts } from "@/lib/schedule";

export const metadata: Metadata = { title: "Ubah program" };

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const [program, media, schedules] = await Promise.all([
    getProgram(id),
    listMedia(),
    listSchedules(),
  ]);
  if (!program) notFound();

  const programSchedules = schedules.filter((schedule) => schedule.programId === program.id);

  return (
    <>
      <PageHeader title="Ubah program" description={program.name} />
      <div className="flex flex-col gap-8">
        <ProgramForm
          media={media}
          initial={{
            id: program.id,
            name: program.name,
            slug: program.slug,
            description: program.description,
            coverImageUrl: program.coverImageUrl,
            isActive: program.isActive,
            isPublished: program.isPublished,
          }}
        />

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Jadwal tayang</h2>
            <Link href="/admin/schedules/new" className={buttonClass("secondary")}>
              Tambah slot jadwal
            </Link>
          </div>
          <ScheduleBoard
            schedules={programSchedules}
            programs={[program]}
            conflicts={findScheduleConflicts(programSchedules)}
            redirectTo={`/admin/programs/${id}`}
          />
        </section>
      </div>
    </>
  );
}
