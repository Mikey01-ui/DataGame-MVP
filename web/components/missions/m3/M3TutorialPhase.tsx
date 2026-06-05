"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { M3TutorialOverlay } from "@/components/missions/m3/M3TutorialOverlay";
import { M3TutorialShell, type M3TutorialShellHandle } from "@/components/missions/m3/M3TutorialShell";

type M3TutorialPhaseProps = {
  onComplete: () => void;
  enterFromBrief?: boolean;
};

export function M3TutorialPhase({ onComplete, enterFromBrief }: M3TutorialPhaseProps) {
  const shellRef = useRef<M3TutorialShellHandle>(null);
  const [shellRoot, setShellRoot] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    document.body.classList.add("m3-tutorial-active", "r3-routing");
    if (enterFromBrief) {
      document.documentElement.classList.add("m3-enter-from-brief");
      const t = window.setTimeout(() => {
        document.documentElement.classList.remove("m3-enter-from-brief");
      }, 60);
      return () => {
        window.clearTimeout(t);
        document.documentElement.classList.remove("m3-enter-from-brief");
        document.body.classList.remove("m3-tutorial-active", "r3-routing");
      };
    }
    return () => {
      document.body.classList.remove("m3-tutorial-active", "r3-routing");
    };
  }, [enterFromBrief]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!portalReady) return;
    const id = requestAnimationFrame(() => {
      shellRef.current?.reset();
      setShellRoot(shellRef.current?.root ?? null);
      setReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, [portalReady]);

  const handleStepChange = useCallback((ix: number) => {
    shellRef.current?.prepareForStep(ix);
  }, []);

  if (!portalReady) return null;

  return createPortal(
    <>
      <M3TutorialShell ref={shellRef} />
      {ready && shellRoot && (
        <M3TutorialOverlay
          shellRoot={shellRoot}
          getDemoApi={() => shellRef.current?.getDemoApi()}
          onStepChange={handleStepChange}
          onComplete={onComplete}
        />
      )}
    </>,
    document.body
  );
}
