"use client";

import { useCallback, useEffect, useState } from "react";
import type { MissionIntro } from "@/lib/content";
import { checkpointToPhase, type MissionPhase } from "@/lib/game/types";
import { useMissionProgress } from "@/lib/game/useMissionProgress";
import { MissionChrome } from "@/components/missions/MissionChrome";
import { BriefPhase } from "@/components/missions/phases/BriefPhase";
import { ProtocolPhase } from "@/components/missions/phases/ProtocolPhase";
import { MissionGame } from "@/components/missions/MissionGame";
import { M3TutorialPhase } from "@/components/missions/m3/M3TutorialPhase";
import { PlaytestMissionNav } from "@/components/admin/PlaytestMissionNav";

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

function shouldShowM3Tutorial() {
  if (typeof window === "undefined") return true;
  try {
    return !new URLSearchParams(window.location.search).has("notutorial");
  } catch {
    return true;
  }
}

export function MissionExperience({
  intro,
  missionId,
  missionName,
  missionLabel,
  initialCheckpoint,
  resume,
}: MissionExperienceProps) {
  const isM3 = missionId === "m3";
  const { save } = useMissionProgress(intro.missionId);
  const [phase, setPhase] = useState<MissionPhase>(() =>
    checkpointToPhase(initialCheckpoint, resume, missionId)
  );
  const [clock, setClock] = useState("--:--:--");
  const [fromBrief, setFromBrief] = useState(false);

  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const goToTutorial = useCallback(async () => {
    if (isM3 && !shouldShowM3Tutorial()) {
      setPhase("game");
      await save({ phase: "game" });
      return;
    }
    setFromBrief(true);
    setPhase("tutorial");
    await save({ phase: "tutorial" });
  }, [isM3, save]);

  const goToProtocol = useCallback(async () => {
    if (isM3) {
      await goToTutorial();
      return;
    }
    setPhase("protocol");
    await save({ phase: "protocol" });
  }, [goToTutorial, isM3, save]);

  const goToGame = useCallback(async () => {
    setPhase("game");
    await save({ phase: "game" });
  }, [save]);

  if (phase === "game") {
    return (
      <>
        <MissionGame missionId={missionId} missionLabel={missionLabel} missionName={missionName} />
        {missionId !== "m3" ? <PlaytestMissionNav missionId={missionId} /> : null}
      </>
    );
  }

  if (phase === "tutorial" && isM3) {
    return <M3TutorialPhase enterFromBrief={fromBrief} onComplete={goToGame} />;
  }

  return (
    <MissionChrome statusLeft={intro.statusLeft} statusRight={intro.statusRight} clock={clock}>
      {phase === "brief" && <BriefPhase brief={intro.brief} onContinue={goToProtocol} />}
      {phase === "protocol" && (
        <ProtocolPhase
          protocol={intro.protocol}
          onBreach={goToGame}
          showAllSteps={isM3}
          hideBreachButton={isM3}
        />
      )}
    </MissionChrome>
  );
}
