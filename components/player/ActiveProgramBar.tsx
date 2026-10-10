import { getPrograms, getSchedules } from "@/lib/content";
import { formatTimeRange } from "@/lib/format";
import { getActiveProgram, getRequestNow } from "@/lib/schedule";
import { LiveRadioPlayer, type OnAirInfo } from "./LiveRadioPlayer";

/**
 * Bar pemutar persisten. Jadwal dibaca di server setelah `connection()`
 * (lihat lib/schedule.getRequestNow) sehingga nama program mengikuti jam
 * Asia/Jakarta per request, bukan hasil prerender.
 */
export async function ActiveProgramBar() {
  const [programs, schedules, now] = await Promise.all([
    getPrograms(),
    getSchedules(),
    getRequestNow(),
  ]);
  const active = getActiveProgram(programs, schedules, now);

  let onAir: OnAirInfo | undefined;
  if (active) {
    onAir = {
      name: active.program.name,
      hostName: active.schedule.hostName,
      timeRange: formatTimeRange(active.schedule.startTime, active.schedule.endTime),
    };
  }

  return <LiveRadioPlayer variant="bar" activeProgram={onAir} />;
}
