"use client";

import { useEffect, useRef } from "react";
import type { M4GameState } from "@/lib/game/m4/types";
import { useOptionalGameAudio } from "@/lib/audio/GameAudioProvider";

export function useM4MissionAudio(state: M4GameState) {
  const audio = useOptionalGameAudio();
  const prev = useRef({
    picksCount: Object.keys(state.picks).length,
    wrongAttempts: state.wrongAttempts,
    gameOver: state.gameOver,
    phase: state.phase,
    detectionWarned: { ...state.detectionWarned },
  });

  useEffect(() => {
    if (!audio) return;
    const shouldAmbient =
      state.hackDone && state.phase === "play" && !state.gameOver && audio.unlocked && !audio.muted;
    if (shouldAmbient) audio.startAmbient();
    else audio.stopAmbient();
  }, [audio, state.hackDone, state.phase, state.gameOver, audio?.unlocked, audio?.muted]);

  useEffect(() => {
    if (!audio?.unlocked) return;

    const p = prev.current;
    const picksCount = Object.keys(state.picks).length;

    if (picksCount > p.picksCount && state.wrongAttempts === p.wrongAttempts) {
      audio.playSfx("correct");
    }
    if (state.wrongAttempts > p.wrongAttempts) {
      audio.playSfx("wrong");
    }

    if (!p.gameOver && state.gameOver) {
      audio.playSfx("gameOver");
    }

    ([30, 60, 80] as const).forEach((tier) => {
      if (!p.detectionWarned[tier] && state.detectionWarned[tier]) {
        audio.playSfx("detectionWarn", 0.65);
      }
    });

    prev.current = {
      picksCount,
      wrongAttempts: state.wrongAttempts,
      gameOver: state.gameOver,
      phase: state.phase,
      detectionWarned: { ...state.detectionWarned },
    };
  }, [audio, state]);
}
