"use client";

import { useFormStatus } from "react-dom";
import { buttonClass, type ButtonVariant } from "./buttonClass";

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
