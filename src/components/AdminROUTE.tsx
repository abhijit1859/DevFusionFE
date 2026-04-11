"use client";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  // --- PHASE 1: NEURAL SYNC (LOADING) ---
  if (loading) {
    return (
      <div className="h-screen bg-[#020202] flex flex-col items-center justify-center">
        <div className="w-16 h-[1px] bg-[#f97316] animate-pulse" />
        <span className="mt-4 text-[8px] font-black uppercase tracking-[0.5em] text-white/20">
          Authenticating_Admin_Clearance
        </span>
      </div>
    );
  }

  // --- PHASE 2: SECURITY CHECK ---
  // If not logged in OR role is not ADMIN, bounce back to landing
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // --- PHASE 3: ACCESS GRANTED ---
  return <Outlet />;
};

export default AdminRoute;
