"use client";

import { useEffect, useRef, useState } from "react";
import { CREW_ORDER, ECHO_FRAME, ECHO_VIZ } from "@/lib/game/m5/data";
import type { M5GameState } from "@/lib/game/m5/types";

const CREW_LABELS: Record<string, string> = {
  zex: "ZEX — Data Analysis",
  atlas: "ATLAS — Governance",
  nova: "NOVA — Ethics",
  kade: "KADE — Data Flows",
};

const LEARNING: Record<string, { who: string; txt: React.ReactNode }> = {
  zex: {
    who: "ZEX · Data Analysis",
    txt: (
      <>
        A node map proves things are <strong>connected</strong> — not that they are switched on. Reading connectivity as live status overstates what the evidence shows.
      </>
    ),
  },
  atlas: {
    who: "ATLAS · Governance",
    txt: (
      <>
        When data crosses a department boundary, governance follows <strong>verified, formal accountability</strong> — not the creator and not the heaviest downstream user.
      </>
    ),
  },
  nova: {
    who: "NOVA · Ethics",
    txt: (
      <>
        Anonymisation is not a universal fix. When the <strong>purpose or basis of collection is itself harmful</strong>, a dataset must be dropped, not just stripped of names.
      </>
    ),
  },
  kade: {
    who: "KADE · Data Flows",
    txt: (
      <>
        A bottleneck is a <strong>convergence point</strong> where dependencies stack on one step — if it fails, everything downstream stalls. That is the real exposure, not mere
        slowness.
      </>
    ),
  },
};

