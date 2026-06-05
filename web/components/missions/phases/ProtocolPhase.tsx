"use client";

import { useEffect, useState } from "react";
import type { MissionIntro } from "@/lib/content";

type ProtocolPhaseProps = {
  protocol: MissionIntro["protocol"];
  onBreach: () => void;
};

export function ProtocolPhase({ protocol, onBreach }: ProtocolPhaseProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [breachUnlocked, setBreachUnlocked] = useState(protocol.steps.length === 0);

  useEffect(() => {
    if (protocol.steps.length === 0) return;
    const timer = setTimeout(() => setBreachUnlocked(true), 1400);
    return () => clearTimeout(timer);
  }, [protocol.steps.length]);

  return (
    <div className="mission-page mission-page--protocol">
      <div className="mission-page-eyebrow">{protocol.eyebrow}</div>
      <h1 className="mission-page-title">{protocol.title}</h1>

      <div className="mission-content" style={{ width: "min(94vw, 1700px)" }}>
        <div className="mission-section-label">{protocol.sectionLabel}</div>

        {protocol.steps.length > 0 && (
          <>
            <div className="mission-step-nav">
              {protocol.steps.map((step, index) => (
                <button
                  key={step.number}
                  type="button"
                  className={index === activeStep ? "active" : ""}
                  onClick={() => setActiveStep(index)}
                >
                  {step.number}
                </button>
              ))}
            </div>
            <div className="mission-steps-grid">
              {protocol.steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`mission-step-card${index === activeStep ? " active" : ""}`}
                >
                  <div className="mission-step-number">{step.number}</div>
                  <div className="mission-step-title">{step.title}</div>
                  <div className="mission-step-desc">{step.description}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {protocol.detection && (
          <div className="mission-detection-card">
            <div className="mission-detection-title">
              {protocol.detection.title}
              <span style={{ marginLeft: "0.5rem", fontSize: "0.65rem" }}>
                {protocol.detection.tag}
              </span>
            </div>
            <p style={{ color: "var(--grey-text)", fontSize: "0.9rem" }}>
              {protocol.detection.description}
            </p>
            <div className="mission-detection-pills">
              {protocol.detection.pills.map((pill) => (
                <span key={pill} className="mission-detection-pill">
                  {pill}
                </span>
              ))}
            </div>
            <p style={{ color: "var(--grey-text)", fontSize: "0.85rem", marginTop: "0.75rem" }}>
              {protocol.detection.hint}
            </p>
          </div>
        )}
      </div>

      <div className="mission-btn-section">
        <div className="mission-btn-label">{protocol.breachReadyLabel}</div>
        <button
          type="button"
          className={`mission-btn-next${breachUnlocked ? "" : " is-locked"}`}
          disabled={!breachUnlocked}
          onClick={onBreach}
        >
          {protocol.breachLabel} →
        </button>
      </div>
    </div>
  );
}
