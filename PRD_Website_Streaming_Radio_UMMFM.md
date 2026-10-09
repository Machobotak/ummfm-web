# Product Requirements Document (PRD)
## Website Streaming Radio 93.4 UMMFM

**Versi:** 1.0  
**Tanggal:** 9 Oktober 2026  
**Status:** Draft untuk validasi kebutuhan  
**Produk:** Website publik dan Content Management System (CMS) 93.4 UMMFM  
**Website saat ini:** https://934ummfmradio.com/

---

## 1. Ringkasan Produk

Website baru 93.4 UMMFM akan dibangun ulang menggunakan Next.js untuk menghadirkan pengalaman mendengarkan radio yang lebih nyaman sekaligus memudahkan anggota UMMFM memperbarui konten tanpa mengedit kode.

Produk terdiri dari dua area:

1. **Website publik** — tempat pendengar memutar siaran radio, melihat program yang sedang dan akan tayang, menjelajahi playlist, membaca berita, mengenal UMMFM, serta melihat event.
2. **Dashboard CMS** — panel internal bagi anggota radio untuk mengunggah gambar, mengelola program dan jadwal, memperbarui playlist, menerbitkan berita, mengelola event, serta mengatur konten yang tampil di halaman utama.

Prinsip utama produk: **konten dikelola melalui dashboard, sedangkan tampilan website diperbarui berdasarkan data yang dipublikasikan.**

## 2. Latar Belakang dan Masalah

Website saat ini sudah menampilkan identitas visual UMMFM, pemutar siaran, kartu program/playlist, berita, konten media sosial, serta informasi organisasi. Namun, kebutuhan pengelolaan konten yang rutin membutuhkan CMS yang mudah digunakan oleh anggota radio.

Masalah yang ingin diselesaikan:

- Mengganti gambar program atau banner seharusnya cukup dengan mengunggah gambar dan memilih program terkait.
- Program yang sedang tayang dan visual program perlu berubah sesuai jadwal yang dikelola.
- Anggota radio perlu bisa memperbarui berita, event, playlist, dan informasi tanpa meminta developer mengubah kode.
- Konten yang sudah tidak relevan perlu bisa diarsipkan tanpa menghapus data secara permanen.
- Website perlu tetap nyaman digunakan di ponsel maupun desktop.
- Pemutar radio perlu mudah ditemukan dan status siaran perlu jelas.

## 3. Tujuan Produk

### 3.1 Tujuan utama

- Menyediakan streaming radio UMMFM dari website.
- Menampilkan program yang sedang tayang dan jadwal berikutnya berdasarkan jadwal yang dikelola.
- Memungkinkan anggota yang berwenang mengelola konten melalui CMS.
- Memudahkan pergantian gambar program berdasarkan waktu/jadwal tanpa perubahan kode.
- Menyediakan halaman News, About, dan Event yang dapat diperbarui secara mandiri.
- Mempertahankan identitas visual UMMFM sambil memperbaiki responsivitas, aksesibilitas, dan konsistensi UI.

### 3.2 Indikator keberhasilan

- Editor dapat membuat atau memperbarui konten tanpa menyentuh kode.
- Perubahan konten yang dipublikasikan tampil di website tanpa perlu deployment ulang.
- Gambar program dan informasi “On Air” mengikuti jadwal yang aktif.
- Pemutar radio berfungsi pada browser desktop dan mobile yang didukung, selama sumber streaming tersedia.
- Semua halaman inti memiliki tampilan responsif dan status kosong/error yang jelas.

## 4. Target Pengguna dan Hak Akses

### 4.1 Pendengar (publik)

Tidak perlu login. Dapat mendengarkan radio, melihat program, playlist, berita, profil, dan event.

### 4.2 Editor Konten

Anggota UMMFM yang ditunjuk untuk mengelola konten. Dapat mengunggah gambar dan membuat, mengedit, menerbitkan, atau mengarsipkan konten sesuai izin.

### 4.3 Admin

Mengelola seluruh konten, akun pengguna CMS, peran/hak akses, pengaturan website, serta konfigurasi sumber streaming.

### 4.4 Opsional: Pengelola Siaran

Jika dibutuhkan, peran ini dapat dibatasi untuk mengelola program dan jadwal siaran tanpa hak mengatur akun atau konfigurasi website.

**Aturan akses:** dashboard hanya dapat diakses pengguna terautentikasi. Hak akses wajib diperiksa di sisi server/database, bukan hanya dengan menyembunyikan tombol pada UI.

