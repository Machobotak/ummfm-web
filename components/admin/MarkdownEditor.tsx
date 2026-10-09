"use client";

import { useState } from "react";
import { SafeMarkdown } from "@/components/ui/SafeMarkdown";
import { ADMIN_INPUT_CLASS, FormField } from "./FormField";

/** Textarea Markdown dengan pratinjau (design.md §8.3). */
export function MarkdownEditor({
  name,
  label,
  initialValue,
  error,
  hint,
  rows = 14,
}: {
  name: string;
  label: string;
  initialValue: string;
  error?: string;
  hint?: string;
  rows?: number;
}) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [value, setValue] = useState(initialValue);

  const tabClass = (active: boolean) =>
    `min-h-11 rounded-control px-4 text-sm font-semibold ${
      active ? "bg-brand-100 text-brand-700" : "text-ink-700 hover:bg-canvas"
    }`;

  return (
    <FormField label={label} error={error} hint={hint}>
      <div role="tablist" aria-label={`Mode ${label}`} className="flex w-fit gap-1 rounded-control border border-border p-1">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "write"}
          onClick={() => setMode("write")}
          className={tabClass(mode === "write")}
        >
          Tulis
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "preview"}
          onClick={() => setMode("preview")}
          className={tabClass(mode === "preview")}
        >
          Pratinjau
        </button>
      </div>

      {/* Textarea tetap ter-mount saat pratinjau supaya nilainya ikut terkirim. */}
      <textarea
        name={name}
        value={value}
        rows={rows}
        onChange={(event) => setValue(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-label={label}
        className={`${ADMIN_INPUT_CLASS} font-mono text-sm ${mode === "preview" ? "hidden" : ""}`}
      />

      {mode === "preview" ? (
        <div className="rounded-control border border-border bg-surface px-4 pb-4">
          {value.trim() ? (
            <SafeMarkdown>{value}</SafeMarkdown>
          ) : (
            <p className="mt-4 text-sm text-ink-500">Belum ada isi untuk ditampilkan.</p>
          )}
        </div>
      ) : null}
    </FormField>
  );
}
