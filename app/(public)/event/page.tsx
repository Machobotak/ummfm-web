import type { Metadata } from "next";
import { EventCard } from "@/components/content/EventCard";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Event",
  description:
    "Agenda UMMFM yang sedang berlangsung dan akan datang, lengkap dengan arsip kegiatan yang sudah selesai.",
};

export default async function EventPage() {
  const events = await getPublishedEvents();
  const current = events.filter(
    (event) => event.status === "upcoming" || event.status === "ongoing",
  );
  const archive = events.filter(
    (event) => event.status === "completed" || event.status === "cancelled",
  );

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <SectionHeading
        as="h1"
        title="Event"
        description="Agenda kegiatan 93.4 UMMFM — dari open studio dan workshop penyiaran sampai siaran kolaborasi bersama komunitas kampus."
      />

      {current.length === 0 ? (
        <EmptyState
          title="Belum ada event mendatang"
          description="Agenda UMMFM berikutnya akan diumumkan di halaman ini."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {current.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <section className="mt-14 sm:mt-20">
        <h2 className="text-2xl font-bold mb-6">Arsip</h2>
        {archive.length === 0 ? (
          <p className="text-ink-500">Belum ada event yang selesai.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
