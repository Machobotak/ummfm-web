# Build: Website Publik 93.4 UMMFM (Frontend-first)

## Context

Greenfield project (only `PRD_Website_Streaming_Radio_UMMFM.md` + `design.md` exist). Build the **public website frontend only** — no CMS/dashboard, no Supabase, no backend. All pages per PRD §12 sitemap + design.md §6–7: Home (all sections), News list/detail, About, Event list/detail, Program, Playlist. Audio streaming uses `https://i.klikhost.com/8682/;radio` (confirmed live on current site via `<audio id="radioStream" preload="none"><source .../></audio>`) stored in env. Content rendered from a **typed mock data layer** shaped to PRD §11 so swapping to Supabase later is mechanical. Follow design.md tokens, structure, and states exactly.

## Approach

### Step 1 — Scaffold Next.js app
Run from project root (`D:/project Ambisius/ummfm-prototype`), Node ≥ 18.18 (verify with `node -v` first):

```
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

The two existing `.md` files are not in create-next-app's conflict list, so scaffolding into the current dir succeeds. Result: Next.js 15 + React 19 + TypeScript + Tailwind CSS **v4** (CSS-first, `@import "tailwindcss"` in `app/globals.css`, **no** `tailwind.config.ts`) + ESLint; creates `app/`, `public/`, `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`.

Contingency: if create-next-app refuses the non-empty dir, scaffold into `./.scaffold/` then move all contents up one level (excluding the two `.md` files) and delete `.scaffold/`.

### Step 2 — Environment & stream config
Create `lib/stream.ts`:

```ts
export const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL ?? "";
```

This is the **only** module that reads the stream env; the player imports it. Create two env files:

`.env.local`:
```
NEXT_PUBLIC_STREAM_URL="https://i.klikhost.com/8682/;radio"
```

`.env.example` (committed):
```
# Audio stream SHOUTcast mount. Baca oleh lib/stream.ts (STREAM_URL).
NEXT_PUBLIC_STREAM_URL="https://i.klikhost.com/8682/;radio"
```

`NEXT_PUBLIC_` is required (client-side `<audio>`). `.env.local` is already gitignored by create-next-app. Empty/missing value → player enters `error` state (Step 9).

Create `lib/site.ts`:

```ts
export const SITE_URL = "https://934ummfmradio.com"; // basis sitemap/robots; pindah ke env bila perlu
export const STATION_NAME = "93.4 UMMFM";
export const TAGLINE = "The Real Campus Radio";
```

### Step 3 — Types (`lib/types.ts`)
Define exact interfaces (mirror PRD §11, simplified only where a join is deferred):

```ts
export type ContentStatus = "draft" | "published" | "unpublished" | "archived";

export interface Program {
  id: string; name: string; slug: string; description: string;
  coverImageUrl: string;   // "" → MediaPlaceholder
  hostName: string; isActive: boolean; isPublished: boolean;
  createdAt: string; updatedAt: string;
}

export interface ProgramSchedule {
  id: string; programId: string;
  dayOfWeek: number;       // 0=Sunday … 6=Saturday
  startTime: string;       // "HH:MM" Asia/Jakarta
  endTime: string;         // "HH:MM"; endTime <= startTime ⇒ wraps past midnight
  timezone: "Asia/Jakarta"; isActive: boolean;
}

export interface Playlist {
  id: string; title: string; description: string; coverImageUrl: string;
  externalUrl: string;     // tautan Spotify/link eksternal
  sortOrder: number; isPublished: boolean;
}

export interface NewsArticle {
  id: string; title: string; slug: string; excerpt: string;
  body: string[];          // paragraf (teks polos; rich text menyusul saat CMS)
  thumbnailUrl: string; coverImageUrl: string;
  authorName: string; status: ContentStatus; publishedAt: string; // ISO
}

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface RadioEvent {
  id: string; title: string; slug: string; description: string;
  posterUrl: string; location: string;
  startsAt: string; endsAt: string;          // ISO
  registrationUrl?: string; status: EventStatus; isPublished: boolean;
}

export interface SocialLink { platform: string; label: string; url: string; }

