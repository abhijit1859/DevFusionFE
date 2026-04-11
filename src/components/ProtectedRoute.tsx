"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import type { RootState } from "../store/store";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    //  Trigger alert only if loading is finished and user is not authenticated
    if (!loading && !isAuthenticated) {
      toast.error("Login To Continue", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  }, [isAuthenticated, loading]);

  // PHASE 1: NEURAL SYNC (Wait for Auth hydration)
  if (loading) {
    return (
      <div className="h-screen bg-[#020202] flex flex-col items-center justify-center">
        <div className="w-16 h-[1px] bg-[#f97316] animate-pulse" />
        <span className="mt-4 text-[8px] font-black uppercase tracking-[0.5em] text-white/20">
          Verifying_Session_Integrity
        </span>
      </div>
    );
  }

  // PHASE 2: REDIRECT (If unauthorized)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // PHASE 3: ACCESS GRANTED
  return <Outlet />;
};

export default ProtectedRoute;
