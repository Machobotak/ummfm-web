"use client";

import { CardImage } from "@/components/ui/CardImage";
import { ErrorState } from "@/components/ui/ErrorState";
import { OnAirBadge } from "@/components/ui/OnAirBadge";
import { STATION_NAME } from "@/lib/site";
import { useRadioPlayer, type PlayerStatus } from "./RadioPlayerProvider";

/** Info jadwal program yang dikirim server; terpisah dari status koneksi stream. */
export interface OnAirInfo {
  name: string;
  hostName: string;
  timeRange: string;
  /** Cover program; dipakai varian `hero`, opsional supaya varian `bar` tetap ringkas. */
  coverImageUrl?: string;
}

const STATUS_TEXT: Record<PlayerStatus, string> = {
  idle: "Siap mendengarkan",
  connecting: "Menghubungkan…",
  playing: "Sedang diputar",
  paused: "Dijeda",
  error: "Siaran belum dapat diakses",
};

function PlayPauseIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
      {playing ? (
        <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
      ) : (
        <path d="M8 5l11 7-11 7z" />
      )}
    </svg>
  );
}

function ConnectingSpinner() {
  return (
    <span
      aria-hidden
      className="size-5 animate-spin rounded-pill border-2 border-white/40 border-t-white"
    />
  );
}

export function LiveRadioPlayer({
  variant,
  activeProgram,
}: {
  variant: "hero" | "bar";
  activeProgram?: OnAirInfo;
}) {
  const { status, play, toggle } = useRadioPlayer();
  const playing = status === "playing";
  const connecting = status === "connecting";
  const controlLabel = playing ? "Jeda siaran" : connecting ? "Batalkan sambungan" : "Putar siaran";
  const controlText = playing ? "Jeda" : connecting ? "Batal" : "Putar";

  const playButton = (
    <button
      type="button"
      onClick={toggle}
      aria-label={controlLabel}
      className="inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center gap-2 rounded-pill bg-brand-700 px-5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
    >
      {connecting ? <ConnectingSpinner /> : <PlayPauseIcon playing={playing} />}
      <span>{controlText}</span>
    </button>
  );

  if (variant === "bar") {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface shadow-overlay">
        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-12">
          {playButton}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-950">
              {activeProgram ? activeProgram.name : STATION_NAME}
            </p>
            <p className="truncate text-xs text-ink-500">
              {activeProgram ? activeProgram.timeRange : "Radio kampus UMM"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {playing ? <OnAirBadge /> : null}
            <p role="status" className="text-sm font-medium text-ink-700">
              {STATUS_TEXT[status]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-center">
        <CardImage
          src={activeProgram?.coverImageUrl ?? ""}
          alt={activeProgram ? `Cover program ${activeProgram.name}` : "Cover program siaran"}
          ratio="4/5"
          sizes="176px"
          className="w-full max-w-44"
        />
        <div>
          {playing ? <OnAirBadge /> : null}
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
            Siaran langsung
          </p>
          <p className="mt-1 text-2xl font-bold sm:text-[28px]">
            {activeProgram ? activeProgram.name : "Di luar jadwal siaran"}
          </p>
          {activeProgram ? (
            <p className="mt-2 text-ink-700">
              {activeProgram.hostName ? `${activeProgram.hostName} · ` : ""}
              {activeProgram.timeRange}
            </p>
          ) : (
            <p className="mt-2 text-ink-700">
              Dengarkan siaran {STATION_NAME} — program berikutnya menyusul sesuai jadwal.
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {playButton}
            <p role="status" className="text-sm font-medium text-ink-700">
              {STATUS_TEXT[status]}
            </p>
          </div>
          {status === "error" ? (
            <div className="mt-3">
              <ErrorState
                message="Siaran belum dapat diakses. Sumber stream mungkin sedang off-air."
                onRetry={play}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
