import Link from "next/link";
import type { MissionIntro } from "@/lib/content";

type GamePlaceholderProps = {
  game: MissionIntro["game"];
  missionLabel: string;
};

export function GamePlaceholder({ game, missionLabel }: GamePlaceholderProps) {
  return (
    <div className="mission-game-placeholder">
      <p className="mission-page-eyebrow">{missionLabel}</p>
      <h2>{game.placeholderTitle}</h2>
      <p>{game.placeholderBody}</p>
      <p>
        <code>reference/legacy-missions/</code> — open the matching HTML while you port mechanics
        into <code>web/components/missions/</code> and <code>web/lib/game/</code>.
      </p>
      <Link href="/hub" className="mission-hub-link">
        ← Back to hub
      </Link>
    </div>
  );
}
