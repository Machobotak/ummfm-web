import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  description:
    "Halaman yang Anda cari tidak tersedia. Kembali ke beranda 93.4 UMMFM untuk siaran live, program, playlist, berita, dan event.",
};

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mx-auto mt-3 max-w-[520px] text-ink-700">
        Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan. Silakan kembali ke halaman
        utama untuk menjelajahi program, playlist, berita, dan event UMMFM.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center rounded-control bg-brand-700 px-6 font-semibold text-white"
      >
        Kembali ke Home
      </Link>
    </Container>
  );
}
