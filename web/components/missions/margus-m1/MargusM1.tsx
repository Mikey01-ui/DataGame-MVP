"use client";

import { useState } from "react";
import { MargusM1Brief } from "./MargusM1Brief";
import { MargusM1Protocol } from "./MargusM1Protocol";

export function MargusM1() {
  const [currentPage, setCurrentPage] = useState<"brief" | "protocol" | "game">("brief");

  const handleBriefContinue = () => {
    setCurrentPage("protocol");
  };

  const handleProtocolContinue = () => {
    setCurrentPage("game");
  };

  return (
    <div className="margus-m1">
      {currentPage === "brief" && <MargusM1Brief onContinue={handleBriefContinue} />}
      {currentPage === "protocol" && <MargusM1Protocol onContinue={handleProtocolContinue} />}
      {currentPage === "game" && (
        <div style={{ color: "white", padding: "2rem", background: "var(--void)" }}>
          <h2>Mission Gameplay - Ready to Integrate</h2>
          <p>The brief and protocol screens are complete!</p>
          <p>Next steps: Integrate with the existing M1Game component.</p>
        </div>
      )}
    </div>
  );
}
