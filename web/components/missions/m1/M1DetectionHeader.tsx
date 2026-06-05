"use client";

import { getDetectionClass, getDetectionLabel } from "@/lib/game/m1/reducer";

type Props = {
  detection: number;
  timer: string;
};

export function M1DetectionHeader({ detection, timer }: Props) {
  const det = Math.round(detection);
  const detClass = getDetectionClass(det);
  const barClass = det < 30 ? "det-bar-green" : det < 60 ? "det-bar-amber" : "det-bar-red";
  const shieldIcon = det < 30 ? "fa-shield-alt" : det < 60 ? "fa-exclamation-triangle" : "fa-radiation";

  return (
    <div id="hdr">
      <div className="hdr-left">
        <i className="fas fa-terminal" aria-hidden /> MASTERMIND TERMINAL | OPERATION OMNI
      </div>
      <div className="hdr-center">MISSION 01 OF 05 / IDENTIFYING THE FOOTPRINT</div>
      <div className="hdr-right">
        <span id="det-display" className={detClass}>
          <span id="det-icon">
            <i className={`fas ${shieldIcon}`} aria-hidden />
          </span>
          <span id="det-pct">{det}%</span>
          <span className="det-bar-wrap">
            <span id="det-bar" className={barClass} style={{ width: `${det}%` }} />
          </span>
          <span id="det-label" style={{ fontSize: "clamp(10px,1vw,12px)", letterSpacing: 2, opacity: 0.7 }}>
            {getDetectionLabel(det)}
          </span>
        </span>
        <span style={{ color: "var(--border)", margin: "0 6px" }}>|</span>
        <span id="timer">{timer}</span>
        <span className="live-dot" />
        <span style={{ letterSpacing: 1 }}>LIVE</span>
      </div>
    </div>
  );
}
