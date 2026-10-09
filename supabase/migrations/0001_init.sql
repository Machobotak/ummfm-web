-- Skema CMS 93.4 UMMFM (Supabase Postgres). Jalankan sekali lewat SQL Editor
-- Supabase atau `supabase db push`. Urutan penting: profiles + is_staff() dulu,
-- lalu tabel konten, lalu RLS + storage.
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
