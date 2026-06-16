"use client";

import { useEffect, useRef, useState } from "react";
import type { CrewId, CrewState } from "@/lib/game/m5/types";

const SVG_NS = "http://www.w3.org/2000/svg";
const CX = 260;
const CY = 160;
const CREW = [
  { lbl: "ZEX", x: 80, y: 70, col: "#f79421" },
  { lbl: "ATLAS", x: 440, y: 70, col: "#00c41c" },
  { lbl: "NOVA", x: 80, y: 250, col: "#d31972" },
  { lbl: "KADE", x: 440, y: 250, col: "#8f44e8" },
];

/** Crew-vote synthesis animation, ported 1:1 from round5_v3's showSynth(). */
export function M5SynthOverlay({
  ships,
  commits,
  crewState,
  onDone,
}: {
  ships: boolean;
  commits: number;
  crewState: Record<CrewId, CrewState>;
  onDone: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [label, setLabel] = useState<{ text: string; color: string } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;

    svg.innerHTML =
      '<defs><filter id="sg2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';

    const lines: SVGLineElement[] = [];
    CREW.forEach((n) => {
      const st = crewState[n.lbl.toLowerCase() as CrewId];
      const committed = st?.status === "committed";
      const col = committed ? n.col : "rgba(100,100,100,.4)";

      const line = document.createElementNS(SVG_NS, "line");
      line.setAttribute("x1", String(n.x));
      line.setAttribute("y1", String(n.y));
      line.setAttribute("x2", String(CX));
      line.setAttribute("y2", String(CY));
      line.setAttribute("stroke", col);
      line.setAttribute("stroke-width", committed ? "2" : "1");
      line.setAttribute("filter", "url(#sg2)");
      const len = Math.hypot(CX - n.x, CY - n.y);
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = String(len);
      svg.appendChild(line);
      lines.push(line);

      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", String(n.x));
      c.setAttribute("cy", String(n.y));
      c.setAttribute("r", "28");
      c.setAttribute("fill", committed ? "rgba(0,0,0,.4)" : "rgba(0,0,0,.2)");
      c.setAttribute("stroke", col);
      c.setAttribute("stroke-width", "1.5");
      c.setAttribute("filter", "url(#sg2)");
      svg.appendChild(c);

      const t = document.createElementNS(SVG_NS, "text");
      t.setAttribute("x", String(n.x));
      t.setAttribute("y", String(n.y + 3));
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("fill", col);
      t.setAttribute("font-size", "9");
      t.setAttribute("font-family", "Space Grotesk,sans-serif");
      t.setAttribute("font-weight", "600");
      t.textContent = n.lbl;
      svg.appendChild(t);

      if (committed) {
        const tick = document.createElementNS(SVG_NS, "text");
        tick.setAttribute("x", String(n.x));
        tick.setAttribute("y", String(n.y + 16));
        tick.setAttribute("text-anchor", "middle");
        tick.setAttribute("fill", col);
        tick.setAttribute("font-size", "8");
        tick.setAttribute("font-family", "Space Grotesk,sans-serif");
        tick.textContent = "COMMITTED";
        svg.appendChild(tick);
      }
    });

    const oc = document.createElementNS(SVG_NS, "circle");
    oc.setAttribute("cx", String(CX));
    oc.setAttribute("cy", String(CY));
    oc.setAttribute("r", "0");
    oc.setAttribute("fill", ships ? "rgba(0,255,65,.08)" : "rgba(211,25,114,.08)");
    oc.setAttribute("stroke", ships ? "#00FF41" : "#d31972");
    oc.setAttribute("stroke-width", "2");
    oc.setAttribute("filter", "url(#sg2)");
    svg.appendChild(oc);

    const ot = document.createElementNS(SVG_NS, "text");
    ot.setAttribute("x", String(CX));
    ot.setAttribute("y", String(CY + 5));
    ot.setAttribute("text-anchor", "middle");
    ot.setAttribute("fill", ships ? "#00FF41" : "#d31972");
    ot.setAttribute("font-size", "11");
    ot.setAttribute("font-family", "Space Grotesk,sans-serif");
    ot.setAttribute("font-weight", "700");
    ot.setAttribute("opacity", "0");
    ot.textContent = `${commits}/4 COMMITTED`;
    svg.appendChild(ot);

    CREW.forEach((_, i) =>
      timers.push(
        setTimeout(() => {
          const ln = lines[i];
          ln.style.transition = "stroke-dashoffset 0.5s ease";
          ln.style.strokeDashoffset = "0";
        }, 300 + i * 350)
      )
    );

    const totalDelay = 300 + CREW.length * 350;
    timers.push(
      setTimeout(() => {
        let r = 0;
        const step = () => {
          r = Math.min(r + 2.5, 42);
          oc.setAttribute("r", String(r));
          if (r < 42) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        timers.push(
          setTimeout(() => {
            ot.style.transition = "opacity .5s";
            ot.setAttribute("opacity", "1");
            setLabel({
              text: ships ? "✓ OPERATION SHIPS — VAULT ACCESS GRANTED" : "✗ OPERATION ABORTED — THRESHOLD NOT MET",
              color: ships ? "var(--green-matrix)" : "var(--pink)",
            });
          }, 500)
        );
      }, totalDelay)
    );

    timers.push(setTimeout(onDone, totalDelay + 3200));

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="synth-overlay"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.97)", zIndex: 450, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
    >
      <svg ref={svgRef} id="synth-svg" viewBox="0 0 520 320" xmlns={SVG_NS} style={{ width: 520, height: 320 }} />
      <div
        id="synth-label"
        style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: 13,
          color: label?.color ?? "var(--green-matrix)",
          letterSpacing: 3,
          marginTop: 22,
          opacity: label ? 1 : 0,
          transition: "opacity .8s",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        {label?.text ?? ""}
      </div>
    </div>
  );
}
