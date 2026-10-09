# Integrasi Backend Supabase + CMS Dashboard 93.4 UMMFM

## Context

Situs publik sudah selesai (mock data via `lib/content.ts`). Permintaan sekarang: integrasikan backend nyata — Supabase (Postgres + Auth + Storage) — dan bangun CMS/dashboard lengkap supaya konten dikelola tanpa menyentuh kode. Acuan: PRD §4 (role), §5.1 (MVP), §7 (fitur CMS), §8 (alur konten), §10 (stack), §11 (skema), §12 (route admin); design.md §8 (dashboard guidelines).

Keputusan yang sudah dikunci (dari jawaban pengguna): **hosted Supabase cloud**, **body News = Markdown**, **scope Full MVP** (8 seksi admin termasuk Users). Stack tambahan: `@supabase/supabase-js` + `@supabase/ssr`, `zod` (validasi), `react-markdown` + `remark-gfm` + `rehype-sanitize` (render markdown aman). End state: editor/admin login, kelola program+jadwal+playlist+news+event+media+settings+users, perubahan langsung tampil di situs publik (cache di-invalidate, tanpa redeploy).

Role: hanya `admin` dan `editor` (PRD §11 `broadcaster` opsional — tidak dipakai MVP). Tidak ada registrasi publik dashboard (PRD §7.8).

## Approach

Urutan membangun tree yang selalu bisa di-build. Setiap step meninggalkan `npm run build`/`typecheck` hijau.

### Step 1 — Dependensi

`npm install @supabase/supabase-js @supabase/ssr zod react-markdown remark-gfm rehype-sanitize`.

### Step 2 — Env & konfigurasi

`next.config.ts`: tambah `images.remotePatterns` untuk host storage Supabase (build-time):

```ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: supabaseUrl
      ? [{ protocol: "https", hostname: new URL(supabaseUrl).hostname, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  turbopack: { /* tetap seperti sekarang */ },
};
```

`.env.example` (tambah, jaga `NEXT_PUBLIC_STREAM_URL`):

```bash
NEXT_PUBLIC_STREAM_URL="https://i.klikhost.com/8682/;radio"
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon key>"
SUPABASE_SERVICE_ROLE_KEY="<service_role key — JANGAN ekspos ke browser>"
```

`.env.local` diisi nilai nyata oleh implementer saat kredensial tersedia (gitignored; `.env.example` tetap di-commit karena `!.env.example` sudah ada di `.gitignore`).

### Step 3 — Klien Supabase

Buat `lib/supabase/config.ts`:

```ts
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export function isSupabaseConfigured(): boolean; // true iff ketiga nilai non-empty
```

Buat tiga klien:

- `lib/supabase/admin.ts` — `import "server-only"`; `getAdmin()` → `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })`. Dipakai oleh `lib/content.ts` (baca publik, cache-compatible) dan semua server action (tulis). **Alasan pakai service role untuk baca publik:** `"use cache"` tidak boleh membaca `cookies()`, sedangkan `createServerClient` butuh cookie store — service role tidak butuh cookie.
- `lib/supabase/server.ts` — `createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, { cookies })` (cookie store dari `next/headers`) untuk cek sesi auth saja.
- `lib/supabase/client.ts` — `"use client"`; `createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)` untuk login form + upload media dari browser.

### Step 4 — Middleware & guard auth

`middleware.ts` (root) — `export const config = { matcher: ["/admin/:path*"] }`. Pola `@supabase/ssr` `updateSession`: jika `!isSupabaseConfigured()` → `NextResponse.next()`. Lainnya buat server client (cookie store dari request), `auth.getUser()`; `/admin` (selain `/admin/login`) tanpa user → redirect `/admin/login`; `/admin/login` dengan user → redirect `/admin`. Refresh cookie dengan `response.cookies.set(...)`.

`lib/auth.ts` (server-only):

