"use client";

import { useEffect, useState } from "react";
import type { MissionIntro } from "@/lib/content";

type BriefPhaseProps = {
  brief: MissionIntro["brief"];
  onContinue: () => void;
};

export function BriefPhase({ brief, onContinue }: BriefPhaseProps) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setUnlocked(true), brief.continueDelayMs);
    return () => clearTimeout(timer);
  }, [brief.continueDelayMs]);

  return (
    <div className="mission-page">
      <div className="mission-page-eyebrow">{brief.eyebrow}</div>
      <h1 className="mission-page-title">{brief.title}</h1>

      <div className="mission-content">
        {brief.params.length > 0 && (
          <div className="mission-params">
            {brief.params.map((cell) => (
              <div key={cell.label} className="mission-param-cell">
                <div className="mission-param-label">{cell.label}</div>
                <div className="mission-param-value">{cell.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mission-brief-grid">
          <div>
            <div className="mission-section-label">// Intelligence Brief</div>
            <div className="mission-brief-card">
              <div className="mission-encrypted">
                <span className="mission-encrypted-dot" />
                VOSS
              </div>
              <div className="mission-brief-text">
                {brief.briefParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
                <p className="mission-pullquote">{brief.pullquote}</p>
              </div>
            </div>
          </div>

          {brief.dossier.length > 0 && (
            <div>
              <div className="mission-section-label">// Dossier</div>
              <div className="mission-dossier">
                {brief.dossier.map((card) => (
                  <div key={card.label} className="mission-dossier-card">
                    <div className="mission-dossier-label">{card.label}</div>
                    <div className="mission-dossier-name">{card.name}</div>
                    <div className="mission-dossier-role">{card.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mission-btn-section">
        <button
          type="button"
          className={`mission-btn-next${unlocked ? "" : " is-locked"}`}
          disabled={!unlocked}
          onClick={onContinue}
        >
          {brief.continueLabel} →
        </button>
      </div>
    </div>
  );
}
