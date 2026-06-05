"use client";

import { useState } from "react";
import { MargusM1Brief } from "./MargusM1Brief";
import { MargusM1Protocol } from "./MargusM1Protocol";
import { MargusM1Game, type GameStats } from "./MargusM1Game";
import { MargusM1Debrief } from "./MargusM1Debrief";

type Phase = "brief" | "protocol" | "game" | "debrief";

export function MargusM1() {
  const [phase, setPhase] = useState<Phase>("brief");
  const [stats, setStats] = useState<GameStats | null>(null);

  return (
    <div className="margus-m1">
      {phase === "brief" && <MargusM1Brief onContinue={() => setPhase("protocol")} />}
      {phase === "protocol" && <MargusM1Protocol onContinue={() => setPhase("game")} />}
      {phase === "game" && (
        <MargusM1Game
          onComplete={(s) => {
            setStats(s);
            setPhase("debrief");
          }}
        />
      )}
      {phase === "debrief" && stats && (
        <MargusM1Debrief
          stats={stats}
          onContinue={() => {
            // End of Mission 1 — restart the flow for local testing.
            setPhase("brief");
          }}
        />
      )}
    </div>
  );
}
