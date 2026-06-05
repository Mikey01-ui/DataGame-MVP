import type { MissionIntro } from "@/lib/content";
import { MissionExperience } from "@/components/missions/MissionExperience";

type MissionRendererProps = {
  intro: MissionIntro;
  missionId: string;
  missionName: string;
  missionLabel: string;
  initialCheckpoint: string | null;
  resume: boolean;
  savedState?: Record<string, unknown> | null;
};

export function MissionRenderer(props: MissionRendererProps) {
  return <MissionExperience {...props} />;
}
