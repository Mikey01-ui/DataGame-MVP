"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { M1HackOverlay } from "@/components/missions/m1/M1HackOverlay";
import { MissionDebriefScreen } from "@/components/missions/shared/MissionDebriefScreen";
import { buildM2Debrief } from "@/lib/game/debriefBuilders";
import {
  DISPUTES,
  FILES,
  HACK_LINES,
  PERSONAL_FILES,
  TOKEN_LEADS,
  VERIFY,
} from "@/lib/game/m2/data";
import { M2GameProvider, useM2Game } from "@/lib/game/m2/context";
import { getDetectionClass, getDetectionLabel } from "@/lib/game/m2/reducer";
import type { DisputeId } from "@/lib/game/m2/types";

const SENDER_COLORS = { Atlas: "#00c41c", Voss: "#8f44e8" } as const;

function InspectorBody({ fileKey }: { fileKey: string }) {
  const f = FILES[fileKey];
  if (!f) return <div className="insp-empty">No file selected.</div>;
  const unverified = /UNVERIFIED/i.test(f.steward);

  return (
    <div>
      <div className="insp-file-hdr">
        <span className="insp-file-icon">📄</span>
        <div>
          <div className="insp-file-name">{f.name}</div>
          <div className="insp-file-meta">
            {f.records.toLocaleString()} records · last access {f.lastAccess}
          </div>
        </div>
      </div>
      <div className="insp-section-hdr">OWNERSHIP & GOVERNANCE</div>
      <div className="insp-row">
        <span className="insp-key">Source System</span>
        <span className="insp-val">{f.source}</span>
      </div>
      <div className="insp-row">
        <span className="insp-key">Data Steward ★</span>
        <span className={`insp-val${unverified ? "" : " highlight"}`} style={unverified ? { color: "#b00020", fontWeight: 700 } : undefined}>
          {f.steward}
          {unverified && <span style={{ marginLeft: 6, fontSize: 8, background: "#b00020", color: "#fff", padding: "1px 5px", borderRadius: 2 }}>⚠ NOT VERIFIED</span>}
        </span>
      </div>
      <div className="insp-row">
        <span className="insp-key">Classification</span>
        <span className="insp-val warn">{f.classification}</span>
      </div>
      <div className="insp-row">
        <span className="insp-key">Claimed By</span>
        <span className="insp-val">{f.claimedBy}</span>
      </div>
      <div className="insp-section-hdr">DATA LINEAGE</div>
      <div className="insp-lineage">
        {f.lineage.map((n, i) => (
          <span key={n}>
            <span className="lin-node">{n}</span>
            {i < f.lineage.length - 1 && <span className="lin-arrow"> → </span>}
          </span>
        ))}
      </div>
      <div className="insp-section-hdr">SCHEMA FIELDS</div>
      <div className="insp-schema">
        {f.schema.map((s) => (
          <span key={s} className="insp-field">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function TribunalBody({ disputeId, onRule }: { disputeId: DisputeId; onRule: (idx: 0 | 1) => void }) {
  const { state } = useM2Game();
  const d = DISPUTES.find((x) => x.id === disputeId)!;
  const done = state.results[disputeId] === "correct";
  const verified = !!state.verifyResults[disputeId];
  const [cA, cB] = d.claimants;

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <div className="trib-header">
        <div className="trib-case-id">
          CASE {d.caseId} · {d.topic}
        </div>
        <div className="trib-case-title">Ownership Conflict — {d.dataset}</div>
      </div>
      <div className="trib-claimant">
        <div className="trib-claimant-hdr cl-a">
          ⚠ CLAIMANT A — {cA.dept.toUpperCase()} <span style={{ fontWeight: 400, opacity: 0.7 }}>{cA.rep}</span>
        </div>
        <div className="trib-claimant-body">{cA.arg}</div>
        <div className="trib-evidence">
          Evidence: <strong>{d.dataset}</strong> — inspect in Registry
        </div>
      </div>
      <div className="trib-claimant">
        <div className="trib-claimant-hdr cl-b">
          ⚠ CLAIMANT B — {cB.dept.toUpperCase()} <span style={{ fontWeight: 400, opacity: 0.7 }}>{cB.rep}</span>
        </div>
        <div className="trib-claimant-body">{cB.arg}</div>
      </div>
      {!done && (
        <div className="trib-verdict-row">
          <button type="button" className={`trib-btn trib-btn-a${state.wrongShake === 0 ? " wrong-shake" : ""}`} onClick={() => onRule(0)}>
            <span className="trib-btn-name">RULE FOR {cA.dept.toUpperCase()}</span>
            <span className="trib-btn-role">{cA.rep}</span>
          </button>
          <button type="button" className={`trib-btn trib-btn-b${state.wrongShake === 1 ? " wrong-shake" : ""}`} onClick={() => onRule(1)}>
            <span className="trib-btn-name">RULE FOR {cB.dept.toUpperCase()}</span>
            <span className="trib-btn-role">{cB.rep}</span>
          </button>
        </div>
      )}
      {done && !verified && (
        <div className="trib-ruling-done">
          <strong>✓ RULING RECORDED:</strong> {d.claimants[d.correctIdx].dept}
          <br />
          <span style={{ color: "#555", fontSize: 10 }}>{d.settleFact}</span>
        </div>
      )}
      {verified && (
        <div className="trib-ruling-done" style={{ background: "#f0fdf4", borderTop: "2px solid #28a745" }}>
          <strong>✓ RULING + VERIFICATION COMPLETE</strong>
          <br />
          {d.claimants[d.correctIdx].dept} — Token extracted.
        </div>
      )}
    </div>
  );
}

function M2GameInner() {
  const { state, dispatch } = useM2Game();
  const router = useRouter();

  const activeDispute = state.activeDispute ?? 1;
  const timer = `${String(Math.floor(state.timerSec / 60)).padStart(2, "0")}:${String(state.timerSec % 60).padStart(2, "0")}`;
  const det = Math.round(state.detection);
  const detClass = getDetectionClass(det);
  const barClass = det < 35 ? "det-bar-green" : det < 70 ? "det-bar-amber" : "det-bar-red";

  const registryRows = useMemo(() => Object.entries(FILES), []);

  const completeMission = useCallback(async () => {
    await fetch("/api/progress", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        missionId: "m2",
        status: "completed",
        checkpoint: "completed",
        score: state.score,
        stateJson: {
          version: 1,
          timerSec: state.timerSec,
          tokens: state.tokens.length,
          wrongRulings: state.wrongRulings,
          verifyErrors: state.verifyErrors,
          hintsUsed: state.hintsUsed,
        },
      }),
    });
    router.push("/mission/m3");
    router.refresh();
  }, [router, state.hintsUsed, state.score, state.timerSec, state.tokens.length, state.verifyErrors, state.wrongRulings]);

  const debrief = useMemo(() => buildM2Debrief(state), [state]);

  const tokenLeads = Object.values(TOKEN_LEADS);

  return (
    <div className="m2-game">
      <div id="m2-game" className={state.hackDone ? "active" : ""}>
        {state.hackDone && (
          <>
            <div id="hdr">
              <div className="hdr-left">⌘ MASTERMIND TERMINAL · OPERATION OMNI</div>
              <div className="hdr-center">MISSION 02 OF 05 / FORGING THE MASTER KEY</div>
              <div className="hdr-right">
                <span id="det-display" className={detClass}>
                  <span id="det-pct">{det}%</span>
                  <span className="det-bar-wrap">
                    <span id="det-bar" className={barClass} style={{ width: `${det}%` }} />
                  </span>
                  <span style={{ fontSize: 10, opacity: 0.7 }}>{getDetectionLabel(det)}</span>
                </span>
                <span style={{ color: "rgba(0,196,28,.2)", margin: "0 4px" }}>|</span>
                <span id="timer">{timer}</span>
                <span className="live-dot" />
                <span style={{ fontSize: 10, letterSpacing: 1 }}>LIVE</span>
              </div>
            </div>

            <div id="step-banner">{state.stepBanner}</div>

            <div id="main-row">
              <div id="desktop-panel">
                <div id="wallpaper" className="visible" />

                <button type="button" className="di di-mission visible" style={{ top: 20, left: 12 }} onDoubleClick={() => dispatch({ type: "OPEN_WINDOW", windowId: "win-tribunal" })}>
                  <span className="di-icon">⚖</span>
                  <div className="di-label">Governance_Tribunal</div>
                </button>
                <button type="button" className="di visible" style={{ top: 118, left: 12 }} onDoubleClick={() => dispatch({ type: "OPEN_WINDOW", windowId: "win-registry" })}>
                  <span className="di-icon">📁</span>
                  <div className="di-label">Data_Registry</div>
                </button>
                <button type="button" className="di visible" style={{ top: 216, left: 12 }} onDoubleClick={() => dispatch({ type: "OPEN_WINDOW", windowId: "win-inspector" })}>
                  <span className="di-icon">🔍</span>
                  <div className="di-label">File_Inspector</div>
                </button>
                <button type="button" className="di visible" style={{ top: 314, left: 12 }} onDoubleClick={() => dispatch({ type: "OPEN_WINDOW", windowId: "win-personal" })}>
                  <span className="di-icon" style={{ color: "#f0c538" }}>
                    📁
                  </span>
                  <div className="di-label">Marshall_Personal</div>
                </button>

                {state.openWindows.includes("win-tribunal") && (
                  <div className="xp-win visible" id="win-tribunal" style={{ top: 36, left: 86, width: 498, zIndex: 112 }}>
                    <div className="xp-tb">
                      <span className="xp-title">Governance_Tribunal.exe</span>
                      <button type="button" className="xp-btn xp-cls" onClick={() => dispatch({ type: "CLOSE_WINDOW", windowId: "win-tribunal" })}>
                        ✕
                      </button>
                    </div>
                    <div className="xp-body" style={{ height: 320 }}>
                      <TribunalBody disputeId={activeDispute} onRule={(idx) => dispatch({ type: "RULE", disputeId: activeDispute, chosenIdx: idx })} />
                    </div>
                  </div>
                )}

                {state.openWindows.includes("win-registry") && (
                  <div className="xp-win visible" style={{ top: 80, left: 120, width: 460, zIndex: 110 }}>
                    <div className="xp-tb">
                      <span className="xp-title">Data_Registry.exe</span>
                      <button type="button" className="xp-btn xp-cls" onClick={() => dispatch({ type: "CLOSE_WINDOW", windowId: "win-registry" })}>
                        ✕
                      </button>
                    </div>
                    <div className="xp-body" style={{ padding: 0, overflow: "auto", maxHeight: 300 }}>
                      <table className="reg-tbl">
                        <thead>
                          <tr>
                            <th>Dataset</th>
                            <th>Claimed By</th>
                            <th>Class</th>
                            <th>Records</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registryRows.map(([key, f]) => (
                            <tr
                              key={key}
                              className={state.selectedFile === key ? "reg-selected" : undefined}
                              style={
                                state.highlightDispute && f.dispute === state.highlightDispute
                                  ? { background: "rgba(247,148,33,.10)", outline: "1px solid rgba(247,148,33,.35)" }
                                  : undefined
                              }
                              onDoubleClick={() => dispatch({ type: "INSPECT_FILE", fileKey: key })}
                              onClick={() => dispatch({ type: "INSPECT_FILE", fileKey: key })}
                            >
                              <td>{f.name}</td>
                              <td>{f.claimedBy}</td>
                              <td>
                                <span className={`reg-badge ${f.cls}`}>{f.classification.split(" ")[0]}</span>
                              </td>
                              <td>{f.records.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {state.openWindows.includes("win-inspector") && (
                  <div className="xp-win visible" style={{ top: 115, left: 106, width: 432, zIndex: 110 }}>
                    <div className="xp-tb">
                      <span className="xp-title">File_Inspector.exe</span>
                      <button type="button" className="xp-btn xp-cls" onClick={() => dispatch({ type: "CLOSE_WINDOW", windowId: "win-inspector" })}>
                        ✕
                      </button>
                    </div>
                    <div className="xp-body" style={{ overflow: "auto", maxHeight: 340 }}>
                      {state.selectedFile ? <InspectorBody fileKey={state.selectedFile} /> : <div className="insp-empty">Double-click a file in the Registry to inspect metadata.</div>}
                    </div>
                  </div>
                )}

                {state.openWindows.includes("win-personal") && (
                  <div className="xp-win visible" style={{ top: 200, left: 200, width: 320, zIndex: 108 }}>
                    <div className="xp-tb">
                      <span className="xp-title">Marshall_Personal</span>
                      <button type="button" className="xp-btn xp-cls" onClick={() => dispatch({ type: "CLOSE_WINDOW", windowId: "win-personal" })}>
                        ✕
                      </button>
                    </div>
                    <div className="xp-body">
                      <div className="folder-grid">
                        {PERSONAL_FILES.map((f) => (
                          <button key={f.key} type="button" className="fg-item" onDoubleClick={() => dispatch({ type: "DECOY_PERSONAL", key: f.key })}>
                            <div className="fg-icon">{f.icon}</div>
                            <div className="fg-label">{f.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div id="right">
                <div id="eboard">
                  <div className="eb-hdr">
                    <span className="eb-htitle">MASTER KEY FORGE</span>
                    <span id="eb-count">{state.tokenCount}</span>
                  </div>
                  <div id="eb-step">{state.ebStep}</div>
                  <div className="eb-grid">
                    {tokenLeads.map((t) => (
                      <button
                        key={t.leadId}
                        type="button"
                        id={t.leadId}
                        className={`lead ${state.leadStatus[t.leadId] ?? "n-idle"}`}
                        onClick={() => {
                          const dispute = DISPUTES.find((d) => TOKEN_LEADS[d.token].leadId === t.leadId);
                          if (dispute && !state.verifyResults[dispute.id]) dispatch({ type: "LOAD_DISPUTE", id: dispute.id });
                        }}
                      >
                        <div className="lead-name">{t.label}</div>
                        <div className="lead-status" id={t.lsId}>
                          {state.leadStatusText[t.leadId]}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="eb-progress">
                    {DISPUTES.map((d) => (
                      <div key={d.id} id={TOKEN_LEADS[d.token].segId} className={`ep-seg${state.verifyResults[d.id] ? " filled" : ""}`} />
                    ))}
                  </div>
                  <button
                    id="synth-btn"
                    type="button"
                    className={state.tokens.length >= 4 ? "ready" : ""}
                    disabled={state.tokens.length < 4}
                    onClick={() => dispatch({ type: "START_SYNTH" })}
                  >
                    COMPILE MASTER KEY
                  </button>
                </div>

                <div id="voss-wrap">
                  <div className="voss-hdr">
                    <div className="bk-info">
                      <div className="bk-name">Mission Channel</div>
                      <div className="bk-roster">
                        <span style={{ color: SENDER_COLORS.Atlas }}>Atlas</span>, <span style={{ color: SENDER_COLORS.Voss }}>Voss</span>
                      </div>
                    </div>
                    <button type="button" id="hint-btn" disabled={state.hintCooldown} onClick={() => dispatch({ type: "REQUEST_HINT" })}>
                      💡
                    </button>
                  </div>
                  <div id="voss-body">
                    {state.messages.map((m, i) => {
                      const showSender = i === 0 || state.messages[i - 1].sender !== m.sender;
                      return (
                        <div key={m.id} className="bm-group">
                          {showSender && (
                            <div className="bm-sender" style={{ color: SENDER_COLORS[m.sender] }}>
                              {m.sender.toUpperCase()}
                            </div>
                          )}
                          <div className={`bm-bubble ${m.tone} show`}>{m.text}</div>
                          <div className="bm-ts">{m.ts}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {state.verifyOpen && state.verifyDispute && (
              <>
                <button type="button" id="verify-toggle" className="show" onClick={() => dispatch({ type: "TOGGLE_VERIFY" })}>
                  ‹
                </button>
                <div id="verify-panel" className="open">
                  <div id="vp-node">{VERIFY[state.verifyDispute].title}</div>
                  <div id="vp-sub">{VERIFY[state.verifyDispute].sub}</div>
                  <div id="vp-params">
                    {VERIFY[state.verifyDispute].questions.map((q, qi) => (
                      <div key={qi} className="cp-param">
                        <div className="cp-plbl">
                          {qi + 1}. {q.label}
                          <span className="cp-note">{q.note}</span>
                        </div>
                        <div className="cp-chips">
                          {q.opts.map((opt, ci) => (
                            <button
                              key={opt}
                              type="button"
                              className={`cp-chip${state.vpSelections[qi] === ci ? " cp-sel" : ""}`}
                              onClick={() => dispatch({ type: "SELECT_CHIP", qi, ci })}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    id="vp-confirm"
                    className="cap-btn"
                    disabled={VERIFY[state.verifyDispute].questions.some((_, qi) => state.vpSelections[qi] === undefined)}
                    onClick={() => dispatch({ type: "CONFIRM_VERIFY" })}
                  >
                    EXTRACT TOKEN →
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {state.phase === "hack" && <M1HackOverlay lines={HACK_LINES} visibleCount={state.hackLine + 1} />}

      {state.phase === "synth" && (
        <div id="synth-overlay" style={{ display: "flex" }}>
          <div className="synth-done show">MASTER KEY — COMPILING...</div>
        </div>
      )}

      {state.phase === "debrief" && <MissionDebriefScreen config={debrief} onContinue={completeMission} />}
    </div>
  );
}

export function M2Game({ savedState }: { savedState?: Record<string, unknown> | null }) {
  return (
    <M2GameProvider savedState={savedState}>
      <M2GameInner />
    </M2GameProvider>
  );
}
