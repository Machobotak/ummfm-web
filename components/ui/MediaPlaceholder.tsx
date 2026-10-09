export type MediaRatio = "16/9" | "4/5" | "1/1" | "3/4";

export const MEDIA_RATIO_CLASS: Record<MediaRatio, string> = {
  "16/9": "aspect-[16/9]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
};

/** Placeholder konsisten untuk aset yang belum tersedia (design.md §10). */
export function MediaPlaceholder({
  ratio,
  label = "93.4 UMMFM",
  className = "",
}: {
  ratio: MediaRatio;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${label} — gambar belum tersedia`}
      className={`flex items-center justify-center bg-brand-100 text-ink-500 ${MEDIA_RATIO_CLASS[ratio]} ${className}`}
    >
      <span className="px-4 text-center text-sm font-semibold">{label}</span>
    </div>
  );
}
