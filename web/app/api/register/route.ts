import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password (min 8 chars)." }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An operative with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: { email, passwordHash },
    });

    await prisma.userProgress.create({
      data: { userId: user.id, missionId: "m1", status: "in_progress", checkpoint: "start" },
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
