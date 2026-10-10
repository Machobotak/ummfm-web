import type { Metadata } from "next";
import { MusicSection } from "@/components/home/MusicSection";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Playlist",
  description: "Playlist dan chart pilihan 93.4 UMMFM, diputar langsung dari Spotify dan Instagram.",
};

export default async function PlaylistPage() {
  const settings = await getSiteSettings();

  return (
    <MusicSection
      headingLevel="h1"
      playlistEmbeds={settings.playlistEmbeds}
      chartEmbeds={settings.chartEmbeds}
    />
  );
}
