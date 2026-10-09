import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatEventPeriod } from "@/lib/format";
import type { RadioEvent } from "@/lib/types";

export function EventCard({ event }: { event: RadioEvent }) {
  return (
    <article className="h-full">
      <Link
        href={`/event/${event.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card transition-shadow hover:shadow-overlay"
      >
        <CardImage src={event.posterUrl} alt={`Poster event ${event.title}`} ratio="3/4" />
        <div className="flex flex-1 flex-col p-5">
          <StatusBadge status={event.status} />
          <h3 className="mt-3 line-clamp-2 text-xl font-semibold">{event.title}</h3>
          <p className="mt-2 text-sm text-ink-500">
            <time dateTime={event.startsAt}>{formatEventPeriod(event.startsAt, event.endsAt)}</time>
          </p>
          <p className="mt-1 text-sm text-ink-700">{event.location}</p>
        </div>
      </Link>
    </article>
  );
}
