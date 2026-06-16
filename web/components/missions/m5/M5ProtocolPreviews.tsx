"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

/** The three animated card previews on the M5 protocol page, ported 1:1 from round5_v3. */

function ProtoCursor() {
  return (
    <div className="proto-cursor" data-cursor>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <line x1="10" y1="2" x2="10" y2="18" stroke="#f79421" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="10" x2="18" y2="10" stroke="#f79421" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="10" r="3" stroke="#f79421" strokeWidth="1" fill="none" />
      </svg>
      <div className="proto-cur-ring" />
    </div>
  );
}

function useCardTimeline(active: boolean, build: (panel: HTMLDivElement) => gsap.core.Timeline | null) {
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!active) {
      tlRef.current?.pause();
      return;
    }
    if (tlRef.current) {
      tlRef.current.play(0);
      return;
    }
    if (panelRef.current) tlRef.current = build(panelRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
      tlRef.current = null;
    },
    []
  );

  return panelRef;
}

function getPos(panel: HTMLElement, el: HTMLElement) {
  const pr = panel.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  return { x: er.left - pr.left + er.width * 0.5 - 7, y: er.top - pr.top + er.height * 0.5 - 9 };
}

/* ── CARD 01: Evidence grid cursor ── */
export function Card01Preview({ active }: { active: boolean }) {
  const panelRef = useCardTimeline(active, (panel) => {
    const cursor = panel.querySelector<HTMLElement>("[data-cursor]");
    const ring = cursor?.querySelector<HTMLElement>(".proto-cur-ring");
    const c1 = panel.querySelector<HTMLElement>("[data-p1-c1]");
    const c3 = panel.querySelector<HTMLElement>("[data-p1-c3]");
    if (!cursor || !ring || !c1 || !c3) return null;

    gsap.set(cursor, { opacity: 0, x: 20, y: 14 });
    gsap.set(ring, { opacity: 0, scale: 0.5 });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: "power2.out" } });
    const clickPulse = (t: number) => {
      tl.to(ring, { opacity: 0.6, scale: 1.5, duration: 0.15, ease: "power1.out" }, t).to(ring, { opacity: 0, scale: 0.5, duration: 0.25 }, t + 0.18);
    };
    tl.to(cursor, { opacity: 1, duration: 0.35 }, 0.3);
    tl.to(cursor, { x: () => getPos(panel, c1).x, y: () => getPos(panel, c1).y, duration: 1.0, ease: "power2.inOut" }, 0.5);
    clickPulse(1.6);
    tl.call(() => c1.classList.add("ev-active"), undefined, 1.78);
    tl.to(cursor, { x: () => getPos(panel, c3).x, y: () => getPos(panel, c3).y, duration: 0.9, ease: "power2.inOut" }, 2.4);
    clickPulse(3.4);
    tl.call(() => c3.classList.add("ev-active"), undefined, 3.55);
    tl.to(cursor, { opacity: 0, duration: 0.3 }, 5.0);
    tl.call(
      () => {
        c1.classList.remove("ev-active");
        c3.classList.remove("ev-active");
      },
      undefined,
      5.4
    );
    tl.set(cursor, { x: 20, y: 14 }, 5.45);
    return tl;
  });

  const cards = [
    { id: "data-p1-c1", op: "OP 1 — INFRASTRUCTURE", title: "Footprint Confirmed" },
    { id: "data-p1-c2", op: "OP 2 — GOVERNANCE", title: "Ownership Map Clean" },
    { id: "data-p1-c3", op: "OP 3 — ETHICS", title: "Payload Cleared" },
    { id: "data-p1-c4", op: "OP 4 — DATA FLOWS", title: "Flow Mapped" },
  ];

  return (
    <div className="card-preview" ref={panelRef} aria-hidden>
      <div className="p1-board">
        <div className="p1-board-hdr">EVIDENCE DOSSIER</div>
        <div className="p1-ev-grid">
          {cards.map((c) => (
            <div key={c.id} className="p1-ev-card" {...{ [c.id]: "" }}>
              <div className="p1-ev-op">{c.op}</div>
              <div className="p1-ev-title">{c.title}</div>
              <div className="p1-ev-qual">● CLEAN</div>
            </div>
          ))}
        </div>
      </div>
      <ProtoCursor />
    </div>
  );
}

