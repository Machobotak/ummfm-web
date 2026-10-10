// Fallback mock saat Supabase belum dikonfigurasi (lib/content.ts) sekaligus
// sumber nilai supabase/seed.sql. Semua gambar "" agar memakai MediaPlaceholder
// (design.md §10: placeholder konsisten, tanpa aset pihak ketiga di fase ini).
import type {
  NewsArticle,
  Playlist,
  Program,
  ProgramSchedule,
  RadioEvent,
  SiteSettings,
} from "./types";
import { SITE_DESCRIPTION, STATION_NAME, TAGLINE } from "./site";

const PROGRAM_UPDATED_AT = "2026-10-01T08:00:00+07:00";

const CONTENT_UPDATED_AT = "2026-10-01T08:00:00+07:00";

export const mockPrograms: Program[] = [
  {
    id: "prog-1",
    name: "Semesta Pagi",
    slug: "semesta-pagi",
    description: "Program pagi penyemangat hari.",
    coverImageUrl: "",
    isActive: true,
    isPublished: true,
    createdAt: "2026-08-01T08:00:00+07:00",
    updatedAt: PROGRAM_UPDATED_AT,
  },
  {
    id: "prog-2",
    name: "Kapsul Musik",
    slug: "kapsul-musik",
    description: "Kurasi lagu pilihan.",
    coverImageUrl: "",
    isActive: true,
    isPublished: true,
    createdAt: "2026-08-01T08:00:00+07:00",
    updatedAt: PROGRAM_UPDATED_AT,
  },
  {
    id: "prog-3",
    name: "Update Kampus",
    slug: "update-kampus",
    description: "Info dan kabar kampus UMM.",
    coverImageUrl: "",
    isActive: true,
    isPublished: true,
    createdAt: "2026-08-01T08:00:00+07:00",
    updatedAt: PROGRAM_UPDATED_AT,
  },
  {
    id: "prog-4",
    name: "Ngobrol Sore",
    slug: "ngobrol-sore",
    description: "Bincang santai sore hari.",
    coverImageUrl: "",
    isActive: true,
    isPublished: true,
    createdAt: "2026-08-01T08:00:00+07:00",
    updatedAt: PROGRAM_UPDATED_AT,
  },
  {
    id: "prog-5",
    name: "Kolase Indie",
    slug: "kolase-indie",
    description: "Musik indie lokal dan nasional.",
    coverImageUrl: "",
    isActive: true,
    isPublished: true,
    createdAt: "2026-08-01T08:00:00+07:00",
    updatedAt: PROGRAM_UPDATED_AT,
  },
  {
    id: "prog-6",
    name: "Gelombang Malam",
    slug: "gelombang-malam",
    description: "Teman begadang lintas tengah malam.",
    coverImageUrl: "",
    isActive: true,
    isPublished: true,
    createdAt: "2026-08-01T08:00:00+07:00",
    updatedAt: PROGRAM_UPDATED_AT,
  },
];

const WEEKDAYS = [1, 2, 3, 4, 5];

function weekdayRows(
  programId: string,
  startTime: string,
  endTime: string,
  hostName: string,
): ProgramSchedule[] {
  return WEEKDAYS.map((dayOfWeek) => ({
    id: `${programId}-d${dayOfWeek}`,
    programId,
    dayOfWeek,
    startTime,
    endTime,
    hostName,
    timezone: "Asia/Jakarta" as const,
    isActive: true,
  }));
}

