import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { User, ShieldCheck, Zap } from "lucide-react";
import solarFarmImg from "@/assets/banner-solar-farm.webp";
import heroPortalBg from "@/assets/hero-portal-bg.webp";

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
      const redirectPath = typeof window !== "undefined" ? window.location.pathname : "/dashboard";
      navigate({
        to: "/auth",
        search: { mode: "login", redirect: redirectPath } as any,
        replace: true,
      });
    }
  }, [isMounted, isAuthenticated, navigate]);

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 text-sm font-bold">
          <div className="size-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[#eff0f5] dark:bg-[#071912] text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
