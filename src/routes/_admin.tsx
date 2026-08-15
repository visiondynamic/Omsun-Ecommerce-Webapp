import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isAuthenticated) {
        navigate({ to: "/auth", replace: true });
      } else if (user?.role !== "admin") {
        navigate({ to: "/", replace: true });
      }
    }
  }, [isMounted, isAuthenticated, user, navigate]);

  if (!isMounted || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F2FBF4] dark:bg-[#071A12] text-[#173226] dark:text-white">
        <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-xl text-center">
          <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
            <Lock className="size-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base">Verifying Admin Credentials</h3>
            <p className="text-xs text-slate-500 font-medium">Authenticating OMSUN Command Center level access...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#F2FBF4] dark:bg-[#071A12] text-[#173226] dark:text-slate-100 flex flex-col font-sans">
      <Outlet />
    </div>
  );
}