export const mockSchedules: ProgramSchedule[] = [
  ...weekdayRows("prog-1", "06:00", "09:00", "Host A"),
  ...weekdayRows("prog-2", "09:00", "12:00", "Host B"),
  ...weekdayRows("prog-3", "12:00", "15:00", "Host C"),
  ...weekdayRows("prog-4", "15:00", "18:00", "Host D"),
  // Sabtu 18:00–21:00
  {
    id: "prog-5-d6",
    programId: "prog-5",
    dayOfWeek: 6,
    startTime: "18:00",
    endTime: "21:00",
    hostName: "Host E",
    timezone: "Asia/Jakarta",
    isActive: true,
  },
  // Jumat & Sabtu 22:00–01:00 → lintas tengah malam (endTime <= startTime)
  {
    id: "prog-6-d5",
    programId: "prog-6",
    dayOfWeek: 5,
    startTime: "22:00",
    endTime: "01:00",
    hostName: "Host F",
    timezone: "Asia/Jakarta",
    isActive: true,
  },
  {
    id: "prog-6-d6",
    programId: "prog-6",
    dayOfWeek: 6,
    startTime: "22:00",
    endTime: "01:00",
    hostName: "Host F",
    timezone: "Asia/Jakarta",
    isActive: true,
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: "pl-1",
    title: "Playlist Pilihan #1",
    description: "Kompilasi lagu favorit penyiar UMMFM.",
    coverImageUrl: "",
    externalUrl: "https://open.spotify.com/playlist/5Q9mUp6OA60CbDEqEjpJ07",
    sortOrder: 1,
    isPublished: true,
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    id: "pl-2",
    title: "Playlist Pilihan #2",
    description: "Rekomendasi rilisan terbaru untuk menemani aktivitas.",
    coverImageUrl: "",
    externalUrl: "https://open.spotify.com/playlist/4OjmZ6nwO3HIWWR970Rb52",
    sortOrder: 2,
    isPublished: true,
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    id: "pl-3",
    title: "Playlist Pilihan #3",
    description: "Pilihan musik indie lokal dan nasional.",
    coverImageUrl: "",
    externalUrl: "https://open.spotify.com/playlist/6A22UhQ1kGKmcBTefgQjmH",
    sortOrder: 3,
    isPublished: true,
    updatedAt: CONTENT_UPDATED_AT,
  },
];

export const mockNews: NewsArticle[] = [
  {
    id: "news-1",
    title: "UMMFM Rayakan Dies Natalis",
    slug: "ummfm-rayakan-dies-natalis",
    excerpt: "Sorotan perayaan radio kampus.",
    body: "93.4 UMMFM merayakan dies natalis bersama mahasiswa dan alumni di Studio UMMFM.\n\nRangkaian acara diisi sesi siaran bersama, panggung musik akustik, dan temu alumni penyiar.\n\nPengunjung dapat mengikuti tur studio untuk melihat proses siaran secara langsung.\n\nRangkaian perayaan berlanjut dengan program spesial sepanjang pekan di kanal siaran UMMFM.",
    thumbnailUrl: "",
    coverImageUrl: "",
    authorName: "Tim Redaksi UMMFM",
    status: "published",
    publishedAt: "2026-10-01T08:00:00+07:00",
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    id: "news-2",
    title: "Rekrutmen Anggota Baru UMMFM",
    slug: "rekrutmen-anggota-baru-ummfm",
    excerpt: "Pendaftaran anggota baru dibuka.",
    body: "UMMFM membuka pendaftaran anggota baru untuk divisi penyiaran, produksi, dan media digital.\n\nPendaftaran terbuka bagi mahasiswa aktif yang tertarik pada dunia radio dan konten audio.\n\nTahapan seleksi meliputi wawancara minat dan latihan siaran bersama penyiar senior.\n\nInformasi jadwal dan persyaratan diperbarui melalui kanal resmi UMMFM.",
    thumbnailUrl: "",
    coverImageUrl: "",
    authorName: "Tim Redaksi UMMFM",
    status: "published",
    publishedAt: "2026-09-20T09:00:00+07:00",
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    id: "news-3",
    title: "Workshop Podcast untuk Mahasiswa",
    slug: "workshop-podcast-untuk-mahasiswa",
    excerpt: "Belajar produksi podcast bersama.",
    body: "Workshop podcast menghadirkan materi dasar penulisan naskah hingga proses mastering audio.\n\nPeserta berlatih merekam dan mengedit episode pendek langsung di studio UMMFM.\n\nMateri ditekankan pada kualitas suara, struktur cerita, dan konsistensi jadwal rilis.\n\nWorkshop berlanjut dengan sesi pendampingan produksi podcast skala kampus.",
    thumbnailUrl: "",
    coverImageUrl: "",
    authorName: "Tim Redaksi UMMFM",
    status: "published",
    publishedAt: "2026-09-05T10:00:00+07:00",
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    id: "news-4",
    title: "UMMFM Hadir di Festival Kampus",
    slug: "ummfm-hadir-di-festival-kampus",
    excerpt: "Liputan festival kampus.",
    body: "UMMFM membuka panggung siaran langsung dari area festival kampus Universitas Muhammadiyah Malang.\n\nPengunjung dapat menyampaikan dedikasi lagu dan pesan langsung ke kanal siaran.\n\nTim liputan merekam wawancara singkat dengan pengunjung dan penampil.\n\nRekaman liputan diolah menjadi konten audio yang tayang pada pekan berikutnya.",
    thumbnailUrl: "",
    coverImageUrl: "",
    authorName: "Tim Redaksi UMMFM",
    status: "published",
    publishedAt: "2026-08-15T13:00:00+07:00",
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    id: "news-5",
    title: "Kilas Program Semester Baru",
    slug: "kilas-program-semester-baru",
    excerpt: "Jadwal program semester baru.",
    body: "Semester baru membawa penyegaran pada sejumlah program rutin UMMFM.\n\nProgram pagi kini menghadirkan segmen kabar kampus dengan narasumber dari unit mahasiswa.\n\nProgram malam menambah slot musik lintas tengah malam untuk menemani pendengar.\n\nSusunan jadwal terbaru dapat dilihat pada halaman program.",
    thumbnailUrl: "",
    coverImageUrl: "",
    authorName: "Tim Redaksi UMMFM",
    status: "published",
    publishedAt: "2026-08-01T07:00:00+07:00",
    updatedAt: CONTENT_UPDATED_AT,
  },
];

