"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { M4TutorialOverlay } from "@/components/missions/m4/M4TutorialOverlay";
import { M4TutorialShell, type M4TutorialShellHandle } from "@/components/missions/m4/M4TutorialShell";

type M4TutorialPhaseProps = {
  onComplete: () => void;
  enterFromBrief?: boolean;
};

export function M4TutorialPhase({ onComplete, enterFromBrief }: M4TutorialPhaseProps) {
  const shellRef = useRef<M4TutorialShellHandle>(null);
  const [shellRoot, setShellRoot] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    document.body.classList.add("m4-tutorial-active");
    if (enterFromBrief) {
      document.documentElement.classList.add("m4-enter-from-brief");
      const t = window.setTimeout(() => {
        document.documentElement.classList.remove("m4-enter-from-brief");
      }, 500);
      return () => {
        window.clearTimeout(t);
        document.documentElement.classList.remove("m4-enter-from-brief");
        document.body.classList.remove("m4-tutorial-active");
      };
    }
    return () => document.body.classList.remove("m4-tutorial-active");
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
      <M4TutorialShell ref={shellRef} />
      {ready && shellRoot && (
        <M4TutorialOverlay
          shellRoot={shellRoot}
          getDemoApi={() => shellRef.current!.getDemoApi()}
          onStepChange={handleStepChange}
          onComplete={onComplete}
        />
      )}
    </>,
    document.body
  );
}
