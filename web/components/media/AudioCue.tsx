"use client";

import { useEffect, useRef } from "react";
import type { MissionMedia } from "@/lib/content";

type AudioAsset = NonNullable<MissionMedia["echoCue"]>;

type AudioCueProps = {
  asset: AudioAsset;
  playToken?: number;
};

export function AudioCue({ asset, playToken }: AudioCueProps) {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!playToken || !ref.current) return;
    ref.current.currentTime = 0;
    void ref.current.play().catch(() => {
      /* autoplay blocked until user gesture */
    });
  }, [playToken]);

  if (asset.type !== "audio") return null;

  return (
    <audio ref={ref} preload="auto" src={asset.src} className="sr-only" aria-hidden="true" />
  );
}
