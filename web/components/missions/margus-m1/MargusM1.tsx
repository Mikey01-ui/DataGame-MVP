"use client";

import { useState } from "react";
import { M1GameProvider } from "@/lib/game/m1/context";
import { M1Game } from "@/components/missions/m1/M1Game";
import { MargusM1Brief } from "./MargusM1Brief";
import { MargusM1Protocol } from "./MargusM1Protocol";

export function MargusM1() {
  const [currentPhase, setCurrentPhase] = useState<"brief" | "protocol" | "game">("brief");

  const handleBriefContinue = () => {
    setCurrentPhase("protocol");
  };

  const handleProtocolContinue = () => {
    setCurrentPhase("game");
  };

  return (
    <div className="margus-m1">
      {currentPhase === "brief" && <MargusM1Brief onContinue={handleBriefContinue} />}

      {currentPhase === "protocol" && <MargusM1Protocol onContinue={handleProtocolContinue} />}

      {currentPhase === "game" && (
        <M1GameProvider>
          <M1Game />
        </M1GameProvider>
      )}
    </div>
  );
}
