"use client";

import { useCallback } from "react";
import type { ProgressStatus } from "@/lib/progress";
import { phaseToCheckpoint, type MissionPhase } from "@/lib/game/types";

type SaveOptions = {
  phase?: MissionPhase;
  checkpoint?: string | null;
  status?: ProgressStatus;
  stateJson?: Record<string, unknown> | null;
  score?: number | null;
};

export function useMissionProgress(missionId: string) {
  const save = useCallback(
    async (options: SaveOptions) => {
      const checkpoint =
        options.checkpoint !== undefined
          ? options.checkpoint
          : options.phase
            ? phaseToCheckpoint(options.phase)
            : undefined;
      await fetch("/api/progress", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId,
          status: options.status ?? "in_progress",
          checkpoint,
          stateJson: options.stateJson,
          score: options.score,
        }),
      });
    },
    [missionId]
  );

  return { save };
}
