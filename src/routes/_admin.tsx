import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";

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
      <div className="min-h-screen flex items-center justify-center pt-24 text-white">
        Checking permissions...
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-zinc-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 text-white">
        <h1 className="text-3xl font-bold mb-8 text-amber-400">Admin Panel</h1>
        <Outlet />
      </div>
    </div>
  );
}
