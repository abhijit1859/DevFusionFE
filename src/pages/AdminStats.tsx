"use client";

import {
  Activity,
  Award,
  BookOpen,
  DollarSign,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm tracking-widest">
            LOADING CORE STATS...
          </p>
        </div>
      </div>
    );
  }

  const { stats, leaderboard, topCreators, mostAttempted, difficultyStats } =
    data;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              Back to Terminal
            </button>
            <h1 className="text-5xl font-black tracking-tighter">
              ADMIN DASHBOARD
            </h1>
            <p className="text-white/40 mt-2">
              Platform Intelligence • Real-time Overview
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
            <div className="w-2.5 h-2.5 bg-[#f97316] rounded-full animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-white/60">
              LIVE
            </span>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Users"
            value={stats.totalUsers?.toLocaleString()}
            color="#f97316"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Total Problems"
            value={stats.totalProblems?.toLocaleString()}
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            title="Submissions"
            value={stats.totalSubmissions?.toLocaleString()}
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Revenue"
            value={`₹${stats.revenue?.toLocaleString()}`}
            color="#22c55e"
          />
        </div>

        {/* ACTIVITY STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            title="Active Users (24h)"
            value={stats.activeUsers24h?.toLocaleString()}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Active Users (7d)"
            value={stats.activeUsers7d?.toLocaleString()}
          />
        </div>

        {/* SECTIONS GRID */}
        <div className="grid lg:grid-cols-2 gap-8">
          <DashboardSection
            title="🏆 Top Solvers"
            icon={<Trophy className="w-5 h-5" />}
          >
            {leaderboard.map((l: any, i: number) => (
              <DataRow key={i} rank={i + 1}>
                <span className="font-medium">{l.user?.name}</span>
                <span className="text-[#f97316] font-bold">{l.solved}</span>
              </DataRow>
            ))}
          </DashboardSection>

          <DashboardSection
            title="🔨 Top Creators"
            icon={<Award className="w-5 h-5" />}
          >
            {topCreators.map((c: any, i: number) => (
              <DataRow key={i} rank={i + 1}>
                <span className="font-medium">{c.user?.name}</span>
                <span className="text-[#f97316] font-bold">
                  {c.problemsCreated}
                </span>
              </DataRow>
            ))}
          </DashboardSection>

          <DashboardSection
            title="🔥 Most Attempted Problems"
            icon={<Target className="w-5 h-5" />}
          >
            {mostAttempted.map((m: any, i: number) => (
              <DataRow key={i} rank={i + 1}>
                <span className="font-medium line-clamp-1">
                  {m.problem?.title}
                </span>
                <span className="text-[#f97316] font-bold">{m.attempts}</span>
              </DataRow>
            ))}
          </DashboardSection>

          <DashboardSection
            title="📊 Difficulty Distribution"
            icon={<Activity className="w-5 h-5" />}
          >
            {difficultyStats.map((d: any, i: number) => (
              <DataRow key={i} rank={i + 1}>
                <span className="font-medium capitalize">{d.difficulty}</span>
                <span className="text-[#f97316] font-bold">
                  {d._count.difficulty}
                </span>
              </DataRow>
            ))}
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}

/* ====================== REUSABLE COMPONENTS ====================== */

function StatCard({ icon, title, value, color = "white" }: any) {
  return (
    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl p-7 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div
          className={`text-[#f97316] group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <p className="text-white/50 text-sm tracking-widest uppercase">
          {title}
        </p>
      </div>
      <h2 className="text-4xl font-black tracking-tighter mt-6 text-white">
        {value}
      </h2>
    </div>
  );
}

function DashboardSection({ title, icon, children }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <div className="px-8 py-5 border-b border-white/10 flex items-center gap-3 bg-white/5">
        {icon}
        <h3 className="uppercase text-sm tracking-[2px] font-semibold text-white/70">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-white/10">{children}</div>
    </div>
  );
}

function DataRow({ rank, children }: any) {
  return (
    <div className="flex items-center justify-between px-8 py-5 hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-4">
        <span className="text-white/30 font-mono text-sm group-hover:text-white/50 transition-colors">
          #{String(rank).padStart(2, "0")}
        </span>
        {children}
      </div>
    </div>
  );
}
