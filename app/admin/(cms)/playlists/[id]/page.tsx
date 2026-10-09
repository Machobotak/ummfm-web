import { connection } from "next/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { PlaylistForm } from "@/components/admin/PlaylistForm";
import { listMedia, listPlaylists } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Ubah playlist" };

export default async function EditPlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const [playlists, media] = await Promise.all([listPlaylists(), listMedia()]);
  const playlist = playlists.find((item) => item.id === id);
  if (!playlist) notFound();

  return (
    <>
      <PageHeader title="Ubah playlist" description={playlist.title} />
      <PlaylistForm
        media={media}
        initial={{
          id: playlist.id,
          title: playlist.title,
          description: playlist.description,
          coverImageUrl: playlist.coverImageUrl,
          externalUrl: playlist.externalUrl,
          sortOrder: playlist.sortOrder,
          isPublished: playlist.isPublished,
        }}
      />
    </>
  );
}
