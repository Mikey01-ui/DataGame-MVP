import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  getMissionProgress,
  getUserProgress,
  upsertProgress,
  type ProgressStatus,
} from "@/lib/progress";

const patchSchema = z.object({
  missionId: z.string().regex(/^m[1-5]$/),
  status: z.enum(["locked", "in_progress", "completed"]).optional(),
  checkpoint: z.string().nullable().optional(),
  stateJson: z.record(z.string(), z.unknown()).nullable().optional(),
  score: z.number().int().nullable().optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const missionId = searchParams.get("missionId");

  if (missionId) {
    const row = await getMissionProgress(session.user.id, missionId);
    return NextResponse.json({ progress: row });
  }

  const rows = await getUserProgress(session.user.id);
  return NextResponse.json({ progress: rows });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid progress payload." }, { status: 400 });
    }

    const row = await upsertProgress(session.user.id, {
      missionId: parsed.data.missionId,
      status: parsed.data.status as ProgressStatus | undefined,
      checkpoint: parsed.data.checkpoint,
      stateJson: parsed.data.stateJson,
      score: parsed.data.score,
    });

    return NextResponse.json({ progress: row });
  } catch (err) {
    console.error("progress patch error", err);
    return NextResponse.json({ error: "Failed to save progress." }, { status: 500 });
  }
}
