"use client";

import type { Dataset } from "@/lib/game/m3/types";

export function M3Inspector({ dataset }: { dataset: Dataset }) {
  return (
    <div className="m3-inspector-content">
      <div className="m3-meta-grid">
        <div>
          <span className="m3-meta-k">Classification</span>
          <span className="m3-meta-v">{dataset.classification}</span>
        </div>
        <div>
          <span className="m3-meta-k">Identifiers</span>
          <span className="m3-meta-v">{dataset.identifiers}</span>
        </div>
        <div>
          <span className="m3-meta-k">Harm if public</span>
          <span className="m3-meta-v warn">{dataset.harmIfPublic}</span>
        </div>
        <div>
          <span className="m3-meta-k">Analyst note</span>
          <span className="m3-meta-v">{dataset.note}</span>
        </div>
      </div>
      <div className="m3-preview-placeholder">
        <i className="fas fa-file-lines" aria-hidden /> Document preview — read metadata above before routing.
      </div>
    </div>
  );
}
