"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { M1HackOverlay } from "@/components/missions/m1/M1HackOverlay";
import { M5Debrief } from "@/components/missions/m5/M5Debrief";
import { M5SynthOverlay } from "@/components/missions/m5/M5SynthOverlay";
import { M5VoteOverlay } from "@/components/missions/m5/M5VoteOverlay";
import { Gloss } from "@/components/missions/shared/GlossTip";
import {
  CREW_META,
  CREW_ORDER,
  CREW_QUESTIONS,
  ECHO_FRAME,
  ECHO_VIZ,
  EVIDENCE_CARDS,
  FRAME_OPTIONS,
  HACK_LINES,
  VIZ_OPTIONS,
} from "@/lib/game/m5/data";
import { M5GameProvider, useM5Game } from "@/lib/game/m5/context";
import { getDetectionClass } from "@/lib/game/m5/reducer";
import type { ChatMessage, CrewId } from "@/lib/game/m5/types";

const SENDER_COLORS: Record<string, string> = {
  Voss: "#8f44e8",
  Echo: "#f79421",
  Zex: "#f79421",
  Atlas: "#00c41c",
  Nova: "#d31972",
  Kade: "#8f44e8",
};

const FRAME_GLOSS =
  "How you position the evidence for the audience. Risk-focused highlights threats and gaps. Opportunity-focused highlights reasons to proceed. Neutral presents facts only — rarely the strongest choice when someone has a specific objection to address.";
const VIZ_GLOSS =
  "The format used to show the evidence. Must match the type of data — a node map proves connectivity, a traffic light grid shows decisions, a matrix shows ownership. Wrong format makes the room do extra work.";

/** Mission channel with the original's typing-dots reveal (650ms per message). */
function MissionChannel({ messages }: { messages: ChatMessage[] }) {
  const [revealed, setRevealed] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const pending = messages.length > revealed;

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), 650);
    return () => clearTimeout(t);
  }, [pending, revealed]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [revealed, pending]);

  const shown = messages.slice(0, revealed);
  const next = pending ? messages[revealed] : null;
  const nextShowsSender = next && (revealed === 0 || shown[revealed - 1]?.sender !== next.sender);

  return (
    <div id="voss-body" ref={bodyRef}>
      <div className="bm-sep">
        <div className="bm-sep-pill">TODAY</div>
      </div>
      {shown.map((msg, i) => {
        const showSender = i === 0 || shown[i - 1].sender !== msg.sender;
        return (
          <div key={msg.id} className="bm-group">
            {showSender && (
              <div className="bm-sender" style={{ color: SENDER_COLORS[msg.sender] ?? "#7fa8cc" }}>
                {msg.sender.toUpperCase()}
              </div>
            )}
            <div className={`bm-bubble ${msg.tone} show`}>{msg.text}</div>
            <div className="bm-ts">{msg.ts}</div>
          </div>
        );
      })}
      {next && (
        <div className="bm-typing-wrap">
          {nextShowsSender && (
            <div className="bm-sender" style={{ color: SENDER_COLORS[next.sender] ?? "#7fa8cc" }}>
              {next.sender.toUpperCase()}
            </div>
          )}
          <div className="bm-typing">
            <span className="tdot" />
            <span className="tdot" />
            <span className="tdot" />
          </div>
        </div>
      )}
    </div>
  );
}

function framingReady(choices: ReturnType<typeof useM5Game>["state"]["frameChoices"]) {
  for (let i = 1; i <= 4; i++) {
    const c = choices[i];
    if (!c?.frame || !c?.viz) return false;
  }
  return true;
}

