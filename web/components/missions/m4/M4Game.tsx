"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { M1HackOverlay } from "@/components/missions/m1/M1HackOverlay";
import { M4FlowCanvas } from "@/components/missions/m4/M4FlowCanvas";
import { MissionDebriefScreen } from "@/components/missions/shared/MissionDebriefScreen";
import { FILES, HACK_LINES, STEPS, getDatasetCandidatesForStep } from "@/lib/game/m4/data";
import { buildM4Debrief } from "@/lib/game/debriefBuilders";
import { M4GameProvider, useM4Game } from "@/lib/game/m4/context";

function M4GameInner() {
  const { state, dispatch } = useM4Game();
  const router = useRouter();
  const [popHidden, setPopHidden] = useState(false);
  const timer = `${String(Math.floor(state.timerSec / 60)).padStart(2, "0")}:${String(state.timerSec % 60).padStart(2, "0")}`;
  const linked = Object.keys(state.picks).length;
  const candidates = getDatasetCandidatesForStep(state.selectedStepId, state.picks);

  const completeMission = useCallback(async () => {
    await fetch("/api/progress", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        missionId: "m4",
        status: "completed",
        checkpoint: "completed",
        score: state.confidence,
        stateJson: {
          version: 1,
          confidence: state.confidence,
          linked: Object.keys(state.picks).length,
          wrongAttempts: state.wrongAttempts,
          timerSec: state.timerSec,
        },
      }),
    });
    router.push("/mission/m5");
    router.refresh();
  }, [router, state.confidence, state.picks, state.timerSec, state.wrongAttempts]);

  const debrief = useMemo(() => buildM4Debrief(state), [state]);

  const selectStep = (stepId: string) => {
    setPopHidden(false);
    dispatch({ type: "SELECT_STEP", stepId });
  };

  return (
    <div className="m4-game">
      <div id="m4-game" className={state.hackDone ? "active" : ""}>
        {state.hackDone && (
          <>
            <div id="hdr">
              <div className="hdr-left">
                <i className="fas fa-terminal" aria-hidden /> MASTERMIND TERMINAL | OPERATION OMNI
              </div>
              <div className="hdr-center">MISSION 04 OF 05 / THE ONBOARDING</div>
              <div className="hdr-right">
                <span className="coh-wrap">
                  <span className="coh-label">NOVA</span>
                  <span className="coh-bar">
                    <span className={`coh-fill ${state.confidence >= 70 ? "conf-ok" : state.confidence >= 40 ? "conf-warn" : "conf-crit"}`} style={{ width: `${state.confidence}%` }} />
                  </span>
                  <span>{Math.round(state.confidence)}%</span>
                </span>
                <span style={{ color: "rgba(0,196,28,.2)", margin: "0 4px" }}>|</span>
                <span id="timer">{timer}</span>
                <span className="live-dot" />
                <span style={{ letterSpacing: 1, fontSize: 10 }}>LIVE</span>
              </div>
            </div>

            <div id="sort-banner">{state.stepBanner}</div>
            <div id="sort-help">
              Click a <strong>gate icon</strong> on the flow — up to <strong>four</strong> candidate files appear in the rail. Drag or click to link. Wrong drops cut Nova&apos;s confidence.
            </div>

            <div id="main-row">
              <div id="flow-canvas-wrap">
                <div id="flow-canvas-inner">
                  <M4FlowCanvas
                    picks={state.picks}
                    selectedStepId={state.selectedStepId}
                    submitted={state.submitted}
                    popHidden={popHidden}
                    onSelectStep={selectStep}
                    onClosePop={() => setPopHidden(true)}
                    onDropFile={(fileId, stepId) => dispatch({ type: "ASSIGN_FILE_TO_STEP", fileId, stepId })}
                  />
                </div>
                <div className="flow-canvas-footer">
                  <span id="r4-routed-count">
                    {linked}/8 handoffs linked · {state.wrongAttempts > 0 ? `${state.wrongAttempts} wrong` : "spine intact"}
                  </span>
                  <button type="button" id="btn-submit-sort" disabled={linked < 8 || state.submitted} onClick={() => dispatch({ type: "SUBMIT" })}>
                    FINALIZE MAP →
                  </button>
                </div>
              </div>

              <div id="right-rail">
                <div className="datasets-panel">
                  <div className="datasets-panel-hdr">
                    <i className="fas fa-folder-open" aria-hidden /> LEAK FILES
                  </div>
                  <div className="datasets-panel-sub">
                    {state.submitted
                      ? "Map finalized — review linked gates on the flow."
                      : state.selectedStepId
                        ? "Drag a file onto the selected gate, or click to assign."
                        : "Click a gate icon on the flow first."}
                  </div>
                  <div id="r4-file-list" className="datasets-grid">
                    {state.submitted ? (
                      <div className="datasets-empty">Map finalized — review linked chips on the flow.</div>
                    ) : !state.selectedStepId ? (
                      <div className="datasets-empty">
                        Click a <strong>gate icon</strong> on the flow first. Up to <strong>four</strong> candidate files appear here.
                      </div>
                    ) : candidates.length === 0 ? (
                      <div className="datasets-empty">No files left in the pool for this view.</div>
                    ) : (
                      candidates.map((f) => {
                        const st = STEPS.find((s) => s.okFile === f.id);
                        return (
                          <div
                            key={f.id}
                            role="button"
                            tabIndex={0}
                            className={`ds-card ds-${st?.deptCls ?? ""}${state.selectedFileId === f.id ? " sel" : ""}`}
                            draggable={!state.submitted}
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/r4-file", f.id);
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onClick={() => dispatch({ type: "ASSIGN_FILE", fileId: f.id })}
                            onKeyDown={(e) => e.key === "Enter" && dispatch({ type: "ASSIGN_FILE", fileId: f.id })}
                          >
                            <span className="ds-ico" aria-hidden>📄</span>
                            <span className="ds-name">{f.name}</span>
                            <span className="ds-desc">{f.desc}</span>
                            <span className="ds-tag">Leak file</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div id="dist-panel">
                  <div className="dist-hdr">
                    <div className="dist-title">Operation Channel</div>
                    <div className="dist-sub">BUNDLE REVIEW · Voss · Nova</div>
                  </div>
                  <div className="broker-body-scroll">
                    <div className="bm-sep">
                      <div className="bm-sep-pill">Onboarding</div>
                    </div>
                    {state.messages.map((m) => (
                      <div key={m.id} className="bm-group">
                        <div className="bm-sender">{m.sender.toUpperCase()}</div>
                        <div className={`bm-bubble ${m.tone}`} dangerouslySetInnerHTML={{ __html: m.text }} />
                        <div className="bm-ts">{m.ts}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {state.phase === "hack" && <M1HackOverlay lines={HACK_LINES} visibleCount={state.hackLine + 1} />}

      {state.phase === "debrief" && <MissionDebriefScreen config={debrief} onContinue={completeMission} />}
    </div>
  );
}

export function M4Game() {
  return (
    <M4GameProvider>
      <M4GameInner />
    </M4GameProvider>
  );
}
