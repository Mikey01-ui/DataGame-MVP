import type { ReactNode } from "react";
import { AudioToggle } from "@/components/audio/AudioToggle";
import { StatusBar } from "@/components/layout/StatusBar";

type MissionChromeProps = {
  statusLeft: string[];
  statusRight: string[];
  clock?: string;
  showAudio?: boolean;
  children: ReactNode;
};

export function MissionChrome({ statusLeft, statusRight, clock, showAudio, children }: MissionChromeProps) {
  const left = clock ? [statusLeft[0], clock, ...statusLeft.slice(1)] : statusLeft;

  return (
    <div className="mission-root">
      <div className="ambient-glow" />
      <div className="scanlines" />
      <div className="bg-grid" />
      <div className="corner corner--tl" />
      <div className="corner corner--tr" />
      <div className="corner corner--bl" />
      <div className="corner corner--br" />
      <StatusBar left={left} right={statusRight} />
      {showAudio ? (
        <div className="mission-audio-slot">
          <AudioToggle />
        </div>
      ) : null}
      {children}
    </div>
  );
}
