// import Image from "next/image";

// export default function Home() {
//   return (
//     <main>
//       <h1>MLB Legends</h1>
//       <p>通算HR偉業に近づく現役選手</p>
//     </main>
//   );
// }

async function getPlayerStats() {
  const res = await fetch(
    "https://statsapi.mlb.com/api/v1/people/660271/stats?stats=career&group=hitting",
    { cache: "no-store" } // 常に最新
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const data = await getPlayerStats();

  const stats = data.stats[0]?.splits[0]?.stat;
  const homeRuns = stats?.homeRuns ?? "N/A";

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif"}}>
      <h1>MLB Legends</h1>
      <h2>通算ホームラン</h2>
      <p>大谷翔平</p>
      <p>Career HR: {homeRuns}</p>
    </main>
  );
}