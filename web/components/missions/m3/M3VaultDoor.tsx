"use client";

import gsap from "gsap";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useOptionalGameAudio } from "@/lib/audio/GameAudioProvider";

const VAULT_CODE = "OMNI";
const DIAL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const VAULT_OPEN_SFX_KEYS = ["vaultOpen"] as const;
const defaultTumblers = (): string[] => ["A", "A", "A", "A"];

type Props = {
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
};

function VaultHandwheelSvg({ idPrefix }: { idPrefix: string }) {
  return (
    <svg className="vault-wheel-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id={`${idPrefix}-rim`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#d0d2da" />
          <stop offset="55%" stopColor="#8a8c96" />
          <stop offset="100%" stopColor="#5a5c64" />
        </radialGradient>
        <linearGradient id={`${idPrefix}-spoke`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8bac4" />
          <stop offset="50%" stopColor="#7a7c86" />
          <stop offset="100%" stopColor="#4a4c54" />
        </linearGradient>
        <radialGradient id={`${idPrefix}-hub`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#e4e6ee" />
          <stop offset="60%" stopColor="#9a9ca4" />
          <stop offset="100%" stopColor="#4a4c54" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill={`url(#${idPrefix}-rim)`} stroke="#4a4c52" strokeWidth="2" />
      <g fill={`url(#${idPrefix}-spoke)`} stroke="#3a3c44" strokeWidth=".5">
        <path d="M100 100 L100 18 A82 82 0 0 1 158 42 Z" />
        <path d="M100 100 L158 42 A82 82 0 0 1 182 100 Z" />
        <path d="M100 100 L182 100 A82 82 0 0 1 158 158 Z" />
        <path d="M100 100 L158 158 A82 82 0 0 1 100 182 Z" />
        <path d="M100 100 L100 182 A82 82 0 0 1 42 158 Z" />
        <path d="M100 100 L42 158 A82 82 0 0 1 18 100 Z" />
        <path d="M100 100 L18 100 A82 82 0 0 1 42 42 Z" />
        <path d="M100 100 L42 42 A82 82 0 0 1 100 18 Z" />
      </g>
      <circle cx="100" cy="100" r="34" fill={`url(#${idPrefix}-hub)`} stroke="#3a3c44" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="14" fill="#2a2c32" stroke="#1a1c22" strokeWidth="1" />
      <circle cx="100" cy="100" r="6" fill="#1a1c20" />
    </svg>
  );
}

export function M3VaultDoor({ open, onClose, onUnlocked }: Props) {
  const audio = useOptionalGameAudio();
  const wheelId = useId().replace(/:/g, "");
  const sceneRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const handwheelRef = useRef<HTMLDivElement>(null);
  const cavityRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const comboWrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const draggingRef = useRef(false);
  const dragStartAngleRef = useRef(0);
  const dragStartIndexRef = useRef(0);
  const lastDialIndexRef = useRef(0);

  const [tumblers, setTumblers] = useState(defaultTumblers);
  const [activeTumbler, setActiveTumbler] = useState(0);
  const [dialIndex, setDialIndex] = useState(0);
  const [status, setStatus] = useState("");
  const [statusOk, setStatusOk] = useState<boolean | null>(null);
  const [opening, setOpening] = useState(false);
  const [shaking, setShaking] = useState(false);

  const setDial = useCallback(
    (idx: number) => {
      if (opening) return;
      const normalized = ((idx % 26) + 26) % 26;
      if (normalized !== lastDialIndexRef.current) {
        lastDialIndexRef.current = normalized;
        audio?.playSfx("vaultClick", 0.55);
      }
      const letter = DIAL_LETTERS[normalized];
      setDialIndex(normalized);
      setTumblers((prev) => {
        const next = [...prev];
        next[activeTumbler] = letter;
        return next;
      });
    },
    [activeTumbler, audio, opening],
  );

  const reset = useCallback(() => {
    setTumblers(defaultTumblers());
    setActiveTumbler(0);
    setDialIndex(0);
    setStatus("");
    setStatusOk(null);
    setOpening(false);
    setShaking(false);
    lastDialIndexRef.current = 0;
    if (slideRef.current) gsap.set(slideRef.current, { xPercent: 0, clearProps: "transform" });
    if (handwheelRef.current) gsap.set(handwheelRef.current, { rotation: 0, clearProps: "transform" });
    if (cavityRef.current) {
      cavityRef.current.classList.remove("lit");
      gsap.set(cavityRef.current, { opacity: 0, scale: 0.98, clearProps: "opacity,transform" });
    }
    if (flashRef.current) gsap.set(flashRef.current, { opacity: 0 });
  }, []);

  useEffect(() => {
    if (open) {
      reset();
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(t);
    }
    audio?.stopSfxKeys([...VAULT_OPEN_SFX_KEYS]);
  }, [audio, open, reset]);

  const playOpenSequence = useCallback(() => {
    const scene = sceneRef.current;
    const slide = slideRef.current;
    const handwheel = handwheelRef.current;
    const cavity = cavityRef.current;
    const flash = flashRef.current;
    const comboWrap = comboWrapRef.current;

    if (!slide) {
      onUnlocked();
      return;
    }

    setOpening(true);
    comboWrap?.classList.add("locked");

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stopVaultOpenSfx = () => {
      audio?.stopSfxKeys([...VAULT_OPEN_SFX_KEYS]);
    };

    const finish = () => {
      stopVaultOpenSfx();
      reset();
      onUnlocked();
    };

    if (reduced) {
      audio?.playSfx("vaultOpen");
      scene?.classList.add("vault-bolts-out");
      cavity?.classList.add("lit");
      slide.style.transform = "translateX(-108%)";
      window.setTimeout(finish, 500);
      return;
    }

    gsap.set(slide, { xPercent: 0 });
    if (handwheel) gsap.set(handwheel, { rotation: 0 });
    if (cavity) gsap.set(cavity, { opacity: 0, scale: 0.98 });
    scene?.classList.remove("vault-bolts-out");
    cavity?.classList.remove("lit");

    const tl = gsap.timeline({ onComplete: finish });

    if (handwheel) {
      tl.to(handwheel, { rotation: 720, duration: 1.5, ease: "power2.inOut" }, 0.1);
    }
    tl.call(() => scene?.classList.add("vault-bolts-out"), undefined, 0.55);
    tl.to(cavity, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, 0.68);
    tl.call(() => cavity?.classList.add("lit"), undefined, 0.72);
    tl.to(slide, { xPercent: -108, duration: 1.2, ease: "power3.inOut" }, 0.82);
    tl.call(() => audio?.playSfx("vaultOpen"), undefined, 0.82);
    if (flash) {
      tl.to(flash, { opacity: 0.35, duration: 0.3, ease: "power2.out" }, 0.9).to(
        flash,
        { opacity: 0, duration: 0.35, ease: "power2.in" },
        1.35,
      );
    }
    tl.to({}, { duration: 0.42 }, 2.05);
  }, [audio, onUnlocked, reset]);

  const submit = () => {
    const code = tumblers.join("");
    if (code.length !== 4) return;

    if (code === VAULT_CODE) {
      setStatus("✓ Combination correct — opening vault…");
      setStatusOk(true);
      playOpenSequence();
      return;
    }

    setShaking(true);
    audio?.playSfx("vaultWrong");
    window.setTimeout(() => setShaking(false), 450);
    setStatus("✗ Invalid combination — try again");
    setStatusOk(false);
    setTumblers(defaultTumblers());
    setActiveTumbler(0);
    setDialIndex(0);
    lastDialIndexRef.current = 0;
  };

  const pickDialFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const wrap = comboWrapRef.current;
      if (!wrap || opening) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
      const step = Math.round(((angle + 90) / 360) * 26) % 26;
      setDial(step);
    },
    [opening, setDial],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const wrap = comboWrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const delta = angle - dragStartAngleRef.current;
      const steps = Math.round((delta / (2 * Math.PI)) * 26);
      setDial(dragStartIndexRef.current + steps);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [setDial]);

  if (!open) return null;

  const dialRot = (dialIndex * (360 / 26)).toFixed(1);
  const codeReady = tumblers.join("").length === 4;

  return (
    <div id="vault-door-screen" className={`active${opening ? " is-opening" : ""}`} aria-hidden={false}>
      <div className="vault-open-flash" id="vault-open-flash" ref={flashRef} aria-hidden />
      <div className="vault-door-hud">
        <p className="vault-door-hint">
          Rotate the <strong>combination dial</strong> to set each letter from the breach package, then open the vault.
        </p>
      </div>
      <div className="vault-scene">
        <div
          className={`vault-scene-inner${shaking ? " shake" : ""}${opening ? " vault-bolts-out" : ""}`}
          id="vault-scene-inner"
          ref={sceneRef}
        >
          <div className="vault-wall" aria-hidden />
          <div className="vault-cavity" id="vault-cavity" ref={cavityRef} aria-hidden>
            <div className="vault-cavity-slot" id="vault-cavity-slot" />
            <div className="vault-cavity-glow" aria-hidden />
          </div>
          <div className="vault-door-assembly" id="vault-door-assembly">
            <div className="vault-door-slide" id="vault-door-slide" ref={slideRef}>
              <div className="vault-door-face" id="vault-door-face">
                <div className="vault-rivets" aria-hidden />
                <div className="vault-lock-mechanism" id="vault-lock-mechanism" aria-hidden>
                  <div className="vault-bolt vault-bolt--tl" id="vault-bolt-tl" />
                  <div className="vault-bolt vault-bolt--bl" id="vault-bolt-bl" />
                  <div className="vault-bolt vault-bolt--mr" id="vault-bolt-mr" />
                </div>
                <div
                  className={`vault-combo-wrap${opening ? " locked" : ""}`}
                  id="vault-combo-wrap"
                  ref={comboWrapRef}
                  title="Drag or click to rotate — sets active tumbler letter"
                  onClick={(e) => {
                    if (draggingRef.current || opening) return;
                    pickDialFromPointer(e.clientX, e.clientY);
                  }}
                  onMouseDown={(e) => {
                    if (opening) return;
                    draggingRef.current = true;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    dragStartAngleRef.current = Math.atan2(e.clientY - cy, e.clientX - cx);
                    dragStartIndexRef.current = dialIndex;
                    e.preventDefault();
                  }}
                  onTouchStart={(e) => {
                    if (opening) return;
                    const touch = e.touches[0];
                    draggingRef.current = true;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    dragStartAngleRef.current = Math.atan2(touch.clientY - cy, touch.clientX - cx);
                    dragStartIndexRef.current = dialIndex;
                  }}
                  onTouchMove={(e) => {
                    if (!draggingRef.current) return;
                    const touch = e.touches[0];
                    const wrap = comboWrapRef.current;
                    if (!wrap) return;
                    const rect = wrap.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const angle = Math.atan2(touch.clientY - cy, touch.clientX - cx);
                    const delta = angle - dragStartAngleRef.current;
                    const steps = Math.round((delta / (2 * Math.PI)) * 26);
                    setDial(dragStartIndexRef.current + steps);
                    e.preventDefault();
                  }}
                  onTouchEnd={() => {
                    draggingRef.current = false;
                  }}
                >
                  <div id="vault-combo-dial">
                    <div className="vault-combo-bezel" aria-hidden />
                    <div className="vault-combo-ring" style={{ transform: `rotate(${dialRot}deg)` }} aria-hidden>
                      <div className="vault-combo-ticks" aria-hidden />
                      <div className="vault-combo-knob" aria-hidden />
                    </div>
                    <div className="vault-combo-face" aria-hidden />
                    <div className="vault-combo-letter" id="vault-combo-letter">
                      {DIAL_LETTERS[dialIndex]}
                    </div>
                  </div>
                </div>
                <div className="vault-wheel-wrap">
                  <div id="vault-handwheel" ref={handwheelRef}>
                    <VaultHandwheelSvg idPrefix={wheelId} />
                  </div>
                </div>
              </div>
              <div className="vault-hinges" aria-hidden>
                <div className="vault-hinge" />
                <div className="vault-hinge" />
                <div className="vault-hinge" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="vault-tumbler-panel">
        <div className="vault-tumblers" id="vault-tumblers">
          {tumblers.map((letter, i) => (
            <button
              key={i}
              type="button"
              id={`vault-tumbler-${i}`}
              data-idx={i}
              className={`vault-tumbler${i === activeTumbler ? " active" : ""}${letter ? " filled" : ""}${letter === VAULT_CODE[i] ? " correct" : ""}`}
              onClick={() => {
                if (opening) return;
                setActiveTumbler(i);
                setDialIndex(DIAL_LETTERS.indexOf(letter || "A"));
              }}
            >
              <span className="vault-tumbler-glyph" aria-hidden>
                {letter || "·"}
              </span>
            </button>
          ))}
        </div>
        <div
          className="vault-door-status"
          id="vault-door-status"
          style={statusOk === true ? { color: "rgba(0,196,28,.9)" } : statusOk === false ? { color: "rgba(255,64,64,.85)" } : undefined}
        >
          {status}
        </div>
        <div className="vault-door-actions">
          <button
            type="button"
            className="vault-door-btn vault-door-btn--open"
            id="vault-door-open"
            disabled={!codeReady || opening}
            onClick={submit}
          >
            Turn wheel &amp; open
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="text"
        id="vault-safe-input"
        className="vault-safe-input"
        maxLength={4}
        autoComplete="off"
        aria-label="Vault combination (keyboard)"
        tabIndex={-1}
        value={tumblers.join("")}
        onChange={(e) => {
          const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
          const next = defaultTumblers();
          for (let i = 0; i < 4; i++) next[i] = val[i] || "A";
          setTumblers(next);
          const active = Math.min(val.length, 3);
          setActiveTumbler(active);
          setDialIndex(DIAL_LETTERS.indexOf(next[active]));
          setShaking(false);
          setStatus("");
          setStatusOk(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && codeReady && !opening) submit();
          if (e.key === "Escape" && !opening) onClose();
          if (e.key === "ArrowLeft") {
            setActiveTumbler((t) => Math.max(0, t - 1));
            e.preventDefault();
          }
          if (e.key === "ArrowRight") {
            setActiveTumbler((t) => Math.min(3, t + 1));
            e.preventDefault();
          }
          if (e.key === "ArrowUp") {
            setDial(dialIndex + 1);
            e.preventDefault();
          }
          if (e.key === "ArrowDown") {
            setDial(dialIndex - 1);
            e.preventDefault();
          }
        }}
      />
    </div>
  );
}
