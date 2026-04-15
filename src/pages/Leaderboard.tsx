"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Cpu,
  Fingerprint,
  Search,
  ShieldCheck,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LeaderboardService } from "../services/index";

interface Leader {
  id: string | number;
  name: string;
  totalScore: number;
  quizzesTaken?: number;
  rank?: number;
}

const RANK_COLORS = [
  "from-amber-400 to-yellow-500",   // 1st - gold
  "from-slate-300 to-slate-400",    // 2nd - silver
  "from-orange-400 to-amber-600",   // 3rd - bronze
];

const RANK_RING = [
  "ring-4 ring-amber-400/30 shadow-amber-500/30",
  "ring-4 ring-slate-300/20 shadow-slate-300/10",
  "ring-4 ring-orange-400/20 shadow-orange-400/10",
];

const RANK_BADGE_BG = ["bg-amber-400", "bg-slate-300", "bg-orange-400"];
const RANK_BADGE_TEXT = ["text-black", "text-black", "text-black"];

function Avatar({
  name,
  size = "md",
  rank,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  rank?: number;
}) {
  const sizeMap = {
    sm: "w-10 h-10 text-base rounded-xl",
    md: "w-14 h-14 text-xl rounded-2xl",
    lg: "w-20 h-20 text-3xl rounded-3xl",
  };
  const isTop3 = rank !== undefined && rank < 3;
  return (
    <div className={`relative flex-shrink-0 ${isTop3 ? RANK_RING[rank!] : ""} rounded-3xl`}>
      <div
        className={`${sizeMap[size]} flex items-center justify-center font-black bg-white/10 border border-white/15 text-white`}
      >
        {name[0].toUpperCase()}
      </div>
      {isTop3 && (
        <span
          className={`absolute -top-2 -right-2 ${RANK_BADGE_BG[rank!]} ${RANK_BADGE_TEXT[rank!]} text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg`}
        >
          {rank! + 1}
        </span>
      )}
    </div>
  );
}

