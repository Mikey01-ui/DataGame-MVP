# Media storage — Operation OMNI

## Small assets (v1)

Place files under `web/public/media/`:

```
public/media/m3/ambient-terminal.mp3
public/media/m3/sfx-correct.mp3
public/media/m3/sfx-wrong.mp3
… (see content/missions/m3/media.json)

public/media/m4/ambient-process.mp3
public/media/m4/sfx-correct.mp3
… (see content/missions/m4/media.json)

public/media/m5/intro.mp4
public/media/m5/intro-poster.jpg
public/media/m5/intro.vtt
public/media/m5/echo-chime.mp3
```

Reference them in `content/missions/mN/media.json` — never hard-code URLs in React components.

### M3 & M4 SFX (Pixabay)

M3/M4 clips are **royalty-free downloads from [Pixabay](https://pixabay.com/sound-effects/)** under the [Pixabay Content License](https://pixabay.com/service/license/). Source URLs and CDN links are recorded in `public/media/pixabay-sources.json`.

Re-download or refresh assets:

```bash
node web/scripts/download-pixabay-audio.mjs
```

Fallback placeholders (ffmpeg tones) if Pixabay is unreachable:

```bash
bash web/scripts/generate-placeholder-audio.sh
```

## Large assets (recommended for production)

Use **Vercel Blob**, **S3**, or **Cloudflare R2**:

1. Upload video/audio to blob storage.
2. Put the public CDN URL in `media.json`.
3. Keep the repo free of multi‑MB binaries.

## Components

- `components/media/VideoBlock.tsx` — intro clips on mission shell
- `components/media/AudioCue.tsx` — checkpoint sound (trigger via `playToken` prop)

## Content workflow

Edit copy and media paths without touching game logic:

- Copy: `content/login.json`, `content/hub.json`
- Per mission: `content/missions/mN/meta.json`, `media.json`
