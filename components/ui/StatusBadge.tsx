import type { ContentStatus, EventStatus } from "@/lib/types";

const TONE_CLASS = {
  brand: "bg-brand-100 text-brand-700",
  live: "bg-live/10 text-live",
  neutral: "border border-border bg-canvas text-ink-500",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
} as const;

const STATUS_BADGE: Record<EventStatus | ContentStatus, { label: string; tone: keyof typeof TONE_CLASS }> = {
  upcoming: { label: "Mendatang", tone: "brand" },
  ongoing: { label: "Berlangsung", tone: "live" },
  completed: { label: "Selesai", tone: "neutral" },
  cancelled: { label: "Dibatalkan", tone: "danger" },
  draft: { label: "Draf", tone: "warning" },
  published: { label: "Terbit", tone: "success" },
  unpublished: { label: "Tidak terbit", tone: "neutral" },
  archived: { label: "Arsip", tone: "neutral" },
};

/** Status selalu berupa label teks, bukan hanya warna (design.md §7.4). */
export function StatusBadge({ status }: { status: EventStatus | ContentStatus }) {
  const badge = STATUS_BADGE[status];
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold ${TONE_CLASS[badge.tone]}`}
    >
      {badge.label}
    </span>
  );
}
