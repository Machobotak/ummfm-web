import { connection } from "next/server";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { PlaylistForm } from "@/components/admin/PlaylistForm";
import { listMedia } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Playlist baru" };

export default async function NewPlaylistPage() {
  await connection();
  const media = await listMedia();

  return (
    <>
      <PageHeader
        title="Playlist baru"
        description="Isi tautan playlist Spotify lalu tentukan apakah playlist tampil di situs publik."
      />
      <PlaylistForm media={media} />
    </>
  );
}
