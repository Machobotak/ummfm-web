"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { postLiveMessage } from "@/lib/actions/live-chat";
import { formatTime } from "@/lib/format";
import {
  EMPTY_LIVE_CHAT_RESULT,
  LIVE_CHAT_HONEYPOT,
  LIVE_CHAT_MAX_BODY,
  LIVE_CHAT_MAX_NAME,
  LIVE_CHAT_POLL_MS,
  type LiveChatResult,
} from "@/lib/live-chat";
import type { LiveMessage } from "@/lib/types";

const FIELD_CLASS =
  "min-h-11 w-full rounded-control border border-border bg-surface px-3 py-2 text-base text-ink-950 placeholder:text-ink-500";

const SUBMIT_CLASS =
  "inline-flex min-h-12 items-center justify-center rounded-pill bg-brand-700 px-5 text-base font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60";

/** Batas bawah dianggap "menempel": di bawah ini pembaca masih ikut pesan terakhir. */
const STICK_THRESHOLD_PX = 80;

function isLiveMessage(value: unknown): value is LiveMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "body" in value &&
    typeof value.body === "string" &&
    "isHidden" in value &&
    typeof value.isHidden === "boolean" &&
    "createdAt" in value &&
    typeof value.createdAt === "string"
  );
}

/**
 * Baca balasan polling. Semua kegagalan (jaringan putus, bukan JSON, bentuk tak
 * dikenal) jadi `null` supaya daftar yang sedang tampil tidak diganti.
 */
async function fetchMessages(): Promise<LiveMessage[] | null> {
  try {
    const response = await fetch("/api/live-chat", { cache: "no-store" });
    if (!response.ok) return null;

    const payload: unknown = await response.json();
    if (typeof payload !== "object" || payload === null || !("messages" in payload)) return null;
    if (!Array.isArray(payload.messages)) return null;

    const messages = payload.messages.filter(isLiveMessage);
    return messages.length === payload.messages.length ? messages : null;
  } catch {
    return null;
  }
}

/**
 * Live chat pendengar. Daftar awal dirender server (bagian dari HTML pertama),
 * lalu disegarkan oleh polling; pesan baru datang tanpa reload dan tanpa
 * membangunkan tab yang sedang tidak dilihat.
 */
export function LiveChat({
  initialMessages,
  canPost,
}: {
  initialMessages: LiveMessage[];
  canPost: boolean;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const refresh = useCallback(async () => {
    const latest = await fetchMessages();
    if (latest) setMessages(latest);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, LIVE_CHAT_POLL_MS);

    return () => clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    const node = listRef.current;
    if (node && stickToBottom.current) node.scrollTop = node.scrollHeight;
  }, [messages]);

  function submit(formData: FormData) {
    startTransition(async () => {
      let result: LiveChatResult;
      try {
        result = await postLiveMessage(EMPTY_LIVE_CHAT_RESULT, formData);
      } catch {
        setErrors({ form: "Pesan gagal dikirim. Coba lagi." });
        return;
      }

      if (!result.ok) {
        setErrors(result.errors);
        return;
      }

      setErrors({});
      // Control state: hanya komentar yang dikosongkan setelah berhasil, nama tetap
      // terisi supaya pesan berikutnya tidak perlu diisi ulang (design.md §8.5).
      setBody("");
      // Kiriman sendiri langsung tampil, tidak menunggu putaran polling berikutnya.
      await refresh();
    });
  }

  return (
    <section
      aria-labelledby="live-chat-heading"
      className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3
          id="live-chat-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-500"
        >
          Live Chat Pendengar
        </h3>
        <p className="text-xs text-ink-500">Diperbarui otomatis tiap 10 detik</p>
      </div>

      <div
        ref={listRef}
        onScroll={(event) => {
          const node = event.currentTarget;
          stickToBottom.current =
            node.scrollHeight - node.scrollTop - node.clientHeight < STICK_THRESHOLD_PX;
        }}
        className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-ink-700">Belum ada pesan. Jadi yang pertama menyapa.</p>
        ) : (
          messages.map((message) => (
            <article key={message.id} className="rounded-card bg-canvas px-3 py-2">
              <p className="text-sm font-semibold text-ink-950">{message.name}</p>
              <p className="mt-0.5 break-words text-sm text-ink-700">{message.body}</p>
              <p className="mt-1 text-xs tabular-nums text-ink-500">
                {formatTime(message.createdAt)}
              </p>
            </article>
          ))
        )}
      </div>

      {canPost ? (
        <form action={submit} className="mt-4 flex flex-col gap-3">
          {errors.form ? (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.form}
            </p>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="live-chat-name" className="text-sm font-semibold text-ink-950">
              Nama
            </label>
            <input
              id="live-chat-name"
              name="name"
              type="text"
              maxLength={LIVE_CHAT_MAX_NAME}
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama atau panggilanmu"
              aria-describedby={errors.name ? "live-chat-name-error" : undefined}
              className={FIELD_CLASS}
            />
            {errors.name ? (
              <p id="live-chat-name-error" role="alert" className="text-sm font-medium text-danger">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="live-chat-body" className="text-sm font-semibold text-ink-950">
              Komentar
            </label>
            <textarea
              id="live-chat-body"
              name="body"
              rows={3}
              maxLength={LIVE_CHAT_MAX_BODY}
              required
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Sapaan, request lagu, atau pesan untuk penyiar"
              aria-describedby={errors.body ? "live-chat-body-error" : undefined}
              className={FIELD_CLASS}
            />
            {errors.body ? (
              <p id="live-chat-body-error" role="alert" className="text-sm font-medium text-danger">
                {errors.body}
              </p>
            ) : null}
          </div>

          {/* Jebakan bot: tidak terlihat pengunjung dan tidak terjangkau keyboard. */}
          <div className="hidden">
            <label htmlFor="live-chat-website">Website</label>
            <input
              id="live-chat-website"
              name={LIVE_CHAT_HONEYPOT}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button type="submit" disabled={pending} aria-busy={pending} className={SUBMIT_CLASS}>
            {pending ? "Mengirim…" : "Kirim pesan"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-ink-500">
          Form live chat aktif setelah situs tersambung ke CMS.
        </p>
      )}
    </section>
  );
}
