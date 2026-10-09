"use client";

import { useEffect, useState } from "react";
import { SubmitButton } from "./SubmitButton";
import { buttonClass } from "./buttonClass";

/**
 * Hapus selalu lewat konfirmasi (design.md §8.2). `action` adalah server action
 * ber-tanda tangan form biasa; hasilnya redirect ke halaman daftar.
 */
export function ConfirmDelete({
  action,
  id,
  redirectTo,
  title,
  description,
  triggerLabel = "Hapus",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  redirectTo?: string;
  title: string;
  description?: string;
  triggerLabel?: string;
}) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 rounded-control px-3 text-sm font-semibold text-danger hover:bg-danger/10"
      >
        {triggerLabel}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-[420px] rounded-card border border-border bg-surface p-6 shadow-overlay"
          >
            <p className="text-lg font-semibold">{title}</p>
            {description ? <p className="mt-2 text-sm text-ink-700">{description}</p> : null}
            <form action={action} className="mt-5 flex justify-end gap-2">
              <input type="hidden" name="id" value={id} />
              {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
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
