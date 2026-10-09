"use client";

import { useActionState, useEffect, useState } from "react";
import { buttonClass, SubmitButton } from "./SubmitButton";
import { deleteMediaAsset } from "@/lib/actions/media";
import { EMPTY_ACTION_RESULT } from "@/lib/actions/result";

/**
 * Hapus aset media selalu lewat konfirmasi (design.md §8.2). Berbeda dari
 * `ConfirmDelete`, aksi hapus media memakai `useActionState` karena server
 * menolak aset yang masih dipakai konten dan daftar pemakainya perlu
 * ditampilkan di dalam dialog (kondisi bisa berubah setelah halaman dirender).
 */
export function MediaDeleteButton({
  id,
  fileName,
  usedBy,
}: {
  id: string;
  fileName: string;
  usedBy: string[];
}) {
  const [state, formAction] = useActionState(deleteMediaAsset, EMPTY_ACTION_RESULT);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const errors = state.ok ? {} : state.errors;
  const blockedBy = state.ok ? [] : (state.usedBy ?? []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 rounded-control px-3 text-sm font-semibold text-danger hover:bg-danger/10"
      >
        Hapus
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Hapus media?"
            className="w-full max-w-[420px] rounded-card border border-border bg-surface p-6 shadow-overlay"
          >
            <p className="text-lg font-semibold">Hapus media?</p>
            <p className="mt-2 text-sm text-ink-700">
              &ldquo;{fileName}&rdquo; akan hilang dari Media Library dan berkasnya di Storage.
              {usedBy.length > 0
                ? ` Aset ini masih dipakai di: ${usedBy.join(", ")}. Hapus akan ditolak selama masih dipakai.`
                : ""}
            </p>

            {errors.form ? (
              <p role="alert" className="mt-3 rounded-control bg-danger/10 px-3 py-2 text-sm text-danger">
                {errors.form}
              </p>
            ) : null}
            {blockedBy.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-sm text-ink-700">
                {blockedBy.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            ) : null}

            <form action={formAction} className="mt-5 flex justify-end gap-2">
              <input type="hidden" name="id" value={id} />
              <button type="button" onClick={() => setOpen(false)} className={buttonClass("secondary")}>
                Batal
              </button>
              <SubmitButton label="Hapus" pendingLabel="Menghapus…" variant="danger" />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
