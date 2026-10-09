import { EventCard } from "@/components/content/EventCard";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { RadioEvent } from "@/lib/types";

export function EventsSection({ events }: { events: RadioEvent[] }) {
  const current = events.filter((event) => event.status === "upcoming" || event.status === "ongoing");

  return (
    <section className="border-b border-border bg-canvas py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Event"
          description="Agenda UMMFM yang sedang berlangsung dan akan datang."
          href="/event"
        />
        {current.length === 0 ? (
          <EmptyState
            title="Belum ada event mendatang"
            description="Agenda UMMFM berikutnya akan diumumkan di halaman ini."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {current.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
