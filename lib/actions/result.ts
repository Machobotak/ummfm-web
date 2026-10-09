import type { ZodError } from "zod";

/**
 * Hasil server action form: `ok: true` (form lalu redirect) atau daftar pesan
 * error per nama field untuk ditampilkan inline oleh `FormField`.
 */
export type ActionResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string>; usedBy?: string[] };
export const EMPTY_ACTION_RESULT: ActionResult = { ok: true };

/** Error zod → map nama field → pesan (pesan pertama tiap field yang dipakai). */
export function fieldErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form";
    if (!(field in errors)) errors[field] = issue.message;
  }

  return errors;
}

/** Kode error PostgreSQL/Supabase → pesan Indonesia. */
export function databaseErrors(
  error: { code?: string; message: string },
  uniqueField?: string,
): Record<string, string> {
  if (error.code === "23505" && uniqueField) {
    return { [uniqueField]: "Nilai ini sudah dipakai. Gunakan yang lain." };
  }
  return { form: `Gagal menyimpan ke database: ${error.message}` };
}
