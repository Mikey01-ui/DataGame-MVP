"use client";

import { useEffect, useRef, useState } from "react";
import { useM4Game } from "@/lib/game/m4/context";
import {
  M4_DETECTION_INFO,
  getDetectionBand,
  getDetectionBarClass,
  getDetectionClass,
  getDetectionIcon,
} from "@/lib/game/m4/detectionMeter";

export function M4DetectionHeader() {
  const { state } = useM4Game();
  const det = Math.round(state.detection);
  const detClass = getDetectionClass(det);
  const band = getDetectionBand(det);
  const info = M4_DETECTION_INFO[band];
  const timer = `${String(Math.floor(state.timerSec / 60)).padStart(2, "0")}:${String(state.timerSec % 60).padStart(2, "0")}`;

  const prevDet = useRef(det);
  const [flash, setFlash] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [toast, setToast] = useState<number | null>(null);
  const meterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (det > prevDet.current) {
      const gained = det - prevDet.current;
      setToast(Math.max(1, gained));
      setFlash(true);
      setPulse(true);
      const flashT = window.setTimeout(() => setFlash(false), 400);
      const pulseT = window.setTimeout(() => setPulse(false), 2100);
      const toastT = window.setTimeout(() => setToast(null), 1300);
      prevDet.current = det;
      return () => {
        window.clearTimeout(flashT);
        window.clearTimeout(pulseT);
        window.clearTimeout(toastT);
      };
    }
    prevDet.current = det;
  }, [det]);

  return (
    <>
      <div id="hdr">
        <div className="hdr-left">
          <i className="fas fa-terminal" aria-hidden /> MASTERMIND TERMINAL | OPERATION OMNI
        </div>
        <div className="hdr-center">MISSION 04 OF 05 / THE ONBOARDING</div>
        <div className="hdr-right">
          <span
            id="det-display"
            ref={meterRef}
            className={`${detClass}${flash ? " det-flash" : ""}${pulse ? " det-penalty-pulse" : ""}`}
          >
            <span id="det-icon">
              <i className={`fas ${getDetectionIcon(det)}`} aria-hidden />
            </span>
            <span id="det-pct">{det}%</span>
            <span className="det-bar-wrap">
              <span id="det-bar" className={getDetectionBarClass(det)} style={{ width: `${det}%` }} />
            </span>
            <span id="det-label">{band}</span>
          </span>
          <span className="det-info-wrap" tabIndex={0} aria-label="Handoff detection info">
            <i className="fas fa-circle-info det-info-i" aria-hidden />
            <div className="det-info-pop" role="tooltip">
              <div className="dip-ttl" style={{ color: info.color }}>
                {band}
              </div>
              <div className="dip-desc">{info.desc}</div>
              <div className="dip-cause">{info.cause}</div>
            </div>
          </span>
          <span style={{ color: "rgba(0,196,28,.2)", margin: "0 4px" }}>|</span>
          <span id="timer">{timer}</span>
          <span className="live-dot" />
          <span style={{ letterSpacing: 1, fontSize: 10 }}>LIVE</span>
        </div>
      </div>
      {toast !== null && meterRef.current ? (
        <DetectionToast amount={toast} anchor={meterRef.current.getBoundingClientRect()} />
      ) : null}
    </>
  );
}

function DetectionToast({ amount, anchor }: { amount: number; anchor: DOMRect }) {
  return (
    <div
      className="det-toast"
      style={{
        top: anchor.top + 4,
        left: anchor.left + anchor.width / 2 - 50,
      }}
    >
      +{amount}% DETECTED
    </div>
  );
}
