import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { buttonClass } from "@/components/admin/buttonClass";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { deleteEvent } from "@/lib/actions/events";
import { listEvents } from "@/lib/admin/data";
import { formatDate, formatEventPeriod, formatTime } from "@/lib/format";
import type { RadioEvent } from "@/lib/types";

export const metadata: Metadata = { title: "Event" };

const columns: Column<RadioEvent>[] = [
  {
    key: "title",
    header: "Judul",
    primary: true,
    render: (event) => (
      <Link href={`/admin/events/${event.id}`} className="font-semibold underline-offset-4 hover:underline">
        {event.title}
      </Link>
    ),
  },
  {
    key: "schedule",
    header: "Jadwal",
    render: (event) => (
      <span className="text-ink-700">{formatEventPeriod(event.startsAt, event.endsAt)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (event) => <StatusBadge status={event.status} />,
  },
  {
    key: "isPublished",
    header: "Terbit",
    render: (event) => <StatusBadge status={event.isPublished ? "published" : "draft"} />,
  },
  {
    key: "updatedAt",
    header: "Diperbarui",
    render: (event) => (
      <span className="text-ink-700">
        {formatDate(event.updatedAt)} · {formatTime(event.updatedAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Aksi",
    className: "text-right",
    render: (event) => (
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/admin/events/${event.id}`}
          className="min-h-11 rounded-control px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          Ubah
        </Link>
        <ConfirmDelete
          action={deleteEvent}
          id={event.id}
          title="Hapus event?"
          description={`"${event.title}" akan hilang dari situs publik.`}
        />
      </div>
    ),
  },
];

export default async function AdminEventsPage() {
  await connection();
  const events = await listEvents();

  return (
    <>
      <PageHeader
        title="Event"
        description="Kelola agenda 93.4 UMMFM. Hanya event berstatus Terbit yang tampil di situs publik."
        action={
          <Link href="/admin/events/new" className={buttonClass("primary")}>
            Tambah event
          </Link>
        }
      />
      <DataTable
        columns={columns}
        rows={events}
        rowKey={(event) => event.id}
        emptyTitle="Belum ada event"
        emptyDescription="Tambah event pertama untuk mengisi halaman Event situs publik."
        emptyAction={
          <Link href="/admin/events/new" className={buttonClass("primary")}>
            Tambah event
          </Link>
        }
      />
    </>
  );
}