## 5. Ruang Lingkup

### 5.1 MVP — wajib tersedia

- Website publik: Home, News, About, Event, Program/Playlist.
- Pemutar live radio dengan status On Air.
- Pengelolaan program dan jadwal siaran.
- Pergantian program/gambar berdasarkan jadwal.
- CMS untuk gambar/media, berita, event, playlist, dan informasi About.
- Autentikasi dashboard dan pembagian hak akses Admin/Editor.
- Draft, publish, unpublish, dan arsip konten.
- Tampilan responsif desktop dan mobile.
- SEO dasar, validasi form, keamanan upload, serta halaman error/empty state.

### 5.2 Tahap berikutnya (opsional)

- Live chat atau pesan pendengar dengan moderasi.
- Integrasi otomatis dengan API layanan musik/playlist jika tersedia dan diizinkan.
- Penjadwalan publikasi konten berdasarkan tanggal.
- Statistik jumlah pemutaran atau pengunjung.
- Integrasi media sosial yang lebih andal.
- Riwayat perubahan konten (audit log) yang lebih lengkap.
- Notifikasi kepada editor saat konten perlu diperbarui.

### 5.3 Di luar ruang lingkup MVP

- Membangun server streaming audio sendiri.
- Mengelola hak cipta atau lisensi musik.
- Aplikasi mobile native.
- Sistem komentar publik tanpa moderasi.
- Migrasi otomatis seluruh data WordPress tanpa pemeriksaan dan pemetaan data.

## 6. Struktur Website Publik

### 6.1 Home

Komponen yang direncanakan:

1. Header dan navigasi: Home, News, About, Event.
2. Hero/banner identitas 93.4 UMMFM.
3. Radio player dengan status Live/On Air.
4. Program yang sedang tayang: gambar, nama program, penyiar, jam siaran.
5. Program berikutnya atau jadwal siaran hari ini.
6. Playlist pilihan, misalnya playlist Spotify yang dikelola.
7. Berita unggulan dan berita terbaru.
8. Event mendatang atau event terbaru.
9. Konten media sosial, jika embed dapat dimuat dengan stabil.
10. Footer berisi deskripsi singkat dan tautan kontak/media sosial.

Urutan dan jumlah komponen dapat disesuaikan pada tahap desain UI.

### 6.2 Radio Player

- Tombol Play/Pause.
- Indikator status: Menghubungkan, Live/Playing, Paused, atau Gagal terhubung.
- Nama stasiun dan program yang sedang tayang.
- Menampilkan pesan yang jelas jika sumber streaming tidak tersedia.
- Tidak memulai audio otomatis tanpa tindakan pengguna.
- Tidak memutar dua audio stream sekaligus.
- Pemutar sebaiknya tetap tersedia ketika pengguna berpindah halaman, jika implementasi teknis memungkinkan.
- URL stream harus disimpan sebagai konfigurasi yang dapat dikelola Admin, bukan ditanam di banyak komponen.
- MVP menggunakan URL stream audio yang sudah dimiliki UMMFM. URL, format, dan dukungan HTTPS harus dikonfirmasi sebelum implementasi.

**Catatan:** ketersediaan player bergantung pada server/penyedia streaming yang aktif. Website tidak dapat menjamin siaran tetap tersedia jika sumber stream mengalami gangguan.

### 6.3 Program dan Jadwal Siaran

Setiap program memiliki:

- Nama program.
- Slug/URL.
- Deskripsi.
- Gambar/cover.
- Nama penyiar atau tim.
- Hari siaran.
- Jam mulai dan selesai.
- Status aktif/nonaktif.
- Urutan atau prioritas bila ada jadwal yang beririsan.
- Status publikasi.

Perilaku yang diharapkan:

- Website menentukan program aktif berdasarkan hari dan waktu saat ini.
- Gambar, nama program, dan informasi penyiar ikut berubah ketika program aktif berubah.
- Jika tidak ada program aktif, website menampilkan status seperti “Di luar jadwal siaran” dan dapat menampilkan program berikutnya.
- Zona waktu menggunakan **Asia/Jakarta (WIB)**.
- Jadwal lintas tengah malam harus didukung atau secara eksplisit divalidasi saat editor menyimpan jadwal.
- Sistem memberi peringatan jika jadwal dua program saling bertabrakan.
- Admin/editor dapat melihat pratinjau program dan jadwal sebelum dipublikasikan.

