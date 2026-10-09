import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardImage } from "@/components/ui/CardImage";
import { Container } from "@/components/ui/Container";
import { SafeMarkdown } from "@/components/ui/SafeMarkdown";
import { getNewsBySlug, getPublishedNews } from "@/lib/content";
import { absoluteUrl, formatDate } from "@/lib/format";

type NewsDetailProps = PageProps<"/news/[slug]">;
// Shell statis tidak mungkin dibuat tanpa slug: halaman ini menunggu `params`
// untuk memutuskan 404, jadi navigasi diizinkan memblokir (Next.js `instant`).
export const instant = false;

export async function generateStaticParams() {
  const articles = await getPublishedNews();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(props: NewsDetailProps): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return { title: "Berita tidak ditemukan" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: absoluteUrl(`/news/${article.slug}`),
    },
  };
}

export default async function NewsDetailPage(props: NewsDetailProps) {
  const { slug } = await props.params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[720px]">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-ink-500"
        >
          <Link
            href="/news"
            className="underline-offset-4 hover:text-brand-700 hover:underline"
          >
            News
          </Link>
          <span aria-hidden="true">/</span>
          <span>{article.title}</span>
        </nav>
        <h1 className="mt-4 text-3xl font-bold sm:text-[40px]">{article.title}</h1>
        <p className="mt-3 text-sm text-ink-500">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden="true"> · </span>
          {article.authorName}
        </p>
        <div className="mt-6">
          <CardImage
            src={article.coverImageUrl}
            alt={`Gambar utama ${article.title}`}
            ratio="16/9"
            sizes="(min-width: 720px) 720px, 100vw"
          />
        </div>
        <SafeMarkdown>{article.body}</SafeMarkdown>
        <Link
          href="/news"
          className="mt-8 inline-flex min-h-11 items-center font-semibold text-brand-700 underline-offset-4 hover:text-brand-600 hover:underline"
        >
          Kembali ke News
        </Link>
      </div>
    </Container>
  );
}
