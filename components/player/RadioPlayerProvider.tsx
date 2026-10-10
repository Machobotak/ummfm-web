"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { STREAM_URL } from "@/lib/stream";

export type PlayerStatus = "idle" | "connecting" | "playing" | "paused" | "error";

interface PlayerContextValue {
  status: PlayerStatus;
  play(): void;
  pause(): void;
  toggle(): void;
}

const RadioPlayerContext = createContext<PlayerContextValue | null>(null);

// Batal saat menyambung menolak play() dengan AbortError; itu aksi pengguna,
// bukan kegagalan siaran (kode 1 = MEDIA_ERR_ABORTED).
function isUserAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * Satu elemen <audio> untuk seluruh situs (PRD §6.2: jangan pernah memutar dua
 * stream sekaligus). Tanpa autoplay: hanya aksi pengguna yang memanggil play().
 * State hidup di provider, jadi navigasi antar halaman tidak menghentikan siaran.
 *
 * `streamUrl` berasal dari CMS (site_settings.stream_url); default-nya env
 * NEXT_PUBLIC_STREAM_URL. Perubahan URL baru terasa setelah reload.
 */
export function RadioPlayerProvider({
  children,
  streamUrl = STREAM_URL,
}: {
  children: ReactNode;
  streamUrl?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<PlayerStatus>(streamUrl ? "idle" : "error");
  // Elemen yang berakhir di state error harus di-reset dengan load() sebelum
  // play() dipanggil lagi; play() dan "Coba lagi" karena itu memakai jalur sama.
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      setStatus("error");
      return;
    }
    setStatus("connecting");
    if (audio.error) audio.load();
    audio.play().catch((error: unknown) => {
      if (!isUserAbort(error)) setStatus("error");
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    // "paused" harus memutar lagi, bukan menjeda ulang; kalau tidak, tombol
    // "Putar" setelah jeda tidak melakukan apa-apa.
    if (status === "playing" || status === "connecting") {
      pause();
    } else {
      play();
    }
  }, [pause, play, status]);

  const value = useMemo(() => ({ status, play, pause, toggle }), [pause, play, status, toggle]);

  return (
    <RadioPlayerContext value={value}>
      {children}
      {streamUrl ? (
        <audio
          ref={audioRef}
          src={streamUrl}
          preload="none"
          onPlaying={() => setStatus("playing")}
          onPause={() => setStatus((current) => (current === "error" ? current : "paused"))}
          onLoadStart={() => setStatus("connecting")}
          onWaiting={() => setStatus("connecting")}
          onStalled={() => setStatus("connecting")}
          onError={(event) =>
            setStatus(event.currentTarget.error?.code === 1 ? "paused" : "error")
          }
          className="hidden"
        />
      ) : null}
    </RadioPlayerContext>
  );
}

export function useRadioPlayer(): PlayerContextValue {
  const value = useContext(RadioPlayerContext);
  if (!value) throw new Error("useRadioPlayer harus dipakai di dalam RadioPlayerProvider");
  return value;
}