### 6.4 Playlist

- Menampilkan playlist pilihan dalam bentuk kartu.
- Setiap item dapat berisi judul, cover, deskripsi singkat, dan URL embed/tautan eksternal.
- Admin/editor dapat menambah, mengedit, mengurutkan, menampilkan, atau menyembunyikan playlist.
- Jika menggunakan Spotify, MVP dapat memakai embed/tautan resmi. Pemutaran lagu tetap mengikuti kebijakan dan batasan platform Spotify.
- Playlist pilihan tidak sama dengan daftar lagu yang sedang diputar di siaran langsung. Informasi “Now Playing” otomatis hanya disediakan jika sumber streaming/API UMMFM memang menyediakan metadata tersebut.

### 6.5 News

Halaman daftar berita:
- Menampilkan berita yang sudah dipublikasikan.
- Memiliki gambar thumbnail, judul, ringkasan, tanggal, dan tautan “Baca selengkapnya”.
- Mendukung pagination atau tombol muat lebih banyak.

Halaman detail berita:
- Judul, gambar utama, tanggal publikasi, penulis (opsional), dan isi berita.
- URL yang mudah dibaca berdasarkan slug.
- Metadata SEO dan gambar berbagi sosial.

CMS berita:
- Buat, edit, pratinjau, publish, unpublish, dan arsip.
- Upload gambar utama.
- Field judul, slug, ringkasan, isi, penulis, tanggal publikasi, dan status.
- Validasi slug agar tidak duplikat.

### 6.6 About

- Informasi profil UMMFM.
- Sejarah, visi/misi, atau informasi organisasi sesuai konten resmi.
- Informasi kontak dan tautan media sosial.
- Gambar pendukung.
- Konten dapat diedit melalui CMS, bukan hard-coded di komponen halaman.

### 6.7 Event

- Daftar event mendatang dan event terdahulu.
- Setiap event memiliki judul, slug, gambar poster, deskripsi, tanggal dan waktu, lokasi, tautan pendaftaran (opsional), serta status.
- Event dapat ditandai sebagai upcoming, ongoing, completed, atau cancelled berdasarkan data dan waktu.
- Event yang telah lewat tidak otomatis dihapus; tetap dapat ditampilkan pada arsip.
- Editor dapat menerbitkan atau menyembunyikan event.

## 7. Fitur CMS / Dashboard

### 7.1 Dashboard ringkasan

Menampilkan ringkasan jumlah berita, event, program, playlist, dan konten draft. Ringkasan statistik pengunjung dapat ditambahkan kemudian jika tersedia sumber analitik.

### 7.2 Media Library

- Upload gambar dari komputer.
- Preview gambar sebelum disimpan.
- Menampilkan nama file, ukuran, dimensi, tanggal upload, dan lokasi penggunaan jika memungkinkan.
- Memilih gambar yang sudah pernah diunggah.
- Mengganti gambar program/banner tanpa mengedit kode.
- Menghapus gambar hanya jika tidak sedang digunakan atau setelah ada konfirmasi.
- Validasi format file dan ukuran maksimal.
- Mendukung JPG/JPEG, PNG, dan WebP; SVG hanya jika ada kebutuhan dan proses sanitasi yang aman.
- Sistem menghasilkan versi gambar yang dioptimalkan bila layanan storage mendukungnya.

**Alur mengganti gambar program:**
1. Editor membuka menu Program.
2. Memilih program yang ingin diperbarui.
3. Mengunggah gambar baru atau memilih dari Media Library.
4. Melihat preview dan menyimpan perubahan.
5. Jika dipublikasikan, gambar baru tampil pada website saat data terbaru dimuat.
6. Saat jadwal program aktif berubah, website menampilkan gambar program yang sesuai jadwal.

### 7.3 Manajemen Program dan Jadwal

- CRUD program.
- Upload dan ganti cover.
- Atur penyiar, deskripsi, hari, jam mulai, dan jam selesai.
- Aktif/nonaktifkan program.
- Cegah atau beri peringatan jadwal bertabrakan.
- Pratinjau tampilan program.
- Tentukan apakah program tampil di halaman publik.

### 7.4 Manajemen Playlist

- Tambah/edit/hapus playlist.
- Upload cover atau gunakan gambar yang telah tersedia.
- Masukkan URL Spotify/embed atau tautan eksternal.
- Atur urutan tampil dan status publikasi.

### 7.5 Manajemen News

