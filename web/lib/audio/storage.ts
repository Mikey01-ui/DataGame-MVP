const MUTED_KEY = "omni-audio-muted";
const VOLUME_KEY = "omni-audio-volume";

export function readAudioMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeAudioMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTED_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function readAudioVolume(): number {
  if (typeof window === "undefined") return 0.85;
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw == null) return 0.85;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0.85;
  } catch {
    return 0.85;
  }
}

export function writeAudioVolume(volume: number) {
  try {
    localStorage.setItem(VOLUME_KEY, String(Math.max(0, Math.min(1, volume))));
  } catch {
    /* ignore */
  }
}
