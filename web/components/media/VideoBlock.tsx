"use client";

import type { MissionMedia } from "@/lib/content";

type VideoAsset = NonNullable<MissionMedia["intro"]>;

export function VideoBlock({ asset }: { asset: VideoAsset }) {
  if (asset.type !== "video") return null;

  return (
    <div className="media-slot">
      <video
        controls
        playsInline
        preload="metadata"
        poster={asset.poster}
        style={{ width: "100%", maxHeight: 220, borderRadius: 4, background: "#000" }}
      >
        <source src={asset.src} />
        {asset.captions && <track kind="captions" src={asset.captions} />}
        Your browser does not support video playback.
      </video>
    </div>
  );
}
