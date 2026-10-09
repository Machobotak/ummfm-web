export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-card bg-brand-100 ${className}`}
    />
  );
}
