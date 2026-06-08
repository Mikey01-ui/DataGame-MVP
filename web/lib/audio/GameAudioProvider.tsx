"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { audioEngine } from "@/lib/audio/engine";
import { readAudioMuted, readAudioVolume, writeAudioMuted, writeAudioVolume } from "@/lib/audio/storage";
import type { MissionAudioConfig } from "@/lib/audio/types";

type GameAudioContextValue = {
  muted: boolean;
  volume: number;
  unlocked: boolean;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMuted: () => void;
  unlock: () => Promise<void>;
  playSfx: (key: string, volume?: number) => void;
  startAmbient: () => void;
  stopAmbient: () => void;
  config: MissionAudioConfig | null;
};

const GameAudioContext = createContext<GameAudioContextValue | null>(null);

export function GameAudioProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: MissionAudioConfig | null;
}) {
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(0.85);
  const [unlocked, setUnlocked] = useState(false);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const m = readAudioMuted();
    const v = readAudioVolume();
    setMutedState(m);
    setVolumeState(v);
    audioEngine.setMuted(m);
    audioEngine.setMasterVolume(v);
    setUnlocked(audioEngine.isUnlocked());
  }, []);

  const setMuted = useCallback((next: boolean) => {
    setMutedState(next);
    writeAudioMuted(next);
    audioEngine.setMuted(next);
    if (next) audioEngine.stopAmbient();
  }, []);

  const setVolume = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(1, next));
    setVolumeState(clamped);
    writeAudioVolume(clamped);
    audioEngine.setMasterVolume(clamped);
  }, []);

  const toggleMuted = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      writeAudioMuted(next);
      audioEngine.setMuted(next);
      if (next) audioEngine.stopAmbient();
      return next;
    });
  }, []);

  const unlock = useCallback(async () => {
    const ok = await audioEngine.unlock();
    if (ok) setUnlocked(true);
  }, []);

  const playSfx = useCallback((key: string, sfxVolume = 1) => {
    const src = configRef.current?.sfx?.[key];
    if (!src) return;
    audioEngine.play(src, sfxVolume);
  }, []);

  const startAmbient = useCallback(() => {
    const amb = configRef.current?.ambient;
    if (!amb?.src) return;
    audioEngine.startAmbient(amb.src, amb.volume ?? 0.25);
  }, []);

  const stopAmbient = useCallback(() => {
    audioEngine.stopAmbient();
  }, []);

  useEffect(() => {
    const onGesture = () => {
      void unlock();
    };
    window.addEventListener("pointerdown", onGesture, { once: true });
    return () => window.removeEventListener("pointerdown", onGesture);
  }, [unlock]);

  useEffect(() => {
    return () => audioEngine.stopAmbient();
  }, []);

  const value = useMemo(
    () => ({
      muted,
      volume,
      unlocked,
      setMuted,
      setVolume,
      toggleMuted,
      unlock,
      playSfx,
      startAmbient,
      stopAmbient,
      config,
    }),
    [muted, volume, unlocked, setMuted, setVolume, toggleMuted, unlock, playSfx, startAmbient, stopAmbient, config]
  );

  return <GameAudioContext.Provider value={value}>{children}</GameAudioContext.Provider>;
}

export function useGameAudio() {
  const ctx = useContext(GameAudioContext);
  if (!ctx) throw new Error("useGameAudio must be used within GameAudioProvider");
  return ctx;
}

export function useOptionalGameAudio() {
  return useContext(GameAudioContext);
}
