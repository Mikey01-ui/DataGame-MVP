"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { isAdminRole } from "@/lib/roles";
import "./playtest-mission-nav.css";

const CHAIN = ["m1", "m2", "m3", "m4", "m5"] as const;

type Props = {
  missionId: string;
};

export function PlaytestMissionNav({ missionId }: Props) {
  const { data: session } = useSession();
  if (!isAdminRole(session?.user?.role)) return null;

  const idx = CHAIN.indexOf(missionId as (typeof CHAIN)[number]);
  if (idx < 0) return null;

  const prevId = CHAIN[(idx - 1 + CHAIN.length) % CHAIN.length];
  const nextId = CHAIN[(idx + 1) % CHAIN.length];

  return (
    <nav className="playtest-mnav" aria-label="Jump between missions (admin)">
      <Link href={`/mission/${prevId}?replay=1`} className="playtest-mnav__btn playtest-mnav__btn--prev" aria-label="Previous mission">
        ←
      </Link>
      <Link href={`/mission/${nextId}?replay=1`} className="playtest-mnav__btn playtest-mnav__btn--next" aria-label="Next mission">
        →
      </Link>
    </nav>
  );
}
