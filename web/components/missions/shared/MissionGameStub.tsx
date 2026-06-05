import Link from "next/link";

type MissionGameStubProps = {
  missionId: string;
  missionLabel: string;
  missionName: string;
};

export function MissionGameStub({ missionId, missionLabel, missionName }: MissionGameStubProps) {
  return (
    <div className="mission-game-placeholder">
      <p className="mission-page-eyebrow">{missionLabel}</p>
      <h2>{missionName}</h2>
      <p>
        React migration in progress. Reference HTML is in{" "}
        <code>reference/legacy-missions/Mission {missionId.replace("m", "")}.html</code>.
      </p>
      <p>Follow the Mission 1 pattern: <code>lib/game/{missionId}/</code> + <code>components/missions/{missionId}/</code></p>
      <Link href="/hub" className="mission-hub-link">
        ← Back to hub
      </Link>
    </div>
  );
}