```ts
export type CmsUser = { id: string; email: string; displayName: string; role: "admin" | "editor" };
export async function getCurrentUser(): Promise<CmsUser | null>;   // null jika tidak terkonfigurasi / tanpa sesi
export async function requireRole(min: "admin" | "editor"): Promise<CmsUser>; // redirect("/admin/login") jika null; redirect("/admin") jika role < min
```

`getCurrentUser`: `server.ts` `auth.getUser()`; join `profiles` via `admin.ts` untuk `display_name`/`role`/`is_active`; return null jika profil `is_active=false`.

### Step 5 — Migrasi database (`supabase/migrations/0001_init.sql`)

Satu file SQL; jalankan via Supabase SQL editor / CLI. Isi persis (urutan penting: `profiles` + `is_staff()` dulu, lalu tabel lain, lalu RLS & storage):

```sql
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'editor' check (role in ('admin','editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles
  where id = auth.uid() and is_active and role in ('admin','editor')); $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles (id, display_name, role, is_active)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)), 'editor', true)
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text not null unique,
  description text not null default '', cover_image_url text not null default '',
  host_name text not null default '',
  is_active boolean not null default true, is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.program_schedules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null, end_time time not null,
  timezone text not null default 'Asia/Jakarta',
  is_active boolean not null default true
);

create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text not null default '',
  cover_image_url text not null default '', external_url text not null default '',
  sort_order int not null default 0, is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text not null unique,
  excerpt text not null default '', body text not null default '',
  thumbnail_url text not null default '', cover_image_url text not null default '',
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default '',
  status text not null default 'draft' check (status in ('draft','published','unpublished','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text not null unique,
  description text not null default '', poster_url text not null default '',
  location text not null default '',
  starts_at timestamptz not null, ends_at timestamptz not null,
  registration_url text not null default '',
  status text not null default 'upcoming' check (status in ('upcoming','ongoing','completed','cancelled')),
  is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null, storage_path text not null, public_url text not null,
  mime_type text not null, file_size bigint not null default 0,
  alt_text text not null default '',
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique, value jsonb not null,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create trigger trg_programs_updated  before update on public.programs  for each row execute function public.set_updated_at();
create trigger trg_playlists_updated before update on public.playlists for each row execute function public.set_updated_at();
create trigger trg_news_updated      before update on public.news      for each row execute function public.set_updated_at();
create trigger trg_events_updated    before update on public.events    for each row execute function public.set_updated_at();

alter table public.profiles          enable row level security;
alter table public.programs          enable row level security;
alter table public.program_schedules enable row level security;
alter table public.playlists         enable row level security;
alter table public.news              enable row level security;
alter table public.events            enable row level security;
alter table public.media_assets      enable row level security;
alter table public.site_settings     enable row level security;

create policy "public read published programs"  on public.programs          for select using (is_published = true);
create policy "public read active schedules"    on public.program_schedules for select using (is_active = true);
create policy "public read published playlists" on public.playlists         for select using (is_published = true);
create policy "public read published news"      on public.news              for select using (status = 'published');
create policy "public read published events"    on public.events            for select using (is_published = true);
create policy "public read media"               on public.media_assets      for select using (true);
create policy "public read settings"            on public.site_settings     for select using (true);
create policy "public read profile names"       on public.profiles          for select using (true);

-- Defense-in-depth: aplikasi menulis lewat service role (server-only), tapi anon key tetap dilindungi.
create policy "staff manage programs"  on public.programs          for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff manage schedules" on public.program_schedules for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff manage playlists" on public.playlists         for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff manage news"      on public.news              for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff manage events"    on public.events            for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff manage media"     on public.media_assets      for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff manage settings"  on public.site_settings     for all to authenticated using (public.is_staff()) with check (public.is_staff());

insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;
create policy "public read media bucket"  on storage.objects for select using (bucket_id = 'media');
create policy "staff upload media bucket" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_staff());
create policy "staff update media bucket" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_staff());
create policy "staff delete media bucket" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_staff());
```

