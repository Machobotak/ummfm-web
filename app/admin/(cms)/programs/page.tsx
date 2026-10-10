import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { buttonClass } from "@/components/admin/buttonClass";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { deleteProgram } from "@/lib/actions/programs";
import { listPrograms } from "@/lib/admin/data";
import { formatDate, formatTime } from "@/lib/format";
import type { Program } from "@/lib/types";

export const metadata: Metadata = { title: "Program" };

const columns: Column<Program>[] = [
  {
    key: "name",
    header: "Nama",
    primary: true,
    render: (program) => (
      <Link
        href={`/admin/programs/${program.id}`}
        className="font-semibold underline-offset-4 hover:underline"
      >
        {program.name}
      </Link>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (program) => (
      <div className="flex flex-wrap items-center justify-end gap-2 md:justify-start">
        <StatusBadge status={program.isPublished ? "published" : "draft"} />
        <span className="text-ink-700">{program.isActive ? "Aktif" : "Nonaktif"}</span>
      </div>
    ),
  },
  {
    key: "updatedAt",
    header: "Diperbarui",
    render: (program) => (
      <span className="text-ink-700">
        {formatDate(program.updatedAt)} · {formatTime(program.updatedAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Aksi",
    className: "text-right",
    render: (program) => (
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/admin/programs/${program.id}`}
          className="min-h-11 rounded-control px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          Ubah
        </Link>
        <ConfirmDelete
          action={deleteProgram}
          id={program.id}
          title="Hapus program?"
          description={`"${program.name}" beserta seluruh slot jadwalnya akan terhapus.`}
        />
      </div>
    ),
  },
];

export default async function AdminProgramsPage() {
  await connection();
  const programs = await listPrograms();

  return (
    <>
      <PageHeader
        title="Program"
        description="Kelola program 93.4 UMMFM: nama, sampul, dan status tayangnya. Penyiar diatur per slot di menu Jadwal."
        action={
          <Link href="/admin/programs/new" className={buttonClass("primary")}>
            Tambah program
          </Link>
        }
      />
      <DataTable
        columns={columns}
        rows={programs}
        rowKey={(program) => program.id}
        emptyTitle="Belum ada program"
        emptyDescription="Tambah program pertama, lalu atur slot jadwalnya."
        emptyAction={
          <Link href="/admin/programs/new" className={buttonClass("primary")}>
            Tambah program
          </Link>
        }
      />
    </>
  );
}
