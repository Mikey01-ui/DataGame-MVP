"use client";

import { useEffect } from "react";
import type { VideoIntroContent } from "@/lib/content";

type IntroBriefModalProps = {
  modal: VideoIntroContent["modal"];
  open: boolean;
  onClose: () => void;
};

export function IntroBriefModal({ modal, open, onClose }: IntroBriefModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`vi-intro-modal-overlay${open ? " active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div className="vi-intro-modal" role="dialog" aria-modal="true" aria-labelledby="intro-modal-title">
        <div className="vi-intro-modal-header">
          <div>
            <div className="vi-intro-modal-eyebrow">{modal.eyebrow}</div>
            <h2 id="intro-modal-title">{modal.title}</h2>
          </div>
          <button type="button" className="vi-intro-modal-close-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="vi-intro-modal-body">
          {modal.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        <div className="vi-intro-modal-footer">
          <span className="vi-intro-modal-footer-text">{modal.footer}</span>
          <button type="button" className="vi-intro-modal-close-btn" onClick={onClose}>
            {modal.close}
          </button>
        </div>
      </div>
    </div>
  );
}
