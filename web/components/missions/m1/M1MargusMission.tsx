"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { MargusM1Debrief } from "@/components/missions/margus-m1/MargusM1Debrief";
import { MargusM1Game, type GameStats } from "@/components/missions/margus-m1/MargusM1Game";
import { useMissionProgress } from "@/lib/game/useMissionProgress";

type Phase = "game" | "debrief";

export function M1MargusMission() {
  const router = useRouter();
  const { save } = useMissionProgress("m1");
  const [phase, setPhase] = useState<Phase>("game");
  const [stats, setStats] = useState<GameStats | null>(null);

  const handleComplete = useCallback((s: GameStats) => {
    setStats(s);
    setPhase("debrief");
    void save({
      status: "in_progress",
      checkpoint: "game",
      stateJson: {
        version: 1,
        phase: "debrief",
        timerSec: s.timerSec,
        detection: s.detection,
      },
    });
  }, [save]);

  const handleDebriefContinue = useCallback(async () => {
    const score = Math.max(0, 100 - (stats?.detection ?? 0));
    await save({
      status: "completed",
      checkpoint: "completed",
      score,
      stateJson: stats
        ? {
            version: 1,
            timerSec: stats.timerSec,
            detection: stats.detection,
            errors: stats.errors,
            hintsUsed: stats.hintsUsed,
          }
        : null,
    });
    await fetch("/api/progress", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        missionId: "m2",
        status: "in_progress",
        checkpoint: "start",
      }),
    });
    router.push("/mission/m2");
    router.refresh();
  }, [router, save, stats]);

  if (phase === "debrief" && stats) {
    return <MargusM1Debrief stats={stats} onContinue={() => void handleDebriefContinue()} />;
  }

  return <MargusM1Game onComplete={handleComplete} />;
}