export const mockEvents: RadioEvent[] = [
  {
    id: "evt-1",
    title: "Open Studio UMMFM",
    slug: "open-studio-ummfm",
    description:
      "Sesi terbuka untuk melihat langsung proses siaran di Studio UMMFM, termasuk tur ruang kontrol dan pengenalan perangkat penyiaran.",
    posterUrl: "",
    location: "Studio UMMFM",
    startsAt: "2026-10-20T10:00:00+07:00",
    endsAt: "2026-10-20T15:00:00+07:00",
    status: "upcoming",
    isPublished: true,
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    id: "evt-2",
    title: "Lomba Siaran Kampus",
    slug: "lomba-siaran-kampus",
    description:
      "Kompetisi siaran untuk mahasiswa dengan penilaian pada penyampaian, pemilihan musik, dan interaksi pendengar.",
    posterUrl: "",
    location: "Aula UMM",
    startsAt: "2026-10-25T09:00:00+07:00",
    endsAt: "2026-10-25T17:00:00+07:00",
    status: "upcoming",
    isPublished: true,
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    id: "evt-3",
    title: "Live Streaming Kolaborasi",
    slug: "live-streaming-kolaborasi",
    description:
      "Siaran kolaborasi lintas komunitas kampus yang disiarkan langsung dan disertai sesi tanya jawab.",
    posterUrl: "",
    location: "Online",
    startsAt: "2026-10-10T19:00:00+07:00",
    endsAt: "2026-10-10T22:00:00+07:00",
    status: "ongoing",
    isPublished: true,
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    id: "evt-4",
    title: "Workshop Penyiar 2026",
    slug: "workshop-penyiar-2026",
    description:
      "Pelatihan dasar penyiaran bagi anggota baru: teknik vokal, penyusunan rundown, dan latihan siaran.",
    posterUrl: "",
    location: "Studio UMMFM",
    startsAt: "2026-09-12T09:00:00+07:00",
    endsAt: "2026-09-12T15:00:00+07:00",
    status: "completed",
    isPublished: true,
    updatedAt: CONTENT_UPDATED_AT,
  },
];

export const mockSiteSettings: SiteSettings = {
  tagline: "The Real Campus Radio",
  heroBannerUrl: "",
  contactEmail: "ummfm@gmail.com",
  socialLinks: [
    {
      platform: "Instagram",
      label: "@ummfm_malang",
      url: "https://www.instagram.com/ummfm_malang",
    },
    {
      platform: "TikTok",
      label: "@ummfm_malang",
      url: "https://www.tiktok.com/@ummfm_malang",
    },
    {
      platform: "Spotify",
      label: "Playlist UMMFM",
      url: "https://open.spotify.com/playlist/5Q9mUp6OA60CbDEqEjpJ07",
    },
  ],
  about: {
    intro:
      "93.4 UMMFM adalah radio kampus Universitas Muhammadiyah Malang yang mengudara untuk mahasiswa dan warga Malang.",
    history:
      "Sejak berdiri, UMMFM tumbuh dari ruang siaran sederhana menjadi rumah produksi audio kampus dengan program harian, liputan, dan konten digital.",
    vision:
      "Menjadi radio kampus yang dekat dengan mahasiswa serta menjadi ruang belajar penyiaran dan produksi konten audio.",
    mission: [
      "Menyediakan siaran yang informatif, menghibur, dan relevan bagi mahasiswa.",
      "Menjadi ruang belajar penyiaran, produksi musik, dan jurnalistik audio.",
      "Mendukung kreativitas dan karya mahasiswa melalui kanal siaran dan konten digital.",
    ],
  },
  // Kosong → RadioPlayerProvider memakai NEXT_PUBLIC_STREAM_URL.
  streamUrl: "",
  seo: {
    title: `${STATION_NAME} — ${TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};
