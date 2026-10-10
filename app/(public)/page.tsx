import { EventsSection } from "@/components/home/EventsSection";
import { Hero } from "@/components/home/Hero";
import { MusicSection } from "@/components/home/MusicSection";
import { NewsSection } from "@/components/home/NewsSection";
import { OnAirSection } from "@/components/home/OnAirSection";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { SocialSection } from "@/components/home/SocialSection";
import { getPrograms, getPublishedEvents, getPublishedNews, getSchedules, getSiteSettings } from "@/lib/content";

export default async function HomePage() {
  const [programs, schedules, news, events, settings] = await Promise.all([
    getPrograms(),
    getSchedules(),
    getPublishedNews(),
    getPublishedEvents(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero bannerUrl={settings.heroBannerUrl} />
      <OnAirSection programs={programs} schedules={schedules} />
      <ProgramsSection programs={programs} schedules={schedules} />
      <MusicSection playlistEmbeds={settings.playlistEmbeds} chartEmbeds={settings.chartEmbeds} />
      <NewsSection articles={news} />
      <EventsSection events={events} />
      <SocialSection socialLinks={settings.socialLinks} />
    </>
  );
}
