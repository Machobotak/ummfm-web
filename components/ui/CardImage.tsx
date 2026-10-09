"use client";

import Image from "next/image";
import { MEDIA_RATIO_CLASS, MediaPlaceholder, type MediaRatio } from "./MediaPlaceholder";

/**
 * Rasio container tetap supaya layout tidak meloncat (design.md §10).
 * Placeholder selalu ada di belakang gambar; bila gambar gagal dimuat,
 * gambar disembunyikan sehingga placeholder yang terlihat — tanpa kotak kosong.
 */
export function CardImage({
  src,
  alt,
  ratio,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className = "",
}: {
  src: string;
  alt: string;
  ratio: MediaRatio;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-card bg-brand-50 ${MEDIA_RATIO_CLASS[ratio]} ${className}`}
    >
      <MediaPlaceholder ratio={ratio} className="absolute inset-0 h-full w-full" />
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          onError={(event) => {
            event.currentTarget.style.opacity = "0";
          }}
        />
      ) : null}
    </div>
  );
}
