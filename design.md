# Design System & UI Guidelines — 93.4 UMMFM

**Versi:** 1.0  
**Tanggal:** 9 Oktober 2026  
**Produk:** Website publik dan CMS 93.4 UMMFM  
**Referensi visual:** Website 934ummfmradio.com yang dikirim pengguna  
**Arah desain:** Modern, minimalis, editorial, dan berkarakter radio kampus

---

## 1. Design Vision

Membangun pengalaman digital 93.4 UMMFM yang terasa modern dan profesional, tetapi tetap energik serta dekat dengan mahasiswa. Desain baru mempertahankan identitas radio kampus—warna biru, logo UMMFM, konten musik, berita, dan event—dengan tata letak yang lebih rapi, konsisten, dan mudah digunakan.

### Kata kunci visual

- **Modern:** layout bersih, komponen konsisten, tipografi kuat.
- **Minimalis:** mengurangi ornamen dekoratif, bayangan berlebihan, dan elemen yang saling berebut perhatian.
- **Enerjik:** warna biru sebagai identitas, aksen merah untuk status Live/On Air.
- **Editorial:** berita dan event ditampilkan dengan hierarki visual yang jelas.
- **Content-first:** gambar program, berita, dan poster menjadi fokus; pengelola bisa menggantinya dari CMS.
- **Accessible:** teks mudah dibaca, kontrol jelas, dan kontras warna memadai.

### Prinsip desain

1. Konten lebih penting daripada dekorasi.
2. Setiap section memiliki tujuan dan hierarki yang jelas.
3. Gunakan ruang kosong untuk memisahkan kelompok konten.
4. Jangan memakai terlalu banyak gaya kartu dalam satu halaman.
5. Warna aksen digunakan secara konsisten, bukan sebagai hiasan acak.
6. Website publik dan dashboard CMS menggunakan fondasi desain yang sama, tetapi dashboard mengutamakan produktivitas.

---

## 2. Arah Visual dari Website Lama

Elemen yang layak dipertahankan:
- Identitas 93.4 UMMFM dan tagline “The Real Campus Radio”.
- Warna biru yang kuat sebagai identitas.
- Radio player dan status siaran.
- Gambar program, playlist, berita, serta event.
- Link media sosial dan Spotify.
- Navigasi utama: Home, News, About, Event.

Elemen yang perlu disederhanakan:
- Kurangi latar biru yang terlalu dominan pada seluruh halaman; gunakan latar netral agar konten lebih mudah dibaca.
- Hindari banyak shadow tebal, glow, outline, dan efek 3D pada heading.
- Samakan radius, jarak, tinggi kartu, serta gaya tombol.
- Hindari kartu berita yang terlalu sempit sehingga judul terpotong menjadi banyak baris.
- Pastikan embed media sosial tidak meninggalkan kotak hitam besar ketika gagal dimuat.
- Buat status “On Air” terlihat jelas tetapi tidak mendominasi seluruh halaman.
- Batasi jumlah font dan gaya heading.

---

## 3. Brand Foundation

### 3.1 Palet warna

Gunakan warna berikut sebagai titik awal. Nilai final dapat disesuaikan setelah logo dan aset brand resmi diperiksa.

| Token | Hex | Penggunaan |
|---|---|---|
| `brand-700` | `#1746C8` | Tombol utama, link aktif, elemen brand |
| `brand-600` | `#2459E8` | Interaksi utama dan hover |
| `brand-100` | `#EAF1FF` | Latar section ringan, badge sekunder |
| `brand-50` | `#F5F8FF` | Latar biru yang sangat ringan |
| `ink-950` | `#101828` | Heading dan teks utama |
| `ink-700` | `#344054` | Teks sekunder |
| `ink-500` | `#667085` | Metadata, tanggal, hint |
| `surface` | `#FFFFFF` | Kartu, form, navbar |
| `canvas` | `#F7F8FA` | Latar utama halaman |
| `border` | `#E4E7EC` | Border, separator, input |
| `live` | `#E62E35` | Live/On Air dan status siaran |
| `success` | `#16803D` | Status berhasil |
| `warning` | `#B54708` | Peringatan |
| `danger` | `#D92D20` | Error dan aksi berbahaya |

