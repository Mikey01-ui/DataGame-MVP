"use client";

import { useEffect, useState } from "react";
import { DESKTOP_ICONS } from "@/lib/game/m1/data";

type Props = {
  visible: boolean;
  openWindows: string[];
  onToggleWindow: (windowId: string) => void;
};

const TB_MAP: Record<string, string> = {
  it: "win-it",
  finance: "win-finance",
  hr: "win-hr",
  vault: "win-vault",
};

export function M1Taskbar({ visible, openWindows, onToggleWindow }: Props) {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const t = new Date();
      const h = t.getHours();
      const m = t.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      setClock(`${h12}:${m} ${ampm}`);
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div id="xp-taskbar" className={visible ? "visible" : ""}>
      <button type="button" id="start-btn">
        ⊞ Start
      </button>
      <div className="tb-div" />
      {DESKTOP_ICONS.filter((d) => d.folder !== "misc").map((icon) => {
        const winId = TB_MAP[icon.folder];
        if (!winId) return null;
        const on = openWindows.includes(winId);
        return (
          <button
            key={icon.id}
            type="button"
            className={`tb-wb${on ? " tb-on" : ""}`}
            onClick={() => onToggleWindow(winId)}
          >
            <i className="fas fa-folder" aria-hidden /> {icon.label}
          </button>
        );
      })}
      <div id="tb-clock">{clock}</div>
    </div>
  );
}