export interface AboutContent {
  intro: string; history: string; vision: string; mission: string[];
}

export interface SiteSettings {
  tagline: string; contactEmail: string;
  socialLinks: SocialLink[]; about: AboutContent;
}
```

`authorName` stands in for PRD's `author_id` join; swap to `author_id` when Supabase/profiles arrive.

### Step 4 — Mock data (`lib/data.ts`)
Export `mockPrograms`, `mockSchedules`, `mockPlaylists`, `mockNews`, `mockEvents`, `mockSiteSettings`. Every image URL (`coverImageUrl`, `thumbnailUrl`, `posterUrl`) is `""` — no external/hotlinked images, no licensing risk; `MediaPlaceholder` (Step 7) renders instead. All content is demo, clearly labeled with a `// DEMO — ganti data Supabase` header comment.

Programs (all `isActive: true`, `isPublished: true`):

| name | slug | hostName | cover | description (1 kalimat) |
|---|---|---|---|---|
| Semesta Pagi | semesta-pagi | Host A | "" | Program pagi penyemangat hari. |
| Kapsul Musik | kapsul-musik | Host B | "" | Kurasi lagu pilihan. |
| Update Kampus | update-kampus | Host C | "" | Info dan kabar kampus UMM. |
| Ngobrol Sore | ngobrol-sore | Host D | "" | Bincang santai sore hari. |
| Kolase Indie | kolase-indie | Host E | "" | Musik indie lokal dan nasional. |
| Gelombang Malam | gelombang-malam | Host F | "" | Teman begadang lintas tengah malam. |

Schedules (all `timezone: "Asia/Jakarta"`, `isActive: true`; `dayOfWeek` 0=Sun…6=Sat):

| program slug | dayOfWeek | startTime | endTime |
|---|---|---|---|
| semesta-pagi | 1–5 (Mon–Fri) | 06:00 | 09:00 |
| kapsul-musik | 1–5 | 09:00 | 12:00 |
| update-kampus | 1–5 | 12:00 | 15:00 |
| ngobrol-sore | 1–5 | 15:00 | 18:00 |
| kolase-indie | 6 (Sat) | 18:00 | 21:00 |
| gelombang-malam | 5 (Fri) | 22:00 | 01:00 |
| gelombang-malam | 6 (Sat) | 22:00 | 01:00 |

One row per day (expand Mon–Fri into 5 rows each); `gelombang-malam` rows exercise the cross-midnight path (`endTime <= startTime`). No program has a Sunday schedule (so Sunday shows "Di luar jadwal siaran" + next program).

Playlists (3, verified Spotify IDs from live site; `coverImageUrl: ""`, `isPublished: true`, `sortOrder` 1–3):

| title | externalUrl |
|---|---|
| Playlist Pilihan #1 | https://open.spotify.com/playlist/5Q9mUp6OA60CbDEqEjpJ07 |
| Playlist Pilihan #2 | https://open.spotify.com/playlist/4OjmZ6nwO3HIWWR970Rb52 |
| Playlist Pilihan #3 | https://open.spotify.com/playlist/6A22UhQ1kGKmcBTefgQjmH |

Link cards only — **no Spotify `<iframe>` embeds** this phase (avoids design.md §6.7 "kotak hitam" failed-embed risk; link is the fallback).

News (5 items; `status: "published"`; `body` = 4 short demo paragraphs each; `authorName` demo):

| title | slug | publishedAt (ISO) | excerpt (1 kalimat) |
|---|---|---|---|
| UMMFM Rayakan Dies Natalis | ummfm-rayakan-dies-natalis | 2026-10-01T08:00:00+07:00 | Sorotan perayaan radio kampus. |
| Rekrutmen Anggota Baru UMMFM | rekrutmen-anggota-baru-ummfm | 2026-09-20T09:00:00+07:00 | Pendaftaran anggota baru dibuka. |
| Workshop Podcast untuk Mahasiswa | workshop-podcast-untuk-mahasiswa | 2026-09-05T10:00:00+07:00 | Belajar produksi podcast bersama. |
| UMMFM Hadir di Festival Kampus | ummfm-hadir-di-festival-kampus | 2026-08-15T13:00:00+07:00 | Liputan festival kampus. |
| Kilas Program Semester Baru | kilas-program-semester-baru | 2026-08-01T07:00:00+07:00 | Jadwal program semester baru. |