**Aturan penggunaan warna:**
- Dominasi halaman: putih dan `canvas`.
- Biru digunakan pada elemen interaktif dan bagian identitas yang penting.
- Merah khusus untuk Live/On Air atau status penting.
- Jangan menggunakan teks biru muda di atas latar biru muda.
- Pastikan teks normal memiliki kontras yang cukup; jangan mengandalkan warna saja untuk menyampaikan status.

### 3.2 Tipografi

Gunakan maksimal dua keluarga font:
- **Inter** atau **Plus Jakarta Sans** untuk UI, body, dan heading.
- Opsional: **DM Sans** jika ingin karakter lebih ramah; jangan menambahkan font ketiga tanpa kebutuhan jelas.

Skala tipografi desktop:

| Token | Ukuran | Weight | Penggunaan |
|---|---:|---:|---|
| Display | 48–64 px | 700–800 | Hero utama, jika diperlukan |
| H1 | 36–44 px | 700 | Judul halaman utama |
| H2 | 28–32 px | 700 | Judul section |
| H3 | 20–24 px | 600–700 | Judul kartu atau subbagian |
| Body Large | 18 px | 400–500 | Intro/lead |
| Body | 16 px | 400 | Teks utama |
| Body Small | 14 px | 400–500 | Metadata dan deskripsi singkat |
| Caption | 12 px | 400–500 | Label tambahan, hanya jika masih terbaca |

Skala mobile:
- Display: 36–42 px.
- H1: 30–36 px.
- H2: 24–28 px.
- Body utama tetap sekitar 16 px.
- Jangan mengecilkan teks berita untuk memaksakan terlalu banyak kartu dalam satu baris.

### 3.3 Bentuk dan radius

- Radius kartu besar: 20 px.
- Radius kartu biasa: 16 px.
- Radius input dan tombol: 10–12 px.
- Badge/pill: 999 px.
- Border default: 1 px solid `border`.
- Hindari mencampur terlalu banyak radius dalam satu section.

### 3.4 Shadow

Gunakan shadow halus untuk membedakan layer, bukan sebagai dekorasi utama:
- Kartu biasa: `0 4px 16px rgba(16, 24, 40, 0.05)`.
- Dropdown/modal: `0 12px 32px rgba(16, 24, 40, 0.12)`.
- Jika border sudah cukup, kartu boleh tanpa shadow.

---

## 4. Layout dan Spacing

### 4.1 Grid

- Maksimum lebar konten desktop: 1200–1280 px.
- Padding horizontal desktop: 32–48 px.
- Padding tablet: 24 px.
- Padding mobile: 16–20 px.
- Gunakan grid 12 kolom untuk layout kompleks.
- Jarak antar-section: 80–112 px desktop, 56–72 px mobile.
- Jarak antar-kartu: 20–24 px desktop, 16 px mobile.

### 4.2 Spacing scale

