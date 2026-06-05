"use client";

import { FILES, STEP_DATA_HINT, STEPS } from "@/lib/game/m4/data";

type Props = {
  selectedStepId: string | null;
  picks: Record<string, string>;
  hidden: boolean;
  onClose: () => void;
};

export function M4StepPop({ selectedStepId, picks, hidden, onClose }: Props) {
  const step = selectedStepId ? STEPS.find((s) => s.id === selectedStepId) : null;
  if (!step) return null;

  const assigned = FILES.find((f) => picks[f.id] === step.id);

  return (
    <aside
      id="r4-step-pop"
      className={`r4-step-pop has-step${hidden ? " hidden" : ""}`}
      aria-live="polite"
    >
      <button type="button" className="r4-step-pop-close" onClick={onClose} title="Close">
        <i className="fas fa-times" aria-hidden />
      </button>
      <div className="r4-step-pop-h">Step details</div>
      <div className="r4-step-pop-t">{step.title}</div>
      <div className="r4-step-pop-lane">
        <i className="fas fa-building" aria-hidden /> {step.lane}
      </div>

      <div className="r4-step-pop-purpose">{step.purpose}</div>
      <div className="r4-step-pop-section">
        <span className="r4-step-pop-label">Expects:</span> {STEP_DATA_HINT[step.id] ?? step.inputs}
      </div>
      <div className="r4-step-pop-section">
        <span className="r4-step-pop-label">Inputs:</span> {step.inputs}
      </div>
      <div className="r4-step-pop-section">
        <span className="r4-step-pop-label">Outputs:</span> {step.outputs}
      </div>
      <div className="r4-step-pop-bottleneck">
        <i className="fas fa-exclamation-triangle" aria-hidden /> {step.bottleneck}
      </div>
      {assigned && (
        <div className="r4-step-pop-ok">
          <i className="fas fa-check-circle" aria-hidden /> Artifact attached: {assigned.name}
        </div>
      )}
    </aside>
  );
}
