import { z } from "zod";
import { jakartaLocalToIso } from "@/lib/format";

/**
 * Potongan schema yang dipakai lebih dari satu server action. Field form memakai
 * camelCase; pemetaan ke kolom snake_case ada di masing-masing action.
 */
export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug wajib diisi")
  .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda minus");

export const optionalIdSchema = z.string().trim().optional();

/** Jam 24 jam tanpa zona, mis. "06:00". */
export const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Jam harus format HH:MM");

/** Nilai `datetime-local` (jam dinding WIB) → instan ISO. */
export const localDateTimeSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/, "Tanggal dan jam tidak valid")
  .transform(jakartaLocalToIso);

/** Nilai `datetime-local` opsional untuk tanggal terbit. */
export const optionalLocalDateTimeSchema = z
  .union([z.literal(""), localDateTimeSchema])
  .transform((value) => (value === "" ? null : value));

export const httpUrlSchema = z
  .string()
  .trim()
  .regex(/^https?:\/\/\S+$/, "Tautan harus dimulai http:// atau https://");

/** Tautan opsional: "" berarti belum diatur. */
export const optionalHttpUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^https?:\/\/\S+$/.test(value),
    "Tautan harus dimulai http:// atau https://",
  );

export const countSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Isi dengan angka bulat")
  .transform(Number);
