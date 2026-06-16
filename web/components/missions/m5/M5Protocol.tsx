"use client";

import { useEffect, useState } from "react";
import { M5Ambient, M5StatusBar } from "@/components/missions/m5/M5IntroChrome";
import { Card01Preview, Card02Preview, Card03Preview } from "@/components/missions/m5/M5ProtocolPreviews";

const CARDS = [
  {
    number: "01",
    title: "FRAME WITH ECHO",
    desc: "Four evidence cards from Ops 1–4. For each card: pick a framing type (risk / opportunity / neutral) and a visualisation format. ECHO gives you one line of feedback per choice — read it before moving on.",
    Preview: Card01Preview,
  },
  {
    number: "02",
    title: "CREW BRIEFING",
    desc: "Present the framed dossier. Each specialist — ZEX, ATLAS, NOVA, KADE — challenges you once with a multiple-choice question from their domain. One retry is available per crew member, at a detection cost.",
    Preview: Card02Preview,
  },
  {
    number: "03",
    title: "THE VOTE",
    desc: "Three of four specialists must commit. VOSS closes the session either way. No retries on the vote — the debrief shows exactly which answers caused each crew member to stay sceptical.",
    Preview: Card03Preview,
  },
];

/** Intro page 2 — Mission Protocol with GSAP cards (round5_v3 #page2). */
export function M5Protocol({ onBreach, onSkip }: { onBreach: () => void; onSkip: () => void }) {
  const [activeCard, setActiveCard] = useState(0);
  const [breachUnlocked, setBreachUnlocked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBreachUnlocked(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const navigateCard = (dir: number) => {
    const next = activeCard + dir;
    if (next >= 0 && next <= 2) setActiveCard(next);
  };

  return (
    <div className="m5-mission">
      <M5Ambient />
      <M5StatusBar />

      <div className="page active" id="page2">
        <div className="page-eyebrow">{"// Mission 5 — The Final Brief"}</div>
        <div className="page-title">Mission Protocol</div>

        <div className="content">
          <div className="ops-section">
            <div className="section-label">{"// How to Present"}</div>
            <div className="steps-grid">
              {CARDS.map((card, i) => (
                <div key={card.number} className={`step-card${activeCard === i ? " active" : ""}`} data-card-index={i}>
                  <span className={`nav-arrow nav-left${i === 0 ? " hidden" : ""}`} onClick={() => navigateCard(-1)}>
                    ‹
                  </span>
                  <span className={`nav-arrow nav-right${i === 2 ? " hidden" : ""}`} onClick={() => navigateCard(1)}>
                    ›
                  </span>
                  <card.Preview active={activeCard === i} />
                  <div className="card-body">
                    <div className="step-number">{card.number}</div>
                    <div className="step-title">{card.title}</div>
                    <div className="step-desc">{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detection-section">
            <div className="detection-card">
              <div className="detection-body">
                <div className="detection-title">
                  THE DETECTION METER
                  <span className="detection-title-tag">
                    <i className="fas fa-exclamation-triangle" /> ACTIVE THREAT
                  </span>
                </div>
                <div className="detection-desc">
                  <p>Every mistake raises the meter. Hit 100% and MegaCorp closes the connection — the briefing room goes dark and the operation is over.</p>
                </div>
                <div className="detection-pills">
                  <span className="dpill dpill-high">Wrong crew answer · +10%</span>
                  <span className="dpill dpill-high">Wrong framing · +8% per card</span>
                  <span className="dpill dpill-mid">Wrong visualisation · +5% per card</span>
                </div>
                <div className="detection-hint-row">
                  <i className="fas fa-lightbulb dh-icon" />
                  <div className="dh-body">
                    <p className="dh-text">
                      <strong>Stuck?</strong> ECHO&apos;s feedback lines on each card are your hints. Read them before confirming — they tell you exactly what each crew member needs to
                      hear and whether your choice lands.
                    </p>
                    <div className="dh-pills">
                      <span className="dpill dpill-hint">Wrong answer · 1 retry available</span>
                      <span className="dpill dpill-hint">Retry costs · +10% detection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="button-section">
          <div className="button-label">{"// Ready to enter the room?"}</div>
          <button className={`btn-next${breachUnlocked ? "" : " is-locked"}`} id="btn-breach" onClick={onBreach}>
            <div className="btn-inner">
              <span>Enter the Briefing Room</span>
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
