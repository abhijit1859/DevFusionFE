"use client";

import {
  Activity,
  Brain,
  ChevronRight,
  Clock,
  Code2,
  LogOut,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../store/authSlice";

import { AuthService, UserService } from "../services/index";
import Heatmap from "../components/HeatMap";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await UserService.getProfile();
        if (res.data.success) setUser(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("SYSTEM_ERROR: Data Link Severed.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      toast.success("SESSION_TERMINATED.");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/5 border-t-[#f97316] rounded-full animate-spin mb-4" />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
          Syncing_Neural_Profile
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-400">

      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-[#020202]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-lg font-black text-white">
            PREPGRID<span className="text-[#f97316]">.</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white px-4 py-2 rounded-lg border border-white/5 hover:bg-red-500/5"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* CONTENT */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT SIDEBAR */}
          <div className="lg:w-[300px] w-full space-y-6">

            {/* PROFILE CARD */}
            <div className="bg-zinc-900/10 border border-white/5 rounded-2xl p-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-xl bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white">
                {user.name?.[0]}
              </div>

              <h1 className="mt-4 text-lg font-bold text-white">
                {user.name}
              </h1>
              <p className="text-xs text-zinc-500">{user.email}</p>

              <div className="flex mt-6 border-t border-white/5 pt-4">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500">Solved</p>
                  <p className="text-lg font-bold text-white">
                    {user._count?.problemSolved || 0}
                  </p>
                </div>
                <div className="flex-1 border-l border-white/5">
                  <p className="text-xs text-zinc-500">Streak</p>
                  <p className="text-lg font-bold text-orange-400">
                    {user.currentStreak}D
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="bg-zinc-900/10 border border-white/5 rounded-2xl p-4 space-y-2">
              <button
                onClick={() => navigate("/problems")}
                className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <Code2 size={14} />
                  Problems
                </div>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => navigate("/mcq")}
                className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <Brain size={14} />
                  Tests
                </div>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 space-y-6">

            <h2 className="text-lg font-bold text-white">
              Interview Registry
            </h2>

            <div className="space-y-4">
              {user.interviews?.length > 0 ? (
                user.interviews.map((int: any) => (
                  <div
                    key={int.id}
                    className="bg-zinc-900/10 border border-white/5 rounded-xl p-5 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {int.role}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {new Date(int.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {int.status === "IN_PROGRESS" ? (
                      <button
                        onClick={() => navigate(`/interview/${int.id}`)}
                        className="text-xs px-4 py-2 bg-orange-500/10 border border-orange-400 text-orange-400 rounded-lg"
                      >
                        Resume
                      </button>
                    ) : (
                      <p className="text-white font-bold">
                        {int.totalScore || 0}/10
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-zinc-600 py-10">
                  No Interviews Yet
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="pt-8 border-t border-white/5 overflow-y-auto">
          <Heatmap />
        </div>

      </div>
    </div>
  );
}