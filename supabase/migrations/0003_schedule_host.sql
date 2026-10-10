-- Penyiar pindah dari program ke slot jadwal: satu program bisa dibawakan
-- penyiar berbeda per slot, dan satu slot boleh menyebut beberapa nama
-- sekaligus. Jalankan setelah 0001_init.sql lewat SQL Editor Supabase.
-- Idempotent supaya aman dijalankan ulang.

alter table public.program_schedules
  add column if not exists host_name text not null default '';

-- Salin penyiar program lama ke slotnya, lalu buang kolomnya. Keduanya hanya
-- jalan selama kolom programs.host_name masih ada, jadi menjalankan ulang file
-- ini tidak gagal.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'programs'
      and column_name = 'host_name'
  ) then
    update public.program_schedules as s
    set host_name = p.host_name
    from public.programs as p
    where s.program_id = p.id
      and s.host_name = ''
      and p.host_name <> '';

    execute 'alter table public.programs drop column host_name';
  end if;
end $$;
