-- Seed idempotent. Nilai persis lib/data.ts (sumber kebenaran nilai).
-- Jalankan setelah 0001_init.sql. Lewati file ini bila ingin mulai kosong.

insert into public.programs
  (name, slug, description, cover_image_url, host_name, is_active, is_published, created_at, updated_at)
values
  ('Semesta Pagi',    'semesta-pagi',    'Program pagi penyemangat hari.',      '', 'Host A', true, true, '2026-08-01T08:00:00+07:00', '2026-10-01T08:00:00+07:00'),
  ('Kapsul Musik',    'kapsul-musik',    'Kurasi lagu pilihan.',                '', 'Host B', true, true, '2026-08-01T08:00:00+07:00', '2026-10-01T08:00:00+07:00'),
  ('Update Kampus',   'update-kampus',   'Info dan kabar kampus UMM.',          '', 'Host C', true, true, '2026-08-01T08:00:00+07:00', '2026-10-01T08:00:00+07:00'),
  ('Ngobrol Sore',    'ngobrol-sore',    'Bincang santai sore hari.',           '', 'Host D', true, true, '2026-08-01T08:00:00+07:00', '2026-10-01T08:00:00+07:00'),
  ('Kolase Indie',    'kolase-indie',    'Musik indie lokal dan nasional.',     '', 'Host E', true, true, '2026-08-01T08:00:00+07:00', '2026-10-01T08:00:00+07:00'),
  ('Gelombang Malam', 'gelombang-malam', 'Teman begadang lintas tengah malam.', '', 'Host F', true, true, '2026-08-01T08:00:00+07:00', '2026-10-01T08:00:00+07:00')
on conflict (slug) do nothing;

-- 23 slot: 4 program Senin–Jumat, Kolase Indie Sabtu, Gelombang Malam Jumat+Sabtu
-- (22:00–01:00 → lintas tengah malam).
with slots(slug, start_time, end_time, days) as (
  values
    ('semesta-pagi',    time '06:00', time '09:00', array[1,2,3,4,5]),
    ('kapsul-musik',    time '09:00', time '12:00', array[1,2,3,4,5]),
    ('update-kampus',   time '12:00', time '15:00', array[1,2,3,4,5]),
    ('ngobrol-sore',    time '15:00', time '18:00', array[1,2,3,4,5]),
    ('kolase-indie',    time '18:00', time '21:00', array[6]),
    ('gelombang-malam', time '22:00', time '01:00', array[5,6])
)
insert into public.program_schedules
  (program_id, day_of_week, start_time, end_time, timezone, is_active)
select p.id, day, slots.start_time, slots.end_time, 'Asia/Jakarta', true
from slots
join public.programs p on p.slug = slots.slug
cross join lateral unnest(slots.days) as day
where not exists (
  select 1 from public.program_schedules existing
  where existing.program_id = p.id
    and existing.day_of_week = day
    and existing.start_time = slots.start_time
);

insert into public.playlists
  (title, description, cover_image_url, external_url, sort_order, is_published)
select title, description, '', external_url, sort_order, true
from (values
  ('Playlist Pilihan #1', 'Kompilasi lagu favorit penyiar UMMFM.',              'https://open.spotify.com/playlist/5Q9mUp6OA60CbDEqEjpJ07', 1),
  ('Playlist Pilihan #2', 'Rekomendasi rilisan terbaru untuk menemani aktivitas.', 'https://open.spotify.com/playlist/4OjmZ6nwO3HIWWR970Rb52', 2),
  ('Playlist Pilihan #3', 'Pilihan musik indie lokal dan nasional.',             'https://open.spotify.com/playlist/6A22UhQ1kGKmcBTefgQjmH', 3)
) as seed(title, description, external_url, sort_order)
where not exists (select 1 from public.playlists p where p.title = seed.title);

insert into public.news
  (title, slug, excerpt, body, thumbnail_url, cover_image_url, author_id, author_name, status, published_at)