/* ── CARD 02: Framing button selection ── */
export function Card02Preview({ active }: { active: boolean }) {
  const panelRef = useCardTimeline(active, (panel) => {
    const cursor = panel.querySelector<HTMLElement>("[data-cursor]");
    const ring = cursor?.querySelector<HTMLElement>(".proto-cur-ring");
    const btnRisk = panel.querySelector<HTMLElement>("[data-p2-btn-risk]");
    const btnTl = panel.querySelector<HTMLElement>("[data-p2-btn-tl]");
    const echoLine = panel.querySelector<HTMLElement>("[data-p2-echo-line]");
    if (!cursor || !ring || !btnRisk || !btnTl || !echoLine) return null;

    gsap.set(cursor, { opacity: 0, x: 16, y: 12 });
    gsap.set(ring, { opacity: 0, scale: 0.5 });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.0, defaults: { ease: "power2.out" } });
    const clickPulse = (t: number) => {
      tl.to(ring, { opacity: 0.6, scale: 1.5, duration: 0.15, ease: "power1.out" }, t).to(ring, { opacity: 0, scale: 0.5, duration: 0.25 }, t + 0.18);
    };
    tl.to(cursor, { opacity: 1, duration: 0.3 }, 0.3);
    tl.to(cursor, { x: () => getPos(panel, btnRisk).x, y: () => getPos(panel, btnRisk).y, duration: 0.9, ease: "power2.inOut" }, 0.5);
    clickPulse(1.5);
    tl.call(() => btnRisk.classList.add("p2-sel"), undefined, 1.65);
    tl.call(() => echoLine.classList.add("show"), undefined, 1.9);
    tl.to(cursor, { x: () => getPos(panel, btnTl).x, y: () => getPos(panel, btnTl).y, duration: 0.75, ease: "power2.inOut" }, 2.6);
    clickPulse(3.45);
    tl.call(() => btnTl.classList.add("p2-sel"), undefined, 3.6);
    tl.to(cursor, { opacity: 0, duration: 0.3 }, 5.0);
    tl.call(
      () => {
        btnRisk.classList.remove("p2-sel");
        btnTl.classList.remove("p2-sel");
        echoLine.classList.remove("show");
      },
      undefined,
      5.4
    );
    tl.set(cursor, { x: 16, y: 12 }, 5.45);
    return tl;
  });

  return (
    <div className="card-preview" ref={panelRef} aria-hidden>
      <div className="p2-board">
        <div className="p2-card">
          <div className="p2-card-label">OP 3 — ETHICS · PAYLOAD CLEARED</div>
          <div className="p2-btns">
            <div className="p2-btn" data-p2-btn-risk>
              RISK
            </div>
            <div className="p2-btn">OPPORTUNITY</div>
            <div className="p2-btn">NEUTRAL</div>
          </div>
        </div>
        <div className="p2-card">
          <div className="p2-card-label">VISUALISATION FORMAT</div>
          <div className="p2-btns">
            <div className="p2-btn" data-p2-btn-tl>
              TRAFFIC LIGHT
            </div>
            <div className="p2-btn">PII LIST</div>
            <div className="p2-btn">HEATMAP</div>
          </div>
        </div>
        <div className="p2-echo" data-p2-echo-line>
          ECHO: Risk framing on an ethics card tells NOVA you took it seriously.
        </div>
      </div>
      <ProtoCursor />
    </div>
  );
}

