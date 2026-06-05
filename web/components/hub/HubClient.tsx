"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { HubContent, MissionMeta } from "@/lib/content";
type SerializedProgress = {
  missionId: string;
  status: string;
  checkpoint: string | null;
  stateJson: Record<string, unknown> | null;
  score: number | null;
  updatedAt: string;
};

type HubClientProps = {
  content: HubContent;
  missions: MissionMeta[];
  progress: SerializedProgress[];
  access: Record<string, { playable: boolean; continueUrl?: string; label: string }>;
  continueMission: { id: string; name: string; url: string } | null;
};

export function HubClient({
  content,
  missions,
  progress,
  access,
  continueMission,
}: HubClientProps) {
  const progressMap = new Map(progress.map((p) => [p.missionId, p]));

  return (
    <main className="hub">
      <div className="hub-top-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          {content.signOut}
        </button>
      </div>

      <header className="hub-header">
        <p className="hub-eyebrow">{content.eyebrow}</p>
        <h1 className="hub-title">{content.title}</h1>
        <p
          className="hub-sub"
          dangerouslySetInnerHTML={{ __html: content.subtitle }}
        />
      </header>

      {continueMission && (
        <div className="continue-banner">
          <div>
            <strong style={{ color: "var(--orange)" }}>{content.continueLabel}</strong>
            <span style={{ color: "var(--grey-text)", marginLeft: "0.5rem" }}>
              {continueMission.name} {content.continueSuffix}
            </span>
          </div>
          <Link href={continueMission.url} className="btn-primary" style={{ width: "auto" }}>
            {content.continueLabel} →
          </Link>
        </div>
      )}

      <ul className="round-grid">
        {missions.map((mission) => {
          const state = access[mission.id] ?? { playable: false, label: "locked" };
          const record = progressMap.get(mission.id);
          const href =
            state.continueUrl ?? `/mission/${mission.id}${record?.status === "completed" ? "?replay=1" : ""}`;
          const cta =
            state.label === "continue"
              ? content.continueLabel
              : state.label === "replay"
                ? content.replayLabel
                : state.label === "locked"
                  ? content.lockedLabel
                  : content.playLabel;

          return (
            <li key={mission.id}>
              <Link
                href={state.playable ? href : "#"}
                className={`round-card${state.playable ? "" : " round-card--locked"}`}
                aria-disabled={!state.playable}
              >
                <div className="round-meta">
                  <span>{mission.label}</span>
                  <span className="round-badge">{cta}</span>
                </div>
                <h2 className="round-name">{mission.name}</h2>
                <p className="round-desc">
                  {state.playable ? mission.description : content.lockedHint}
                  {record?.checkpoint && state.label === "continue" && (
                    <> · checkpoint: <strong>{record.checkpoint}</strong></>
                  )}
                </p>
                <div className="round-cta">
                  {cta} <span aria-hidden="true">→</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="hub-footer">{content.footer}</p>
    </main>
  );
}
