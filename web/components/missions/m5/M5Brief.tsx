"use client";

import { useState } from "react";
import { Gloss } from "@/components/missions/shared/GlossTip";
import { M5Ambient, M5StatusBar } from "@/components/missions/m5/M5IntroChrome";

/** Intro page 1 — Pre-Mission Brief with acknowledgement gate (round5_v3 #page1). */
export function M5Brief({ onContinue, onSkip }: { onContinue: () => void; onSkip: () => void }) {
  const [acked, setAcked] = useState(false);

  return (
    <div className="m5-mission">
      <M5Ambient />
      <M5StatusBar />

      <div className="page active" id="page1">
        <div className="page-eyebrow">{"// Mission 5 — The Final Brief"}</div>
        <div className="page-title">Pre-Mission Brief</div>

        <div className="content">
          <div className="mission-params">
            <div className="mp-cell">
              <div className="mp-label">{"// Window"}</div>
              <div className="mp-value">OPEN</div>
            </div>
            <div className="mp-cell">
              <div className="mp-label">{"// Detection Ceiling"}</div>
              <div className="mp-value">100%</div>
            </div>
            <div className="mp-cell">
              <div className="mp-label">{"// Evidence Cards"}</div>
              <div className="mp-value">4</div>
            </div>
            <div className="mp-cell">
              <div className="mp-label">{"// Commit Threshold"}</div>
              <div className="mp-value">3 OF 4 CREW</div>
            </div>
            <div className="mp-cell">
              <div className="mp-label">{"// Outcome"}</div>
              <div className="mp-value">OPERATION SHIPS</div>
            </div>
          </div>

          <div className="brief-grid">
            <div className="brief-col">
              <div className="brief-section">
                <div className="section-label">{"// Intelligence Brief"}</div>
                <div className="brief-card">
                  <div className="brief-scanlines" />
                  <div className="encrypted-indicator">
                    <span className="encrypted-dot" />
                    VOSS
                  </div>
                  <div className="brief-text">
                    <p>
                      Four operations. Four objections answered. The{" "}
                      <Gloss scopeClass="m5-mission" text="The four specialists who will vote on whether the operation ships. Each has a different reason to say no.">
                        crew
                      </Gloss>{" "}
                      is in the room for the first time — all of them. <strong>I&apos;m stepping back.</strong> The plan has to
                      stand without me holding it up.
                    </p>
                    <p>
                      ECHO works with you first: choose how to{" "}
                      <Gloss
                        scopeClass="m5-mission"
                        text="Framing determines what the room focuses on — risk, opportunity, or neutral fact. The wrong framing gives the crew a reason to object before you open your mouth."
                      >
                        frame each evidence card
                      </Gloss>{" "}
                      and which{" "}
                      <Gloss
                        scopeClass="m5-mission"
                        text="Visualisation format must match the type of evidence being shown. A node map proves connectivity. A traffic light grid proves ethical triage. A table proves nothing without context."
                      >
                        visualisation format
                      </Gloss>{" "}
                      makes it legible to a non-technical room.
                    </p>
                    <p>
                      Then you present. Each specialist challenges you once — a question from their domain.{" "}
                      <strong>Get three of four to commit</strong> and the operation ships.
                    </p>
                    <p>You built this dossier across four operations. Now you have to sell it to the people who have to act on it.</p>
                    <div className="pullquote">The room doesn&apos;t care what you found. It cares what it means.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dossier-col">
              <div className="brief-section" style={{ height: "100%" }}>
                <div className="section-label">{"// Crew Dossier"}</div>
                <div className="dossier-backdrop">
                  <div className="dossier-card">
                    <div className="dc-label">HANDLER</div>
                    <div className="dc-name">Voss</div>
                    <div className="dc-role">Steps back — watching only</div>
                  </div>
                  <div className="dossier-card">
                    <div className="dc-label">COMMS / FRAMING</div>
                    <div className="dc-name">Echo</div>
                    <div className="dc-role">Works with you on framing — already committed</div>
                  </div>
                  <div className="dossier-card">
                    <div className="dc-label">CREW VOTE</div>
                    <div className="dc-name">ZEX · ATLAS · NOVA · KADE</div>
                    <div className="dc-role">Each challenges you once — 3 of 4 must commit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`ack-gate${acked ? " is-checked" : ""}`} id="ack-gate" onClick={() => setAcked((a) => !a)}>
            <div className="ack-box">
              <div className="ack-tick" />
            </div>
            I understand — three of four crew members must commit for the operation to ship
          </div>
        </div>

        <div className="button-section">
          <button className={`btn-next${acked ? "" : " is-locked"}`} id="btn-continue" disabled={!acked} onClick={onContinue}>
            <div className="btn-inner">
              <span>Continue</span>
              <span className="btn-arrow">→</span>
            </div>
          </button>
        </div>
        <button id="skip-intro" onClick={onSkip}>
          SKIP INTRO →
        </button>
      </div>
    </div>
  );
}
