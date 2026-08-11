import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ShieldCheck, Lock } from "lucide-react";
import heroAdminBg from "@/assets/hero-admin-bg.webp";

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
      <div className="min-h-dvh flex items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 text-sm font-bold">
          <Lock className="size-5 text-amber-500" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* ── ADMIN HERO BANNER ── */}
        <section className="relative overflow-hidden bg-[#041a12] pt-28 pb-12 sm:pt-36 sm:pb-14 text-white border-b border-amber-500/20 mb-8">
          <img
            src={heroAdminBg}
            alt="OMSUN Executive Administration"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center pointer-events-none opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03150e]/90 via-[#03150e]/70 to-[#03150e]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03150e]/40 via-transparent to-[#041a12]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  <ShieldCheck className="size-3.5 text-amber-400" />
                  <span>Executive Management Portal</span>
                </span>
                <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
                  OMSUN Nepal System Administration
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-amber-100/70 max-w-2xl font-medium">
                  Real-time system telemetry, product catalog control, customer orders, and staff
                  operations.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-amber-500/20 px-4 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/30 backdrop-blur-md">
                  Administrator Level 1
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