/* ── CARD 03: Crew rows committing ── */
export function Card03Preview({ active }: { active: boolean }) {
  const panelRef = useCardTimeline(active, (panel) => {
    const cursor = panel.querySelector<HTMLElement>("[data-cursor]");
    const ring = cursor?.querySelector<HTMLElement>(".proto-cur-ring");
    const zexRow = panel.querySelector<HTMLElement>("[data-p3-zex]");
    const atlasRow = panel.querySelector<HTMLElement>("[data-p3-atlas]");
    const zexSt = panel.querySelector<HTMLElement>("[data-p3-zex-st]");
    const atlasSt = panel.querySelector<HTMLElement>("[data-p3-atlas-st]");
    if (!cursor || !ring || !zexRow || !atlasRow || !zexSt || !atlasSt) return null;

    gsap.set(cursor, { opacity: 0, x: 20, y: 20 });
    gsap.set(ring, { opacity: 0, scale: 0.5 });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: "power2.out" } });
    const clickPulse = (t: number) => {
      tl.to(ring, { opacity: 0.6, scale: 1.5, duration: 0.15, ease: "power1.out" }, t).to(ring, { opacity: 0, scale: 0.5, duration: 0.25 }, t + 0.18);
    };
    tl.to(cursor, { opacity: 1, duration: 0.3 }, 0.3);
    tl.to(cursor, { x: () => getPos(panel, zexRow).x, y: () => getPos(panel, zexRow).y, duration: 0.9, ease: "power2.inOut" }, 0.5);
    clickPulse(1.5);
    tl.call(
      () => {
        zexRow.classList.add("cr-active");
        zexSt.style.color = "var(--purple-light)";
        zexSt.textContent = "ASKING";
      },
      undefined,
      1.65
    );
    tl.to(cursor, { opacity: 0, duration: 0.2 }, 2.4);
    tl.call(
      () => {
        zexRow.classList.remove("cr-active");
        zexRow.classList.add("cr-commit");
        zexSt.style.color = "var(--green)";
        zexSt.textContent = "COMMITTED ✓";
      },
      undefined,
      3.0
    );
    tl.to(cursor, { opacity: 1, duration: 0.3 }, 3.2);
    tl.to(cursor, { x: () => getPos(panel, atlasRow).x, y: () => getPos(panel, atlasRow).y, duration: 0.8, ease: "power2.inOut" }, 3.4);
    clickPulse(4.3);
    tl.call(
      () => {
        atlasRow.classList.add("cr-active");
        atlasSt.style.color = "var(--purple-light)";
        atlasSt.textContent = "ASKING";
      },
      undefined,
      4.45
    );
    tl.to(cursor, { opacity: 0, duration: 0.2 }, 5.2);
    tl.call(
      () => {
        atlasRow.classList.remove("cr-active");
        atlasRow.classList.add("cr-commit");
        atlasSt.style.color = "var(--green)";
        atlasSt.textContent = "COMMITTED ✓";
      },
      undefined,
      5.8
    );
    tl.to(cursor, { opacity: 0, duration: 0.3 }, 6.8);
    tl.call(
      () => {
        zexRow.classList.remove("cr-commit");
        zexSt.style.color = "var(--text-d)";
        zexSt.textContent = "PENDING";
        atlasRow.classList.remove("cr-commit");
        atlasSt.style.color = "var(--text-d)";
        atlasSt.textContent = "PENDING";
      },
      undefined,
      7.2
    );
    tl.set(cursor, { x: 20, y: 20 }, 7.25);
    return tl;
  });

  const rows = [
    { key: "zex", row: "data-p3-zex", st: "data-p3-zex-st", initial: "Z", style: { background: "rgba(247,148,33,.12)", border: "1.5px solid var(--orange)", color: "var(--orange)" } },
    { key: "atlas", row: "data-p3-atlas", st: "data-p3-atlas-st", initial: "A", style: { background: "rgba(0,196,28,.08)", border: "1.5px solid var(--green-stable)", color: "var(--green-stable)" } },
    { key: "nova", row: "data-p3-nova", st: "data-p3-nova-st", initial: "N", style: { background: "rgba(211,25,114,.10)", border: "1.5px solid var(--pink)", color: "var(--pink)" } },
    { key: "kade", row: "data-p3-kade", st: "data-p3-kade-st", initial: "K", style: { background: "rgba(143,68,232,.10)", border: "1.5px solid var(--purple-light)", color: "var(--purple-light)" } },
  ];

  return (
    <div className="card-preview" ref={panelRef} aria-hidden>
      <div className="p3-board">
        {rows.map((r) => (
          <div key={r.key} className="p3-crew-row" {...{ [r.row]: "" }}>
            <div className="p3-crew-avatar" style={r.style}>
              {r.initial}
            </div>
            <div className="p3-crew-name">{r.key.toUpperCase()}</div>
            <div className="p3-crew-status" style={{ color: "var(--text-d)" }} {...{ [r.st]: "" }}>
              PENDING
            </div>
          </div>
        ))}
      </div>
      <ProtoCursor />
    </div>
  );
}