- Editor konten dengan dukungan paragraf, heading, tautan, dan gambar.
- Simpan draft dan pratinjau.
- Publish/unpublish dan arsip.
- Atur tanggal publikasi dan gambar thumbnail/utama.

### 7.6 Manajemen Event

- Tambah/edit/hapus atau arsip event.
- Upload poster.
- Atur waktu, lokasi, deskripsi, dan tautan pendaftaran.
- Pratinjau sebelum publish.

### 7.7 Pengaturan Website

Admin dapat mengelola:
- Logo dan favicon.
- Hero/banner utama.
- Deskripsi singkat website.
- Link media sosial dan kontak.
- URL streaming radio.
- Pengaturan dasar SEO.
- Konten footer.

### 7.8 Pengelolaan pengguna

- Admin mengundang atau membuat akun editor.
- Admin dapat mengubah peran atau menonaktifkan akun.
- Pengguna dapat keluar (logout).
- Pengaturan reset kata sandi mengikuti layanan autentikasi yang digunakan.
- Jangan menyediakan registrasi publik untuk dashboard.

## 8. Alur Kerja Konten

Status konten yang disarankan:

- **Draft:** hanya terlihat di dashboard.
- **Published:** tampil di website publik.
- **Unpublished:** disembunyikan dari website, tetapi tetap dapat diedit.
- **Archived:** tidak tampil pada konten aktif, tetapi data tetap tersimpan.

Alur standar:
1. Editor membuat konten.
2. Mengisi informasi dan mengunggah gambar.
3. Melihat preview.
4. Menyimpan draft atau menerbitkan.
5. Website menampilkan konten published.
6. Editor dapat memperbarui atau mengarsipkan konten kapan saja sesuai izin.

Untuk MVP, persetujuan berlapis sebelum publish belum wajib. Jika diperlukan, fitur “menunggu persetujuan Admin” bisa ditambahkan.

## 9. Persyaratan Nonfungsional

### 9.1 Responsivitas dan aksesibilitas
- Mendukung mobile, tablet, dan desktop.
- Navigasi dan kontrol player dapat digunakan dengan keyboard.
- Kontras teks dan latar belakang memadai.
- Gambar memiliki teks alternatif yang relevan.
- Status player tidak hanya dibedakan melalui warna.

### 9.2 Performa
- Gambar dioptimalkan dan memakai ukuran yang sesuai.
- Konten berita tidak perlu memuat seluruh gambar beresolusi tinggi sekaligus.
- Embed eksternal dimuat secara efisien dan tidak menghalangi konten utama.
- Halaman publik menggunakan rendering dan caching yang sesuai; perubahan konten CMS harus memicu pembaruan/revalidasi cache agar tidak terus menampilkan data lama.

### 9.3 Keamanan
- Dashboard memerlukan autentikasi.
- Terapkan role-based access control.
- Validasi input di server.
- Terapkan Row Level Security (RLS) pada tabel Supabase yang terekspos.
- Batasi tipe dan ukuran file upload.
- Jangan menyimpan secret key di frontend atau repository.
- URL eksternal dan konten embed harus divalidasi.
- Sediakan konfirmasi untuk tindakan destruktif.

### 9.4 SEO dan berbagi sosial
- Judul dan deskripsi unik per halaman.
- Slug yang konsisten.
- Sitemap dan robots.txt.
- Open Graph metadata untuk berita dan event.
- Gunakan struktur heading yang benar.

### 9.5 Keandalan
- Tampilkan error state jika streaming, gambar, atau embed gagal dimuat.
- Konten utama seperti berita dan About tetap dapat dibaca saat embed media sosial gagal.
- Sediakan backup/ekspor database secara berkala sesuai kemampuan paket layanan yang dipilih.

## 10. Rekomendasi Teknologi

| Bagian | Rekomendasi | Kegunaan |
|---|---|---|
| Frontend dan routing | Next.js App Router + TypeScript | Website publik dan dashboard dalam satu aplikasi |
| UI | Tailwind CSS + komponen UI yang konsisten | Pengembangan tampilan responsif |
| Database | Supabase Postgres | Menyimpan program, jadwal, playlist, berita, event, dan pengaturan |
| Autentikasi | Supabase Auth | Login dan sesi pengguna CMS |
| Penyimpanan gambar | Supabase Storage | Upload dan penyajian cover, banner, poster, dan gambar berita |
| Hosting aplikasi | Vercel atau hosting kompatibel Next.js | Deployment website |
| Streaming audio | Sumber streaming UMMFM yang sudah ada | Mengirim audio live ke pemutar website |