values
  ('UMMFM Rayakan Dies Natalis', 'ummfm-rayakan-dies-natalis', 'Sorotan perayaan radio kampus.',
   E'93.4 UMMFM merayakan dies natalis bersama mahasiswa dan alumni di Studio UMMFM.\n\nRangkaian acara diisi sesi siaran bersama, panggung musik akustik, dan temu alumni penyiar.\n\nPengunjung dapat mengikuti tur studio untuk melihat proses siaran secara langsung.\n\nRangkaian perayaan berlanjut dengan program spesial sepanjang pekan di kanal siaran UMMFM.',
   '', '', null, 'Tim Redaksi UMMFM', 'published', '2026-10-01T08:00:00+07:00'),
  ('Rekrutmen Anggota Baru UMMFM', 'rekrutmen-anggota-baru-ummfm', 'Pendaftaran anggota baru dibuka.',
   E'UMMFM membuka pendaftaran anggota baru untuk divisi penyiaran, produksi, dan media digital.\n\nPendaftaran terbuka bagi mahasiswa aktif yang tertarik pada dunia radio dan konten audio.\n\nTahapan seleksi meliputi wawancara minat dan latihan siaran bersama penyiar senior.\n\nInformasi jadwal dan persyaratan diperbarui melalui kanal resmi UMMFM.',
   '', '', null, 'Tim Redaksi UMMFM', 'published', '2026-09-20T09:00:00+07:00'),
  ('Workshop Podcast untuk Mahasiswa', 'workshop-podcast-untuk-mahasiswa', 'Belajar produksi podcast bersama.',
   E'Workshop podcast menghadirkan materi dasar penulisan naskah hingga proses mastering audio.\n\nPeserta berlatih merekam dan mengedit episode pendek langsung di studio UMMFM.\n\nMateri ditekankan pada kualitas suara, struktur cerita, dan konsistensi jadwal rilis.\n\nWorkshop berlanjut dengan sesi pendampingan produksi podcast skala kampus.',
   '', '', null, 'Tim Redaksi UMMFM', 'published', '2026-09-05T10:00:00+07:00'),
  ('UMMFM Hadir di Festival Kampus', 'ummfm-hadir-di-festival-kampus', 'Liputan festival kampus.',
   E'UMMFM membuka panggung siaran langsung dari area festival kampus Universitas Muhammadiyah Malang.\n\nPengunjung dapat menyampaikan dedikasi lagu dan pesan langsung ke kanal siaran.\n\nTim liputan merekam wawancara singkat dengan pengunjung dan penampil.\n\nRekaman liputan diolah menjadi konten audio yang tayang pada pekan berikutnya.',
   '', '', null, 'Tim Redaksi UMMFM', 'published', '2026-08-15T13:00:00+07:00'),
  ('Kilas Program Semester Baru', 'kilas-program-semester-baru', 'Jadwal program semester baru.',
   E'Semester baru membawa penyegaran pada sejumlah program rutin UMMFM.\n\nProgram pagi kini menghadirkan segmen kabar kampus dengan narasumber dari unit mahasiswa.\n\nProgram malam menambah slot musik lintas tengah malam untuk menemani pendengar.\n\nSusunan jadwal terbaru dapat dilihat pada halaman program.',
   '', '', null, 'Tim Redaksi UMMFM', 'published', '2026-08-01T07:00:00+07:00')
on conflict (slug) do nothing;

insert into public.events
  (title, slug, description, poster_url, location, starts_at, ends_at, registration_url, status, is_published)
values
  ('Open Studio UMMFM', 'open-studio-ummfm',
   'Sesi terbuka untuk melihat langsung proses siaran di Studio UMMFM, termasuk tur ruang kontrol dan pengenalan perangkat penyiaran.',
   '', 'Studio UMMFM', '2026-10-20T10:00:00+07:00', '2026-10-20T15:00:00+07:00', '', 'upcoming', true),
  ('Lomba Siaran Kampus', 'lomba-siaran-kampus',
   'Kompetisi siaran untuk mahasiswa dengan penilaian pada penyampaian, pemilihan musik, dan interaksi pendengar.',
   '', 'Aula UMM', '2026-10-25T09:00:00+07:00', '2026-10-25T17:00:00+07:00', '', 'upcoming', true),
  ('Live Streaming Kolaborasi', 'live-streaming-kolaborasi',
   'Siaran kolaborasi lintas komunitas kampus yang disiarkan langsung dan disertai sesi tanya jawab.',
   '', 'Online', '2026-10-10T19:00:00+07:00', '2026-10-10T22:00:00+07:00', '', 'ongoing', true),
  ('Workshop Penyiar 2026', 'workshop-penyiar-2026',
   'Pelatihan dasar penyiaran bagi anggota baru: teknik vokal, penyusunan rundown, dan latihan siaran.',
   '', 'Studio UMMFM', '2026-09-12T09:00:00+07:00', '2026-09-12T15:00:00+07:00', '', 'completed', true)
on conflict (slug) do nothing;

insert into public.site_settings (key, value) values
  ('tagline', '"The Real Campus Radio"'::jsonb),
  ('contact_email', '"ummfm@gmail.com"'::jsonb),
  ('social_links', '[
    {"platform":"Instagram","label":"@ummfm_malang","url":"https://www.instagram.com/ummfm_malang"},
    {"platform":"TikTok","label":"@ummfm_malang","url":"https://www.tiktok.com/@ummfm_malang"},
    {"platform":"Spotify","label":"Playlist UMMFM","url":"https://open.spotify.com/playlist/5Q9mUp6OA60CbDEqEjpJ07"}
  ]'::jsonb),
  ('about', '{
    "intro": "93.4 UMMFM adalah radio kampus Universitas Muhammadiyah Malang yang mengudara untuk mahasiswa dan warga Malang.",
    "history": "Sejak berdiri, UMMFM tumbuh dari ruang siaran sederhana menjadi rumah produksi audio kampus dengan program harian, liputan, dan konten digital.",
    "vision": "Menjadi radio kampus yang dekat dengan mahasiswa serta menjadi ruang belajar penyiaran dan produksi konten audio.",
    "mission": [
      "Menyediakan siaran yang informatif, menghibur, dan relevan bagi mahasiswa.",
      "Menjadi ruang belajar penyiaran, produksi musik, dan jurnalistik audio.",
      "Mendukung kreativitas dan karya mahasiswa melalui kanal siaran dan konten digital."
    ]
  }'::jsonb),
  ('stream_url', '""'::jsonb)
on conflict (key) do nothing;
