import type { MetadataRoute } from "next";
import { getPublishedEvents, getPublishedNews } from "@/lib/content";
import { absoluteUrl } from "@/lib/format";

const STATIC_ROUTES = ["/", "/news", "/about", "/event", "/program", "/playlist"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, events] = await Promise.all([getPublishedNews(), getPublishedEvents()]);

  return [
    ...STATIC_ROUTES.map((path) => ({ url: absoluteUrl(path) })),
    ...news.map((article) => ({
      url: absoluteUrl(`/news/${article.slug}`),
      lastModified: new Date(article.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...events.map((event) => ({
      url: absoluteUrl(`/event/${event.slug}`),
      lastModified: new Date(event.startsAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
