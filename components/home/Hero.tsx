import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { STATION_NAME, TAGLINE } from "@/lib/site";

/**
 * Hero identitas UMMFM (design.md §6.1): banner dari Pengaturan CMS dipakai
 * sebagai latar penuh hero, ditutup lapisan gelap agar teks tetap kontras.
 * Tanpa banner, hero tampil satu kolom dengan latar brand-50.
 */
export function Hero({ bannerUrl }: { bannerUrl: string }) {
  const onBanner = bannerUrl !== "";

  const copy = (
    <div className="max-w-[720px]">
      <p
        className={`text-sm font-semibold uppercase tracking-wide ${
          onBanner ? "text-brand-100" : "text-brand-700"
        }`}
      >
        {STATION_NAME} · Malang
      </p>
      <h1
        className={`mt-3 text-3xl font-bold sm:text-[40px] lg:text-[48px] ${
          onBanner ? "text-white" : ""
        }`}
      >
        {TAGLINE}
      </h1>
      <p className={`mt-4 text-lg ${onBanner ? "text-white" : "text-ink-700"}`}>
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
          className={
            onBanner
              ? "inline-flex min-h-12 items-center justify-center rounded-control border border-white/70 px-6 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              : "inline-flex min-h-12 items-center justify-center rounded-control border border-border bg-surface px-6 text-base font-semibold text-ink-950 transition-colors hover:border-brand-600 hover:text-brand-700"
          }
        >
          Lihat Program
        </Link>
      </div>
    </div>
  );

  if (!onBanner) {
    return (
      <section className="border-b border-border bg-brand-50">
        <Container className="py-14 sm:py-20 lg:py-24">{copy}</Container>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-ink-950 lg:flex lg:aspect-[12/5] lg:max-h-[86vh] lg:min-h-[520px] lg:items-center">
      {/* Di layar kecil banner tampil utuh pada rasio 12:5 dengan teks di bawahnya; mulai 1024 px
          banner jadi latar penuh dengan teks di atasnya. */}
      <div className="relative aspect-[12/5] w-full lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src={bannerUrl}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-contain lg:object-cover"
        />
        {/* Lapisan gelap minimal 70% supaya teks putih tetap kontras di atas banner apa pun. */}
        <div className="absolute inset-0 hidden bg-ink-950/70 lg:block" aria-hidden />
      </div>
      <Container className="relative py-10 sm:py-12 lg:py-20">{copy}</Container>
    </section>
  );
}
