import { connection } from "next/server";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { NewsForm } from "@/components/admin/NewsForm";
import { listMedia } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Berita baru" };

export default async function NewNewsPage() {
  await connection();
  const media = await listMedia();

  return (
    <>
      <PageHeader
        title="Berita baru"
        description="Isi Markdown didukung: heading, daftar, tautan, tabel, dan gambar."
      />
      <NewsForm media={media} />
    </>
  );
}