Catatan skema vs PRD §11: `news.author_id` disimpan + `news.author_name` di-snapshot saat simpan (jadi render publik tanpa join; `NewsArticle.authorName` tetap). `program_schedules.valid_from/valid_until` (opsional) dan `media_assets` kolom dimensi **tidak** dibuat (di luar MVP; jangan tambah).

### Step 6 — Seed (`supabase/seed.sql`)

Idempotent. Nilai = persis data mock di `lib/data.ts` (sumber kebenaran nilai; jangan ciptakan nilai baru):

- 6 program (`on conflict (slug) do nothing`); 23 `program_schedules` via subquery `(select id from programs where slug='…')` (6 slot × weekday; `gelombang-malam` Jumat+Sabtu `22:00`–`01:00`); 3 playlist; 5 news (`body` = paragraf mock digabung `\n\n`, `author_name='Tim Redaksi UMMFM'`, `author_id` null, `status='published'`, `published_at` sesuai mock); 4 event.
- `site_settings` (key, value jsonb): `tagline` → `"The Real Campus Radio"`, `contact_email` → `"ummfm@gmail.com"`, `social_links` → JSON array 3 tautan mock, `about` → JSON `{intro,history,vision,mission[]}`, `stream_url` → `""`.

Seed hanya dijalankan sekali saat setup; konten selanjutnya lewat CMS.

### Step 7 — Tipe & mapper

`lib/types.ts`:
- Ubah `NewsArticle.body: string[]` → `body: string` (Markdown).
- Tambah `streamUrl?: string` ke `SiteSettings`.
- Tambah `export type UserRole = "admin" | "editor";` dan interface `MediaAsset { id; fileName; storagePath; publicUrl; mimeType; fileSize; altText; uploadedBy: string | null; createdAt }` serta `Profile { id; displayName; role: UserRole; isActive; createdAt }`.

`lib/data.ts` (fallback mock): gabung tiap `body: string[]` jadi satu string Markdown (paragraf dipisah baris kosong); tambah `streamUrl: ""` di `mockSiteSettings`. **Jangan hapus `lib/data.ts`** — dipakai saat Supabase belum terkonfigurasi.

`lib/supabase/rows.ts`: definisikan tipe baris snake_case (`ProgramRow`, `ScheduleRow`, `PlaylistRow`, `NewsRow`, `EventRow`, `MediaRow`, `ProfileRow`, `SettingRow`) — kolom persis seperti migrasi.

`lib/supabase/mappers.ts`: `mapProgram`, `mapSchedule`, `mapPlaylist`, `mapNews`, `mapEvent`, `mapMedia`, `mapProfile`. Aturan khusus: `start_time`/`end_time` (`time`) → `"06:00"` (buang `:00` detik, `slice(0,5)`); `published_at` null → pakai `created_at`; `day_of_week` → number; timestamptz → string ISO langsung.

### Step 8 — Tulis ulang `lib/content.ts` (seam → Supabase)

Jaga signature fungsi & return type (call site tidak berubah). Tiap getter: `"use cache"` + `cacheLife("hours")` + `cacheTag("<tag>")` + guard `isSupabaseConfigured()`:

```ts
import { cacheLife, cacheTag } from "next/cache";

export async function getPublishedNews(): Promise<NewsArticle[]> {
  "use cache"; cacheLife("hours"); cacheTag("news");
  if (!isSupabaseConfigured()) return mockNews.filter(a => a.status === "published").sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  const { data, error } = await getAdmin().from("news").select("*").eq("status","published").order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map(mapNews);
}
```

Pola sama untuk semua getter. Tag & query:

