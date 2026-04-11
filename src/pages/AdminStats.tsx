import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats } from "../services/api";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminStats()
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        Loading...
      </div>
    );
  }

  const { stats, leaderboard, topCreators, mostAttempted, difficultyStats } =
    data;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-6">

   
      <div className="max-w-7xl mx-auto">

        
        <div className="mb-10">
          <button
            onClick={() => navigate("/")}
            className="mb-4 text-white/60 hover:text-white"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-white/40 text-sm">
            Monitor your platform stats
          </p>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <StatCard title="Users" value={stats.totalUsers} />
          <StatCard title="Problems" value={stats.totalProblems} />
          <StatCard title="Submissions" value={stats.totalSubmissions} />
          <StatCard title="Revenue" value={`₹${stats.revenue}`} />
        </div>

        
        <div className="grid grid-cols-2 gap-5 mb-10 max-w-md">
          <StatCard title="Active (24h)" value={stats.activeUsers24h} />
          <StatCard title="Active (7d)" value={stats.activeUsers7d} />
        </div>

        {/* 🔥 SECTIONS GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          <Section title="Top Solvers">
            {leaderboard.map((l: any, i: number) => (
              <Row key={i}>
                <span>{l.user?.name}</span>
                <span className="text-orange-400">{l.solved}</span>
              </Row>
            ))}
          </Section>

          <Section title="Top Creators">
            {topCreators.map((c: any, i: number) => (
              <Row key={i}>
                <span>{c.user?.name}</span>
                <span className="text-orange-400">
                  {c.problemsCreated}
                </span>
              </Row>
            ))}
          </Section>

          <Section title="Most Attempted">
            {mostAttempted.map((m: any, i: number) => (
              <Row key={i}>
                <span>{m.problem?.title}</span>
                <span className="text-orange-400">
                  {m.attempts}
                </span>
              </Row>
            ))}
          </Section>

          <Section title="Difficulty">
            {difficultyStats.map((d: any, i: number) => (
              <Row key={i}>
                <span>{d.difficulty}</span>
                <span className="text-orange-400">
                  {d._count.difficulty}
                </span>
              </Row>
            ))}
          </Section>

        </div>

      </div>
    </div>
  );
}

 
function StatCard({ title, value }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
      <p className="text-white/40 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}
 
function Section({ title, children }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 text-white/70 text-sm">
        {title}
      </div>
      {children}
    </div>
  );
}

 
function Row({ children }: any) {
  return (
    <div className="flex justify-between px-4 py-3 border-b border-white/10 hover:bg-white/5">
      {children}
    </div>
  );
}