import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { parseEmbedLink, type EmbedLink } from "@/lib/embeds";
import { MusicTabs } from "./MusicTabs";

/** Nilai CMS berupa teks bebas; hanya link yang dikenali yang dirender. */
function toEmbedLinks(values: string[]): EmbedLink[] {
  return values.map(parseEmbedLink).filter((embed): embed is EmbedLink => embed !== null);
}

/**
 * Seksi "UMMFM on Music's" (design.md §6.4): dua tab berisi embed Spotify dan
 * Instagram yang dikelola dari Pengaturan CMS. Dipakai di Home dan di halaman
 * `/playlist` supaya keduanya menampilkan daftar yang sama.
 */
export function MusicSection({
  playlistEmbeds,
  chartEmbeds,
  headingLevel = "h2",
}: {
  playlistEmbeds: string[];
  chartEmbeds: string[];
  headingLevel?: "h1" | "h2";
}) {
  return (
    <section className="border-b border-border bg-brand-50 py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          as={headingLevel}
          title="UMMFM on Music's"
          description="Kurasi lagu penyiar UMMFM dalam dua tab: playlist untuk menemani harimu, dan chart lagu yang sedang diputar."
        />
        <MusicTabs playlist={toEmbedLinks(playlistEmbeds)} chart={toEmbedLinks(chartEmbeds)} />
      </Container>
    </section>
  );
}
