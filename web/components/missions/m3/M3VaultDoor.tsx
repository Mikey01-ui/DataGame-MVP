"use client";

import { useCallback, useEffect, useState } from "react";

const VAULT_CODE = "OMNI";
const DIAL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Props = {
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
};

export function M3VaultDoor({ open, onClose, onUnlocked }: Props) {
  const [tumblers, setTumblers] = useState(["A", "A", "A", "A"]);
  const [activeTumbler, setActiveTumbler] = useState(0);
  const [dialIndex, setDialIndex] = useState(0);
  const [status, setStatus] = useState("");
  const [opening, setOpening] = useState(false);

  const setDial = useCallback((idx: number) => {
    const letter = DIAL_LETTERS[((idx % 26) + 26) % 26];
    setDialIndex(((idx % 26) + 26) % 26);
    setTumblers((prev) => {
      const next = [...prev];
      next[activeTumbler] = letter;
      return next;
    });
  }, [activeTumbler]);

  const reset = useCallback(() => {
    setTumblers(["A", "A", "A", "A"]);
    setActiveTumbler(0);
    setDialIndex(0);
    setStatus("");
    setOpening(false);
  }, []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const submit = () => {
    const code = tumblers.join("");
    if (code === VAULT_CODE) {
      setStatus("Code accepted — opening vault…");
      setOpening(true);
      setTimeout(() => onUnlocked(), 1400);
      return;
    }
    setStatus("Incorrect code — try again.");
    setTumblers(["A", "A", "A", "A"]);
    setActiveTumbler(0);
    setDialIndex(0);
  };

  if (!open) return null;

  const dialRot = (dialIndex * (360 / 26)).toFixed(1);

  return (
    <div id="vault-door-screen" className={`active${opening ? " is-opening" : ""}`} aria-hidden={false}>
      <div className="vault-door-hud">
        <p className="vault-door-hint">
          Rotate the <strong>combination dial</strong> to set each letter from the breach package, then open the vault.
        </p>
        <button type="button" className="vault-door-back" onClick={onClose}>
          Back to desktop
        </button>
      </div>
      <div className="vault-scene">
        <div className={`vault-scene-inner${opening ? " vault-bolts-out" : ""}`} id="vault-scene-inner">
          <div className="vault-wall" aria-hidden />
          <div className={`vault-cavity${opening ? " lit" : ""}`} id="vault-cavity">
            <div className="vault-cavity-glow" aria-hidden />
          </div>
          <div className="vault-door-assembly">
            <div className={`vault-door-slide${opening ? " open" : ""}`} id="vault-door-slide">
              <div className="vault-door-face">
                <div className="vault-combo-wrap" id="vault-combo-wrap" onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const cx = rect.left + rect.width / 2;
                  const cy = rect.top + rect.height / 2;
                  const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
                  const step = Math.round(((angle + 90) / 360) * 26) % 26;
                  setDial(step);
                }}>
                  <div id="vault-combo-dial">
                    <div className="vault-combo-ring" style={{ transform: `rotate(${dialRot}deg)` }}>
                      <div className="vault-combo-ticks" aria-hidden />
                    </div>
                    <div className="vault-combo-letter" id="vault-combo-letter">
                      {DIAL_LETTERS[dialIndex]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="vault-tumbler-panel">
        <div className="vault-tumblers">
          {tumblers.map((letter, i) => (
            <button
              key={i}
              type="button"
              className={`vault-tumbler${i === activeTumbler ? " active" : ""}${letter === VAULT_CODE[i] ? " correct" : ""} filled`}
              onClick={() => {
                setActiveTumbler(i);
                setDialIndex(DIAL_LETTERS.indexOf(letter));
              }}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="vault-door-status" id="vault-door-status">
          {status}
        </div>
        <div className="vault-door-actions">
          <button type="button" className="vault-door-btn vault-door-btn--open" disabled={tumblers.join("").length !== 4} onClick={submit}>
            Turn wheel &amp; open
          </button>
        </div>
        <input
          type="text"
          id="vault-safe-input"
          className="vault-safe-input"
          maxLength={4}
          placeholder="OMNI"
          onChange={(e) => {
            const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
            e.target.value = val;
            const next = ["A", "A", "A", "A"];
            for (let i = 0; i < 4; i++) next[i] = val[i] || "A";
            setTumblers(next);
            setActiveTumbler(Math.min(val.length, 3));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowUp") setDial(dialIndex + 1);
            if (e.key === "ArrowDown") setDial(dialIndex - 1);
          }}
        />
      </div>
    </div>
  );
}
