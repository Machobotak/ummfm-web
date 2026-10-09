import { CardImage } from "@/components/ui/CardImage";
import type { Program } from "@/lib/types";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <CardImage src={program.coverImageUrl} alt={`Cover program ${program.name}`} ratio="4/5" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold">{program.name}</h3>
        <p className="mt-1 text-sm text-ink-500">{program.hostName}</p>
        <p className="mt-3 line-clamp-2 text-sm text-ink-700">{program.description}</p>
      </div>
    </article>
  );
}