Gunakan skala konsisten berbasis kelipatan 4 px:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`

Jangan menggunakan margin acak di setiap komponen. Tentukan spacing dari skala ini dan gunakan token yang konsisten.

### 4.3 Responsive breakpoints

Rekomendasi awal:
- Mobile: `< 640 px`
- Tablet: `640–1023 px`
- Desktop: `>= 1024 px`
- Wide desktop: `>= 1280 px`

Gunakan pendekatan mobile-first. Breakpoint akhir mengikuti sistem CSS/framework yang digunakan.

---

## 5. Navigasi dan Header

### Desktop
- Navbar putih atau sedikit transparan dengan border bawah yang halus.
- Logo UMMFM di kiri dengan tinggi visual sekitar 44–52 px.
- Navigasi di kanan: Home, News, About, Event.
- Link aktif menggunakan warna `brand-700` atau underline tipis.
- CTA “Dengarkan Live” boleh ditambahkan jika player tidak langsung terlihat pada viewport.
- Navbar sticky dapat digunakan, tetapi jangan terlalu tinggi.

### Mobile
- Logo di kiri dan tombol menu di kanan.
- Menu menjadi drawer atau dropdown yang mudah ditutup.
- Player mini dapat ditampilkan sebagai bar bawah jika tidak mengganggu konten dan kontrol sistem.
- Pastikan menu dan player tidak menutupi konten penting.

---

## 6. Homepage — Rekomendasi Struktur

Urutan section yang disarankan:

1. Header.
2. Hero identitas UMMFM.
3. Live Radio Player + program On Air.
4. Program dan jadwal siaran.
5. UMMFM on Music's — embed playlist dan chart.
6. Berita terbaru.
7. Event mendatang.
8. Konten sosial media (opsional).
9. Footer.

### 6.1 Hero

**Tujuan:** mengenalkan UMMFM dan mengarahkan pengunjung untuk mendengarkan siaran.

Layout:
- Headline ringkas, misalnya “The Real Campus Radio”.
- Subheadline singkat tentang radio kampus UMMFM.
- CTA utama: “Dengarkan Live”.
- CTA sekunder: “Lihat Program”.
- Gunakan satu aset visual utama: banner dari CMS (Pengaturan → banner hero) dengan rasio lanskap
  sekitar 12:5, misalnya 2048×853. Pilih foto atau artwork dengan area tenang; hindari teks atau
  logo besar di dalam banner karena teks hero ditumpuk di atasnya.
- Mulai 1024 px banner tampil sebagai latar penuh hero (full-bleed, tepi ke tepi) dengan teks hero di
  atasnya, bukan sebagai kartu terpisah. Tinggi hero mengikuti lebar dengan rasio 12:5 dan dibatasi
  `max-h-[86vh]`, jadi banner lanskap tampil utuh; di bawah 1248 px `min-h-[520px]` menjaga hero
  tetap tinggi.
- Lapisan gelap `ink-950` minimal 70% menutup banner supaya teks putih tetap kontras untuk banner
  apa pun; banner tetap terlihat sebagai tekstur di belakangnya.
- Di bawah 1024 px banner tampil utuh pada kotak rasio 12:5 (`object-contain`) selebar layar, dan
  teks hero berada di bawah banner, bukan menumpuk di atasnya.
- Tanpa banner, hero satu kolom dengan latar `brand-50` dan teks `ink-950`.

Hindari:
- Headline yang terlalu besar hingga mengambil seluruh viewport.
- Banyak ornamen, pola titik, glow, dan gambar dekoratif sekaligus.
- Menampilkan logo berulang kali tanpa fungsi.

### 6.2 Live Radio Player

Gunakan satu komponen player yang kuat secara visual.

**Desktop:**
- Layout horizontal dua kolom.
- Area informasi berisi badge LIVE, nama program, nama penyiar (dari slot jadwal), dan jam siaran.
- Area kontrol berisi tombol Play/Pause yang jelas, indikator loading/error, dan volume jika didukung.

**Mobile:**
- Player menjadi satu kolom atau compact card.
- Tombol Play memiliki area sentuh minimal 44 × 44 px.
- Informasi program tetap terbaca.

Elemen:
- Badge `LIVE` dengan dot merah.
- Judul program.
- Nama penyiar.
- Jadwal.
- Tombol Play/Pause.
- Pesan status koneksi.

Status yang harus didesain:
- Idle: “Siap mendengarkan”.
- Connecting: spinner + “Menghubungkan…”.
- Playing: “Sedang diputar”.
- Error: “Siaran belum dapat diakses” dan tombol coba lagi.
- Off-air: “Di luar jadwal siaran” jika tidak ada program aktif.

Jangan mengklaim radio sedang live hanya karena ada jadwal aktif; status jadwal dan status koneksi stream adalah dua informasi berbeda.

- Nama penyiar mengikuti slot jadwal yang sedang tayang: satu program bisa punya penyiar berbeda
  per slot, dan penyiar boleh kosong bila belum diisi.

### 6.3 Program On Air, Live Chat, dan Program Berikutnya

- Cover program aktif tampil di dalam kartu player dengan rasio 4:5 bila artwork berbentuk
  poster; nama program, penyiar, dan jam tayang berada di sisi cover.
- Program berikutnya tampil sebagai daftar atau kartu yang lebih kecil.
- Live chat pendengar menempati kolom kanan, di atas daftar program berikutnya:
  - Nama pengirim maksimal 40 karakter, pesan maksimal 300 karakter.
  - Jeda kirim 15 detik per IP dan honeypot untuk menahan bot; pengunjung tanpa akun.
  - Pesan baru muncul tanpa reload (polling 10 detik) dan jam kirim memakai `Asia/Jakarta`.
  - Daftar kosong, pesan gagal terkirim, dan pesan tersembunyi punya tampilan masing-masing.
- Data dan gambar berasal dari CMS, bukan hard-coded.
- Ketika jadwal berganti, konten yang relevan berubah berdasarkan waktu `Asia/Jakarta`.

### 6.4 UMMFM on Music's (embed playlist dan chart)

- Seksi berisi dua tab: “Playlist” dan “Chart”; hanya satu tab yang aktif pada satu waktu dan
  tab yang tidak aktif tidak ikut dimuat.
- Isi seksi adalah embed Spotify dan Instagram; tidak ada kartu cover atau unggahan gambar.
- Pengelola menempelkan link di CMS → Pengaturan: satu link embed per baris, hanya link
  `open.spotify.com` (playlist, album, track, artist, episode, show) dan `instagram.com`
  (`p`, `reel`, `tv`) yang diterima. Link dinormalkan ke bentuk `/embed/…` sebelum masuk iframe.
- Desktop: grid tiga kolom. Tablet: dua kolom. Mobile: satu kolom. Instagram dibatasi
  `max-w-[400px]` dan ditengahkan karena kirimannya berbentuk potret.
- Tinggi iframe tetap: Spotify 480 px, Instagram 620 px; `loading="lazy"` supaya halaman
  ringan meski embed banyak.
- Setiap embed disertai tautan “Buka di Spotify/Instagram” sebagai jalan keluar bila iframe
  diblokir jaringan pengunjung.
- Tanpa link tersimpan, seksi menampilkan empty state yang mengarahkan pengelola ke Pengaturan.

### 6.5 News

- Heading section: “Berita Terbaru” dengan link “Lihat Semua”.
- Satu berita unggulan dapat memiliki ukuran lebih besar.
- Berita lain menggunakan grid dua atau tiga kolom, sesuai lebar layar.
- Gambar berita: rasio 16:9.
- Judul maksimal sekitar 2–3 baris di kartu; gunakan line clamp bila perlu.
- Metadata tanggal menggunakan ukuran kecil tetapi tetap terbaca.
- Seluruh kartu memiliki tinggi dan jarak yang konsisten.

### 6.6 Event

- Gunakan poster dengan rasio yang konsisten; poster vertikal dapat menggunakan 3:4.
- Tampilkan tanggal event dengan jelas.
- Bedakan event mendatang dan event selesai melalui label teks.
- CTA: “Detail Event” atau “Daftar”.
- Event lama tetap dapat ditemukan di halaman arsip.

### 6.7 Konten media sosial

- Jadikan section opsional.
- Jika embed gagal atau diblokir, tampilkan thumbnail dan link ke platform terkait.
- Jangan membiarkan area kosong atau kotak hitam tanpa pesan.
- Lazy-load embed agar tidak memperlambat konten utama.

### 6.8 Footer

Gunakan latar netral atau biru gelap dengan kontras yang baik. Isi:
- Logo dan deskripsi singkat UMMFM.
- Navigasi ringkas.
- Email/kontak resmi.
- Instagram, TikTok, YouTube, Spotify, dan tautan resmi lain.
- Copyright.

Jangan menampilkan informasi kontak yang belum diverifikasi atau sudah tidak digunakan.

---

## 7. Halaman Publik

### 7.1 News listing
- Judul halaman dan intro singkat.
- Berita unggulan.
- Grid berita.
- Pagination atau tombol “Muat lebih banyak”.
- Empty state jika belum ada berita.
- Search/filter dapat ditambahkan jika jumlah berita sudah banyak.

### 7.2 News detail
- Breadcrumb.
- Judul utama.
- Tanggal dan penulis (jika tersedia).
- Gambar utama 16:9.
- Isi artikel dengan lebar baca sekitar 680–760 px.
- Share link dan berita terkait (opsional).
- Pastikan gambar tidak memotong informasi penting.

### 7.3 About
- Intro tentang UMMFM.
- Sejarah, visi/misi, atau struktur organisasi sesuai informasi resmi.
- Foto studio/tim bila tersedia.
- Kontak dan media sosial.
- Gunakan layout editorial, bukan deretan kartu untuk semua paragraf.

### 7.4 Event listing/detail
- Daftar event mendatang dan arsip.
- Poster, tanggal, lokasi, dan deskripsi.
- Detail event memiliki CTA pendaftaran bila URL tersedia.
- Status event tidak hanya ditampilkan dengan warna; gunakan label teks.

---

## 8. Dashboard CMS — Design Guidelines

Dashboard perlu lebih fungsional daripada dekoratif. Gunakan latar `canvas`, sidebar yang tenang, dan area kerja putih.

### 8.1 Struktur layout
- Sidebar desktop: lebar sekitar 240–260 px.
- Topbar: nama halaman, breadcrumb, profil pengguna.
- Main content: maksimal lebar 1200 px.
- Mobile: sidebar berubah menjadi drawer.
- Tombol aksi utama berada di posisi konsisten, biasanya kanan atas judul halaman.

### 8.2 Navigasi CMS

Menu yang disarankan:
- Dashboard
- Program
- Jadwal Siaran
- UMMFM on Music's (diatur di menu Pengaturan)
- News
- Event
- Media Library
- Pengaturan
- Pengguna (Admin saja)

### 8.3 Dashboard overview

Tampilkan:
- Ringkasan jumlah berita published/draft.
- Jumlah program aktif.
- Event mendatang.
- Konten yang terakhir diperbarui.
- Quick actions seperti “Tambah Berita”, “Tambah Program”, dan “Upload Media”.

Jangan menampilkan metrik pengunjung palsu. Tampilkan statistik hanya jika terhubung ke sumber analitik yang nyata.

### 8.4 Tabel dan daftar konten

- Gunakan tabel pada desktop untuk data administratif.
- Pada mobile, gunakan daftar/kartu ringkas atau tabel dengan horizontal scroll yang terkontrol.
- Tampilkan kolom penting: judul, status, tanggal diperbarui, dan aksi.
- Status berupa badge dengan label teks.
- Aksi Edit mudah ditemukan; Delete diletakkan di menu sekunder.
- Sediakan search, filter status, dan pagination ketika daftar mulai panjang.

### 8.5 Form konten

Form dibagi menjadi dua area:
- **Konten utama:** judul, deskripsi/isi, jadwal atau data event.
- **Panel publikasi:** status, gambar, slug, tanggal, dan preview.

Panduan:
- Label selalu terlihat; jangan hanya mengandalkan placeholder.
- Tandai field wajib.
- Tampilkan validasi dekat field terkait.
- Pertahankan input jika submit gagal.
- Berikan preview gambar sebelum menyimpan.
- Tombol utama: “Simpan Draft” atau “Publikasikan”.
- Tindakan hapus memerlukan konfirmasi.
- Berikan feedback setelah simpan berhasil/gagal.
- Halaman Pengaturan punya tombol Simpan di kaki setiap kartu; satu klik menyimpan seluruh form,
  halaman tetap di posisi kartu itu, dan muncul konfirmasi “Tersimpan.”.

### 8.6 Media Library

- Grid thumbnail dengan ukuran konsisten.
- Search berdasarkan nama file.
- Filter jenis media jika dibutuhkan.
- Aksi upload yang menonjol.
- Klik item untuk preview dan memilih gambar.
- Tampilkan alt text, ukuran file, dan tanggal upload bila tersedia.
- Jika gambar sedang digunakan oleh konten, peringatkan sebelum menghapusnya.
- Gunakan placeholder/loading state saat gambar sedang diproses.

### 8.7 Editor jadwal siaran

- Gunakan tabel atau daftar per hari.
- Tampilkan jam mulai dan selesai dalam format yang konsisten.
- Tampilkan zona waktu WIB.
- Penyiar diatur per slot jadwal (boleh beberapa nama, boleh kosong); data program tidak lagi
  menyimpan penyiar.
- Beri peringatan visual dan teks jika ada jadwal yang bertabrakan.
- Sediakan preview program yang aktif pada hari/jam tertentu.
- Jangan menganggap status stream otomatis sama dengan status jadwal.

---

## 9. Komponen UI dan State

Komponen yang sebaiknya reusable:
- `SiteHeader`
- `MobileNavigation`
- `SiteFooter`
- `LiveRadioPlayer`
- `OnAirBadge`
- `ProgramCard`
- `ScheduleList`
- `MusicSection`
- `MusicTabs`
- `NewsCard`
- `FeaturedNewsCard`
- `EventCard`
- `SectionHeading`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `ImageUploader`
- `MediaPicker`
- `StatusBadge`
- `ConfirmDialog`
- `AdminSidebar`
- `AdminTopbar`
- `ContentTable`
- `ContentEditorForm`

Setiap komponen data-driven harus menangani:
- Loading.
- Data tersedia.
- Data kosong.
- Error.
- Gambar gagal dimuat jika relevan.

Hindari menyalin struktur dan styling kartu yang sama ke banyak file; gunakan komponen bersama dengan props yang jelas.

---

## 10. Gambar, Artwork, dan Media

### Rasio yang disarankan

| Jenis aset | Rasio | Catatan |
|---|---|---|
| Hero visual | 12:5 (mis. 2048×853) | Di desktop tinggi hero mengikuti lebar; rasio lain dipotong di sisi terpanjang |
| Cover program | 4:5 atau 3:4 | Cocok untuk artwork poster program |
| Thumbnail berita | 16:9 | Konsisten di grid berita |
| Poster event | 3:4 | Cocok untuk poster vertikal |
| Avatar penyiar | 1:1 | Gunakan crop wajah yang wajar |

### Aturan gambar
- Gunakan Next.js Image atau mekanisme optimasi yang sesuai dengan sumber gambar.
- Tetapkan rasio container agar layout tidak meloncat saat gambar dimuat.
- Gunakan `object-fit: cover` untuk thumbnail, dengan `object-position` yang dapat diatur jika subjek tidak berada di tengah.
- Sediakan alt text untuk gambar informatif.
- Hindari teks penting yang tertanam pada gambar jika informasi yang sama perlu dapat dicari atau dibaca oleh screen reader.
- Gunakan placeholder yang konsisten ketika gambar tidak tersedia.
- Untuk pergantian gambar melalui CMS, simpan referensi aset pada record konten; jangan mengganti file secara manual di source code.

---

## 11. Motion dan Interaction

Gunakan motion seperlunya:
- Hover tombol/kartu: 150–200 ms.
- Transisi warna atau border: halus.
- Drawer/menu: 200–250 ms.
- Hindari parallax, animasi berulang, dan efek berlebihan.
- Jangan membuat informasi penting hanya muncul ketika hover.
- Hormati preferensi `prefers-reduced-motion`.
- Tombol player perlu memberi feedback langsung saat ditekan.

### States
- Hover: perubahan warna/border ringan.
- Focus: outline yang jelas untuk keyboard.
- Disabled: terlihat nonaktif dan tidak bisa diklik.
- Loading: spinner atau skeleton, bukan halaman kosong.
- Error: pesan spesifik dan opsi pemulihan jika tersedia.
- Success: notifikasi singkat, misalnya “Perubahan berhasil disimpan”.

---

## 12. Accessibility Checklist

- [ ] Semua kontrol dapat diakses menggunakan keyboard.
- [ ] Focus ring terlihat jelas.
- [ ] Kontras teks dan latar memadai.
- [ ] Tombol hanya berupa ikon memiliki accessible label.
- [ ] Gambar informatif memiliki alt text.
- [ ] Form memiliki label, pesan validasi, dan instruksi yang jelas.
- [ ] Status Live/Error tidak hanya dibedakan berdasarkan warna.
- [ ] Audio tidak autoplay tanpa interaksi pengguna.
- [ ] Animasi menghormati preferensi reduced motion.
- [ ] Target sentuh pada mobile idealnya minimal 44 × 44 px.

---

## 13. Responsive Behavior

### Mobile
- Satu kolom untuk berita dan event.
- Hero lebih ringkas; CTA tidak memenuhi seluruh layar.
- Hero menampilkan banner utuh (kotak rasio 12:5) dengan teks di bawahnya, tanpa bagian terpotong.
- Player tetap mudah diakses dan tidak menutupi konten.
- Playlist dan chart tampil sebagai dua tab berisi embed Spotify/Instagram, satu kolom di mobile.
- Menu navigasi memakai drawer/dropdown.
- Dashboard menggunakan drawer untuk sidebar dan form satu kolom.

### Tablet
- Dua kolom untuk sebagian besar grid konten.
- Player dapat menggunakan layout horizontal jika ruang mencukupi.
- Sidebar CMS dapat dipersempit atau diubah menjadi drawer.

### Desktop
- Maksimal tiga kolom untuk kartu konten.
- Player dapat menggunakan dua kolom; hero memakai latar banner penuh dengan teks di atasnya.
- Dashboard menggunakan sidebar tetap.
- Hindari konten yang melebar tanpa batas pada monitor besar.

---

## 14. Design Tokens Awal untuk CSS

Contoh token CSS yang dapat dijadikan dasar implementasi:

```css
:root {
  --color-brand-700: #1746c8;
  --color-brand-600: #2459e8;
  --color-brand-100: #eaf1ff;
  --color-brand-50: #f5f8ff;

  --color-ink-950: #101828;
  --color-ink-700: #344054;
  --color-ink-500: #667085;

  --color-surface: #ffffff;
  --color-canvas: #f7f8fa;
  --color-border: #e4e7ec;

  --color-live: #e62e35;
  --color-success: #16803d;
  --color-warning: #b54708;
  --color-danger: #d92d20;

  --radius-card: 20px;
  --radius-control: 12px;
  --radius-pill: 999px;

  --shadow-card: 0 4px 16px rgba(16, 24, 40, 0.05);
  --shadow-overlay: 0 12px 32px rgba(16, 24, 40, 0.12);

  --container-max: 1280px;
  --page-gutter: 24px;
}
```

Token ini merupakan titik awal, bukan aturan yang tidak boleh diubah. Simpan token global pada satu lokasi agar perubahan identitas visual dapat diterapkan konsisten.

---

## 15. Do / Don't

### Do
- Gunakan latar netral dan biru sebagai aksen brand.
- Gunakan ukuran gambar konsisten per kategori konten.
- Pastikan judul, tanggal, dan CTA mudah dipindai.
- Buat semua konten utama dapat dikelola dari CMS.
- Gunakan status yang jelas untuk player, konten, dan jadwal.
- Buat tampilan mobile sebagai bagian dari desain sejak awal.

### Don't
- Jangan menggunakan banyak glow, shadow tebal, dan efek 3D sekaligus.
- Jangan menggunakan biru muda untuk teks kecil di atas latar biru muda.
- Jangan membuat semua section menjadi kartu dengan border/shadow yang sama.
- Jangan menaruh teks panjang pada kartu berita yang sempit.
- Jangan menampilkan embed gagal sebagai kotak kosong/hitam tanpa fallback.
- Jangan menampilkan status Live hanya berdasarkan jadwal tanpa memeriksa kondisi player.
- Jangan hard-code gambar program, berita, atau event di source code.
- Jangan menampilkan statistik yang belum benar-benar dikumpulkan.

---

## 16. Checklist Sebelum Desain Dianggap Siap

### Website publik
- [ ] Header dan navigasi konsisten pada seluruh halaman.
- [ ] Hero memiliki satu pesan utama dan CTA yang jelas.
- [ ] Player punya state idle, connecting, playing, dan error.
- [ ] Program aktif dan artwork diambil dari data CMS.
- [ ] Grid berita dan event memiliki rasio gambar yang konsisten.
- [ ] Halaman News, About, dan Event memiliki empty state.
- [ ] Footer memiliki link yang benar.
- [ ] Semua halaman diuji di mobile, tablet, dan desktop.

### Dashboard CMS
- [ ] Navigasi dan hierarki halaman mudah dipahami anggota baru.
- [ ] Tombol upload dan preview gambar mudah ditemukan.
- [ ] Form memberi validasi dan feedback yang jelas.
- [ ] Status draft/published/archived terlihat konsisten.
- [ ] Tindakan destruktif meminta konfirmasi.
- [ ] Tampilan tabel dan form tetap usable di mobile.
- [ ] Perubahan konten tidak memerlukan deployment ulang.

---

## 17. Referensi dan Hubungan dengan PRD

Dokumen ini melengkapi PRD **Website Streaming Radio UMMFM**. PRD menjelaskan apa yang harus dilakukan produk; dokumen design ini menjelaskan bagaimana produk sebaiknya terlihat dan terasa ketika digunakan.

Sebelum implementasi final:
1. Konfirmasi logo, aset brand, dan warna resmi UMMFM.
2. Kumpulkan artwork program, foto tim/studio, cover playlist, dan poster event.
3. Buat wireframe Home, News listing/detail, Event listing/detail, About, login CMS, Media Library, dan form Program.
4. Validasi wireframe dengan beberapa anggota UMMFM.
5. Implementasikan komponen reusable dan design tokens.
6. Uji responsivitas, aksesibilitas, dan seluruh state UI.

**Hasil yang diharapkan:** website UMMFM tetap memiliki identitas radio kampus yang kuat, tetapi tampil lebih bersih, modern, mudah dibaca, dan lebih mudah dikelola oleh anggota non-developer.
