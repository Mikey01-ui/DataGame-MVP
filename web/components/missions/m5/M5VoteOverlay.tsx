"use client";

import { CREW_ORDER } from "@/lib/game/m5/data";
import type { CrewId, CrewState } from "@/lib/game/m5/types";

/** The vote result card, ported from round5_v3's triggerVote() content. */
export function M5VoteOverlay({
  ships,
  commits,
  crewState,
  onContinue,
}: {
  ships: boolean;
  commits: number;
  crewState: Record<CrewId, CrewState>;
  onContinue: () => void;
}) {
  const vossLine = ships
    ? "Four people who don't agree on anything just agreed on you. That's not nothing. Move."
    : "You built something real across four operations. The room didn't commit — but the work was real. That's the difference between an analyst and a guesser. Remember it.";

  return (
    <div id="vote-overlay" className="active">
      <div className="vote-card">
        <div className="vote-badge">THE VOTE</div>
        <div className="vote-title" id="vote-title">
          {ships ? "OPERATION SHIPS" : "OPERATION ABORTED"}
        </div>
        <div className="vote-tally" id="vote-tally">
          {CREW_ORDER.map((c) => {
            const committed = crewState[c].status === "committed";
            return (
              <div key={c} className={`vote-pip ${committed ? "commit" : "sceptical"}`} title={c.toUpperCase()}>
                {committed ? "✓" : "✗"}
              </div>
            );
          })}
        </div>
        <div className="vote-voss" id="vote-voss-line">
          VOSS: {vossLine}
        </div>
        <div className="vote-outcome" id="vote-outcome" style={{ color: ships ? "var(--green)" : "var(--pink)" }}>
          {ships ? `${commits}/4 specialists committed. The hack is a go.` : `${commits}/4 specialists committed. Threshold not met.`}
        </div>
        <div className="vote-sub" id="vote-sub">
          {ships ? "OMNI vault access initiated. Operation complete." : "Review the debrief to see which objections were not satisfied and why."}
        </div>
        <button className="vote-btn" onClick={onContinue}>
          VIEW DEBRIEF →
        </button>
      </div>
    </div>
  );
}
