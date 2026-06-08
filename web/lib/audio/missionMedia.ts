import type { MissionMedia } from "@/lib/content";
import type { MissionAudioConfig } from "@/lib/audio/types";

export function toMissionAudioConfig(media: MissionMedia | null | undefined): MissionAudioConfig | null {
  if (!media?.sfx && !media?.ambient) return null;
  return {
    missionId: media.missionId,
    ambient: media.ambient,
    sfx: media.sfx,
  };
}