Events (4; `isPublished: true`; `posterUrl: ""`):

| title | slug | startsAt / endsAt (ISO) | location | status | registrationUrl |
|---|---|---|---|---|---|
| Open Studio UMMFM | open-studio-ummfm | 2026-10-20T10:00 / 2026-10-20T15:00 +07:00 | Studio UMMFM | upcoming | "" |
| Lomba Siaran Kampus | lomba-siaran-kampus | 2026-10-25T09:00 / 2026-10-25T17:00 +07:00 | Aula UMM | upcoming | "" |
| Live Streaming Kolaborasi | live-streaming-kolaborasi | 2026-10-10T19:00 / 2026-10-10T22:00 +07:00 | Online | ongoing | "" |
| Workshop Penyiar 2026 | workshop-penyiar-2026 | 2026-09-12T09:00 / 2026-09-12T15:00 +07:00 | Studio UMMFM | completed | "" |

`mockSiteSettings`:
- `tagline`: "The Real Campus Radio"
- `contactEmail`: "ummfm@gmail.com"
- `socialLinks` (only **verified** URLs): Instagram `https://www.instagram.com/ummfm_malang`, TikTok `https://www.tiktok.com/@ummfm_malang`, Spotify `https://open.spotify.com/playlist/5Q9mUp6OA60CbDEqEjpJ07`. No YouTube (unverified URL — design.md §6.8 forbids unverified contact).
- `about`: intro/history/vision = 1–2 demo sentences each; `mission` = 3 demo bullet strings.

### Step 5 — Schedule logic (`lib/schedule.ts`)
Server-side active/next program from Jakarta wall-clock.

```ts
export const STATION_TZ = "Asia/Jakarta";
export function parseTimeToMinutes(t: string): number;          // "HH:MM" → h*60+m
export function getJakartaParts(now: Date): { weekday: number; minutes: number };
  // weekday 0=Sunday…6=Saturday; minutes = menit sejak tengah malam, keduanya di Asia/Jakarta
  // via new Intl.DateTimeFormat("en-US",{timeZone:STATION_TZ,weekday:"short",hour:"numeric",minute:"numeric",hour12:false}).formatToParts(now)
export function isScheduleActive(s: ProgramSchedule, weekday: number, minutes: number): boolean;
export function getActiveProgram(programs: Program[], schedules: ProgramSchedule[], now: Date):
  { program: Program; schedule: ProgramSchedule } | null;
export function getUpcomingPrograms(programs: Program[], schedules: ProgramSchedule[], now: Date, limit: number):
  { program: Program; schedule: ProgramSchedule; startsAt: Date }[];
```

`isScheduleActive` (cross-midnight correct):
```
S=start, E=end (minutes), W=dayOfWeek
if E > S: return weekday === W && minutes >= S && minutes < E
// E <= S ⇒ lintas tengah malam
if weekday === W: return minutes >= S
return weekday === (W+1) % 7 && minutes < E
```

`getActiveProgram`: filter schedules where `schedule.isActive && program.isActive && program.isPublished`; keep those with `isScheduleActive(...)` true; tie-break by earliest `startTime`; return `{program, schedule}` or `null`.

`getUpcomingPrograms`: for each active schedule, compute `startsAt` = earliest Jakarta `Date` at-or-after `now` whose weekday equals `dayOfWeek` (today if today matches and `now` < startTime, else next matching weekday); sort ascending by `startsAt`; return first `limit` mapped to `{program, schedule, startsAt}`. Compose a Jakarta `Date` via `new Date(`${YYYY-MM-DD}T${startTime}:00+07:00`)`.

### Step 6 — Content access layer (`lib/content.ts`)
Async getters returning mock data (shaped to become Supabase queries later — no code change at call sites):

