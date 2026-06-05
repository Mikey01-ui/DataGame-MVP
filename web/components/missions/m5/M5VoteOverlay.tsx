"use client";

import { CREW_ORDER } from "@/lib/game/m5/data";
import type { CrewId } from "@/lib/game/m5/types";

type Props = {
  active: boolean;
  ships: boolean;
  commits: number;
  crewState: Record<CrewId, { status: string }>;
  onContinue: () => void;
};

export function M5VoteOverlay({ active, ships, commits, crewState, onContinue }: Props) {
  if (!active) return null;

  const vossLine = ships
    ? "Four people who don't agree on anything just agreed on you. That's not nothing. Move."
    : "You built something real across four operations. The room didn't commit — but the work was real.";

  return (
    <div id="vote-overlay" className="active">
      <div className="vote-card">
        <div className="vote-title" id="vote-title">
          {ships ? "OPERATION SHIPS" : "OPERATION ABORTED"}
        </div>
        <div className="vote-tally" id="vote-tally">
          {CREW_ORDER.map((c) => {
            const st = crewState[c].status;
            return (
              <div key={c} className={`vote-pip ${st === "committed" ? "commit" : "sceptical"}`} title={c.toUpperCase()}>
                {st === "committed" ? "✓" : "✗"}
              </div>
            );
          })}
        </div>
        <div className="vote-voss" id="vote-voss-line">
          VOSS: {vossLine}
        </div>
        <div className="vote-outcome" id="vote-outcome" style={{ color: ships ? "var(--green-stable)" : "var(--pink)" }}>
          {ships ? `${commits}/4 specialists committed. The hack is a go.` : `${commits}/4 specialists committed. Threshold not met.`}
        </div>
        <div className="vote-sub" id="vote-sub">
          {ships ? "OMNI vault access initiated. Operation complete." : "Review the debrief to see which objections were not satisfied and why."}
        </div>
        <button type="button" className="vote-cta" onClick={onContinue}>
          VIEW DEBRIEF →
        </button>
      </div>
    </div>
  );
}
