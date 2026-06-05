"use client";

import { useEffect, useState } from "react";

type StatusBarProps = {
  left: string[];
  right: string[];
};

export function StatusBar({ left, right }: StatusBarProps) {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().slice(0, 8));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-left">
        {left.map((item, i) => (
          <span key={item}>
            {i === 0 ? (
              <>
                <span className="status-dot live" /> {item}
              </>
            ) : item === "LIVE" || item.includes(":") ? (
              item === left[1] && left[0].includes("ACTIVE") ? clock : item
            ) : (
              item
            )}
          </span>
        ))}
        {left[0]?.includes("ACTIVE") && !left.some((x) => x.includes(":")) && (
          <span>{clock}</span>
        )}
      </div>
      <div className="status-right">
        {right.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}
