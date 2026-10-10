import { connection } from "next/server";
import type { Metadata } from "next";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { deleteLiveMessage, setLiveMessageHidden } from "@/lib/actions/live-chat";
import { listLiveMessages } from "@/lib/admin/data";
import { formatDate, formatTime } from "@/lib/format";
import type { LiveMessage } from "@/lib/types";

export const metadata: Metadata = { title: "Chat" };

/** Status sebagai label teks, bukan warna saja (design.md §7.4). */
function VisibilityBadge({ isHidden }: { isHidden: boolean }) {
  const tone = isHidden
    ? "border border-border bg-canvas text-ink-500"
    : "bg-success/10 text-success";

  return (
    <span className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold ${tone}`}>
      {isHidden ? "Disembunyikan" : "Tampil"}
    </span>
  );
}

const columns: Column<LiveMessage>[] = [
  {
    key: "body",
    header: "Pesan",
    primary: true,
    render: (message) => (
      <div className="max-w-[520px]">
        <p className="break-words">{message.body}</p>
        <p className="mt-1 text-xs font-semibold text-ink-500">{message.name}</p>
      </div>
    ),
  },
  {
    key: "createdAt",
    header: "Waktu",
    render: (message) => (
      <span className="tabular-nums text-ink-700">
        {formatDate(message.createdAt)} · {formatTime(message.createdAt)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (message) => <VisibilityBadge isHidden={message.isHidden} />,
  },
  {
    key: "actions",
    header: "Aksi",
    className: "text-right",
    render: (message) => (
      <div className="flex items-center justify-end gap-1">
        <form action={setLiveMessageHidden}>
          <input type="hidden" name="id" value={message.id} />
          <input type="hidden" name="isHidden" value={message.isHidden ? "false" : "true"} />
          <SubmitButton
            label={message.isHidden ? "Tampilkan" : "Sembunyikan"}
            pendingLabel="Menyimpan…"
            variant="secondary"
          />
        </form>
        <ConfirmDelete
          action={deleteLiveMessage}
          id={message.id}
          title="Hapus pesan?"
          description={`Pesan dari "${message.name}" akan dihapus permanen dari daftar.`}
        />
      </div>
    ),
  },
];

/** PostgREST membalas objek { code, message }, jadi jangan asumsikan Error biasa. */
function readErrorText(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Penyebabnya tidak diketahui.";
}

export default async function AdminChatPage() {
  await connection();

  let messages: LiveMessage[] = [];
  let loadError = "";
  try {
    messages = await listLiveMessages();
  } catch (error) {
    loadError = readErrorText(error);
  }

  return (
    <>
      <PageHeader
        title="Live Chat"
        description="Komentar pendengar dari halaman publik. Pesan yang disembunyikan langsung hilang dari Home."
      />
      {loadError ? (
        <EmptyState
          title="Daftar chat gagal dibaca"
          description={`${loadError}. Jalankan supabase/migrations/0002_live_messages.sql di SQL Editor Supabase, lalu muat ulang halaman ini.`}
        />
      ) : (
        <DataTable
          columns={columns}
          rows={messages}
          rowKey={(message) => message.id}
          emptyTitle="Belum ada pesan chat"
          emptyDescription="Pesan yang dikirim pendengar lewat Home akan muncul di sini."
        />
      )}
    </>
  );
}
