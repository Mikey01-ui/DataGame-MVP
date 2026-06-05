"use client";

import type { HackLine } from "@/lib/game/m1/data";

type Props = {
  lines: HackLine[];
  visibleCount: number;
};

export function M1HackOverlay({ lines, visibleCount }: Props) {
  return (
    <div id="hack-overlay" className="active">
      <div id="hack-terminal">
        {lines.slice(0, visibleCount).map((line, i) => (
          <span key={i} className={`ht ${line.className ?? "ht-g"} show`}>
            {line.text}
            {"\n"}
          </span>
        ))}
      </div>
    </div>
  );
}
