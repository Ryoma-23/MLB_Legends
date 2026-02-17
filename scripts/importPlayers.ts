import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fetching players...");

  const res = await fetch("https://statsapi.mlb.com/api/v1/sports/1/players?hydrate=stats(group=[hitting],type=[career])");
  const data = await res.json();

  const players = data.people.map((p: any) => {
    const careerStats = p.stats?.[0]?.splits?.[0]?.stat;

    return {
      id: p.id,
      fullName: p.fullName,
      birthDate: p.birthDate ? new Date(p.birthDate) : null,
      careerHR: careerStats?.homeRuns ?? 0,
      active: p.active ?? false,
    };
  });

  console.log(`Inserting ${players.length} players...`);

  await prisma.player.createMany({
    data: players,
    skipDuplicates: true,
  });

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