```ts
export async function getPublishedNews(): Promise<NewsArticle[]>;            // filter status==="published", sort publishedAt desc
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null>;
export async function getPublishedEvents(): Promise<RadioEvent[]>;          // sort startsAt asc
export async function getEventBySlug(slug: string): Promise<RadioEvent | null>;
export async function getPrograms(): Promise<Program[]>;                    // isPublished
export async function getSchedules(): Promise<ProgramSchedule[]>;           // isActive
export async function getPlaylists(): Promise<Playlist[]>;                  // isPublished, sort sortOrder asc
export async function getSiteSettings(): Promise<SiteSettings>;
```

All return `mock*` arrays/objects from `lib/data.ts`. Pages (server components) call these; `getActiveProgram`/`getUpcomingPrograms` are invoked in the page with `new Date()` (server request time). `getNewsBySlug`/`getEventBySlug` return `null` when not found → page calls `notFound()`.

### Step 7 — UI primitives (`components/ui/`)
- `Container.tsx` — `({ className?, children })` → `<div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">`.
- `MediaPlaceholder.tsx` — `({ ratio: "16/9" | "4/5" | "1/1" | "3/4"; label?: string; className? })` → `<div>` with `aspect-[ratio]` (map via a `ratioClass` object), `bg-brand-100 text-ink-500`, centered label (default "93.4 UMMFM"), `rounded-card`. Design-compliant consistent placeholder (design.md §10).
- `CardImage.tsx` — `({ src, alt, ratio, className?, sizes? })`: if `src` is `""` → `MediaPlaceholder`; else Next `<Image fill className="object-cover" onError={/* swap to placeholder */}>` inside a `relative aspect-[ratio] overflow-hidden rounded-card` wrapper. `onError` sets local `failed` state → renders `MediaPlaceholder`. No `next.config.ts` `remotePatterns` needed now (mock srcs empty); add Supabase storage domain later.
- `SectionHeading.tsx` — `({ title, description?, href?, linkLabel? })` → H2 + optional "Lihat Semua" `<Link>`.
- `EmptyState.tsx` — `({ title, description?, action? })` → centered message + optional CTA.
- `ErrorState.tsx` — `({ message, onRetry? })` → message + "Coba lagi" button when `onRetry` given.
- `LoadingSkeleton.tsx` — `({ className? })` → `animate-pulse bg-brand-100` block (used as `loading.tsx`/Suspense fallback; with mock data it won't fire in normal flow).
- `OnAirBadge.tsx` — red dot (`bg-live animate-pulse`) + **text** "ON AIR" (never color-only, per accessibility).
- `StatusBadge.tsx` — `({ status: EventStatus | ContentStatus })` → pill (`rounded-pill`) with text label and mapped tone: `upcoming`→brand, `ongoing`→live, `completed`→ink-500, `cancelled`→danger, `draft`→warning, `published`→success, `unpublished`→ink-500, `archived`→ink-500.

### Step 8 — Player (persistent, single stream, no autoplay)
`components/player/RadioPlayerProvider.tsx` — `"use client"` context:

```ts
type PlayerStatus = "idle" | "connecting" | "playing" | "paused" | "error";
interface PlayerContextValue { status: PlayerStatus; play(): void; pause(): void; toggle(): void; retry(): void; }
export function RadioPlayerProvider({ children }): JSX.Element;
export function useRadioPlayer(): PlayerContextValue;
```

Implementation: render one hidden `<audio ref={audioRef} src={STREAM_URL} preload="none" />` inside the provider (only when `STREAM_URL` non-empty; if empty, skip src). Attach React handlers:
- `onPlaying` → `"playing"`
- `onPause` → `"paused"`
- `onWaiting` / `onLoadStart` / `onStalled` → `"connecting"`
- `onError` → `"error"`

`play()` = `setStatus("connecting")` then `audioRef.current?.play().catch(() => setStatus("error"))`. `pause()` = `audioRef.current?.pause()`. `retry()` = `audioRef.current?.load(); audioRef.current?.play().catch(...)`. `toggle()` = if status is `"playing"`/`"connecting"`/`"paused"` → `pause()`, else `play()`. **No autoplay**: nothing calls `play()` on mount. Single `<audio>` element ⇒ no double stream. Provider is mounted once in root layout so state persists across client navigation.

`components/player/LiveRadioPlayer.tsx` — `"use client"`, consumes `useRadioPlayer()`, prop `variant: "hero" | "bar"` plus `activeProgram?: Program & { timeRange: string }` (passed from the page; schedule info — **separate** from connection status per design.md §6.2 "jangan menganggap live hanya karena jadwal aktif").
- Status copy (text, not color-only): idle "Siap mendengarkan", connecting "Menghubungkan…", playing "Sedang diputar", paused "Dijeda", error "Siaran belum dapat diakses".
- `hero` variant: two-column card (info: `OnAirBadge` shown **only when `status === "playing"`**, program name/host/timeRange; controls: ≥44×44 px play/pause button, status text, "Coba lagi" button when error). `bar` variant: fixed bottom bar (play/pause button + status text + program name, min 44px touch target).

### Step 9 — Site chrome (`components/site/`)
- `SiteHeader.tsx` — `"use client"`. White bg, subtle bottom border, `Container`. Left: wordmark text "93.4 UMMFM" (no external logo asset). Right (desktop): nav `Home` `/`, `News` `/news`, `About` `/about`, `Event` `/event`. Active link via `usePathname()` → `text-brand-700` + underline. Mobile (right): hamburger toggling `MobileNavigation` drawer. Sticky top.
- `MobileNavigation.tsx` — `"use client"` drawer; same 4 links, closes on link click; 200–250 ms transition, respects `prefers-reduced-motion`.
- `SiteFooter.tsx` — dark/`ink-950` bg, `Container`: wordmark + tagline, nav (Home/News/About/Event/Program/Playlist), contact `ummfm@gmail.com`, social links from `getSiteSettings().socialLinks` (Instagram, TikTok, Spotify), copyright line.

### Step 10 — Root layout (`app/layout.tsx`)
- Font: `Plus_Jakarta_Sans` via `next/font/google` with `variable: "--font-jakarta"`; apply on `<html>`/`<body>`. (Contingency: if font download fails at build, drop next/font and use system stack.)
- Metadata: `title: { default: "93.4 UMMFM — The Real Campus Radio", template: "%s | 93.4 UMMFM" }`, `description`, `openGraph: { type: "website", title, description, url: SITE_URL }`.
- Structure: `<body className="bg-canvas text-ink-950 antialiased">` → `<RadioPlayerProvider>` → `<SiteHeader/>` + `{children}` + `<SiteFooter/>` + `<LiveRadioPlayer variant="bar" />` (fixed bottom, persistent across routes).

### Step 11 — Design tokens (`app/globals.css`)
Replace default content. Keep `@import "tailwindcss";` then add `@theme { … }` mapping design.md §14:

```css
@theme {
  --color-brand-700: #1746c8; --color-brand-600: #2459e8;
  --color-brand-100: #eaf1ff; --color-brand-50: #f5f8ff;
  --color-ink-950: #101828; --color-ink-700: #344054; --color-ink-500: #667085;
  --color-surface: #ffffff; --color-canvas: #f7f8fa; --color-border: #e4e7ec;
  --color-live: #e62e35; --color-success: #16803d;
  --color-warning: #b54708; --color-danger: #d92d20;
  --radius-card: 20px; --radius-control: 12px; --radius-pill: 999px;
  --shadow-card: 0 4px 16px rgba(16, 24, 40, 0.05);
  --shadow-overlay: 0 12px 32px rgba(16, 24, 40, 0.12);
  --font-sans: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
}
@layer base {
  body { @apply bg-canvas text-ink-950 antialiased; }
}
```

This yields utilities `bg-brand-700`, `text-ink-500`, `rounded-card`, `shadow-card`, `border-border`, etc. Add a base rule honoring `prefers-reduced-motion` (reduce transitions/animations). Delete leftover create-next-app demo styles (`app/page.tsx` demo content will be replaced in Step 12).

### Step 12 — Home page (`app/page.tsx` + `components/home/`, `components/content/`)
`app/page.tsx` is an async server component: `await` `getPrograms/schedules/news/events/playlists/siteSettings`; compute `active = getActiveProgram(...)` and `upcoming = getUpcomingPrograms(..., 3)`; render sections in design.md §6 order. Create these components:

`components/home/`:
- `Hero.tsx` — brand-50 bg, headline `TAGLINE`, subheadline, CTA "Dengarkan Live" (`<a href="#live">`), secondary "Lihat Program" (`/program`). No oversized full-viewport headline, no ornament overload (design.md §6.1).
- `OnAirSection.tsx` — `id="live"`; `LiveRadioPlayer variant="hero"` (pass `active` program + formatted timeRange "HH:MM–HH:MM WIB") beside an on-air program card (cover 4:5, name, host, timeRange). If `active` is null → text "Di luar jadwal siaran" + next program from `upcoming[0]`.
- `ProgramsSection.tsx` — heading "Program & Jadwal" + link `/program`; grid of `ProgramCard` (up to 4) + compact `ScheduleList` for today.
- `PlaylistsSection.tsx` — heading "Playlist Pilihan" + link `/playlist`; grid 3 `PlaylistCard` (desktop 3-col, tablet 2-col, mobile 1-col).
- `NewsSection.tsx` — heading "Berita Terbaru" + link `/news`; `FeaturedNewsCard` (first, larger) + grid of `NewsCard` (rest). Empty list → `EmptyState` ("Belum ada berita").
- `EventsSection.tsx` — heading "Event" + link `/event`; grid of `EventCard` for `upcoming`/`ongoing`. Empty → `EmptyState`.
- `SocialSection.tsx` — heading "Media Sosial"; link cards (label + platform) from `socialLinks` (no embeds).

`components/content/`:
- `ProgramCard.tsx` — `CardImage ratio="4/5"`, name (H3), `hostName`, description clamp.
- `ScheduleList.tsx` — list of `{ program, schedule }` rows "HH:MM–HH:MM WIB — name"; today's weekday heading.
- `PlaylistCard.tsx` — `CardImage ratio="1/1"`, title, description clamp, "Buka playlist" link (`externalUrl`, `target="_blank" rel="noopener noreferrer"`).
- `NewsCard.tsx` — `CardImage ratio="16/9"`, title (2–3 line clamp), date (ink-500), excerpt clamp; whole card links `/news/[slug]`.
- `FeaturedNewsCard.tsx` — larger `NewsCard` variant (16:9, larger title).
- `EventCard.tsx` — `CardImage ratio="3/4"`, title, date (formatted `id-ID`), location, `StatusBadge`; links `/event/[slug]`.

Formatting helpers: `lib/format.ts` — `formatDate(iso, opts?)` via `Intl.DateTimeFormat("id-ID", { timeZone: STATION_TZ })`, `formatTimeRange(startTime, endTime)` → "HH:MM–HH:MM WIB".

### Step 13 — Sub pages + SEO
Each page is an async server component with `export const metadata`/`generateMetadata`. Reuse `Container`, `SectionHeading`, cards, `EmptyState`.

- `app/news/page.tsx` — title "News", intro; featured + grid; empty → `EmptyState`.
- `app/news/[slug]/page.tsx` — `generateStaticParams()` returns mock news slugs; `generateMetadata({params})`; body: breadcrumb, H1, date + author, `CardImage ratio="16/9"` (cover), paragraphs (`body.map(<p>)`) in `max-w-[720px]` prose column; `notFound()` if `getNewsBySlug` null.
- `app/about/page.tsx` — editorial layout (design.md §7.3, not a card wall): intro, history, vision, mission list, contact + social links.
- `app/event/page.tsx` — title "Event"; upcoming/ongoing grid, then "Arsip" (completed/cancelled); empty → `EmptyState`.
- `app/event/[slug]/page.tsx` — `generateStaticParams` + `generateMetadata`; `CardImage ratio="3/4"` poster, `StatusBadge`, date/time, location, description, "Daftar" CTA only when `registrationUrl` non-empty; `notFound()` if null.
- `app/program/page.tsx` — all `ProgramCard`s grid + full weekly `ScheduleList` grouped by day.
- `app/playlist/page.tsx` — all `PlaylistCard`s grid.

SEO (PRD §9.4):
- `app/robots.ts` — allow all + `sitemap: ${SITE_URL}/sitemap.xml`.
- `app/sitemap.ts` — routes `/`, `/news`, `/about`, `/event`, `/program`, `/playlist` + each mock news/event slug `/${type}/${slug}` with `lastModified` from `publishedAt`/`startsAt`.

## Critical files & anchors
- `design.md:56-127` — color/type/radius tokens (Step 11 source of truth).
- `design.md:180-296` — Homepage section order + player states (Step 12, Step 8).
- `PRD_Website_Streaming_Radio_UMMFM.md:359-456` — data schema (Step 3–4).
- `PRD_Website_Streaming_Radio_UMMFM.md:126-137` — player behavior: no autoplay, no double stream, single config source (Step 8).
- `lib/schedule.ts` — cross-midnight + Asia/Jakarta logic; the only time-sensitive code (Step 5).

## Verification

Prereqs: `npm install` completed (from scaffold), `.env.local` present (Step 2), run from project root.

1. **Build/typecheck** — `npm run build` exits 0 (typecheck + lint + production build).
2. **Run** — `npm run dev`, open `http://localhost:3000`.
3. **Player state machine (behavior proof)** — on Home, player shows "Siap mendengarkan" and **no audio autoplay** (Network tab shows no stream request before click). Click play → "Menghubungkan…". Because the SHOUTcast mount currently returns `ICY 401 Service Unavailable` (source off-air; verified via `curl --http0.9`), expect transition to "Siaran belum dapat diakses" + a "Coba lagi" button — this **is** the expected outcome and proves error handling (when the encoder is live, expect "Sedang diputar"). Verify only one `<audio>` element exists in DOM and retry re-attempts.
4. **Persistence** — click play (to error/connecting), navigate `/news` → the bottom bar still reflects the same status; no second stream started.
5. **Pages** — visit each and confirm visible text: `/` (hero "The Real Campus Radio", sections Program & Jadwal, Playlist Pilihan, Berita Terbaru, Event, Media Sosial, footer), `/news`, `/news/ummfm-rayakan-dies-natalis` (breadcrumb + title + date + author + paragraphs), `/about`, `/event` (StatusBadge text "Mendatang"/"Berlangsung"/"Selesai"), `/event/open-studio-ummfm`, `/program` (weekly schedule grouped by day), `/playlist`. `/news/nonexistent` → 404.
6. **Empty state** — temporarily set `mockNews = []` in `lib/data.ts`, reload `/news` → "Belum ada berita" `EmptyState` renders; revert. (Repeat once for `mockEvents` on `/event`.)
7. **Responsive + a11y** — at ~375 px width: hamburger opens drawer, nav links tappable, cards single-column, play button ≥44 px; at ≥1024 px: 3-col grids, horizontal player. Tab through header/player: visible focus ring; player status is text (not color-only).

## Assumptions & contingencies
- **Stream URL** is a SHOUTcast v1.9.8 mount and is currently **off-air** (returns `ICY 401 Service Unavailable`); the player treats this as `error` + retry, which is correct radio behavior, not a defect. If the user later provides a different mount/URL, change only `.env.local`/`.env.example`.
- **Tailwind v4** (create-next-app default): tokens live in `@theme` in `globals.css`, not `tailwind.config.ts`. If scaffold produces v3, move tokens into `tailwind.config.ts` `theme.extend` instead (same values).
- **Font** `Plus_Jakarta_Sans` requires network at build; if it fails, fall back to `ui-sans-serif, system-ui` (drop `next/font`).
- **YouTube/other social URLs unverified** — only Instagram, TikTok, Spotify (playlist), and email are included; add the rest when real URLs are provided (design.md §6.8 forbids unverified contact).
- **No image assets in this phase** — all mock image URLs are `""` and render `MediaPlaceholder`; real cover/thumbnail/poster come from Supabase Storage later (add `next.config.ts` `images.remotePatterns` for the storage domain when that lands).
- **Mock data swap path** — `lib/content.ts` getters are the single seam; replacing their bodies with Supabase queries is the only required change to go live, and page/component contracts are unchanged.
