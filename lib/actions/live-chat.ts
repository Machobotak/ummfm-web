"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import {
  LIVE_CHAT_COOLDOWN_MS,
  LIVE_CHAT_HONEYPOT,
  LIVE_CHAT_MAX_BODY,
  LIVE_CHAT_MAX_NAME,
  type LiveChatResult,
} from "@/lib/live-chat";
import { getAdmin } from "@/lib/supabase/admin";
import { SUPABASE_SERVICE_ROLE_KEY, isSupabaseConfigured } from "@/lib/supabase/config";
import { fieldText } from "./fields";
import { databaseErrors, fieldErrors } from "./result";

const messageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(LIVE_CHAT_MAX_NAME, `Nama maksimal ${LIVE_CHAT_MAX_NAME} karakter`),
  body: z
    .string()
    .trim()
    .min(1, "Komentar wajib diisi")
    .max(LIVE_CHAT_MAX_BODY, `Komentar maksimal ${LIVE_CHAT_MAX_BODY} karakter`),
});

/**
 * Hash IP dengan garam service role key: tabel jeda hanya menyimpan hash ini,
 * jadi alamat pengunjung tidak pernah tersimpan dan tidak bisa dibalik.
 */
function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}:${SUPABASE_SERVICE_ROLE_KEY}`).digest("hex");
}

/**
 * Kirim komentar pendengar. Tanpa autentikasi, jadi pertahanannya: honeypot,
 * batas panjang (zod + check constraint di migrasi), dan jeda kirim per IP.
 */
export async function postLiveMessage(
  _previous: LiveChatResult,
  formData: FormData,
): Promise<LiveChatResult> {
  if (fieldText(formData, LIVE_CHAT_HONEYPOT)) {
    return { ok: false, errors: { form: "Pengiriman ditolak." } };
  }
  if (!isSupabaseConfigured()) {
    return { ok: false, errors: { form: "Live chat belum tersambung ke CMS." } };
  }

  const parsed = messageSchema.safeParse({
    name: fieldText(formData, "name"),
    body: fieldText(formData, "body"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const admin = getAdmin();
  // Header ini diisi proxy di depan aplikasi. Bila tidak ada, jeda dilewati
  // supaya semua pengunjung tidak berbagi satu keranjang jeda yang sama.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ipHash = ip ? hashIp(ip) : "";

  if (ipHash) {
    const { data } = await admin
      .from("live_chat_limits")
      .select("posted_at")
      .eq("ip_hash", ipHash)
      .maybeSingle();
    const postedAt =
      data && typeof data === "object" && "posted_at" in data && typeof data.posted_at === "string"
        ? data.posted_at
        : null;

    if (postedAt) {
      const elapsed = Date.now() - new Date(postedAt).getTime();
      if (elapsed < LIVE_CHAT_COOLDOWN_MS) {
        const seconds = Math.ceil((LIVE_CHAT_COOLDOWN_MS - elapsed) / 1000);
        return { ok: false, errors: { form: `Tunggu ${seconds} detik sebelum mengirim lagi.` } };
      }
    }
  }

  const { error } = await admin
    .from("live_messages")
    .insert({ name: parsed.data.name, body: parsed.data.body });
  if (error) return { ok: false, errors: databaseErrors(error) };

  if (ipHash) {
    // Pesan sudah tersimpan; catatan jeda yang gagal tidak boleh menggagalkannya.
    await admin
      .from("live_chat_limits")
      .upsert({ ip_hash: ipHash, posted_at: new Date().toISOString() });
  }

  return { ok: true, postedAt: new Date().toISOString() };
}

/** Sembunyikan atau tampilkan kembali pesan (moderasi CMS). */
export async function setLiveMessageHidden(formData: FormData): Promise<void> {
  await requireRole("editor");

  const id = fieldText(formData, "id");
  if (id) {
    const { error } = await getAdmin()
      .from("live_messages")
      .update({ is_hidden: fieldText(formData, "isHidden") === "true" })
      .eq("id", id);
    if (error) throw new Error(`Gagal mengubah status pesan: ${error.message}`);
  }

  redirect("/admin/chat");
}

export async function deleteLiveMessage(formData: FormData): Promise<void> {
  await requireRole("editor");

  const id = fieldText(formData, "id");
  if (id) {
    const { error } = await getAdmin().from("live_messages").delete().eq("id", id);
    if (error) throw new Error(`Gagal menghapus pesan: ${error.message}`);
  }

  redirect("/admin/chat");
}