| getter | tag | query |
|---|---|---|
| `getPublishedNews` | `news` | `.eq("status","published")` order `published_at desc` |
| `getNewsBySlug(slug)` | `news` | `.eq("slug",slug).eq("status","published").maybeSingle()` |
| `getPublishedEvents` | `events` | `.eq("is_published",true)` order `starts_at asc` |
| `getEventBySlug(slug)` | `events` | `.eq("slug",slug).eq("is_published",true).maybeSingle()` |
| `getPrograms` | `programs` | `.eq("is_published",true)` |
| `getSchedules` | `schedules` | `.eq("is_active",true)` |
| `getPlaylists` | `playlists` | `.eq("is_published",true).order("sort_order")` |
| `getSiteSettings` | `site-settings` | select semua baris, susun dari key |

`getSiteSettings` (susun dari baris `site_settings`): `tagline`, `contactEmail`, `socialLinks` (array), `about` (`{intro,history,vision,mission[]}`), `streamUrl` (undefined bila `""`). Nilai hilang → default dari `mockSiteSettings`. Error query → throw.

### Step 9 — Restruktur route (route groups) — WAJIB

Root layout saat ini membungkus semua dengan header/footer/player publik; dashboard tidak boleh menampilkannya. Pindah halaman publik ke group `(public)` (URL tidak berubah):

- Pindah: `app/page.tsx`→`app/(public)/page.tsx`; `app/news/`→`app/(public)/news/`; `app/event/`→`app/(public)/event/`; `app/about/`→`app/(public)/about/`; `app/program/`→`app/(public)/program/`; `app/playlist/`→`app/(public)/playlist/`.
- **Tetap di root** `app/`: `layout.tsx`, `globals.css`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, `favicon.ico`.
- `app/(public)/layout.tsx` (baru, server component): `const { streamUrl } = await getSiteSettings();` lalu render `<RadioPlayerProvider streamUrl={streamUrl}><SiteHeader/><main id="main" className="flex-1 pb-32">{children}</main><SiteFooter/><Suspense fallback={<LiveRadioPlayer variant="bar" />}><ActiveProgramBar/></Suspense></RadioPlayerProvider>`.
- `app/layout.tsx` (edit): hapus `RadioPlayerProvider`, `SiteHeader`, `main`, `SiteFooter`, `ActiveProgramBar`/`Suspense`. Sisakan `<html>`/`<body className="flex min-h-full flex-col bg-canvas text-ink-950 antialiased">` + font + metadata + `{children}`.

`RadioPlayerProvider` (edit `components/player/RadioPlayerProvider.tsx`): tambah prop opsional `streamUrl?: string`; default `STREAM_URL` dari `lib/stream.ts`; pakai prop tsb sebagai `src` elemen `<audio>`. Ini mewujudkan "URL streaming dikelola di CMS" (PRD §7.7) dengan env sebagai fallback. Catatan: perubahan stream URL baru terasa setelah reload (state player diinisialisasi saat mount).

### Step 10 — Kerangka dashboard + login

`app/admin/layout.tsx` (server): `const user = await getCurrentUser(); if (!user) redirect("/admin/login");` render `<AdminShell user={user}>{children}</AdminShell>`.

`components/admin/AdminShell.tsx` (client): sidebar desktop (lebar 240–260px, item: Dashboard `/admin`, Program `/admin/programs`, Jadwal `/admin/schedules`, Playlist `/admin/playlists`, News `/admin/news`, Event `/admin/events`, Media `/admin/media`, Pengaturan `/admin/settings`, Pengguna `/admin/users` — item Pengguna hanya tampil bila `user.role === "admin"`); topbar (judul halaman dari `usePathname` map + menu profil + tombol logout); mobile = sidebar jadi drawer (toggle 44×44). Nav aktif via `usePathname`.

`app/admin/login/page.tsx` + `lib/actions/auth.ts`:
- `login(prevState, formData)` (server action): `server.ts` `signInWithPassword({ email, password })`; sukses → `redirect("/admin")`; gagal → return `{ error: "Email atau kata sandi salah" }`.
- `logout()`: `server.ts` `signOut()` → `redirect("/admin/login")`.

### Step 11 — Baca data admin (`lib/admin/data.ts`)

