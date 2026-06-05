"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { CREW_QUESTIONS, HACK_LINES, INTRO_CHAT } from "@/lib/game/m5/data";
import { createInitialM5State, m5Reducer } from "@/lib/game/m5/reducer";
import type { CrewId, M5GameAction, M5GameState } from "@/lib/game/m5/types";

const M5GameContext = createContext<{ state: M5GameState; dispatch: (action: M5GameAction) => void } | null>(null);

export function M5GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(m5Reducer, undefined, createInitialM5State);

  useEffect(() => {
    if (state.phase !== "hack") return;
    if (state.hackLine >= HACK_LINES.length) {
      const t = setTimeout(() => dispatch({ type: "HACK_DONE" }), 900);
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
    if (state.phase === "hack" || state.phase === "debrief") return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "briefing" || !state.activeCrew) return;
    const q = CREW_QUESTIONS[state.activeCrew];
    const names: Record<CrewId, string> = { zex: "Zex", atlas: "Atlas", nova: "Nova", kade: "Kade" };
    const t = setTimeout(() => dispatch({ type: "ADD_CHAT", sender: names[state.activeCrew!], text: q.text.replace(/^"|"$/g, ""), tone: "bm-d" }), 400);
    return () => clearTimeout(t);
  }, [state.phase, state.activeCrew]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <M5GameContext.Provider value={value}>{children}</M5GameContext.Provider>;
}

export function useM5Game() {
  const ctx = useContext(M5GameContext);
  if (!ctx) throw new Error("useM5Game must be used within M5GameProvider");
  return ctx;
}
