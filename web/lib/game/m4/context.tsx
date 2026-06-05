"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { HACK_LINES, INTRO_CHAT } from "@/lib/game/m4/data";
import { createInitialM4State, m4Reducer } from "@/lib/game/m4/reducer";
import type { M4GameAction, M4GameState } from "@/lib/game/m4/types";

const M4GameContext = createContext<{ state: M4GameState; dispatch: (action: M4GameAction) => void } | null>(null);

export function M4GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(m4Reducer, undefined, createInitialM4State);

  useEffect(() => {
    if (state.phase !== "hack") return;
    if (state.hackLine >= HACK_LINES.length) {
      const t = setTimeout(() => dispatch({ type: "HACK_DONE" }), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => dispatch({ type: "HACK_ADVANCE" }), 400);
    return () => clearTimeout(t);
  }, [state.phase, state.hackLine]);

  useEffect(() => {
    if (!state.hackDone || state.messages.length > 0) return;
    INTRO_CHAT.forEach(({ delay, sender, text, tone }) =>
      setTimeout(() => dispatch({ type: "ADD_CHAT", sender, text, tone }), delay)
    );
  }, [state.hackDone, state.messages.length]);

  useEffect(() => {
    if (state.phase !== "play") return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.phase]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <M4GameContext.Provider value={value}>{children}</M4GameContext.Provider>;
}

export function useM4Game() {
  const ctx = useContext(M4GameContext);
  if (!ctx) throw new Error("useM4Game must be used within M4GameProvider");
  return ctx;
}
