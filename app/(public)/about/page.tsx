import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Intro, sejarah, visi, misi, dan kontak 93.4 UMMFM, radio kampus Universitas Muhammadiyah Malang.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[720px]">
        <SectionHeading
          as="h1"
          title="About 93.4 UMMFM"
          description="Radio kampus Universitas Muhammadiyah Malang yang mengudara untuk mahasiswa dan warga Malang."
        />

        <p className="mt-4 text-lg text-ink-700">{settings.about.intro}</p>

        <h2 className="mt-10 text-2xl font-bold">Sejarah</h2>
        <p className="mt-4 text-ink-700">{settings.about.history}</p>

        <h2 className="mt-10 text-2xl font-bold">Visi</h2>
        <p className="mt-4 text-ink-700">{settings.about.vision}</p>

        <h2 className="mt-10 text-2xl font-bold">Misi</h2>
        <ul className="mt-4 space-y-2">
          {settings.about.mission.map((item) => (
            <li key={item} className="list-disc pl-1 text-ink-700 marker:text-brand-700">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-card border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Kontak</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline-offset-4 hover:text-brand-600 hover:underline"
              >
                {settings.contactEmail}
              </a>
            </li>
            {settings.socialLinks.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-ink-700 underline-offset-4 hover:text-brand-600 hover:underline"
                >
                  {social.platform}
                  <span className="text-ink-500"> · {social.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