Next.js cocok untuk memadukan halaman publik dan fitur interaktif; Supabase dapat menyediakan database, autentikasi, dan storage. Kebijakan akses harus dikonfigurasi dengan benar, khususnya RLS dan izin upload.

Dokumentasi:
- Next.js App Router: https://nextjs.org/docs/app
- Next.js Server dan Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Supabase Storage: https://supabase.com/docs/guides/storage
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security

## 11. Rancangan Data Awal

Tabel yang disarankan:

### `profiles`
- `id`
- `display_name`
- `role` (`admin`, `editor`, atau `broadcaster` bila digunakan)
- `is_active`
- `created_at`

### `programs`
- `id`
- `name`
- `slug`
- `description`
- `cover_image_url`
- `host_name`
- `is_active`
- `is_published`
- `created_at`
- `updated_at`

### `program_schedules`
- `id`
- `program_id`
- `day_of_week`
- `start_time`
- `end_time`
- `timezone` (default `Asia/Jakarta`)
- `valid_from` (opsional)
- `valid_until` (opsional)
- `is_active`

### `playlists`
- `id`
- `title`
- `description`
- `cover_image_url`
- `external_url`
- `sort_order`
- `is_published`
- `created_at`
- `updated_at`

### `news`
- `id`
- `title`
- `slug`
- `excerpt`
- `body`
- `thumbnail_url`
- `cover_image_url`
- `author_id`
- `status`
- `published_at`
- `created_at`
- `updated_at`

### `events`
- `id`
- `title`
- `slug`
- `description`
- `poster_url`
- `location`
- `starts_at`
- `ends_at`
- `registration_url`
- `status`
- `published_at`
- `created_at`
- `updated_at`

### `media_assets`
- `id`
- `file_name`
- `storage_path`
- `public_url` atau URL yang dihasilkan dari storage
- `mime_type`
- `file_size`
- `alt_text`
- `uploaded_by`
- `created_at`

### `site_settings`
- `id`
- `key`
- `value`
- `updated_by`
- `updated_at`

Catatan desain:
- Relasi program dan jadwal dipisahkan agar satu program dapat memiliki beberapa slot jadwal.
- Simpan path storage sebagai referensi utama; hindari bergantung pada URL sementara.
- Gunakan constraint/index untuk slug dan pencarian konten.
- Field status sebaiknya menggunakan nilai yang konsisten dan tervalidasi.
- Skema final harus disesuaikan dengan kebutuhan nyata dan kebijakan keamanan.

## 12. Sitemap dan Route Awal

### Publik
- `/` — Home
- `/news` — daftar berita
- `/news/[slug]` — detail berita
- `/about` — tentang UMMFM
- `/event` — daftar event
- `/event/[slug]` — detail event
- `/program` — daftar program/jadwal (bila dipisah dari Home)
- `/playlist` — daftar playlist (bila dipisah dari Home)

### CMS
- `/admin/login`
- `/admin` — dashboard
- `/admin/programs`
- `/admin/schedules`
- `/admin/playlists`
- `/admin/news`
- `/admin/events`
- `/admin/media`
- `/admin/settings`
- `/admin/users` — khusus Admin

Route dapat disesuaikan dengan hasil desain navigasi final.

## 13. Kriteria Penerimaan (Acceptance Criteria)

### Streaming
- [ ] Pengunjung dapat menekan Play untuk memulai stream.
- [ ] Status player berubah sesuai kondisi pemutaran atau kegagalan.
- [ ] Jika URL stream gagal, pesan error yang mudah dipahami tampil.
- [ ] Navigasi website tidak memicu dua stream berjalan bersamaan.

### Program dan jadwal
- [ ] Editor dapat membuat dan memperbarui program beserta cover-nya.
- [ ] Editor dapat mengatur hari dan jam siaran.
- [ ] Program aktif dipilih berdasarkan waktu WIB dan jadwal yang tersimpan.
- [ ] Cover dan nama program pada area On Air mengikuti program aktif.
- [ ] Jika tidak ada jadwal aktif, fallback ditampilkan.
- [ ] Sistem memperingatkan jadwal yang bertabrakan.

