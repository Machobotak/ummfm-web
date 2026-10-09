import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { buttonClass } from "@/components/admin/buttonClass";
import { dashboardStats } from "@/lib/admin/data";
import { formatDate, formatTime } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

const TYPE_LABEL = {
  program: "Program",
  playlist: "Playlist",
  news: "News",
  event: "Event",
} as const;

export default async function AdminDashboardPage() {
  await connection();
  const stats = await dashboardStats();

  const cards = [
    { label: "News terbit", value: stats.newsPublished, href: "/admin/news" },
    { label: "News draf", value: stats.newsDraft, href: "/admin/news" },
    { label: "Program aktif", value: stats.activePrograms, href: "/admin/programs" },
    { label: "Event mendatang", value: stats.upcomingEvents, href: "/admin/events" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan isi situs 93.4 UMMFM. Semua angka diambil langsung dari tabel konten."
      />

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/news/new" className={buttonClass("primary")}>
          Tambah News
        </Link>
        <Link href="/admin/programs/new" className={buttonClass("secondary")}>
          Tambah Program
        </Link>
        <Link href="/admin/media" className={buttonClass("secondary")}>
          Upload Media
        </Link>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-card border border-border bg-surface p-5">
            <dt className="text-sm font-semibold text-ink-700">{card.label}</dt>
            <dd className="mt-2 text-3xl font-bold">{card.value}</dd>
            <dd className="mt-2">
              <Link
                href={card.href}
                className="text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
              >
                Kelola
              </Link>
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Terakhir diperbarui</h2>
        {stats.recent.length === 0 ? (
          <p className="mt-3 rounded-card border border-border bg-surface px-5 py-6 text-ink-700">
            Belum ada konten. Mulai dari menambah program atau berita.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-border rounded-card border border-border bg-surface">
            {stats.recent.map((item) => (
              <li key={`${item.type}-${item.id}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-4">
                <span className="rounded-pill bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                  {TYPE_LABEL[item.type]}
                </span>
                <Link
                  href={item.href}
                  className="flex-1 font-semibold underline-offset-4 hover:underline"
                >
                  {item.title}
                </Link>
                <span className="text-sm text-ink-500">
                  {formatDate(item.updatedAt)} · {formatTime(item.updatedAt)} WIB
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
