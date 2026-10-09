import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { buttonClass } from "@/components/admin/buttonClass";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { deletePlaylist } from "@/lib/actions/playlists";
import { listPlaylists } from "@/lib/admin/data";
import { formatDate, formatTime } from "@/lib/format";
import type { Playlist } from "@/lib/types";

export const metadata: Metadata = { title: "Playlist" };

const columns: Column<Playlist>[] = [
  {
    key: "title",
    header: "Judul",
    primary: true,
    render: (playlist) => (
      <Link
        href={`/admin/playlists/${playlist.id}`}
        className="font-semibold underline-offset-4 hover:underline"
      >
        {playlist.title}
      </Link>
    ),
  },
  {
    key: "sortOrder",
    header: "Urutan",
    render: (playlist) => <span className="text-ink-700">{playlist.sortOrder}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (playlist) => <StatusBadge status={playlist.isPublished ? "published" : "draft"} />,
  },
  {
    key: "updatedAt",
    header: "Diperbarui",
    render: (playlist) => (
      <span className="text-ink-700">
        {formatDate(playlist.updatedAt)} · {formatTime(playlist.updatedAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Aksi",
    className: "text-right",
    render: (playlist) => (
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/admin/playlists/${playlist.id}`}
          className="min-h-11 rounded-control px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          Ubah
        </Link>
        <ConfirmDelete
          action={deletePlaylist}
          id={playlist.id}
          title="Hapus playlist?"
          description={`"${playlist.title}" akan hilang dari situs publik.`}
        />
      </div>
    ),
  },
];

export default async function AdminPlaylistsPage() {
  await connection();
  const playlists = await listPlaylists();

  return (
    <>
      <PageHeader
        title="Playlist"
        description="Kelola playlist pilihan 93.4 UMMFM. Hanya playlist berstatus Terbit yang tampil di situs publik."
        action={
          <Link href="/admin/playlists/new" className={buttonClass("primary")}>
            Tambah playlist
          </Link>
        }
      />
      <DataTable
        columns={columns}
        rows={playlists}
        rowKey={(playlist) => playlist.id}
        emptyTitle="Belum ada playlist"
        emptyDescription="Tambah playlist pertama untuk mengisi halaman playlist situs publik."
        emptyAction={
          <Link href="/admin/playlists/new" className={buttonClass("primary")}>
            Tambah playlist
          </Link>
        }
      />
    </>
  );
}
