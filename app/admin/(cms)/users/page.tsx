import { connection } from "next/server";
import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserActiveForm, UserForm, UserRoleForm } from "@/components/admin/UserForm";
import { listProfiles } from "@/lib/admin/data";
import { requireRole } from "@/lib/auth";
import { formatDate, formatTime } from "@/lib/format";
import type { Profile, UserRole } from "@/lib/types";

export const metadata: Metadata = { title: "Pengguna" };

const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Admin",
  editor: "Editor",
};

function buildColumns(currentUserId: string): Column<Profile>[] {
  return [
    {
      key: "displayName",
      header: "Nama tampilan",
      primary: true,
      render: (profile) => (
        <span className="font-semibold">
          {profile.displayName}
          {profile.id === currentUserId ? (
            <span className="ml-2 text-xs font-medium text-ink-500">(Anda)</span>
          ) : null}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (profile) => <span className="text-ink-700">{ROLE_LABEL[profile.role]}</span>,
    },
    {
      key: "isActive",
      header: "Status",
      render: (profile) =>
        profile.isActive ? (
          <span className="font-semibold text-success">Aktif</span>
        ) : (
          <span className="font-semibold text-ink-500">Nonaktif</span>
        ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      render: (profile) => (
        <span className="text-ink-700">
          {formatDate(profile.createdAt)} · {formatTime(profile.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      className: "text-right",
      render: (profile) => (
        <div className="flex flex-wrap items-end justify-end gap-3">
          <UserRoleForm profile={profile} />
          <UserActiveForm profile={profile} />
        </div>
      ),
    },
  ];
}

export default async function AdminUsersPage() {
  await connection();
  const currentUser = await requireRole("admin");
  const profiles = await listProfiles();

  return (
    <>
      <PageHeader
        title="Pengguna"
        description="Akun CMS terdiri dari akun Supabase Auth dan baris profilnya. Role Editor mengelola konten tanpa melihat menu Pengguna; hanya admin yang bisa menambah akun serta mengubah role dan status."
      />

      <div className="flex flex-col gap-6">
        <UserForm />
        <DataTable
          columns={buildColumns(currentUser.id)}
          rows={profiles}
          rowKey={(profile) => profile.id}
          emptyTitle="Belum ada pengguna"
          emptyDescription="Tambahkan akun pertama lewat form di atas."
        />
      </div>
    </>
  );
}