/** Two-panel mission debrief, ported from round5_v3's showDebrief() with staged reveal. */
export function M5Debrief({ state, onComplete }: { state: M5GameState; onComplete: () => void }) {
  const ships = state.commits >= 3;
  const m = String(Math.floor(state.timerSec / 60)).padStart(2, "0");
  const s = String(state.timerSec % 60).padStart(2, "0");
  let wrongF = 0;
  let wrongV = 0;
  for (let i = 1; i <= 4; i++) {
    const c = state.frameChoices[i] ?? {};
    if (c.frame && c.frame !== ECHO_FRAME[i].correct) wrongF++;
    if (c.viz && c.viz !== ECHO_VIZ[i].correct) wrongV++;
  }
  const det = Math.round(state.detection);
  const detClass = det < 35 ? "det-green" : det < 70 ? "det-amber" : "det-red";
  const rating = ships
    ? "Operation shipped. The room committed. That is the only metric that matters."
    : "Operation aborted. Review which framing and crew answers cost you the vote.";

  // Staged reveal matching the original (_debriefReveal)
  const [revealStep, setRevealStep] = useState(0);
  useEffect(() => {
    const delays = [180, 480, 780, 1080, 1210, 1340, 1670, 2070];
    const timers = delays.map((d, i) => setTimeout(() => setRevealStep(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Scroll cues (_wireDebriefScrollCues)
  const detectRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    [detectRef.current, tcRef.current].forEach((el) => {
      if (!el) return;
      const panel = el.closest(".db-panel");
      if (!panel) return;
      const sync = () => {
        panel.classList.toggle("has-overflow", el.scrollHeight > el.clientHeight + 4);
        panel.classList.toggle("scrolled-bottom", el.scrollHeight - el.scrollTop - el.clientHeight < 8);
      };
      el.addEventListener("scroll", sync);
      sync();
      cleanups.push(() => el.removeEventListener("scroll", sync));
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  const show = (step: number) => (revealStep >= step ? " show" : "");

  return (
    <div id="debrief-overlay" className="active">
      <div className="db-header">
        <div className="page-eyebrow" id="db-eyebrow">
          {ships ? "// Mission 5 — Operation Shipped" : "// Mission 5 — Operation Aborted"}
        </div>
        <div className="page-title" id="db-head">
          {ships ? "OMNI Exposed · Debrief" : "Operation Aborted · Debrief"}
        </div>
      </div>

      <div className="db-main">
        <div className="db-panel">
          <div className="db-panel-label">{"// MISSION REPORT"}</div>
          <div className="mr-metrics" id="mr-metrics">
            <div className="mr-metric">
              <div className="mr-metric-val">
                {m}:{s}
              </div>
              <div className="mr-metric-lbl">TIME</div>
            </div>
            <div className="mr-metric">
              <div className="mr-metric-val">{state.commits}/4</div>
              <div className="mr-metric-lbl">COMMITS</div>
            </div>
            <div className="mr-metric">
              <div className="mr-metric-val">{state.score}</div>
              <div className="mr-metric-lbl">SCORE</div>
            </div>
            <div className="mr-metric">
              <div className={`mr-metric-val ${detClass}`}>{det}%</div>
              <div className="mr-metric-lbl">DETECTION</div>
            </div>
          </div>
          <div className="mr-detect" id="mr-detect" ref={detectRef}>
            <div className="mr-detect-ttl">PERFORMANCE BREAKDOWN</div>
            <div className="mr-detect-row">
              <span>Framing accuracy</span>
              <span style={{ color: wrongF === 0 ? "var(--green)" : "var(--red)" }}>{wrongF === 0 ? "PERFECT" : `${wrongF} wrong`}</span>
            </div>
            <div className="mr-detect-row">
              <span>Visualisation accuracy</span>
              <span style={{ color: wrongV === 0 ? "var(--green)" : "var(--red)" }}>{wrongV === 0 ? "PERFECT" : `${wrongV} wrong`}</span>
            </div>
            {CREW_ORDER.map((c) => {
              const committed = state.crewState[c].status === "committed";
              return (
                <div key={c} className="mr-detect-row">
                  <span>{CREW_LABELS[c]}</span>
                  <span style={{ color: committed ? "var(--green)" : "var(--red)" }}>{committed ? "COMMITTED" : "SCEPTICAL"}</span>
                </div>
              );
            })}
            <div className="mr-detect-row total">
              <span>Crew commits</span>
              <span className={detClass}>{state.commits} / 4</span>
            </div>
            <div className="mr-rating">{rating}</div>
          </div>
        </div>

        <div className="db-panel">
          <div className="db-panel-label">{"// TRADECRAFT — ECHO"}</div>
          <div className="tc-content" ref={tcRef}>
            <div className={`tc-block${show(1)}`} id="tc-1">
              <p>
                You just did what every analyst eventually faces: <strong>turning evidence into commitment</strong>. Not just finding the answer — explaining it to the room, in
                terms the room can act on.
              </p>
            </div>
            <div className={`tc-block${show(2)}`} id="tc-2">
              <p>
                The thing you actually did is <strong>Decision Communication</strong>. It isn&apos;t a soft skill. It&apos;s three disciplines executed in sequence — and the room
                only commits when all three land.
              </p>
            </div>
            <div className={`tc-block${show(3)}`} id="tc-3">
              <p>
                What you produced carries forward as the <strong>Final Brief</strong>: the compiled case that answers every objection the crew raised across four operations.
              </p>
            </div>

            <div className="tc-pillars">
              <div className={`tc-pillar${show(4)}`}>
                <div className="tc-pillar-tag">— skill one</div>
                <div className="tc-pillar-ttl">Frame for the audience.</div>
                <div className="tc-pillar-txt">
                  Risk, opportunity, neutral — each crew member needed a different argument. The same evidence, framed wrong, gives them a reason to object instead of a reason to
                  commit.
                </div>
              </div>
              <div className={`tc-pillar${show(5)}`}>
                <div className="tc-pillar-tag">— skill two</div>
                <div className="tc-pillar-ttl">Match the format to the proof.</div>
                <div className="tc-pillar-txt">
                  A visualisation that needs explaining has already failed. The right format makes the evidence self-evident — the room understands before you speak.
                </div>
              </div>
              <div className={`tc-pillar${show(6)}`}>
                <div className="tc-pillar-tag">— skill three</div>
                <div className="tc-pillar-ttl">Answer the objection, not the question.</div>
                <div className="tc-pillar-txt">
                  Every crew member had a specific reason to say no. The challenge questions tested whether you understood what that reason was — and whether your evidence actually
                  addressed it.
                </div>
              </div>
            </div>

            <div className={`tc-block tc-learning${show(7)}`} id="tc-learning">
              <div className="tc-learning-ttl">WHAT EACH CHALLENGE ACTUALLY TESTED</div>
              <div id="tc-learning-rows">
                {CREW_ORDER.map((c) => {
                  const committed = state.crewState[c].status === "committed";
                  return (
                    <div key={c} className="tc-lrn-row">
                      <div className={`tc-lrn-dot ${committed ? "ok" : "no"}`}>{committed ? "✓" : "✕"}</div>
                      <div className="tc-lrn-body">
                        <div className="tc-lrn-who">{LEARNING[c].who}</div>
                        <div className="tc-lrn-txt">{LEARNING[c].txt}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`db-cta-row${show(8)}`} id="cta-row">
        <button className="db-cta" onClick={onComplete}>
          {ships ? "OPERATION COMPLETE — OMNI EXPOSED ✓" : "OPERATION CLOSED — RETURN TO HUB →"}
        </button>
      </div>
    </div>
  );
}