Server-only, TIDAK di-cache (di belakang auth, low traffic). Semua pakai `getAdmin()` + mappers: `listPrograms()`, `getProgram(id)`, `listSchedules()`, `listPlaylists()`, `listNews()`, `getNews(id)`, `listEvents()`, `listMedia()`, `listProfiles()`, `dashboardStats()` (jumlah news published/draft, program aktif, event mendatang `starts_at > now()`, konten terakhir di-update dari `updated_at` tiap tabel).

### Step 12 — Utilitas

- `lib/slugify.ts`: `slugify(input: string): string` — lowercase, trim, ganti non-alphanumeric dengan `-`, collapse dash ganda, buang dash tepi.
- `lib/schedule.ts` tambah `findScheduleConflicts(schedules: ProgramSchedule[]): { dayOfWeek: number; a: ProgramSchedule; b: ProgramSchedule }[]` — deteksi tumpang tindih per hari, sadar lintas tengah malam (reuse `parseTimeToMinutes`). Dipakai untuk **peringatan** (tidak memblokir simpan — PRD §7.3 "cegah ATAU peringatkan").

### Step 13 — Server actions konten

Buat `lib/actions/` (satu file per domain, semua `"use server"`). Pola seragam: zod-parse `formData` → `requireRole("editor")` → `getAdmin()` upsert/delete → `revalidateTag(...)`. Return `{ ok: true } | { ok: false; errors: Record<string,string> }` untuk dipakai form; `redirect` kembali ke list setelah sukses.

Validasi zod per domain (field + aturan):

- **programs** (`programs.ts`): `saveProgram` — `id?`, `name` (min 1), `slug` (wajib, validasi regex `^[a-z0-9-]+$`; form isi otomatis dari `slugify(name)`), `description`, `coverImageUrl`, `hostName`, `isActive` (bool), `isPublished` (bool). `deleteProgram(id)`.
- **schedules** (`schedules.ts`): `saveSchedule` — `id?`, `programId` (wajib), `dayOfWeek` (int 0–6), `startTime`/`endTime` (`HH:MM` regex), `isActive`. `deleteSchedule(id)`.
- **playlists** (`playlists.ts`): `savePlaylist` — `id?`, `title`, `description`, `coverImageUrl`, `externalUrl`, `sortOrder` (int), `isPublished`. `deletePlaylist(id)`.
- **news** (`news.ts`): `saveNews` — `id?`, `title`, `slug`, `excerpt`, `body` (Markdown), `thumbnailUrl`, `coverImageUrl`, `status` (enum `draft|published|unpublished|archived`), `publishedAt`. Saat publish: `author_name = currentUser.displayName`; `published_at` diisi `now()` bila kosong. `deleteNews(id)`. Tag: `revalidateTag("news")`.
- **events** (`events.ts`): `saveEvent` — `id?`, `title`, `slug`, `description`, `posterUrl`, `location`, `startsAt`/`endsAt` (datetime-local → ISO), `registrationUrl`, `status` (enum), `isPublished`. `deleteEvent(id)`. Tag `events`.
- **settings** (`settings.ts`): `saveSettings` — `tagline`, `contactEmail`, `socialLinks[]` (`platform,label,url`), `about.intro/history/vision/mission[]`, `streamUrl`. Upsert tiap key ke `site_settings` (`on conflict (key)`). Tag `site-settings`.
- **media** (`media.ts`): `createMediaAsset({ fileName, storagePath, publicUrl, mimeType, fileSize, altText })` (insert; `uploaded_by = user.id`); `deleteMediaAsset(id)` — cek penggunaan (query `programs.cover_image_url`, `news.thumbnail_url`/`cover_image_url`, `events.poster_url`, `playlists.cover_image_url` yang mengandung `public_url`); return `{ ok:false, usedBy: string[] }` bila dipakai (UI konfirmasi), else delete.
- **users** (`users.ts`, `requireRole("admin")`): `createUser({ email, password, displayName, role })` via `admin.auth.admin.createUser` + `admin.from("profiles").update({ role, display_name })`; `setUserRole(id, role)`; `setUserActive(id, isActive)` (`admin.auth.admin.updateUserById(id, { ban_duration: isActive ? "none" : "876000h" })` + update `profiles.is_active`).

