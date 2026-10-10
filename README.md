# Website Publik 93.4 UMMFM

Situs publik radio kampus 93.4 UMMFM (The Real Campus Radio) plus dashboard CMS-nya —
Next.js App Router, Supabase (Postgres + Auth + Storage) sebagai backend.
Tanpa kredensial Supabase, situs publik tetap jalan memakai konten mock bertipe di `lib/data.ts`.

Referensi: `PRD_Website_Streaming_Radio_UMMFM.md`, `design.md`, `BUILD_WEBSITE_PUBLIK_934_UMMFM_PLAN.md`,
`SUPABASE_CMS_INTEGRATION_PLAN.md`.

## Menjalankan

Node ≥ 18.18 (diuji pada Node 26).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi (compiler + typecheck)
npm run lint
npm run typecheck
```

## Konfigurasi

| Variabel | Fungsi |
|---|---|
| `NEXT_PUBLIC_STREAM_URL` | Mount audio SHOUTcast. Fallback bila `site_settings.stream_url` kosong. |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase. Kosong → seluruh situs memakai konten mock. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Kunci publik (anon) untuk login dan unggah media dari browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | Kunci service role, **hanya server** (baca konten publik, tulis CMS, Storage). |

`.env.local` berisi nilai nyata (tidak di-commit); `.env.example` dokumentasi (di-commit).
Nilai `NEXT_PUBLIC_STREAM_URL` kosong membuat player langsung berada pada status `error`
beserta tombol "Coba lagi".

## Struktur

```
app/                    publik: /, /news, /news/[slug], /about, /event, /event/[slug],
                        /program, /playlist — di dalam route group `(public)`
app/admin/login/        login CMS (tanpa chrome publik)
app/admin/(cms)/        dashboard CMS: /admin, programs, schedules, playlists, news,
                        events, media, settings, users
components/ui/          primitif: Container, CardImage, MediaPlaceholder, SectionHeading,
                        EmptyState, ErrorState, LoadingSkeleton, OnAirBadge, StatusBadge
components/player/      RadioPlayerProvider (state, satu elemen <audio>), LiveRadioPlayer,
                        ActiveProgramBar (server: jadwal per request)
components/site/        SiteHeader, MobileNavigation, SiteFooter
components/home/        section halaman Home
components/content/     kartu konten: ProgramCard, ScheduleList, PlaylistCard,
                        NewsCard, FeaturedNewsCard, EventCard
lib/types.ts            tipe konten (mengikuti PRD §11)
lib/data.ts             mock konten (semua gambar "" → MediaPlaceholder)
lib/content.ts          seam baca publik (cache + fallback mock) untuk halaman/komponen
lib/admin/data.ts       bacaan dashboard CMS (tanpa cache, di belakang auth)
lib/actions/            server action tulis (programs, schedules, playlists, news, events,
                        settings, media, users, auth, live-chat) — semua `requireRole` + zod,
                        kecuali postLiveMessage (publik: honeypot, batas panjang, jeda per IP)
lib/supabase/           klien Supabase (admin/server/browser), mapper baris, skema settings
lib/schedule.ts         jadwal aktif/berikutnya menurut jam Asia/Jakarta
lib/format.ts           format tanggal/jam id-ID + zona WIB
lib/live-chat.ts        batas panjang, jeda kirim, dan interval polling live chat
lib/stream.ts, lib/site.ts
```

## Backend Supabase (CMS)

1. Buat project Supabase, lalu jalankan `supabase/migrations/0001_init.sql` di SQL Editor.
2. Jalankan `supabase/migrations/0002_live_messages.sql` — tabel live chat pendengar Home
   (`live_messages` + `live_chat_limits`). Tanpa langkah ini Home tetap tampil, tetapi daftar
   chat kosong dan pengiriman pesan ditolak.
3. Jalankan `supabase/migrations/0003_schedule_host.sql` — penyiar pindah dari program ke slot
   jadwal (`program_schedules.host_name`). Migrasi menyalin penyiar tiap program ke semua
   slotnya lalu menghapus kolom `programs.host_name`. Selama belum dijalankan, nama penyiar
   tampil kosong dan penyimpanan slot jadwal dari CMS gagal.
4. (Opsional) jalankan `supabase/seed.sql` — berisi konten yang sama dengan mock `lib/data.ts`.
5. Isi `.env.local` (lihat tabel di atas), lalu buat akun admin pertama lewat
   Dashboard Supabase → Authentication → Users, dan set `profiles.role = 'admin'`.
6. Buka `/admin/login`. Role `editor` boleh mengelola konten; role `admin` juga mengelola
   Pengguna. Akun dengan `profiles.is_active = false` tidak bisa masuk.

`lib/content.ts` adalah satu-satunya seam baca untuk situs publik: tiap getter memakai
`"use cache"` + `cacheTag`, memilih Supabase bila env terisi dan mock bila tidak, sehingga
call site tidak perlu berubah. Mutasi dari CMS memanggil `updateTag(<tag konten>)` supaya
perubahan langsung terlihat di situs publik tanpa redeploy. Aset gambar dari Supabase Storage
ditambahkan otomatis ke `images.remotePatterns` (`next.config.ts`) dari host
`NEXT_PUBLIC_SUPABASE_URL`.

## Catatan teknis

- **Cache Components** (`cacheComponents: true`) aktif. Data runtime — `new Date()` — hanya
  dipakai untuk jadwal: di dalam `getRequestNow()` (`connection()` + `<Suspense>`), jadi
  halaman lain tetap statis dan navigasi instan.
- **Halaman detail** (`/news/[slug]`, `/event/[slug]`) memakai `instant = false` karena
  `params` dibaca untuk memutuskan `notFound()`. Konsekuensinya sesuai Next.js: slug tak
  dikenal yang pertama kali diminta (cache dingin) dibalas `200` + `<meta name="robots"
  content="noindex">` sambil tetap menampilkan halaman 404, dan permintaan berikutnya `404`.
- **Player**: tanpa autoplay, satu elemen `<audio>` untuk seluruh situs, status koneksi
  terpisah dari status jadwal ("on air" per jadwal ≠ stream tersedia).
- **Jadwal** mendukung slot lintas tengah malam (`endTime <= startTime`) dan dihitung
  memakai jam dinding `Asia/Jakarta`.
- **Live chat** pendengar: daftar awal dirender server, lalu klien memanggil
  `GET /api/live-chat` (`connection()` + `no-store`) tiap 10 detik selama tab terlihat. Kirim
  pesan lewat server action publik dengan honeypot, batas 300 karakter, dan jeda 15 detik per
  IP (hanya hash IP yang disimpan, di `live_chat_limits` yang tanpa policy). Moderasi di
  `/admin/chat`: pesan yang disembunyikan langsung hilang dari Home, yang dihapus permanen.
- **Dashboard** berada di route group `app/admin/(cms)/` dengan `app/admin/login` di luarnya:
  layout `(cms)` menjaga seluruh halaman CMS (`getCurrentUser()` → redirect `/admin/login`),
  dan halaman `/admin/login` tidak bisa ikut terjaga oleh layout yang sama tanpa loop.
  Seluruh halaman CMS memanggil `await connection()` di awal render: data CMS harus segar
  saat request, bukan hasil prerender.
- **Invalidasi cache** memakai `updateTag` (bukan `revalidateTag`): perubahan dari CMS
  langsung kedaluwarsa dan tampil pada render berikutnya di roundtrip yang sama.
- Tanpa aset gambar eksternal pada fase mock: semua URL gambar `""` sehingga
  `MediaPlaceholder` yang tampil.