function PodiumCard({
  user,
  rank,
  delay = 0,
}: {
  user: Leader;
  rank: number;
  delay?: number;
}) {
  const isFirst = rank === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={`flex flex-col items-center text-center gap-2 ${isFirst ? "scale-105 z-10" : "opacity-90"}`}
    >
      <Avatar name={user.name} size={isFirst ? "lg" : "md"} rank={rank} />
      <p className={`font-bold tracking-tight leading-tight ${isFirst ? "text-lg" : "text-sm"} max-w-[80px] truncate`}>
        {user.name}
      </p>
      <p
        className={`font-black tabular-nums ${
          isFirst
            ? "text-3xl bg-gradient-to-b from-[#f97316] to-orange-600 bg-clip-text text-transparent"
            : "text-xl text-white/80"
        }`}
      >
        {user.totalScore.toLocaleString()}
      </p>
      {rank === 0 && (
        <div className="flex items-center gap-1 mt-1">
          <Trophy size={14} className="text-amber-400" />
          <span className="text-xs text-amber-400 font-bold tracking-widest">CHAMPION</span>
        </div>
      )}
    </motion.div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [top10, setTop10] = useState<Leader[]>([]);
  const [currentUser, setCurrentUser] = useState<Leader | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await LeaderboardService.getLeaderboard();
        if (res.data.success) {
          const { top10: fetchedTop10, user: fetchedUser } = res.data.data;
          setTop10(fetchedTop10 || []);
          setCurrentUser(fetchedUser || null);
        }
      } catch (error) {
        console.error("Registry_Link_Failure");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filteredLeaders = useMemo(
    () =>
      top10.filter((l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [top10, searchQuery]
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-[#f97316]/30 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-7 h-7 text-[#f97316] animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[#f97316] text-xs font-bold tracking-[4px]">
              SYNCING NEURAL CORE
            </p>
            <p className="text-white/30 text-xs">ESTABLISHING QUANTUM LINK...</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-36">
        {/* TOP NAV */}
        <nav className="flex justify-between items-center mb-10 gap-3">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 sm:gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 sm:px-5 py-2.5 rounded-2xl transition-all duration-300"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform flex-shrink-0"
            />
            <span className="uppercase text-[10px] sm:text-xs tracking-[2px] font-semibold whitespace-nowrap">
              Back
            </span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <div className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse flex-shrink-0" />
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-white/50 whitespace-nowrap">
              LIVE REGISTRY
            </span>
          </div>
        </nav>

        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 mb-5">
            <ShieldCheck className="text-[#f97316] flex-shrink-0" size={16} />
            <span className="uppercase text-[10px] sm:text-xs tracking-[2px] font-bold text-white/60">
              GLOBAL EFFICIENCY INDEX
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent leading-none">
            LEADERBOARD
          </h1>
          <p className="mt-2 text-white/40 text-sm sm:text-base">
            Top Performers • Neural Network 2026
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-sm mx-auto mb-10">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search competitors..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#f97316]/50 focus:bg-white/8 transition-all duration-200"
          />
        </div>

        {/* PODIUM - TOP 3 */}
        {filteredLeaders.length > 0 && !searchQuery && (
          <div className="mb-10">
            <div className="flex justify-center items-end gap-6 sm:gap-10 px-4">
              {/* 2nd */}
              {filteredLeaders[1] && (
                <div className="flex-1 flex flex-col items-center pb-0">
                  <PodiumCard user={filteredLeaders[1]} rank={1} delay={0.1} />
                  <div className="mt-4 w-full bg-white/5 border border-white/10 rounded-t-xl h-20 sm:h-24" />
                </div>
              )}
              {/* 1st */}
              {filteredLeaders[0] && (
                <div className="flex-1 flex flex-col items-center -mb-0">
                  <PodiumCard user={filteredLeaders[0]} rank={0} delay={0} />
                  <div className="mt-4 w-full bg-[#f97316]/10 border border-[#f97316]/20 rounded-t-xl h-32 sm:h-40" />
                </div>
              )}
              {/* 3rd */}
              {filteredLeaders[2] && (
                <div className="flex-1 flex flex-col items-center">
                  <PodiumCard user={filteredLeaders[2]} rank={2} delay={0.2} />
                  <div className="mt-4 w-full bg-white/5 border border-white/10 rounded-t-xl h-14 sm:h-16" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEADERBOARD LIST */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Table header — hidden on small screens */}
          <div className="hidden sm:flex px-6 py-4 border-b border-white/10 bg-white/5 items-center gap-4">
            <div className="w-12 text-[10px] uppercase tracking-[2px] font-semibold text-white/40">
              Rank
            </div>
            <div className="flex-1 text-[10px] uppercase tracking-[2px] font-semibold text-white/40">
              Subject
            </div>
            <div className="text-[10px] uppercase tracking-[2px] font-semibold text-white/40">
              Score
            </div>
          </div>

          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {filteredLeaders.map((user, idx) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`group flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-white/5 transition-all duration-200 ${
                    idx < 3 ? "bg-white/[0.03]" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 sm:w-12 flex-shrink-0 flex justify-center">
                    {idx < 3 ? (
                      <div
                        className={`w-7 h-7 rounded-xl bg-gradient-to-br ${RANK_COLORS[idx]} flex items-center justify-center text-black text-xs font-black`}
                      >
                        {idx + 1}
                      </div>
                    ) : (
                      <span className="font-mono text-sm font-bold text-white/25 group-hover:text-white/50 transition-colors">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Avatar + Name */}
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-base font-bold border transition-all ${
                        idx < 3
                          ? "bg-[#f97316]/10 border-[#f97316]/25 text-white"
                          : "bg-white/5 border-white/10 group-hover:border-white/25"
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base tracking-tight truncate">
                        {user.name}
                      </p>
                      {user.quizzesTaken && (
                        <p className="text-[10px] text-white/35 font-mono hidden sm:block">
                          {user.quizzesTaken} nodes
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xl sm:text-2xl font-black tabular-nums tracking-tighter transition-colors ${
                        idx < 3
                          ? "text-[#f97316]"
                          : "text-white group-hover:text-[#f97316]"
                      }`}
                    >
                      {user.totalScore.toLocaleString()}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-white/15 group-hover:text-[#f97316]/60 transition-colors hidden sm:block"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredLeaders.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
              <Fingerprint size={40} className="text-white/10" />
              <p className="uppercase tracking-[3px] text-white/25 text-xs font-bold">
                NO MATCHING IDENTITY
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/30">
          <div className="flex items-center gap-2">
            <Cpu size={14} />
            <span className="font-mono">NODE_CALIBRATOR_v4.7 • 2026</span>
          </div>
          <p>SECURE • TRANSPARENT • UNSTOPPABLE</p>
        </footer>
      </div>

      {/* FLOATING CURRENT USER */}
      <AnimatePresence>
        {currentUser && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 sm:px-6 pb-4 sm:pb-6"
          >
            <div className="max-w-lg mx-auto bg-[#0f0f0f]/95 border border-[#f97316]/30 rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-4 shadow-2xl shadow-black/80 backdrop-blur-xl">
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#f97316]/10 border border-[#f97316]/25 flex items-center justify-center flex-shrink-0">
                  <Target size={22} className="text-[#f97316]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">
                      Your Standing
                    </p>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10">
                      #{currentUser.rank ?? "—"}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg font-bold truncate mt-0.5">
                    {currentUser.name}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    Score
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-[#f97316] tabular-nums tracking-tighter leading-tight">
                    {currentUser.totalScore.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}