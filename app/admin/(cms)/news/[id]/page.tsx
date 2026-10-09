import { connection } from "next/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsForm } from "@/components/admin/NewsForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getNewsRow, listMedia } from "@/lib/admin/data";
import { isoToJakartaLocal } from "@/lib/format";

export const metadata: Metadata = { title: "Ubah berita" };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  // Baris mentah dipakai supaya draft (published_at null) tidak terisi tanggal.
  const [row, media] = await Promise.all([getNewsRow(id), listMedia()]);
  if (!row) notFound();

  return (
    <>
      <PageHeader title="Ubah berita" description={row.title} />
      <NewsForm
        media={media}
        initial={{
          id: row.id,
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          body: row.body,
          thumbnailUrl: row.thumbnail_url,
          coverImageUrl: row.cover_image_url,
          status: row.status,
          publishedAt: row.published_at ? isoToJakartaLocal(row.published_at) : "",
        }}
      />
    </>
  );
}