Setiap mutasi juga `revalidateTag("admin")` — dashboard tidak di-cache, jadi cukup tag konten terkait.

### Step 14 — Halaman & form CMS

Gunakan `components/admin/` primitif: `DataTable` (server-rendered: desktop table + mobile card list; kolom title/status/updated/aksi), `ConfirmDelete` (client, `<form action>` + konfirmasi), `FormField` (label selalu tampak + error inline), `ImagePicker` (client modal: tab pilih dari media + tab upload), `MarkdownEditor` (client textarea + preview `react-markdown`), `ScheduleEditor` (client baris per hari + highlight konflik via `findScheduleConflicts`), reuse `StatusBadge`/`EmptyState`/`ErrorState` yang sudah ada. Form = server component + `<form action={saveX}>` + `useActionState` untuk error.

Route + isi:

- `/admin` — `dashboardStats()` + quick actions "Tambah Berita/Program/Upload Media" (design §8.3). Jangan tampilkan metrik pengunjung palsu.
- `/admin/programs` — `DataTable` semua program; `/admin/programs/new` & `/admin/programs/[id]` — form Program + sub-list jadwal program tsb (tambah/hapus slot `saveSchedule`).
- `/admin/schedules` — `ScheduleEditor` global (semua slot, grouping per `dayOfWeek`), peringatan konflik.
- `/admin/playlists` + `new`/`[id]` — `savePlaylist`.
- `/admin/news` + `new`/`[id]` — `saveNews` dengan `MarkdownEditor`, panel publikasi (status/slug/gambar/tanggal).
- `/admin/events` + `new`/`[id]` — `saveEvent`.
- `/admin/media` — grid thumbnail `listMedia()`, upload (validasi `image/jpeg|image/png|image/webp`, ≤ 5 MB), preview, delete via `ConfirmDelete` (peringatan bila `usedBy` non-empty).
- `/admin/settings` — `saveSettings` (About, social links, stream URL, SEO dasar title/description tersimpan di `site_settings` key `seo`).
- `/admin/users` — admin-only (`requireRole("admin")` di dalam page): tabel user + form `createUser` + aksi role/aktif.

Upload media (client): browser client `storage.from("media").upload(path, file)` dengan `path = \`${crypto.randomUUID()}.${ext}\``; lalu `storage.from("media").getPublicUrl(path)` → `createMediaAsset` action.

### Step 15 — Render publik Markdown + slug live

- `components/ui/SafeMarkdown.tsx` (baru): `react-markdown` + `remark-gfm` + `rehype-sanitize` (allowlist default `rehype-sanitize`; gambar via `img` — tambah schema allow `img` dengan `src` http/https; kelas `prose` tidak dipakai, styling via `[&_a]:…` utilities Tailwind sederhana).
- `app/(public)/news/[slug]/page.tsx`: ganti blok `article.body.map(...)` (baris 77–81) dengan `<SafeMarkdown>{article.body}</SafeMarkdown>`.
- `generateStaticParams` di `news/[slug]` dan `event/[slug]` sudah memanggil `getPublishedNews()`/`getPublishedEvents()` → otomatis mengambil slug dari Supabase setelah Step 8; tidak ada perubahan lagi. `sitemap.ts` juga otomatis hidup.

### Step 16 — Dokumentasi & README

`README.md`: tambah seksi konfigurasi Supabase (env), langkah migrasi (`supabase/migrations/0001_init.sql` via SQL editor), seed, dan catatan bahwa `lib/content.ts` kini baca Supabase dengan fallback mock bila env kosong. Jaga dokumen sumber tiga file tetap ada.

## Critical files & anchors

