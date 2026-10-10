-- Live chat pendengar (menu CMS "Chat"). Jalankan setelah 0001_init.sql lewat
-- SQL Editor Supabase. Tidak ada policy insert untuk anon: satu-satunya jalur
-- tulis adalah server action (service role) yang memvalidasi panjang pesan dan
-- memberi jeda kirim per IP. Idempotent supaya aman dijalankan ulang.
create table if not exists public.live_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  body text not null check (char_length(body) between 1 and 300),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists live_messages_created_at_idx
  on public.live_messages (created_at desc);

-- Jeda kirim per IP: hanya hash IP yang disimpan, dan tabel ini tanpa policy
-- sama sekali supaya hanya service role yang bisa membacanya.
create table if not exists public.live_chat_limits (
  ip_hash text primary key,
  posted_at timestamptz not null default now()
);

alter table public.live_messages  enable row level security;
alter table public.live_chat_limits enable row level security;

create policy "public read visible messages" on public.live_messages
  for select using (is_hidden = false);
create policy "staff manage messages" on public.live_messages
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
