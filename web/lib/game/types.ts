export type MissionPhase = "brief" | "protocol" | "game";

export function checkpointToPhase(
  checkpoint: string | null | undefined,
  resume: boolean
): MissionPhase {
  if (!resume) return "brief";
  if (!checkpoint || checkpoint === "start" || checkpoint === "intro") return "brief";
  if (checkpoint === "brief") return "brief";
  if (checkpoint === "protocol") return "protocol";
  return "game";
}

export function phaseToCheckpoint(phase: MissionPhase): string {
  if (phase === "brief") return "brief";
  if (phase === "protocol") return "protocol";
  return "game";
}
