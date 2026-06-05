"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMissionProgress } from "@/lib/game/useMissionProgress";

type Options<T> = {
  missionId: string;
  state: T;
  serialize: (state: T) => Record<string, unknown>;
  /** When false, nothing is written (e.g. debrief / mission complete). */
  enabled: boolean;
};

export function useGameSessionPersist<T>({ missionId, state, serialize, enabled }: Options<T>) {
  const { save } = useMissionProgress(missionId);
  const serializeRef = useRef(serialize);
  serializeRef.current = serialize;

  const flush = useCallback(() => {
    if (!enabled) return;
    const payload = {
      missionId,
      status: "in_progress" as const,
      checkpoint: "game",
      stateJson: serializeRef.current(state),
    };
    const body = JSON.stringify(payload);
    try {
      void fetch("/api/progress", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    } catch {
      /* tab may already be gone */
    }
  }, [enabled, missionId, state]);

  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => {
      void save({
        status: "in_progress",
        checkpoint: "game",
        stateJson: serialize(state),
      });
    }, 400);
    return () => clearTimeout(t);
  }, [enabled, save, serialize, state]);

  useEffect(() => {
    if (!enabled) return;
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [enabled, flush]);
}

/** Shallow-merge saved snapshot onto fresh initial state. */
export function restoreGameState<T extends object>(
  raw: Record<string, unknown> | null | undefined,
  version: number,
  createInitial: () => T,
  blockedPhases: readonly string[],
): T | null {
  if (!raw || raw.version !== version) return null;
  const phase = raw.phase;
  if (typeof phase !== "string" || blockedPhases.includes(phase)) return null;
  return { ...createInitial(), ...raw } as T;
}
