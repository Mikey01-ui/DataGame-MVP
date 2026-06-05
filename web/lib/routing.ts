import { getMissionProgress } from "@/lib/progress";

/** Where to send a logged-in user after login/register. */
export async function resolvePostLoginPath(userId: string): Promise<string> {
  const m1 = await getMissionProgress(userId, "m1");
  if (!m1 || m1.checkpoint === "start") {
    return "/intro";
  }
  return "/hub";
}
