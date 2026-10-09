import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getSiteSettings } from "@/lib/content";
import { SITE_URL, STATION_NAME } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Metadata dasar dibaca dari CMS (site_settings key `seo`) dengan fallback mock.
 * Chrome situs publik (header/footer/pemutar) hidup di `app/(public)/layout.tsx`
 * supaya dashboard /admin tidak memakainya.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.title,
      template: `%s | ${STATION_NAME}`,
    },
    description: seo.description,
    openGraph: {
      type: "website",
      siteName: STATION_NAME,
      locale: "id_ID",
      title: seo.title,
      description: seo.description,
      url: SITE_URL,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1746c8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas text-ink-950 antialiased">
        {children}
      </body>
    </html>
  );
}
