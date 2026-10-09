import type { Metadata } from "next";
import { PlaylistCard } from "@/components/content/PlaylistCard";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPlaylists } from "@/lib/content";

export const metadata: Metadata = {
  title: "Playlist",
  description: "Kumpulan playlist pilihan 93.4 UMMFM yang bisa didengarkan di luar jam siaran.",
};

export default async function PlaylistPage() {
  const playlists = await getPlaylists();

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <SectionHeading
        as="h1"
        title="Playlist"
        description="Rekomendasi lagu dan kurasi tim UMMFM untuk menemani harimu."
      />
      <p className="mb-8 max-w-[720px] text-ink-700">
        Setiap playlist dibuka di platform streaming eksternal.
      </p>

      {playlists.length === 0 ? (
        <EmptyState
          title="Belum ada playlist"
          description="Playlist akan tampil di sini setelah dipublikasikan."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </Container>
  );
}
