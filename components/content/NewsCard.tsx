import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";
import { formatDate } from "@/lib/format";
import type { NewsArticle } from "@/lib/types";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="h-full">
      <Link
        href={`/news/${article.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card transition-shadow hover:shadow-overlay"
      >
        <CardImage
          src={article.thumbnailUrl}
          alt={`Thumbnail berita ${article.title}`}
          ratio="16/9"
        />
        <div className="flex flex-1 flex-col p-5">
          <p className="text-sm text-ink-500">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </p>
          <h3 className="mt-2 line-clamp-3 text-xl font-semibold">{article.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm text-ink-700">{article.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
