import { connection } from "next/server";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettingsForEdit } from "@/lib/admin/data";
import { STREAM_URL } from "@/lib/stream";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function AdminSettingsPage() {
  await connection();
  const settings = await getSettingsForEdit();

  return (
    <>
      <PageHeader
        title="Pengaturan"
        description="Identitas situs, media sosial, konten Tentang, dan SEO yang tampil di situs publik."
      />
      <SettingsForm initial={settings} fallbackStreamUrl={STREAM_URL} />
    </>
  );
}
