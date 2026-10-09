import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SocialLink } from "@/lib/types";

/** Link kartu saja — tanpa embed, supaya tidak ada kotak kosong saat embed gagal (design.md §6.7). */
export function SocialSection({ socialLinks }: { socialLinks: SocialLink[] }) {
  return (
    <section className="bg-surface py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Media Sosial"
          description="Ikuti kegiatan harian UMMFM di kanal resmi berikut."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {socialLinks.map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-20 flex-col justify-center rounded-card border border-border bg-canvas px-5 py-4 transition-colors hover:border-brand-600"
            >
              <span className="text-sm font-semibold uppercase tracking-wide text-ink-500">
                {social.platform}
              </span>
              <span className="mt-1 font-semibold text-brand-700">{social.label}</span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
