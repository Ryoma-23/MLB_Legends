type Player = {
  id: number;
  name: string;
};

const players: Player[] = [
  { id: 660271, name: "Shohei Ohtani" },
  { id: 545361, name: "Mike Trout" },
  { id: 592450, name: "Aaron Judge" },
];

async function getPlayerStats(playerId: number) {
  const res = await fetch(
    `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=career&group=hitting`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const playerData = await Promise.all(
    players.map(async (player) => {
      const data = await getPlayerStats(player.id);
      const stats = data.stats[0]?.splits[0]?.stat;
      const homeRuns = Number(stats?.homeRuns ?? 0);

      return {
        name: player.name,
        homeRuns,
        remainingTo500: 500 - homeRuns,
      };
    })
  );

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        500HRに近づく現役選手
      </h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {playerData.map((player) => (
          <div
            key={player.name}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "12px",
              width: "220px",
            }}
          >
            <h2>{player.name}</h2>
            <p>通算HR: {player.homeRuns}</p>
            <p>500HRまであと: {player.remainingTo500}本</p>
          </div>
        ))}
      </div>
    </main>
  );
}
