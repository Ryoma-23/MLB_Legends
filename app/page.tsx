type PlayerBasic = {
  id: number;
  fullName: string;
  birthDate: string;
};

type ProcessedPlayer = {
  name: string;
  age: number;
  homeRuns: number;
};

async function getActivePlayers(): Promise<PlayerBasic[]> {
  const res = await fetch(
    "https://statsapi.mlb.com/api/v1/sports/1/players?active=true",
    { cache: "no-store" }
  );

  const data = await res.json();
  return data.people;
}

async function getCareerHR(playerId: number) {
  const res = await fetch(
    `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=career&group=hitting`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const stats = data.stats[0]?.splits[0]?.stat;
  return Number(stats?.homeRuns ?? 0);
}

function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default async function Home() {
  const activePlayers = await getActivePlayers();

  // とりあえず200人だけ取得（負荷対策）
  const samplePlayers = activePlayers.slice(0, 8000);

  const playersWithHR: ProcessedPlayer[] = await Promise.all(
    samplePlayers.map(async (player) => {
      const homeRuns = await getCareerHR(player.id);

      return {
        name: player.fullName,
        age: calculateAge(player.birthDate),
        homeRuns,
      };
    })
  );

  // 500HRに近い順（HR多い順）
  const topTo500 = playersWithHR
    .filter((p) => p.homeRuns > 0)
    .sort((a, b) => b.homeRuns - a.homeRuns)
    .slice(0, 5);

  // 350未満で350に近い順
  const near350 = playersWithHR
    .filter((p) => p.homeRuns < 350)
    .sort((a, b) => b.homeRuns - a.homeRuns)
    .slice(0, 5);

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>現役選手 HR分析</h1>

      <h2>500HRに最も近い5人</h2>
      {topTo500.map((p) => (
        <div key={p.name}>
          {p.name} / {p.age}歳 / {p.homeRuns}本
        </div>
      ))}

      <h2 style={{ marginTop: "40px" }}>
        350HR未満で最も近い5人
      </h2>
      {near350.map((p) => (
        <div key={p.name}>
          {p.name} / {p.age}歳 / {p.homeRuns}本
        </div>
      ))}
    </main>
  );
}
