import { notFound } from "next/navigation";
import { AmbientShell } from "@/components/layout/AmbientShell";
import { StatusBar } from "@/components/layout/StatusBar";
import { MissionRenderer } from "@/components/missions/MissionRenderer";
import { VideoBlock } from "@/components/media/VideoBlock";
import { getHubContent, getMissionIntro, getMissionMedia, getMissionMeta } from "@/lib/content";
import { auth } from "@/lib/auth";
import { getMissionProgress, upsertProgress } from "@/lib/progress";

type PageProps = {
  params: Promise<{ missionId: string }>;
  searchParams: Promise<{ resume?: string; replay?: string }>;
};

export default async function MissionPage({ params, searchParams }: PageProps) {
  const { missionId } = await params;
  const { resume, replay } = await searchParams;
  const isResume = resume === "1";
  const session = await auth();
  const userId = session!.user!.id;

  const meta = await getMissionMeta(missionId);
  if (!meta) notFound();

  const [hubContent, media, intro, existing] = await Promise.all([
    getHubContent(),
    getMissionMedia(missionId),
    getMissionIntro(missionId),
    getMissionProgress(userId, missionId),
  ]);

  if (!replay) {
    if (!existing || existing.status === "locked") {
      await upsertProgress(userId, {
        missionId,
        status: "in_progress",
        checkpoint: isResume ? existing?.checkpoint ?? "start" : "start",
        stateJson: isResume ? existing?.stateJson ?? null : null,
      });
    } else if (
      !isResume &&
      existing.status !== "completed" &&
      (!existing.checkpoint || existing.checkpoint === "start")
    ) {
      await upsertProgress(userId, {
        missionId,
        status: "in_progress",
        checkpoint: "start",
        stateJson: null,
      });
    }
  }

  if (meta.renderer === "react") {
    return (
      <MissionRenderer
        intro={intro}
        missionId={missionId}
        missionName={meta.name}
        missionLabel={meta.label}
        initialCheckpoint={existing?.checkpoint ?? "start"}
        resume={isResume}
      />
    );
  }

  const legacyParams = new URLSearchParams();
  legacyParams.set("play", "1");
  if (isResume) legacyParams.set("resume", "1");
  if (meta.progressBridge) legacyParams.set("omniBridge", "1");
  const iframeSrc = `${meta.legacyHtmlPath}?${legacyParams.toString()}`;

  return (
    <AmbientShell>
      <StatusBar left={[hubContent.statusLeft[0], meta.label]} right={hubContent.statusRight} />
      {media?.intro?.type === "video" && (
        <div style={{ padding: "48px 1rem 0", maxWidth: 900, margin: "0 auto" }}>
          <VideoBlock asset={media.intro} />
        </div>
      )}
      <div className="mission-shell">
        <iframe title={`${meta.name} — Operation OMNI`} src={iframeSrc} allow="autoplay" />
      </div>
    </AmbientShell>
  );
}
