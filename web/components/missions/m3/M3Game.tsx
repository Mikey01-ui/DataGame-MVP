"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { M1HackOverlay } from "@/components/missions/m1/M1HackOverlay";
import { M3Inspector } from "@/components/missions/m3/M3Inspector";
import { M3VaultDoor } from "@/components/missions/m3/M3VaultDoor";
import { MissionDebriefScreen } from "@/components/missions/shared/MissionDebriefScreen";
import { CHANNEL_LABELS, DATASETS, HACK_LINES } from "@/lib/game/m3/data";
import { buildM3Debrief } from "@/lib/game/debriefBuilders";
import { M3GameProvider, useM3Game } from "@/lib/game/m3/context";
import { getTrustClass } from "@/lib/game/m3/reducer";
import type { Channel } from "@/lib/game/m3/types";

function M3RoutingPanel() {
  const { state, dispatch } = useM3Game();
  const routed = Object.keys(state.assigned).length;
  const selected = DATASETS.find((d) => d.id === state.selectedId);
  const trust = Math.round(state.novaTrust);
  const trustClass = getTrustClass(trust);
  const timer = `${String(Math.floor(state.timerSec / 60)).padStart(2, "0")}:${String(state.timerSec % 60).padStart(2, "0")}`;

  return (
    <>
      <div id="hdr">
        <div className="hdr-left">
          <i className="fas fa-terminal" aria-hidden /> MASTERMIND TERMINAL | OPERATION OMNI
        </div>
        <div className="hdr-center">MISSION 03 OF 05 / THE HUMAN SHIELD</div>
        <div className="hdr-right">
          <span id="nova-trust" className={`nt-display ${trustClass}`}>
            <span className="nt-icon">
              <i className="fas fa-user-shield" aria-hidden />
            </span>
            <span id="hdr-trust-pct">{trust}%</span>
            <span className="nt-bar-wrap">
              <span id="hdr-trust-bar" className={trustClass} style={{ width: `${trust}%` }} />
            </span>
            <span className="nt-label">NOVA</span>
          </span>
          <span style={{ color: "rgba(0,196,28,.2)", margin: "0 4px" }}>|</span>
          <span id="budget">💰 ${state.budget.toLocaleString()}</span>
          <span style={{ color: "rgba(0,196,28,.2)", margin: "0 4px" }}>|</span>
          <span id="timer">{timer}</span>
          <span className="live-dot" />
          <span style={{ letterSpacing: 1, fontSize: 10 }}>LIVE</span>
        </div>
      </div>

      <div id="step-banner">{state.stepBanner}</div>

      <div id="main-row">
        <div id="desktop-panel">
          <div className="r2-layout">
            <div className="r2-router">
              <div className="r2-r-hdr">STAGED FOR DISCLOSURE</div>
              <div id="r3-file-list">
                {DATASETS.map((ds) => (
                  <button
                    key={ds.id}
                    type="button"
                    className={`r2-file${state.selectedId === ds.id ? " sel" : ""}${state.assigned[ds.id] ? " done" : ""}`}
                    onClick={() => dispatch({ type: "SELECT_DATASET", id: ds.id })}
                  >
                    <span>📄</span>
                    <span>{ds.file}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="r2-inspector">
              <div className="r2-ins-hdr">{selected ? `INSPECTOR — ${selected.file}` : "INSPECTOR — Select a file"}</div>
              <div className="r2-ins-body">
                {selected ? (
                  <M3Inspector dataset={selected} />
                ) : (
                  <span style={{ color: "#5a6a7a" }}>Open a file and read what&apos;s in it — then pick the channel that fits audience and harm.</span>
                )}
              </div>
              {selected && !state.assigned[selected.id] && (
                <div className="ch-bar">
                  <span>Assign release channel:</span>
                  <div className="ch-row">
                    {(["public", "official", "vault"] as Channel[]).map((ch) => (
                      <button key={ch} type="button" className={`ch-btn ch-${ch}`} onClick={() => dispatch({ type: "ASSIGN_CHANNEL", channel: ch })}>
                        <i className={`fas ${ch === "public" ? "fa-bullhorn" : ch === "official" ? "fa-landmark" : "fa-lock"}`} aria-hidden /> {CHANNEL_LABELS[ch]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div id="right">
          <div id="dist-panel">
            <div className="dist-hdr">
              <div className="dist-title">DISTRIBUTION MAP</div>
              <div className="dist-sub">WHERE EACH FILE IS SLATED TO GO</div>
            </div>
            <div className="dist-cols">
              {(["public", "official", "vault"] as Channel[]).map((ch) => (
                <div key={ch} className={`dist-col ${ch}`}>
                  <div className="dist-col-h">{ch === "vault" ? "NO REL." : ch.toUpperCase()}</div>
                  {DATASETS.filter((d) => state.assigned[d.id] === ch).map((d) => (
                    <div key={d.id} className={`dist-chip ${ch}`}>
                      {d.file.length > 22 ? `${d.file.slice(0, 20)}…` : d.file}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div id="routed-count">Routed: {routed} / 10</div>
            <button type="button" id="signoff-btn" className={routed >= 10 ? "ready" : ""} disabled={routed < 10} onClick={() => dispatch({ type: "REQUEST_SIGNOFF" })}>
              REQUEST NOVA SIGN-OFF
            </button>
          </div>

          <div id="broker-wrap">
            <div className="broker-hdr">
              <div className="bk-avatar">
                <i className="fas fa-shield-halved" aria-hidden />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bk-name">Operation Channel</div>
                <div className="bk-members">Voss — 🟢 · Zex — 🟢 · Nova — 🟢</div>
              </div>
              <div className="bk-icons">
                <i className="fas fa-lock" aria-hidden />
              </div>
            </div>
            <div id="broker-body">
              <div className="bm-sep">
                <div className="bm-sep-pill">Staging</div>
              </div>
              {state.messages.map((m) => (
                <div key={m.id} className="bm-group">
                  <div className="bm-sender">{m.sender.toUpperCase()}</div>
                  <div className={`bm-bubble ${m.tone}`} dangerouslySetInnerHTML={{ __html: m.text }} />
                  <div className="bm-ts">{m.ts}</div>
                </div>
              ))}
            </div>
            <div className="broker-footer">
              <div className="broker-input-bar">
                <div className="hint-wrap">
                  <button type="button" id="hint-btn" disabled={state.hintCooldown || !state.selectedId || !!(state.selectedId && state.assigned[state.selectedId])} onClick={() => dispatch({ type: "REQUEST_HINT" })}>
                    <i className="fas fa-lightbulb" aria-hidden />
                  </button>
                  <div className="hint-tooltip">Hint · −$2,500</div>
                </div>
                <input type="text" placeholder="Operation Channel — listen only" disabled readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function M3GameInner() {
  const { state, dispatch } = useM3Game();
  const router = useRouter();
  const [desktopReady, setDesktopReady] = useState(false);
  const trust = Math.round(state.novaTrust);
  const routed = Object.keys(state.assigned).length;

  useEffect(() => {
    if (state.phase === "desktop") {
      const t = setTimeout(() => setDesktopReady(true), 400);
      return () => clearTimeout(t);
    }
    setDesktopReady(false);
  }, [state.phase]);

  const completeMission = useCallback(async () => {
    await fetch("/api/progress", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        missionId: "m3",
        status: "completed",
        checkpoint: "completed",
        score: Math.max(0, state.budget),
        stateJson: {
          version: 1,
          novaTrust: trust,
          routed: 10,
          wrongRoutes: state.wrongRoutes,
          catastrophic: state.catastrophic,
          hintsUsed: state.hintsUsed,
          timerSec: state.timerSec,
        },
      }),
    });
    router.push("/mission/m4");
    router.refresh();
  }, [router, state.budget, state.catastrophic, state.hintsUsed, state.timerSec, state.wrongRoutes, trust]);

  const debrief = useMemo(() => buildM3Debrief(state), [state]);

  const isRouting = state.phase === "play" || state.phase === "signoff";

  return (
    <div className={`m3-game${isRouting ? " m3-routing" : " m3-desktop"}${state.vaultOpen ? " vault-open" : ""}`}>
      <div id="m3-game" className={state.hackDone ? "active" : ""}>
        {state.hackDone && (
          <>
            {state.phase === "desktop" && (
              <>
                <div id="step-banner">{state.stepBanner}</div>
                <div id="main-row">
                  <div id="desktop-panel">
                    <div id="wallpaper" className={desktopReady ? "visible" : ""} />
                    <button
                      type="button"
                      className={`di di-interactive di-mission visible${state.vaultOpen ? "" : ""}`}
                      style={{ top: 22, left: 14 }}
                      title="Double-click to open"
                      onDoubleClick={() => dispatch({ type: "OPEN_VAULT" })}
                    >
                      <span className="di-icon">
                        <i className="fas fa-lock" aria-hidden />
                      </span>
                      <span className="di-label">Data Vault</span>
                    </button>
                    {[
                      { top: 106, icon: "fa-folder-open", label: "Disclosure Queue" },
                      { top: 190, icon: "fa-folder", label: "HR_Records" },
                      { top: 274, icon: "fa-chart-bar", label: "Finance" },
                      { top: 358, emoji: "🗑️", label: "Recycle Bin" },
                    ].map((item) => (
                      <div key={item.label} className="di di-locked visible" style={{ top: item.top, left: 14 }}>
                        <span className="di-icon">{item.emoji ?? <i className={`fas ${item.icon}`} aria-hidden />}</span>
                        <span className="di-label">{item.label}</span>
                      </div>
                    ))}
                    <div id="xp-taskbar" className={desktopReady ? "visible" : ""}>
                      <div id="start-btn">⊞ start</div>
                      <div className="tb-div" />
                      <button type="button" className="tb-wb" onDoubleClick={() => dispatch({ type: "OPEN_VAULT" })}>
                        <i className="fas fa-lock" aria-hidden /> Data Vault
                      </button>
                      <div id="tb-clock">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                  <div id="right">
                    <div id="broker-wrap">
                      <div className="broker-hdr">
                        <div className="bk-avatar">
                          <i className="fas fa-shield-halved" aria-hidden />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="bk-name">Operation Channel</div>
                          <div className="bk-members">Voss — 🟢 · Nova — 🟢</div>
                        </div>
                      </div>
                      <div id="broker-body">
                        {state.messages.map((m) => (
                          <div key={m.id} className="bm-group">
                            <div className="bm-sender">{m.sender.toUpperCase()}</div>
                            <div className={`bm-bubble ${m.tone}`} dangerouslySetInnerHTML={{ __html: m.text }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {isRouting && <M3RoutingPanel />}
          </>
        )}
      </div>

      <M3VaultDoor open={state.vaultOpen} onClose={() => dispatch({ type: "CLOSE_VAULT" })} onUnlocked={() => dispatch({ type: "VAULT_UNLOCKED" })} />

      {state.phase === "hack" && <M1HackOverlay lines={HACK_LINES} visibleCount={state.hackLine + 1} />}

      {state.phase === "signoff" && (
        <div id="signoff-overlay" className="active">
          <pre id="signoff-term">{`NOVA SIGN-OFF PROTOCOL
TRUST: ${trust}%
ROUTED: ${routed}/10
${trust >= 45 ? "STATUS: APPROVED" : "STATUS: WITHHELD"}`}</pre>
        </div>
      )}

      {state.phase === "debrief" && <MissionDebriefScreen config={debrief} onContinue={completeMission} />}
    </div>
  );
}

export function M3Game() {
  return (
    <M3GameProvider>
      <M3GameInner />
    </M3GameProvider>
  );
}
