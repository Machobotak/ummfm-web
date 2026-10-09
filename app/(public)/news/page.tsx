import type { Metadata } from "next";
import { FeaturedNewsCard } from "@/components/content/FeaturedNewsCard";
import { NewsCard } from "@/components/content/NewsCard";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description: "Kabar kampus, kegiatan, dan siaran terbaru dari 93.4 UMMFM.",
};

export default async function NewsPage() {
  const articles = await getPublishedNews();
  const [featured, ...rest] = articles;

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <SectionHeading as="h1" title="News" description="Arsip berita dan kabar kampus UMMFM." />
      <p className="max-w-[720px] text-lg text-ink-700">
        Semua liputan dan pengumuman 93.4 UMMFM dikumpulkan di sini, dari kegiatan mahasiswa
        hingga program siaran terbaru di kanal radio kampus.
      </p>
      {featured ? (
        <div className="mt-8 space-y-6 sm:mt-10">
          <FeaturedNewsCard article={featured} />
          {rest.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-8 sm:mt-10">
          <EmptyState
            title="Belum ada berita"
            description="Berita UMMFM akan tampil di sini setelah dipublikasikan."
          />
        </div>
      )}
    </Container>
  );
}
