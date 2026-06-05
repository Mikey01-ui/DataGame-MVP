"use client";

import { useCallback, useEffect, useState } from "react";
import type { MissionIntro } from "@/lib/content";
import { checkpointToPhase, type MissionPhase } from "@/lib/game/types";
import { useMissionProgress } from "@/lib/game/useMissionProgress";
import { MissionChrome } from "@/components/missions/MissionChrome";
import { BriefPhase } from "@/components/missions/phases/BriefPhase";
import { ProtocolPhase } from "@/components/missions/phases/ProtocolPhase";
import { MissionGame } from "@/components/missions/MissionGame";

type MissionExperienceProps = {
  intro: MissionIntro;
  missionId: string;
  missionName: string;
  missionLabel: string;
  initialCheckpoint: string | null;
  resume: boolean;
};

function formatClock(now: Date) {
  return now.toLocaleTimeString("en-GB", { hour12: false });
}

export function MissionExperience({
  intro,
  missionId,
  missionName,
  missionLabel,
  initialCheckpoint,
  resume,
}: MissionExperienceProps) {
  const { save } = useMissionProgress(intro.missionId);
  const [phase, setPhase] = useState<MissionPhase>(() =>
    checkpointToPhase(initialCheckpoint, resume)
  );
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const goToProtocol = useCallback(async () => {
    setPhase("protocol");
    await save({ phase: "protocol" });
  }, [save]);

  const goToGame = useCallback(async () => {
    setPhase("game");
    await save({ phase: "game" });
  }, [save]);

  if (phase === "game") {
    return <MissionGame missionId={missionId} missionLabel={missionLabel} missionName={missionName} />;
  }

  return (
    <MissionChrome statusLeft={intro.statusLeft} statusRight={intro.statusRight} clock={clock}>
      {phase === "brief" && <BriefPhase brief={intro.brief} onContinue={goToProtocol} />}
      {phase === "protocol" && <ProtocolPhase protocol={intro.protocol} onBreach={goToGame} />}
    </MissionChrome>
  );
}
