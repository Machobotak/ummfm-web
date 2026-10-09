import { FeaturedNewsCard } from "@/components/content/FeaturedNewsCard";
import { NewsCard } from "@/components/content/NewsCard";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { NewsArticle } from "@/lib/types";

export function NewsSection({ articles }: { articles: NewsArticle[] }) {
  const [featured, ...rest] = articles;

  return (
    <section className="border-b border-border bg-surface py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Berita Terbaru"
          description="Kabar kampus, kegiatan, dan siaran terbaru dari UMMFM."
          href="/news"
        />
        {featured ? (
          <div className="space-y-6">
            <FeaturedNewsCard article={featured} />
            {rest.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(0, 3).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState
            title="Belum ada berita"
            description="Berita UMMFM akan tampil di sini setelah dipublikasikan."
          />
        )}
      </Container>
    </section>
  );
}
