"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { EmbedKind, EmbedLink } from "@/lib/embeds";

type TabId = "playlist" | "chart";

const TABS: { id: TabId; label: string }[] = [
  { id: "playlist", label: "Playlist" },
  { id: "chart", label: "Chart" },
];

/** Tinggi iframe: Spotify memuat daftar lagu yang bisa di-scroll, Instagram satu kiriman. */
const EMBED_HEIGHT: Record<EmbedKind, number> = { spotify: 480, instagram: 620 };

const TAB_LABEL: Record<TabId, string> = { playlist: "Playlist", chart: "Chart" };
const SOURCE_LABEL: Record<EmbedKind, string> = { spotify: "Spotify", instagram: "Instagram" };

/**
 * Dua tab seksi "UMMFM on Music's" (design.md §6.4). Isinya hanya iframe embed
 * yang ditempel pengelola lewat CMS. Tab yang tidak aktif tidak dirender supaya
 * iframe-nya tidak ikut dimuat, dan tiap embed tetap punya tautan biasa sebagai
 * jalan keluar bila iframe diblokir jaringan pengunjung.
 */
export function MusicTabs({ playlist, chart }: { playlist: EmbedLink[]; chart: EmbedLink[] }) {
  const [active, setActive] = useState<TabId>("playlist");
  const baseId = useId();
  const embeds = active === "playlist" ? playlist : chart;

  function selectTab(id: TabId, focus: boolean) {
    setActive(id);
    if (focus) document.getElementById(`${baseId}-tab-${id}`)?.focus();
  }

  /** Navigasi papan tunas: panah kiri/kanan berputar, Home/End ke ujung. */
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step !== 0) {
      event.preventDefault();
      selectTab(TABS[(index + step + TABS.length) % TABS.length].id, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectTab(TABS[0].id, true);
    } else if (event.key === "End") {
      event.preventDefault();
      selectTab(TABS[TABS.length - 1].id, true);
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="UMMFM on Music's" className="mb-6 flex flex-wrap gap-3">
        {TABS.map((tab, index) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={selected ? `${baseId}-panel` : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(tab.id, false)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`inline-flex min-h-11 items-center rounded-full px-6 text-sm font-semibold transition-colors ${
                selected
                  ? "bg-brand-700 text-white"
                  : "border border-brand-600 bg-surface text-ink-950 hover:bg-brand-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`}>
        {embeds.length === 0 ? (
          <EmptyState
            title={`Belum ada embed ${TAB_LABEL[active].toLowerCase()}`}
            description="Pengelola dapat menempelkan link embed Spotify atau Instagram di CMS → Pengaturan."
          />
        ) : (
          <ul className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {embeds.map((embed, index) => (
              <li key={`${embed.src}-${index}`} className="flex flex-col gap-2">
                <iframe
                  src={embed.src}
                  title={`${TAB_LABEL[active]} ${index + 1} — embed ${SOURCE_LABEL[embed.kind]}`}
                  height={EMBED_HEIGHT[embed.kind]}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className={`w-full rounded-card border border-border bg-surface ${
                    embed.kind === "instagram" ? "mx-auto max-w-[400px]" : ""
                  }`}
                />
                <a
                  href={embed.webUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-auto text-sm font-semibold text-brand-700 underline-offset-4 hover:text-brand-600 hover:underline"
                >
                  Buka di {SOURCE_LABEL[embed.kind]}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
