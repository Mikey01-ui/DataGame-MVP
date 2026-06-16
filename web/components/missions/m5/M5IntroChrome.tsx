"use client";

/** Shared chrome for the M5 intro pages (round5_v3 status bar + ambient layers). */
export function M5Ambient() {
  return (
    <>
      <div className="ambient-glow" />
      <div className="scanlines" />
      <div className="bg-grid" />
      <div className="corner corner--tl" />
      <div className="corner corner--tr" />
      <div className="corner corner--bl" />
      <div className="corner corner--br" />
    </>
  );
}

export function M5StatusBar() {
  return (
    <div className="status-bar">
      <div className="status-left">
        <span>
          <span className="status-dot live" />
          LIVE SESSION
        </span>
        <span>OPERATION OMNI</span>
        <span>MISSION 05 / 05</span>
      </div>
      <div className="status-right">
        <span>MASTERMIND TERMINAL</span>
        <span>v5.0.0</span>
      </div>
    </div>
  );
}
