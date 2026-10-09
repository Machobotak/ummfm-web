export type ButtonVariant = "primary" | "secondary" | "danger";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-600",
  secondary: "border border-border bg-surface text-ink-950 hover:bg-canvas",
  danger: "bg-danger text-white hover:bg-danger/90",
};

/**
 * Gaya tombol CMS. Modul ini sengaja TANPA `"use client"`: Server Component
 * (mis. `<Link>` bertombol di halaman daftar) ikut memakainya, dan fungsi yang
 * diekspor dari modul klien tidak bisa dipanggil dari server.
 */
export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `inline-flex min-h-11 items-center justify-center rounded-control px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASS[variant]} ${extra}`;
}
