import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { resolvePostLoginPath } from "@/lib/routing";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  redirect(await resolvePostLoginPath(session.user.id));
}
