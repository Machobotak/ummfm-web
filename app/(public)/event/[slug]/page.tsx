import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardImage } from "@/components/ui/CardImage";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getEventBySlug, getPublishedEvents } from "@/lib/content";
import { absoluteUrl, formatEventPeriod } from "@/lib/format";
// Sama seperti /news/[slug]: `params` dibutuhkan lebih dulu untuk memutuskan 404,
// jadi segmen ini diizinkan memblokir saat navigasi.
export const instant = false;

export async function generateStaticParams() {
  const events = await getPublishedEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata(props: PageProps<"/event/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {};
  }

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      type: "article",
      title: event.title,
      description: event.description,
      url: absoluteUrl(`/event/${slug}`),
    },
  };
}

export default async function EventDetailPage(props: PageProps<"/event/[slug]">) {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="lg:grid lg:grid-cols-[3fr_4fr] lg:items-start lg:gap-10">
        <div>
          <CardImage
            src={event.posterUrl}
            alt={`Poster event ${event.title}`}
            ratio="3/4"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <StatusBadge status={event.status} />
            {event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-control bg-brand-700 px-6 text-base font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Daftar
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <nav aria-label="Breadcrumb" className="text-sm">
            <Link
              href="/event"
              className="font-semibold text-brand-700 underline-offset-4 hover:text-brand-600 hover:underline"
            >
              Event
            </Link>
          </nav>

          <h1 className="mt-3 text-3xl font-bold sm:text-[34px] lg:text-[40px]">{event.title}</h1>

          <div className="mt-4 text-ink-700">
            <time dateTime={event.startsAt} className="font-semibold text-ink-950">
              {formatEventPeriod(event.startsAt, event.endsAt)}
            </time>
            <p className="mt-1">{event.location}</p>
          </div>

          <h2 className="mt-8 text-2xl font-bold">Tentang event</h2>
          <p className="mt-3 max-w-[720px] text-lg text-ink-700">{event.description}</p>
        </div>
      </div>
    </Container>
  );
}
