import { connection } from "next/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ScheduleForm } from "@/components/admin/ScheduleForm";
import { listPrograms, listSchedules } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Ubah slot jadwal" };

export default async function EditSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const [schedules, programs] = await Promise.all([listSchedules(), listPrograms()]);
  const schedule = schedules.find((item) => item.id === id);
  if (!schedule) notFound();

  return (
    <>
      <PageHeader title="Ubah slot jadwal" description="Ubah program, hari, atau jam tayang slot ini." />
      <ScheduleForm
        programs={programs}
        initial={{
          id: schedule.id,
          programId: schedule.programId,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: schedule.isActive,
        }}
        redirectTo="/admin/schedules"
      />
    </>
  );
}
