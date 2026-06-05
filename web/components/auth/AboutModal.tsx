"use client";

import type { LoginContent } from "@/lib/content";

type AboutModalProps = {
  content: LoginContent["about"];
  open: boolean;
  onClose: () => void;
};

export function AboutModal({ content, open, onClose }: AboutModalProps) {
  return (
    <div
      className={`modal-overlay${open ? " active" : ""}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-eyebrow">{content.eyebrow}</div>
            <h2 className="omni-title" style={{ fontSize: "1.5rem" }}>
              {content.title}
            </h2>
          </div>
          <button type="button" className="btn-secondary" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          {content.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <button type="button" className="btn-secondary" onClick={onClose}>
          {content.close}
        </button>
      </div>
    </div>
  );
}
