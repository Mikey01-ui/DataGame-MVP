"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FLOW_EDGES,
  FLOW_NODE_POSITIONS,
  STEP_FLOW_ICONS,
  STEPS,
  isStepAvailable,
  isStepSatisfied,
} from "@/lib/game/m4/data";

type Props = {
  picks: Record<string, string>;
  selectedStepId: string | null;
  submitted: boolean;
  onSelectStep: (stepId: string) => void;
  onDropFile: (fileId: string, stepId: string) => void;
};

export function M4FlowCanvas({ picks, selectedStepId, submitted, onSelectStep, onDropFile }: Props) {
  const flowRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 400 });
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const animatedEdges = useRef(new Set<string>());

  useEffect(() => {
    const el = flowRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  const edgePaths = useMemo(() => {
    return FLOW_EDGES.map(([fromIdx, toIdx]) => {
      const fromPos = FLOW_NODE_POSITIONS[fromIdx];
      const toPos = FLOW_NODE_POSITIONS[toIdx];
      const x1 = (fromPos.x / 100) * size.w + 40;
      const y1 = (fromPos.y / 100) * size.h;
      const x2 = (toPos.x / 100) * size.w - 40;
      const y2 = (toPos.y / 100) * size.h;
      const fromStep = STEPS[fromIdx];
      const done = fromStep && isStepSatisfied(fromStep.id, picks);
      const d =
        Math.abs(y1 - y2) < 10
          ? `M${x1},${y1} L${x2},${y2}`
          : `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
      return { d, done, key: `${fromIdx}->${toIdx}` };
    });
  }, [picks, size]);

  useEffect(() => {
    edgePaths.forEach((e) => {
      if (e.done) animatedEdges.current.add(e.key);
    });
  }, [edgePaths]);

  const handleDragOver = useCallback(
    (e: React.DragEvent, stepId: string, idx: number) => {
      e.preventDefault();
      if (submitted || isStepSatisfied(stepId, picks) || !isStepAvailable(idx, picks)) return;
      setDragTarget(stepId);
      e.dataTransfer.dropEffect = "move";
    },
    [picks, submitted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, stepId: string) => {
      e.preventDefault();
      setDragTarget(null);
      const fileId = e.dataTransfer.getData("text/r4-file");
      if (fileId) onDropFile(fileId, stepId);
    },
    [onDropFile]
  );

  return (
    <div id="m4-flow-dist" className="m4-flow-dist">
      <div className="dist-hdr m4-flow-dist-hdr">
        <div className="dist-title">OMNI — NEW EMPLOYEE ONBOARDING FLOW</div>
        <div className="dist-sub">
          OFFER → INTEGRATION · CLICK AN ICON · DRAG DATA FROM THE RIGHT RAIL · GREEN ARROWS = STEP COMPLETE
        </div>
      </div>

      <div className="fc-phase-bar">
        {["Offer", "Verification", "Provisioning", "Integration"].map((label, pi) => {
          const phaseSteps = [[0, 1], [2, 3, 4], [5], [6, 7]][pi] ?? [];
          const allDone = phaseSteps.every((si) => STEPS[si] && isStepSatisfied(STEPS[si].id, picks));
          return (
            <div key={label} className={`fc-phase${allDone ? " done" : ""}`}>
              <span className="fc-phase-label">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="fc-canvas">
        <div className="fc-canvas-inner" id="flow-row" ref={flowRef}>
          <svg className="fc-edges" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
            <defs>
              <marker id="arrow-pending" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L7,3.5 L0,7 L2,3.5 Z" fill="#475569" />
              </marker>
              <marker id="arrow-done" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L7,3.5 L0,7 L2,3.5 Z" fill="#00ff41" />
              </marker>
            </defs>
            {edgePaths.map((e) => (
              <path
                key={e.key}
                d={e.d}
                className={`fc-edge${e.done ? " done fc-edge-pulse" : ""}`}
                markerEnd={`url(#arrow-${e.done ? "done" : "pending"})`}
              />
            ))}
          </svg>
          {STEPS.map((step, idx) => {
            const pos = FLOW_NODE_POSITIONS[idx];
            const done = isStepSatisfied(step.id, picks);
            const available = isStepAvailable(idx, picks);
            const locked = !done && !available;
            const sel = selectedStepId === step.id;
            const isDrag = dragTarget === step.id;
            return (
              <div
                key={step.id}
                data-step-id={step.id}
                className={`fc-node${done ? " done" : ""}${sel ? " sel" : ""}${locked ? " locked" : ""}${available && !done ? " available" : ""}${isDrag ? " drag-target" : ""}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => !submitted && !locked && !done && onSelectStep(step.id)}
                onDragOver={(e) => handleDragOver(e, step.id, idx)}
                onDragLeave={() => setDragTarget(null)}
                onDrop={(e) => handleDrop(e, step.id)}
              >
                <div className="fc-node-box">
                  {locked && (
                    <div className="fc-node-lock">
                      <i className="fas fa-lock" aria-hidden />
                    </div>
                  )}
                  <i className={`fas ${STEP_FLOW_ICONS[step.id] ?? "fa-circle-dot"} fc-node-ico`} aria-hidden />
                  <div className="fc-node-label">{step.title.split(" ")[0]}</div>
                </div>
                <div className="fc-node-badge">
                  <i className="fas fa-check" aria-hidden />
                </div>
                {done ? <div className="fc-node-status">Complete</div> : locked ? <div className="fc-node-status">Locked</div> : null}
                <div className="fc-drop-zone" data-step-id={step.id} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