### CMS dan media
- [ ] Pengguna yang belum login tidak dapat membuka dashboard atau melakukan mutasi data.
- [ ] Editor dapat upload dan preview gambar.
- [ ] Editor dapat mengganti gambar program tanpa mengubah kode.
- [ ] Konten draft tidak tampil di halaman publik.
- [ ] Konten published tampil tanpa deployment ulang.
- [ ] Upload dengan format yang tidak diizinkan ditolak.

### News, About, dan Event
- [ ] Editor dapat membuat, mengedit, publish, unpublish, dan mengarsipkan berita/event.
- [ ] Detail berita dan event memiliki URL slug yang unik.
- [ ] Konten About dan pengaturan footer dapat diperbarui dari CMS.
- [ ] Event yang telah selesai tetap dapat diakses melalui arsip jika dipublikasikan.

### Kualitas umum
- [ ] Halaman inti dapat digunakan pada ukuran mobile dan desktop.
- [ ] Embed eksternal yang gagal tidak merusak seluruh halaman.
- [ ] Form memberikan pesan validasi dan error yang jelas.
- [ ] Hak akses diverifikasi di server/database.

## 14. Prioritas Pengembangan

### Tahap 1 — Fondasi
- Setup Next.js, TypeScript, UI, Supabase, environment variables.
- Autentikasi CMS dan role.
- Struktur database, RLS, dan storage.
- Layout publik dan dashboard.

### Tahap 2 — Streaming dan Program
- Player radio.
- Data program dan jadwal.
- Pemilihan program aktif berdasarkan waktu WIB.
- Upload cover program dan pergantian gambar.

### Tahap 3 — CMS Konten
- Media Library.
- CRUD playlist, News, About, Event.
- Draft/publish/unpublish/arsip.
- Preview konten.

### Tahap 4 — Polishing dan Peluncuran
- Responsivitas, SEO, aksesibilitas, optimasi gambar.
- Pengujian keamanan dan hak akses.
- Uji stream di desktop/mobile.
- Migrasi konten WordPress yang masih relevan.
- Uji penerimaan dengan anggota UMMFM.
- Deployment dan dokumentasi singkat untuk editor.

## 15. Risiko dan Ketergantungan

- **URL streaming:** perlu dipastikan format dan alamat stream yang valid, serta apakah server mengizinkan koneksi HTTPS dan pemutaran dari browser.
- **Jadwal siaran:** perlu data hari/jam yang resmi, termasuk program khusus, libur, dan perubahan mendadak.
- **Playlist:** perlu dipastikan apakah hanya menggunakan embed/tautan Spotify atau ada sumber metadata lagu yang dapat diakses.
- **Hak cipta:** penggunaan lagu, artwork, foto, dan embed harus mengikuti izin dan kebijakan platform terkait.
- **Migrasi WordPress:** perlu inventarisasi berita, gambar, kategori, halaman, dan URL lama. Redirect URL lama sebaiknya disiapkan agar tautan yang sudah tersebar tidak rusak.
- **Akun CMS:** tentukan siapa Admin dan siapa yang boleh menerbitkan konten.
- **Pembaruan terjadwal:** perubahan konten CMS perlu memperbarui cache website; jangan mengandalkan deployment ulang.
- **Live chat dan media sosial:** embed pihak ketiga bisa dibatasi, lambat, atau gagal; jadikan fitur opsional jika stabilitas menjadi prioritas.

## 16. Pertanyaan yang Perlu Diputuskan

1. Apa URL stream radio UMMFM yang digunakan saat ini (misalnya URL audio langsung atau endpoint dari penyedia streaming)?
2. Apakah playlist hanya berupa embed Spotify, atau ingin menampilkan daftar lagu dari sumber lain?
3. Apakah anggota/editor boleh langsung publish, atau berita/event perlu persetujuan Admin?
4. Apakah setiap program memiliki jadwal tetap mingguan, dan apakah ada jadwal khusus untuk tanggal tertentu?
5. Apakah fitur Live Chat tetap dibutuhkan pada versi pertama?
6. Apakah konten WordPress lama perlu dipindahkan seluruhnya, atau hanya berita/halaman tertentu?
7. Siapa yang akan mengelola akun, domain, hosting, dan proyek Supabase?

---

## Definisi MVP Selesai

MVP dianggap siap ketika pendengar dapat mendengarkan stream dan menjelajahi konten publik, sementara anggota UMMFM yang berwenang dapat login ke CMS, mengunggah gambar, mengelola jadwal program, serta memperbarui playlist, berita, About, dan event tanpa mengubah kode atau melakukan deployment ulang.
