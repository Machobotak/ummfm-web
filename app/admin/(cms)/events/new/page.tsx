import { connection } from "next/server";
import type { Metadata } from "next";
import { EventForm } from "@/components/admin/EventForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { listMedia } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Event baru" };

export default async function NewEventPage() {
  await connection();
  const media = await listMedia();

  return (
    <>
      <PageHeader
        title="Event baru"
        description="Isi jadwal dalam WIB. Waktu selesai harus setelah waktu mulai."
      />
      <EventForm media={media} />
    </>
  );
}
