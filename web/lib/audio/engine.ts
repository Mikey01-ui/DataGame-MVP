type PoolEntry = {
  el: HTMLAudioElement;
  busy: boolean;
};

const SILENT_WAV =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

export class AudioEngine {
  private pools = new Map<string, PoolEntry[]>();
  private ambientEl: HTMLAudioElement | null = null;
  private ambientSrc: string | null = null;
  private ambientOnEnded: (() => void) | null = null;
  private audioCtx: AudioContext | null = null;
  private unlocked = false;
  private muted = false;
  private masterVolume = 0.85;
  private preloadUrls = new Set<string>();

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.ambientEl) this.ambientEl.muted = muted;
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientEl && this.ambientBaseVolume != null) {
      this.ambientEl.volume = this.muted ? 0 : this.ambientBaseVolume * this.masterVolume;
    }
  }

  isUnlocked() {
    return this.unlocked;
  }

  preload(urls: string[]) {
    if (typeof window === "undefined") return;
    for (const src of urls) {
      if (!src || this.preloadUrls.has(src)) continue;
      this.preloadUrls.add(src);
      const el = new Audio(src);
      el.preload = "auto";
      el.load();
    }
  }

  /** Call synchronously inside a user-gesture handler (pointerdown / click). */
  unlock(): boolean {
    if (this.unlocked) return true;
    if (typeof window === "undefined") return false;

    try {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) {
        if (!this.audioCtx) this.audioCtx = new Ctor();
        if (this.audioCtx.state === "suspended") void this.audioCtx.resume();
      }
    } catch {
      /* element fallback below */
    }

    try {
      const probe = new Audio(SILENT_WAV);
      probe.volume = 0.001;
      void probe.play().then(() => probe.pause()).catch(() => undefined);
      this.unlocked = true;
      return true;
    } catch {
      return false;
    }
  }

  private ambientBaseVolume: number | null = null;

  private detachAmbientEnded() {
    if (this.ambientEl && this.ambientOnEnded) {
      this.ambientEl.removeEventListener("ended", this.ambientOnEnded);
    }
    this.ambientOnEnded = null;
  }

  play(src: string, volume = 1) {
    if (this.muted || !src || typeof window === "undefined") return;
    if (!this.unlocked) return;

    let pool = this.pools.get(src);
    if (!pool) {
      pool = [];
      this.pools.set(src, pool);
    }
    let poolEntry = pool.find((p) => !p.busy);
    if (!poolEntry) {
      poolEntry = { el: new Audio(src), busy: false };
      poolEntry.el.preload = "auto";
      pool.push(poolEntry);
    }
    const el = poolEntry.el;

    if (el.src !== new URL(src, window.location.origin).href) {
      el.src = src;
      el.load();
    }

    poolEntry.busy = true;
    el.volume = Math.max(0, Math.min(1, volume * this.masterVolume));
    el.currentTime = 0;

    const done = () => {
      poolEntry.busy = false;
      el.removeEventListener("ended", done);
      el.removeEventListener("error", done);
    };
    el.addEventListener("ended", done);
    el.addEventListener("error", done);

    const start = () => {
      void el.play().catch(() => done());
    };

    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      start();
    } else {
      el.addEventListener("canplay", start, { once: true });
      el.addEventListener("error", done, { once: true });
    }
  }

  startAmbient(src: string, baseVolume = 0.25) {
    if (!src || typeof window === "undefined") return;
    if (this.muted || !this.unlocked) return;

    if (this.ambientEl && this.ambientSrc === src) {
      if (this.ambientEl.paused) {
        void this.ambientEl.play().catch(() => undefined);
      }
      return;
    }

    this.stopAmbient();
    this.ambientEl = new Audio(src);
    this.ambientEl.loop = true;
    this.ambientEl.preload = "auto";
    this.ambientSrc = src;
    this.ambientBaseVolume = baseVolume;
    this.ambientEl.volume = baseVolume * this.masterVolume;
    this.ambientEl.muted = this.muted;

    const onEnded = () => {
      if (!this.ambientEl) return;
      this.ambientEl.load();
      void this.ambientEl.play().catch(() => undefined);
    };
    this.ambientOnEnded = onEnded;
    this.ambientEl.addEventListener("ended", onEnded);

    const start = () => {
      void this.ambientEl?.play().catch(() => undefined);
    };
    this.ambientEl.addEventListener("canplay", start, { once: true });
    this.ambientEl.load();
    if (this.ambientEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) start();
  }

  stopAmbient() {
    if (!this.ambientEl) return;
    this.detachAmbientEnded();
    this.ambientEl.pause();
    this.ambientEl.src = "";
    this.ambientEl = null;
    this.ambientSrc = null;
    this.ambientBaseVolume = null;
  }

  stopSources(srcs: string[]) {
    for (const src of srcs) {
      const pool = this.pools.get(src);
      if (!pool) continue;
      for (const entry of pool) {
        entry.el.pause();
        entry.el.currentTime = 0;
        entry.busy = false;
      }
    }
  }
}

export const audioEngine = new AudioEngine();
