import { CardImage } from "@/components/ui/CardImage";
import type { Playlist } from "@/lib/types";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <CardImage
        src={playlist.coverImageUrl}
        alt={`Cover ${playlist.title}`}
        ratio="1/1"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold">{playlist.title}</h3>
        <p className="mt-3 line-clamp-2 flex-1 text-sm text-ink-700">{playlist.description}</p>
        <a
          href={playlist.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 underline-offset-4 hover:text-brand-600 hover:underline"
        >
          Buka playlist
        </a>
      </div>
    </article>
  );
}