- `PRD_Website_Streaming_Radio_UMMFM.md:359-456` — skema tabel (Step 5 source of truth); `:458-482` route admin; `:207-300` fitur CMS + alur status.
- `design.md:333-411` — layout dashboard, tabel/form/media/schedule editor (Step 14).
- `lib/content.ts` — seam yang ditulis ulang (Step 8); call site tidak berubah.
- `app/layout.tsx` — chrome publik dipindah ke `(public)` (Step 9); perhatikan `ActiveProgramBar` + `Suspense` ikut pindah.
- `components/player/RadioPlayerProvider.tsx` — tambah prop `streamUrl` (Step 9); jangan sentuh state machine yang sudah berfungsi.

## Verification

Prereq: `npm install`; `npm run build` hijau setelah tiap step. Dua jalur:

**Tanpa kredensial (fallback mock)** — pastikan regresi nol sebelum Supabase tersedia:
1. `npm run build` exit 0; `npm run typecheck`; `npm run lint`.
2. `npm run dev` → semua halaman publik 200 dengan konten mock (fallback) dan layout baru tetap benar: `/`, `/news`, `/news/ummfm-rayakan-dies-natalis` (body sekarang Markdown, tetap tampil), `/about`, `/event`, `/program`, `/playlist`.
3. `/admin` → redirect ke `/admin/login`; `/admin/login` tampil; submit login → pesan "Supabase belum dikonfigurasi" (error jelas, bukan crash).

**Dengan kredensial (jalur penerimaan nyata)** — setel `.env.local`, jalankan migrasi + seed:
4. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin` → `307`/`302` (belum login).
5. Login di `/admin/login` dengan akun admin (buat pertama kali via Supabase dashboard → Auth → Users → lalu set `role='admin'` di `profiles`).
6. **Bukti end-to-end CMS → publik**: buat News baru (status `published`, body Markdown berisi heading + tautan) → `redirect` ke `/admin/news` menampilkan baris baru → buka `http://localhost:3000/news/<slug-baru>` → judul/isi tampil **tanpa redeploy**; `getNewsBySlug` 200; slug tak dikenal → 404.
7. **Media**: upload JPG ≤5 MB di `/admin/media` → muncul di grid + `public_url` bisa dibuka; upload `.svg`/`.exe` → ditolak (validasi).
8. **Program + jadwal**: buat program + slot jadwal; dua slot tumpang tindih di hari sama → muncul peringatan konflik; program aktif sesuai jam WIB tampil di On Air Home.
9. **Settings**: ubah `stream_url` + simpan → `lib/content.ts` invalidate → reload Home, `RadioPlayerProvider` menerima URL baru (periksa `audio.src`).
10. **Users (admin)**: buat akun editor → editor login → menu Pengguna tidak tampil; editor buka `/admin/users` → redirect (role guard server-side).
11. **Draft tidak tampil publik**: News `status=draft` → tidak muncul di `/news` dan Home.

## Assumptions & contingencies

- **Kredensial Supabase belum ada saat implementasi**: implementer memakai `.env.local` dari user; bila belum tersedia, semua step yang butuh DB nyata dijalankan dengan fallback mock (site tetap build/render). Nilai `<project-ref>`/key di `.env.example` adalah placeholder — ganti saat key tiba. Jangan blokir pekerjaan menunggu kredensial: bangun semua kode (Step 1–15), jalankan Verification jalur tanpa-kredensial, lalu jalur dengan-kredensial begitu key tersedia.
- **Konten mock jadi seed**: bila user ingin mulai kosong (tanpa seed), lewati `seed.sql` — tidak ada perubahan kode.
- **Render Markdown**: bila `rehype-sanitize` terlalu ketat untuk kebutuhan editor (mis. perlu `<figure>`), cukup perlebar allowlist — jangan ganti library.
- **Role broadcaster** tidak diimplementasi (PRD menandainya opsional); bila dibutuhkan nanti, tambah nilai `role` + kolom check constraint + item sidebar.
