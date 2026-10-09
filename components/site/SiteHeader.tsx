"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS } from "@/lib/site";
import { MobileNavigation } from "./MobileNavigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-control focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Lewati ke konten utama
      </a>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          93.4 UMMFM
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:text-brand-600 ${
                  active ? "text-brand-700 underline" : "text-ink-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="inline-flex size-11 items-center justify-center rounded-control border border-border text-ink-700 md:hidden"
        >
          <span className="sr-only">{menuOpen ? "Tutup menu" : "Buka menu"}</span>
          <svg viewBox="0 0 24 24" aria-hidden className="size-5 stroke-current stroke-2">
            {menuOpen ? (
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      <MobileNavigation id="mobile-navigation" open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
