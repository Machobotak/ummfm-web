import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { STATION_NAME, TAGLINE } from "@/lib/site";

export function Hero() {
  return (
    <section className="border-b border-border bg-brand-50">
      <Container className="py-14 sm:py-20 lg:py-24">
        <div className="max-w-[720px]">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            {STATION_NAME} · Malang
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-[40px] lg:text-[48px]">{TAGLINE}</h1>
          <p className="mt-4 text-lg text-ink-700">
            Radio kampus Universitas Muhammadiyah Malang: siaran harian, kurasi musik, berita
            kampus, dan event mahasiswa dalam satu kanal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#live"
              className="inline-flex min-h-12 items-center justify-center rounded-control bg-brand-700 px-6 text-base font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Dengarkan Live
            </a>
            <Link
              href="/program"
              className="inline-flex min-h-12 items-center justify-center rounded-control border border-border bg-surface px-6 text-base font-semibold text-ink-950 transition-colors hover:border-brand-600 hover:text-brand-700"
            >
              Lihat Program
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
