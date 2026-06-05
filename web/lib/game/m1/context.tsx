"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { DETECTION, HACK_LINES, INTRO_CHAT, LEADS } from "@/lib/game/m1/data";
import { useGameSessionPersist } from "@/lib/game/sessionPersist";
import { createInitialM1State, hydrateM1State, m1Reducer, serializeM1State } from "@/lib/game/m1/reducer";
import type { M1GameAction, M1GameState } from "@/lib/game/m1/types";

type M1GameContextValue = {
  state: M1GameState;
  dispatch: (action: M1GameAction) => void;
};

const M1GameContext = createContext<M1GameContextValue | null>(null);

function initM1State(saved: Record<string, unknown> | null | undefined) {
  return hydrateM1State(saved) ?? createInitialM1State();
}

export function M1GameProvider({
  children,
  savedState,
}: {
  children: ReactNode;
  savedState?: Record<string, unknown> | null;
}) {
  const [state, dispatch] = useReducer(m1Reducer, savedState, initM1State);

  useGameSessionPersist({
    missionId: "m1",
    state,
    serialize: serializeM1State,
    enabled: state.phase !== "debrief" && state.phase !== "done",
  });

  useEffect(() => {
    if (state.phase !== "hack") return;
    if (state.hackLine >= HACK_LINES.length) {
      const t = setTimeout(() => dispatch({ type: "HACK_DONE" }), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => dispatch({ type: "HACK_ADVANCE" }), 420);
    return () => clearTimeout(t);
  }, [state.phase, state.hackLine]);

  useEffect(() => {
    if (state.phase !== "play" || !state.hackDone) return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.phase, state.hackDone]);

  useEffect(() => {
    if (!state.hackDone || state.introScheduled) return;
    dispatch({ type: "SCHEDULE_INTRO" });
    const timers = INTRO_CHAT.map(({ delay, sender, text, tone }) =>
      setTimeout(() => dispatch({ type: "ADD_CHAT", sender, text, tone }), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [state.hackDone, state.introScheduled]);

  useEffect(() => {
    if (!state.anomalyLead) return;
    const zex = LEADS[state.anomalyLead].zexAnomaly;
    if (!zex) return;
    const t = setTimeout(() => dispatch({ type: "ADD_CHAT", sender: "Zex", text: zex }), 1200);
    return () => clearTimeout(t);
  }, [state.anomalyLead]);

  useEffect(() => {
    if (state.detectionToast == null) return;
    const t = setTimeout(() => dispatch({ type: "CLEAR_DETECTION_TOAST" }), 2400);
    return () => clearTimeout(t);
  }, [state.detectionToast]);

  useEffect(() => {
    if (state.phase === "synth") {
      const t = setTimeout(() => dispatch({ type: "SYNTH_DONE" }), 4500);
      return () => clearTimeout(t);
    }
  }, [state.phase]);

  useEffect(() => {
    if (!state.hintCooldown) return;
    const t = setTimeout(() => dispatch({ type: "HINT_COOLDOWN_CLEAR" }), DETECTION.hintCooldownMs);
    return () => clearTimeout(t);
  }, [state.hintCooldown]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <M1GameContext.Provider value={value}>{children}</M1GameContext.Provider>;
}

export function useM1Game() {
  const ctx = useContext(M1GameContext);
  if (!ctx) throw new Error("useM1Game must be used within M1GameProvider");
  return ctx;
}
