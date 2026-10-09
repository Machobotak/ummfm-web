"use client";

import { useFormStatus } from "react-dom";

export type ButtonVariant = "primary" | "secondary" | "danger";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-600",
  secondary: "border border-border bg-surface text-ink-950 hover:bg-canvas",
  danger: "bg-danger text-white hover:bg-danger/90",
};

export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `inline-flex min-h-11 items-center justify-center rounded-control px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASS[variant]} ${extra}`;
}

/** Tombol submit yang mengunci dirinya selama action berjalan. */
export function SubmitButton({
  label,
  pendingLabel = "Menyimpan…",
  variant = "primary",
  className = "",
  onClick,
}: {
  label: string;
  pendingLabel?: string;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={onClick}
      className={buttonClass(variant, className)}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
