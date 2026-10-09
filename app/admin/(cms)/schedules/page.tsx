import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ScheduleBoard } from "@/components/admin/ScheduleBoard";
import { buttonClass } from "@/components/admin/SubmitButton";
import { listPrograms, listSchedules } from "@/lib/admin/data";
import { findScheduleConflicts } from "@/lib/schedule";

export const metadata: Metadata = { title: "Jadwal" };

export default async function AdminSchedulesPage() {
  await connection();
  const [schedules, programs] = await Promise.all([listSchedules(), listPrograms()]);

  return (
    <>
      <PageHeader
        title="Jadwal"
        description="Jam tayang program per hari WIB (Asia/Jakarta). Peringatan konflik hanya menandai slot yang bertabrakan — simpan tetap bisa dilakukan."
        action={
          <Link href="/admin/schedules/new" className={buttonClass("primary")}>
            Tambah slot
          </Link>
        }
      />
      <ScheduleBoard
        schedules={schedules}
        programs={programs}
        conflicts={findScheduleConflicts(schedules)}
        redirectTo="/admin/schedules"
      />
    </>
  );
}
