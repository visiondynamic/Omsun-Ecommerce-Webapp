import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      navigate({ to: "/auth", replace: true });
    }
  }, [isMounted, isAuthenticated, navigate]);

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-slate-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 text-white">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}</h1>
        <Outlet />
      </div>
    </div>
  );
}
