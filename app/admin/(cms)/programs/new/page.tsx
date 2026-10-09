import { connection } from "next/server";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { listMedia } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Program baru" };

export default async function NewProgramPage() {
  await connection();
  const media = await listMedia();

  return (
    <>
      <PageHeader
        title="Program baru"
        description="Program tanpa slot jadwal belum tayang di situs publik."
      />
      <ProgramForm media={media} />
    </>
  );
}
