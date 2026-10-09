import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-border bg-surface px-6 py-12 text-center">
      <p className="text-lg font-semibold text-ink-950">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-[480px] text-ink-700">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
