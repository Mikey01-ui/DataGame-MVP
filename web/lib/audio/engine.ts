type PoolEntry = {
  el: HTMLAudioElement;
  busy: boolean;
};

export class AudioEngine {
  private pools = new Map<string, PoolEntry[]>();
  private ambientEl: HTMLAudioElement | null = null;
  private ambientSrc: string | null = null;
  private unlocked = false;
  private muted = false;
  private masterVolume = 0.85;

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

  async unlock(): Promise<boolean> {
    if (this.unlocked) return true;
    if (typeof window === "undefined") return false;
    try {
      const probe = new Audio();
      probe.volume = 0;
      await probe.play();
      probe.pause();
      this.unlocked = true;
      return true;
    } catch {
      return false;
    }
  }

  private ambientBaseVolume: number | null = null;

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

    void el.play().catch(() => {
      done();
    });
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
    void this.ambientEl.play().catch(() => undefined);
  }

  stopAmbient() {
    if (!this.ambientEl) return;
    this.ambientEl.pause();
    this.ambientEl.src = "";
    this.ambientEl = null;
    this.ambientSrc = null;
    this.ambientBaseVolume = null;
  }
}

export const audioEngine = new AudioEngine();
