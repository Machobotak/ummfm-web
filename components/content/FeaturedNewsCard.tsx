import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";
import { formatDate } from "@/lib/format";
import type { NewsArticle } from "@/lib/types";

/** Berita unggulan: satu kartu lebih besar (design.md §6.5). */
export function FeaturedNewsCard({ article }: { article: NewsArticle }) {
  return (
    <article>
      <Link
        href={`/news/${article.slug}`}
        className="grid overflow-hidden rounded-card border border-border bg-surface shadow-card transition-shadow hover:shadow-overlay sm:grid-cols-2"
      >
        <CardImage
          src={article.coverImageUrl}
          alt={`Gambar utama ${article.title}`}
          ratio="16/9"
          className="rounded-none sm:h-full"
        />
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="text-sm text-ink-500">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </p>
          <h3 className="mt-2 text-2xl font-bold sm:text-[28px]">{article.title}</h3>
          <p className="mt-3 text-ink-700">{article.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
