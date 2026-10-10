import { EventsSection } from "@/components/home/EventsSection";
import { Hero } from "@/components/home/Hero";
import { NewsSection } from "@/components/home/NewsSection";
import { OnAirSection } from "@/components/home/OnAirSection";
import { PlaylistsSection } from "@/components/home/PlaylistsSection";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { SocialSection } from "@/components/home/SocialSection";
import {
  getPlaylists,
  getPrograms,
  getPublishedEvents,
  getPublishedNews,
  getSchedules,
  getSiteSettings,
} from "@/lib/content";

export default async function HomePage() {
  const [programs, schedules, playlists, news, events, settings] = await Promise.all([
    getPrograms(),
    getSchedules(),
    getPlaylists(),
    getPublishedNews(),
    getPublishedEvents(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero bannerUrl={settings.heroBannerUrl} />
      <OnAirSection programs={programs} schedules={schedules} />
      <ProgramsSection programs={programs} schedules={schedules} />
      <PlaylistsSection playlists={playlists} />
      <NewsSection articles={news} />
      <EventsSection events={events} />
      <SocialSection socialLinks={settings.socialLinks} />
    </>
  );
}
