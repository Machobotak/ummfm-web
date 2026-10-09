import { connection } from "next/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { listEvents, listMedia } from "@/lib/admin/data";
import { isoToJakartaLocal } from "@/lib/format";

export const metadata: Metadata = { title: "Ubah event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const [events, media] = await Promise.all([listEvents(), listMedia()]);
  const event = events.find((item) => item.id === id);
  if (!event) notFound();

  return (
    <>
      <PageHeader title="Ubah event" description={event.title} />
      <EventForm
        media={media}
        initial={{
          id: event.id,
          title: event.title,
          slug: event.slug,
          description: event.description,
          posterUrl: event.posterUrl,
          location: event.location,
          startsAt: isoToJakartaLocal(event.startsAt),
          endsAt: isoToJakartaLocal(event.endsAt),
          registrationUrl: event.registrationUrl ?? "",
          status: event.status,
          isPublished: event.isPublished,
        }}
      />
    </>
  );
}
