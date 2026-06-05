import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedUser(email: string, password: string, role: "player" | "admin") {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, role },
    update: { passwordHash, role },
  });

  if (role === "admin") {
    for (const missionId of ["m1", "m2", "m3", "m4", "m5"]) {
      await prisma.userProgress.upsert({
        where: { userId_missionId: { userId: user.id, missionId } },
        create: { userId: user.id, missionId, status: "completed", checkpoint: "completed" },
        update: { status: "completed", checkpoint: "completed" },
      });
    }
  } else {
    await prisma.userProgress.upsert({
      where: { userId_missionId: { userId: user.id, missionId: "m1" } },
      create: { userId: user.id, missionId: "m1", status: "in_progress", checkpoint: "start" },
      update: {},
    });
  }

  return user;
}

async function main() {
  await seedUser("playtest@omni.local", "playtest12", "player");
  console.log("Seeded playtest user: playtest@omni.local / playtest12");

  await seedUser("admin@maverxtest.com", "test123.com", "admin");
  console.log("Seeded admin user: admin@maverxtest.com / test123.com (skip arrows enabled)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
