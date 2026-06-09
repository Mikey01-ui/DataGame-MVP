"use client";

import { useOptionalGameAudio } from "@/lib/audio/GameAudioProvider";

export function AudioToggle({ compact = false }: { compact?: boolean }) {
  const audio = useOptionalGameAudio();
  if (!audio) return null;

  return (
    <div className={`audio-ctrl${compact ? " audio-ctrl--compact" : ""}`}>
      <button
        type="button"
        className={`audio-ctrl-btn${audio.muted ? " audio-ctrl-btn--muted" : ""}`}
        onClick={() => {
          audio.unlock();
          if (audio.muted) audio.setMuted(false);
          else audio.setMuted(true);
        }}
        aria-label={audio.muted ? "Unmute mission audio" : "Mute mission audio"}
        aria-pressed={audio.muted}
        title={audio.unlocked ? undefined : "Click to enable sound"}
      >
        <i className={`fas ${audio.muted ? "fa-volume-xmark" : "fa-volume-high"}`} aria-hidden />
      </button>
      {!compact ? (
        <input
          type="range"
          className="audio-ctrl-slider"
          min={0}
          max={100}
          value={Math.round(audio.volume * 100)}
          onChange={(e) => audio.setVolume(Number(e.target.value) / 100)}
          aria-label="Mission audio volume"
          disabled={audio.muted}
        />
      ) : null}
    </div>
  );
}
