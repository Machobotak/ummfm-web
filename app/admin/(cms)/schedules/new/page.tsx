import { connection } from "next/server";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ScheduleForm } from "@/components/admin/ScheduleForm";
import { listPrograms } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Slot jadwal baru" };

export default async function NewSchedulePage() {
  await connection();
  const programs = await listPrograms();

  return (
    <>
      <PageHeader
        title="Slot jadwal baru"
        description="Jam tayang memakai WIB (Asia/Jakarta). Jam selesai sebelum jam mulai berarti slot tayang sampai lewat tengah malam."
      />
      <ScheduleForm programs={programs} redirectTo="/admin/schedules" submitLabel="Tambah slot" />
    </>
  );
}