function CrewRow({
  crewId,
  retryFlash,
  onSubmit,
}: {
  crewId: CrewId;
  retryFlash: { crewId: CrewId; chosen: number } | null;
  onSubmit: (crewId: CrewId) => void;
}) {
  const { state, dispatch } = useM5Game();
  const meta = CREW_META[crewId];
  const cs = state.crewState[crewId];
  const q = CREW_QUESTIONS[crewId];
  const rowRef = useRef<HTMLDivElement>(null);
  const flashing = retryFlash?.crewId === crewId;

  useEffect(() => {
    if (cs.status === "asking") rowRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [cs.status]);

  const rowClass = [
    "crew-member-row",
    cs.status === "pending" ? "locked" : "",
    cs.status === "asking" ? "active" : "",
    cs.status === "committed" ? "committed" : "",
    cs.status === "sceptical" ? "sceptical" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const badgeText = cs.status === "committed" ? "COMMITTED ✓" : cs.status === "sceptical" ? "SCEPTICAL ✗" : cs.status === "asking" ? "ASKING" : "PENDING";

  return (
    <div className={rowClass} id={`crew-${crewId}`} ref={rowRef}>
      <div className="crew-top">
        <div className="crew-avatar" style={{ background: `${meta.color === "var(--orange)" ? "rgba(247,148,33,.12)" : meta.color === "var(--green-stable)" ? "rgba(0,196,28,.08)" : meta.color === "var(--pink)" ? "rgba(211,25,114,.10)" : "rgba(143,68,232,.10)"}`, border: `2px solid ${meta.color}`, color: meta.color }}>
          {meta.initial}
        </div>
        <div>
          <div className="crew-name">{meta.name}</div>
          <div className="crew-domain">{meta.domain}</div>
        </div>
        <div className={`crew-status-badge ${cs.status}`} id={`badge-${crewId}`}>
          {badgeText}
        </div>
      </div>
      {(cs.status === "asking" || flashing) && (
        <div className="crew-question show" id={`q-${crewId}`}>
          <div>{q.text}</div>
          <div className="crew-opts" id={`opts-${crewId}`}>
            {q.opts.map((opt, i) => {
              let cls = "crew-opt";
              if (flashing) {
                cls += " disabled";
                if (retryFlash!.chosen === i) cls += " wrong";
              } else if (cs.selected === i) {
                cls += " selected";
              }
              return (
                <div key={i} className={cls} onClick={() => !flashing && dispatch({ type: "SELECT_CREW_OPT", crewId, idx: i })}>
                  {opt}
                </div>
              );
            })}
          </div>
          <button type="button" className="crew-confirm" id={`conf-${crewId}`} disabled={cs.selected === null || flashing} onClick={() => onSubmit(crewId)}>
            SUBMIT →
          </button>
          {flashing && <div className="crew-verdict v-skip show">{q.sceptical} (detection +10%)</div>}
        </div>
      )}
      {cs.status === "committed" && <div className="crew-verdict v-commit show">{q.commit}</div>}
      {cs.status === "sceptical" && <div className="crew-verdict v-skip show">Not convinced. Moving on.</div>}
    </div>
  );
}

function M5GameInner() {
  const { state, dispatch } = useM5Game();
  const router = useRouter();
  const [synthDone, setSynthDone] = useState(false);
  const [retryFlash, setRetryFlash] = useState<{ crewId: CrewId; chosen: number } | null>(null);
  const timer = `${String(Math.floor(state.timerSec / 60)).padStart(2, "0")}:${String(state.timerSec % 60).padStart(2, "0")}`;
  const det = Math.round(state.detection);
  const detClass = getDetectionClass(det);
  const barClass = det < 35 ? "det-bar-green" : det < 70 ? "det-bar-amber" : "det-bar-red";
  const detIcon = det < 35 ? "fa-shield-alt" : det < 70 ? "fa-exclamation-triangle" : "fa-radiation";

  useEffect(() => {
    if (state.phase === "vote") setSynthDone(false);
  }, [state.phase]);

  // Crew submit with the original's retry flash: wrong first answers show the
  // sceptical verdict + marked option for 2.2s before the row resets.
  const submitCrew = useCallback(
    (crewId: CrewId) => {
      const cs = state.crewState[crewId];
      const q = CREW_QUESTIONS[crewId];
      if (cs.selected === null) return;
      const wrongFirstTry = cs.selected !== q.ans && !cs.retried;
      if (wrongFirstTry) {
        setRetryFlash({ crewId, chosen: cs.selected });
        setTimeout(() => setRetryFlash(null), 2200);
      }
      dispatch({ type: "CONFIRM_CREW", crewId });
    },
    [state.crewState, dispatch]
  );

  const completeMission = useCallback(async () => {
    await fetch("/api/progress", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        missionId: "m5",
        status: "completed",
        checkpoint: "completed",
        score: state.score,
        stateJson: {
          version: 2,
          commits: state.commits,
          ships: state.ships,
          detection: state.detection,
          timerSec: state.timerSec,
        },
      }),
    });
    router.push("/hub");
    router.refresh();
  }, [router, state.commits, state.detection, state.score, state.ships, state.timerSec]);

  const showFraming = state.phase === "framing" || state.phase === "briefing";

  return (
    <div className="m5-mission gp-html-active">
      {state.phase === "hack" && <M1HackOverlay lines={HACK_LINES} visibleCount={state.hackLine + 1} />}

      <div id="gp-root" className={state.hackDone ? "active" : ""}>
        <div id="game">
          <div id="hdr">
            <div className="hdr-left">
              <i className="fas fa-terminal" /> MASTERMIND TERMINAL · OPERATION OMNI
            </div>
            <div className="hdr-center">MISSION 05 OF 05 / THE FINAL BRIEF</div>
            <div className="hdr-right">
              <span id="det-display" className={detClass}>
                <span id="det-icon">
                  <i className={`fas ${detIcon}`} />
                </span>
                <span id="det-pct">{det}%</span>
                <span className="det-bar-wrap">
                  <span id="det-bar" className={barClass} style={{ width: `${det}%` }} />
                </span>
                <span style={{ fontSize: 10, letterSpacing: 1.5, opacity: 0.7 }}>DARK</span>
              </span>
              <span style={{ color: "rgba(0,196,28,.2)", margin: "0 4px" }}>|</span>
              <span id="timer">{timer}</span>
              <span className="live-dot" />
              <span style={{ letterSpacing: 1, fontSize: 10 }}>LIVE</span>
            </div>
          </div>

          <div id="step-banner">{state.stepBanner}</div>

          <div id="main-row">
            <div id="brief-panel">
              {showFraming && (
                <div id="phase-framing">
                  <div className="phase-label">STEP 01 — ECHO FRAMING</div>
                  <div className="evidence-grid" id="ev-grid">
                    {EVIDENCE_CARDS.map((card) => {
                      const choice = state.frameChoices[card.id] ?? {};
                      const echoLines: string[] = [];
                      if (choice.frame) echoLines.push(ECHO_FRAME[card.id].msgs[choice.frame]);
                      if (choice.viz) echoLines.push(ECHO_VIZ[card.id].msgs[choice.viz]);
                      return (
                        <div key={card.id} className="ev-card" id={`evc-${card.id}`}>
                          <div className="ev-op">{card.op}</div>
                          <div className="ev-title">{card.title}</div>
                          <div className="ev-finding">{card.finding}</div>
                          <div className="ev-qual clean">● CLEAN</div>
                          <div className="ev-choices">
                            <div className="ev-choice-label">
                              <Gloss scopeClass="m5-mission" text={FRAME_GLOSS}>
                                FRAMING TYPE ⓘ
                              </Gloss>
                            </div>
                            <div className="choice-btns">
                              {FRAME_OPTIONS.map((opt) => (
                                <button
                                  key={opt.key}
                                  type="button"
                                  className={`choice-btn${choice.frame === opt.key ? " selected" : ""}${state.framingLocked ? " locked" : ""}`}
                                  disabled={state.framingLocked}
                                  onClick={() => dispatch({ type: "SELECT_FRAME", cardId: card.id, frame: opt.key })}
                                >
                                  <span className="cb-ico">
                                    <i className={`fas ${opt.icon}`} aria-hidden />
                                  </span>
                                  <span className="cb-lbl">{opt.label}</span>
                                </button>
                              ))}
                            </div>
                            <div className="ev-choice-label" style={{ marginTop: 5 }}>
                              <Gloss scopeClass="m5-mission" text={VIZ_GLOSS}>
                                VISUALISATION ⓘ
                              </Gloss>
                            </div>
                            <div className="choice-btns">
                              {VIZ_OPTIONS[card.id].map((opt) => (
                                <button
                                  key={opt.key}
                                  type="button"
                                  className={`choice-btn${choice.viz === opt.key ? " selected" : ""}${state.framingLocked ? " locked" : ""}`}
                                  disabled={state.framingLocked}
                                  onClick={() => dispatch({ type: "SELECT_VIZ", cardId: card.id, viz: opt.key })}
                                >
                                  <span className="cb-ico">
                                    <i className={`fas ${opt.icon}`} aria-hidden />
                                  </span>
                                  <span className="cb-lbl">{opt.label}</span>
                                </button>
                              ))}
                            </div>
                            {echoLines.length > 0 && (
                              <div className="echo-line show" id={`echo-${card.id}`}>
                                {echoLines.map((line, i) => (
                                  <span key={i}>
                                    <span className="echo-tag">ECHO</span>
                                    {line}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {!state.framingLocked && (
                    <button type="button" id="framing-confirm" disabled={!framingReady(state.frameChoices)} onClick={() => dispatch({ type: "CONFIRM_FRAMING" })}>
                      ENTER THE BRIEFING ROOM →
                    </button>
                  )}
                </div>
              )}

              {state.phase === "briefing" && (
                <div id="phase-briefing">
                  <div className="phase-label">STEP 02 — CREW BRIEFING</div>
                  {CREW_ORDER.map((crewId) => (
                    <CrewRow key={crewId} crewId={crewId} retryFlash={retryFlash} onSubmit={submitCrew} />
                  ))}
                </div>
              )}
            </div>

            <div id="right">
              <div id="voss-wrap">
                <div className="voss-hdr">
                  <div className="bk-avatar">
                    <i className="fas fa-user-secret" aria-hidden />
                  </div>
                  <div className="bk-info">
                    <div className="bk-name">Mission Channel</div>
                    <div className="bk-members">
                      <span className="bk-member online">Voss</span>
                      <span className="bk-sep">,</span>
                      <span className="bk-member online">Echo</span>
                      <span className="bk-sep">,</span>
                      <span className="bk-member online">Zex</span>
                      <span className="bk-sep">,</span>
                      <span className="bk-member online">Atlas</span>
                      <span className="bk-sep">,</span>
                      <span className="bk-member online">Nova</span>
                      <span className="bk-sep">,</span>
                      <span className="bk-member online">Kade</span>
                    </div>
                  </div>
                  <div className="bk-icons">
                    <i className="fas fa-lock" aria-hidden />
                  </div>
                </div>
                <MissionChannel messages={state.messages} />
                <div className="voss-footer">
                  <div className="voss-input-bar">
                    <input id="voss-input" readOnly placeholder="// channel encrypted — read only" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {state.phase === "vote" && state.ships !== null && !synthDone && (
        <M5SynthOverlay ships={state.ships} commits={state.commits} crewState={state.crewState} onDone={() => setSynthDone(true)} />
      )}
      {state.phase === "vote" && state.ships !== null && synthDone && (
        <M5VoteOverlay ships={state.ships} commits={state.commits} crewState={state.crewState} onContinue={() => dispatch({ type: "TRIGGER_VOTE" })} />
      )}

      {state.phase === "debrief" && <M5Debrief state={state} onComplete={completeMission} />}
    </div>
  );
}

export function M5Game() {
  return (
    <M5GameProvider>
      <M5GameInner />
    </M5GameProvider>
  );
}
