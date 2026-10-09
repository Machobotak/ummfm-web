import { cacheLife } from "next/cache";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/content";
import { STATION_NAME } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/event", label: "Event" },
  { href: "/program", label: "Program" },
  { href: "/playlist", label: "Playlist" },
];

// `new Date()` tanpa argumen adalah runtime data di Cache Components, jadi tahun
// diambil di dalam `use cache` (nilai sama untuk semua pengunjung sampai revalidasi).
async function CopyrightLine() {
  "use cache";
  cacheLife("days");
  return (
    <p className="text-xs text-white/60">
      © {new Date().getFullYear()} {STATION_NAME}. Seluruh hak cipta dilindungi.
    </p>
  );
}

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-16 bg-ink-950 text-white sm:mt-24">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-lg font-extrabold">{STATION_NAME}</p>
          <p className="mt-2 max-w-[360px] text-sm text-white/70">{settings.tagline}</p>
        </div>

        <nav aria-label="Navigasi footer">
          <p className="text-sm font-semibold">Jelajahi</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-6 items-center hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold">Kontak</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <a href={`mailto:${settings.contactEmail}`} className="inline-flex min-h-6 items-center hover:text-white hover:underline">
                {settings.contactEmail}
              </a>
            </li>
            {settings.socialLinks.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-6 items-center hover:text-white hover:underline"
                >
                  {social.platform} — {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="border-t border-white/10 py-6">
        <CopyrightLine />
      </Container>
    </footer>
  );
}
