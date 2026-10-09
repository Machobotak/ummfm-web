/**
 * Pembacaan FormData mentah. Field yang tidak dikirim menjadi "" supaya zod
 * yang memutuskan validitasnya; nilai tidak pernah dipangkas di sini (kata
 * sandi pun lewat), pemangkasan diatur per schema dengan `.trim()`.
 */
export function fieldText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

/** Checkbox HTML hanya terkirim saat dicentang. */
export function fieldChecked(formData: FormData, name: string): boolean {
  return formData.get(name) !== null;
}

/** Semua nilai dari field bernama sama (mis. baris social link), urut dokumen. */
export function fieldTexts(formData: FormData, name: string): string[] {
  return formData.getAll(name).filter((value): value is string => typeof value === "string");
}