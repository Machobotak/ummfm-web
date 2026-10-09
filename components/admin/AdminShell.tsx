"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { logout } from "@/lib/actions/auth";
import type { CmsUser } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/programs", label: "Program" },
  { href: "/admin/schedules", label: "Jadwal" },
  { href: "/admin/playlists", label: "Playlist" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/events", label: "Event" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Pengaturan" },
  { href: "/admin/users", label: "Pengguna", adminOnly: true },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean): string {
  return [
    "flex min-h-11 items-center rounded-control px-3 text-sm font-semibold transition-colors",
    active ? "bg-brand-100 text-brand-700" : "text-ink-700 hover:bg-canvas hover:text-ink-950",
  ].join(" ");
}

/** Kerangka dashboard CMS: sidebar 256px di desktop, drawer di layar kecil. */
export function AdminShell({ user, children }: { user: CmsUser; children: ReactNode }) {
  const pathname = usePathname();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || user.role === "admin");
  const current = items.find((item) => isActive(pathname, item.href));

  const navigation = (
    <nav aria-label="Navigasi CMS" className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setDrawerOpen(false)}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={navLinkClass(isActive(pathname, item.href))}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const session = (
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{user.displayName}</p>
        <p className="truncate text-xs text-ink-500">{user.email}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="min-h-11 w-full rounded-control border border-border bg-surface px-3 text-sm font-semibold text-ink-950 hover:bg-canvas"
        >
          Keluar
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="hidden border-r border-border bg-surface p-6 lg:flex lg:flex-col lg:gap-6">
        <Link href="/admin" className="text-lg font-bold">
          93.4 UMMFM <span className="text-ink-500">CMS</span>
        </Link>
        <div className="flex-1">{navigation}</div>
        {session}
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={isDrawerOpen}
            aria-controls="admin-drawer"
            className="min-h-11 rounded-control border border-border px-3 text-sm font-semibold lg:hidden"
          >
            Menu
          </button>
          <p className="truncate font-semibold">{current?.label ?? "Dashboard"}</p>
          <span className="ml-auto hidden truncate text-sm text-ink-700 sm:block">
            {user.displayName}
          </span>
        </header>
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label="Tutup navigasi"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink-950/40"
          />
          <div
            id="admin-drawer"
            className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col gap-6 bg-surface p-6 shadow-overlay"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">93.4 UMMFM CMS</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="min-h-11 min-w-11 rounded-control border border-border font-semibold"
              >
                Tutup
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navigation}</div>
            {session}
          </div>
        </div>
      ) : null}
    </div>
  );
}
