import type { ReactNode } from "react";

/** Gaya kontrol form CMS. Dipakai lewat `inputClass(error)` supaya keadaan
 *  invalid terlihat tanpa harus menyalin kelas di setiap form. */
export const ADMIN_INPUT_CLASS =
  "min-h-11 w-full rounded-control border border-border bg-surface px-3 py-2 text-base text-ink-950 placeholder:text-ink-500";

export function inputClass(error?: string): string {
  return error ? `${ADMIN_INPUT_CLASS} border-danger` : ADMIN_INPUT_CLASS;
}

/**
 * Label selalu terlihat (design.md §8.3) dan pesan error tampil inline di bawah
 * kontrol, bukan di toast.
 */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink-950">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-500">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Checkbox dengan label tetap terlihat di samping kontrol. */
export function FormCheckbox({
  label,
  name,
  defaultChecked,
  error,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-ink-950">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="h-5 w-5 rounded border-border text-brand-700"
        />
        {label}
      </label>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
