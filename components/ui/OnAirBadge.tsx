/** Status siaran: selalu teks + dot, tidak pernah warna saja (design.md §3.1). */
export function OnAirBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-pill bg-live/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-live">
      <span aria-hidden className="size-2 rounded-full bg-live animate-pulse" />
      On Air
    </span>
  );
}
