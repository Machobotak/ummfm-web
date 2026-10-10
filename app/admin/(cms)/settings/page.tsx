import { connection } from "next/server";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettingsForEdit, listMedia } from "@/lib/admin/data";
import { STREAM_URL } from "@/lib/stream";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function AdminSettingsPage() {
  await connection();
  const [settings, media] = await Promise.all([getSettingsForEdit(), listMedia()]);

  return (
    <>
      <PageHeader
        title="Pengaturan"
        description="Identitas situs, banner hero, media sosial, konten Tentang, dan SEO yang tampil di situs publik."
      />
      <SettingsForm initial={settings} fallbackStreamUrl={STREAM_URL} media={media} />
    </>
  );
}
