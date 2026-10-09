import { PlaylistCard } from "@/components/content/PlaylistCard";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Playlist } from "@/lib/types";

export function PlaylistsSection({ playlists }: { playlists: Playlist[] }) {
  return (
    <section className="border-b border-border bg-canvas py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Playlist Pilihan"
          description="Kurasi lagu dari penyiar UMMFM, dibuka langsung di Spotify."
          href="/playlist"
        />
        {playlists.length === 0 ? (
          <EmptyState
            title="Belum ada playlist"
            description="Playlist pilihan akan muncul di sini setelah dipublikasikan."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.slice(0, 3).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
