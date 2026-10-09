import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { buttonClass } from "@/components/admin/buttonClass";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { deleteNews } from "@/lib/actions/news";
import { listNews } from "@/lib/admin/data";
import { formatDate, formatTime } from "@/lib/format";
import type { NewsArticle } from "@/lib/types";

export const metadata: Metadata = { title: "News" };

const columns: Column<NewsArticle>[] = [
  {
    key: "title",
    header: "Judul",
    primary: true,
    render: (article) => (
      <Link href={`/admin/news/${article.id}`} className="font-semibold underline-offset-4 hover:underline">
        {article.title}
      </Link>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (article) => <StatusBadge status={article.status} />,
  },
  {
    key: "publishedAt",
    header: "Tanggal terbit",
    render: (article) => <span className="text-ink-700">{formatDate(article.publishedAt)}</span>,
  },
  {
    key: "updatedAt",
    header: "Diperbarui",
    render: (article) => (
      <span className="text-ink-700">
        {formatDate(article.updatedAt)} · {formatTime(article.updatedAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Aksi",
    className: "text-right",
    render: (article) => (
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/admin/news/${article.id}`}
          className="min-h-11 rounded-control px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          Ubah
        </Link>
        <ConfirmDelete
          action={deleteNews}
          id={article.id}
          title="Hapus berita?"
          description={`"${article.title}" akan hilang dari situs publik.`}
        />
      </div>
    ),
  },
];

export default async function AdminNewsPage() {
  await connection();
  const news = await listNews();

  return (
    <>
      <PageHeader
        title="News"
        description="Kelola berita 93.4 UMMFM. Hanya berita berstatus Terbit yang tampil di situs publik."
        action={
          <Link href="/admin/news/new" className={buttonClass("primary")}>
            Tambah berita
          </Link>
        }
      />
      <DataTable
        columns={columns}
        rows={news}
        rowKey={(article) => article.id}
        emptyTitle="Belum ada berita"
        emptyDescription="Tambah berita pertama untuk mengisi halaman News situs publik."
        emptyAction={
          <Link href="/admin/news/new" className={buttonClass("primary")}>
            Tambah berita
          </Link>
        }
      />
    </>
  );
}
