import { Suspense, type ReactNode } from "react";
import { ActiveProgramBar } from "@/components/player/ActiveProgramBar";
import { LiveRadioPlayer } from "@/components/player/LiveRadioPlayer";
import { RadioPlayerProvider } from "@/components/player/RadioPlayerProvider";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getSiteSettings } from "@/lib/content";

/**
 * Chrome situs publik: header, footer, dan pemutar radio persisten. Dipisah ke
 * route group `(public)` supaya dashboard /admin (root layout saja) tidak
 * menampilkannya. URL halaman tidak berubah.
 */
export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { streamUrl } = await getSiteSettings();

  return (
    <RadioPlayerProvider streamUrl={streamUrl}>
      <SiteHeader />
      <main id="main" className="flex-1 pb-32">
        {children}
      </main>
      <SiteFooter />
      <Suspense fallback={<LiveRadioPlayer variant="bar" />}>
        <ActiveProgramBar />
      </Suspense>
    </RadioPlayerProvider>
  );
}
