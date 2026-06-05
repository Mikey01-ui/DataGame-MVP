# Media storage — Operation OMNI

## Small assets (v1)

Place files under `web/public/media/`:

```
public/media/m5/intro.mp4
public/media/m5/intro-poster.jpg
public/media/m5/intro.vtt
public/media/m5/echo-chime.mp3
```

Reference them in `content/missions/m5/media.json` — never hard-code URLs in React components.

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
