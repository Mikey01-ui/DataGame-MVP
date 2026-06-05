"use client";

import { useEffect, useRef, useState } from "react";

const NODES = [
  { lbl: "COMPUTE", x: 115, y: 95 },
  { lbl: "FUNDING", x: 585, y: 95 },
  { lbl: "PERSONNEL", x: 115, y: 405 },
  { lbl: "PAYLOAD", x: 585, y: 405 },
];
const CX = 350;
const CY = 250;
const OUTER_R = 46;
const CENTER_R = 72;

export function M1SynthOverlay() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.innerHTML = `<defs><filter id="sg" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter></defs>`;

    const lines: SVGLineElement[] = [];
    NODES.forEach((n, i) => {
      const dx = CX - n.x;
      const dy = CY - n.y;
      const dist = Math.hypot(dx, dy);
      const ux = dx / dist;
      const uy = dy / dist;
      const x1 = n.x + ux * OUTER_R;
      const y1 = n.y + uy * OUTER_R;
      const x2 = CX - ux * CENTER_R;
      const y2 = CY - uy * CENTER_R;
      const lineLen = Math.hypot(x2 - x1, y2 - y1);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(x1));
      line.setAttribute("y1", String(y1));
      line.setAttribute("x2", String(x2));
      line.setAttribute("y2", String(y2));
      line.setAttribute("stroke", "#00FF41");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("filter", "url(#sg)");
      line.style.strokeDasharray = String(lineLen);
      line.style.strokeDashoffset = String(lineLen);
      svg.appendChild(line);
      lines.push(line);

      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", String(n.x));
      c.setAttribute("cy", String(n.y));
      c.setAttribute("r", String(OUTER_R));
      c.setAttribute("fill", "none");
      c.setAttribute("stroke", "#00FF41");
      c.setAttribute("stroke-width", "1.5");
      c.setAttribute("filter", "url(#sg)");
      svg.appendChild(c);

      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", String(n.x));
      t.setAttribute("y", String(n.y + 5));
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("fill", "#00FF41");
      t.setAttribute("font-size", "11");
      t.setAttribute("font-family", "Space Grotesk, sans-serif");
      t.setAttribute("letter-spacing", "1");
      t.textContent = n.lbl;
      svg.appendChild(t);
    });

    const oc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    oc.setAttribute("cx", String(CX));
    oc.setAttribute("cy", String(CY));
    oc.setAttribute("r", "0");
    oc.setAttribute("fill", "rgba(0,255,65,.10)");
    oc.setAttribute("stroke", "#00FF41");
    oc.setAttribute("stroke-width", "2.5");
    oc.setAttribute("filter", "url(#sg)");
    svg.appendChild(oc);

    const ot1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    ot1.setAttribute("x", String(CX));
    ot1.setAttribute("y", String(CY - 4));
    ot1.setAttribute("text-anchor", "middle");
    ot1.setAttribute("fill", "#00FF41");
    ot1.setAttribute("font-size", "30");
    ot1.setAttribute("font-family", "Space Grotesk, sans-serif");
    ot1.setAttribute("font-weight", "700");
    ot1.setAttribute("letter-spacing", "5");
    ot1.setAttribute("opacity", "0");
    ot1.textContent = "OMNI";
    svg.appendChild(ot1);

    const ot2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    ot2.setAttribute("x", String(CX));
    ot2.setAttribute("y", String(CY + 22));
    ot2.setAttribute("text-anchor", "middle");
    ot2.setAttribute("fill", "#8f44e8");
    ot2.setAttribute("font-size", "12");
    ot2.setAttribute("font-family", "Space Grotesk, sans-serif");
    ot2.setAttribute("letter-spacing", "4");
    ot2.setAttribute("opacity", "0");
    ot2.textContent = "CONFIRMED";
    svg.appendChild(ot2);

    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((ln, i) => {
      timers.push(
        setTimeout(() => {
          ln.style.transition = "stroke-dashoffset 0.55s ease";
          ln.style.strokeDashoffset = "0";
        }, 420 + i * 380)
      );
    });

    const centerDelay = 420 + 4 * 380;
    timers.push(
      setTimeout(() => {
        let r = 0;
        const step = () => {
          r = Math.min(r + 2, CENTER_R);
          oc.setAttribute("r", String(r));
          if (r < CENTER_R) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        setTimeout(() => {
          ot1.style.transition = "opacity 0.6s";
          ot1.setAttribute("opacity", "1");
          ot2.style.transition = "opacity 0.6s";
          ot2.setAttribute("opacity", "1");
        }, 600);
      }, centerDelay)
    );

    timers.push(setTimeout(() => setDone(true), centerDelay + 1200));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div id="synth-overlay">
      <svg id="synth-svg" ref={svgRef} viewBox="0 0 700 500" />
      <div className={`synth-done${done ? " show" : ""}`}>FOOTPRINT DOSSIER COMPILED</div>
    </div>
  );
}
