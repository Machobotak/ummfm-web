import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { MediaDeleteButton } from "@/components/admin/MediaDeleteButton";
import { FormField, inputClass } from "@/components/admin/FormField";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { PageHeader } from "@/components/admin/PageHeader";
import { buttonClass } from "@/components/admin/buttonClass";
import { CardImage } from "@/components/ui/CardImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { listMedia, mediaUsage } from "@/lib/admin/data";
import { formatDate } from "@/lib/format";
import type { MediaAsset } from "@/lib/types";

export const metadata: Metadata = { title: "Media" };

/** Ukuran berkas dalam KB/MB (satu desimal untuk MB) supaya mudah dibaca editor. */
function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function MediaCard({ asset, usedBy }: { asset: MediaAsset; usedBy: string[] }) {
  return (
    <li className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4 shadow-card">
      <CardImage src={asset.publicUrl} alt={asset.altText || asset.fileName} ratio="1/1" sizes="(min-width: 1024px) 33vw, 100vw" />

      <div className="flex flex-col gap-1">
        <p className="break-all font-semibold text-ink-950">{asset.fileName}</p>
        <p className="text-sm text-ink-700">Ukuran: {formatFileSize(asset.fileSize)}</p>
        <p className="text-sm text-ink-700">Teks alternatif: {asset.altText || "belum diisi"}</p>
        <p className="text-sm text-ink-700">Diunggah: {formatDate(asset.createdAt)}</p>
      </div>

      {usedBy.length > 0 ? (
        <p className="rounded-control bg-warning/10 px-3 py-2 text-sm font-medium text-warning">
          Dipakai di: {usedBy.join(", ")}
        </p>
      ) : null}

      <div className="mt-auto flex justify-end">
        <MediaDeleteButton id={asset.id} fileName={asset.fileName} usedBy={usedBy} />
      </div>
    </li>
  );
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await connection();

  const { q } = await searchParams;
  const rawQuery = (q ?? "").trim();
  const query = rawQuery.toLowerCase();

  const [assets, usage] = await Promise.all([listMedia(), mediaUsage()]);
  const visible = query
    ? assets.filter(
        (asset) =>
          asset.fileName.toLowerCase().includes(query) || asset.altText.toLowerCase().includes(query),
      )
    : assets;

  return (
    <>
      <PageHeader
        title="Media"
        description="Semua gambar yang bisa dipakai program, berita, dan event."
      />

      <MediaUploader />

      <form action="/admin/media" method="get" className="mb-6 flex flex-wrap items-end gap-3">
        <div className="w-full sm:max-w-[360px]">
          <FormField
            label="Cari media"
            htmlFor="media-search"
            hint="Mencocokkan nama berkas dan teks alternatif."
          >
            <input
              id="media-search"
              type="search"
              name="q"
              defaultValue={rawQuery}
              placeholder="Nama berkas atau teks alternatif"
              className={inputClass()}
            />
          </FormField>
        </div>
        <button type="submit" className={buttonClass("secondary")}>
          Cari
        </button>
        {rawQuery ? (
          <Link href="/admin/media" className={buttonClass("secondary")}>
            Tampilkan semua
          </Link>
        ) : null}
      </form>

      {visible.length === 0 ? (
        <EmptyState
          title={query ? "Media tidak ditemukan" : "Media Library masih kosong"}
          description={
            query
              ? `Tidak ada media yang cocok dengan pencarian "${rawQuery}".`
              : "Unggah berkas pertama lewat formulir di atas supaya bisa dipakai konten."
          }
          action={
            query ? (
              <Link href="/admin/media" className={buttonClass("secondary")}>
                Tampilkan semua
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((asset) => (
            <MediaCard key={asset.id} asset={asset} usedBy={usage[asset.id] ?? []} />
          ))}
        </ul>
      )}
    </>
  );
}
