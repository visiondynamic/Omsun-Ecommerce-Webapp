import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Cpu,
  FileCheck,
  Gauge,
  Lightbulb,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import projectImg from "@/assets/project-nepal.jpg";
import heroImg from "@/assets/banner-solar-farm.png";

export const Route = createFileRoute("/solar-solutions")({
  head: () => ({
    meta: [
      { title: "Solar Solutions & Engineering | OMSUN Nepal" },
      {
        name: "description",
        content:
          "Custom solar engineering solutions in Nepal — rooftop EPC, hybrid microgrids, off-grid storage, and industrial energy systems with NEA net-metering approvals.",
      },
    ],
  }),
  component: SolarSolutionsPage,
});

function SolarSolutionsPage() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      <Navbar />

      <main className="pt-24">
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden bg-[#051711] py-20 text-white">
          {/* BG Image overlay */}
          <img
            src={heroImg}
            alt="OMSUN Solar Farm"
            className="absolute inset-0 size-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051711] via-[#051711]/80 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sun className="size-4 animate-spin-slow" />
                <span>Turnkey Solar EPC & Engineering</span>
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold sm:text-6xl leading-tight">
                Tailored Solar Solutions for Homes & Enterprises in Nepal
              </h1>

              <p className="mt-5 text-lg text-white/70 leading-relaxed">
                From residential rooftop solar systems to high-capacity industrial hybrid plants and remote off-grid microgrids — OMSUN handles design, procurement, NEA net-metering, and lifetime maintenance.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="h-13 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 text-base font-bold text-white shadow-lg transition-all hover:scale-105"
                >
                  <Link to="/shop">Explore Solar Products</Link>
                </Button>
                <a
                  href="#commercial-epc"
                  className="inline-flex h-13 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  <span>Commercial EPC Solutions</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── COMMERCIAL & INDUSTRIAL SOLAR EPC SHOWCASE ── */}
        <section id="commercial-epc" className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                High-Yield Capital Investment
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-5xl tracking-tight">
                Commercial & Industrial Solar EPC Engineering
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-base">
                Solar infrastructure in Nepal delivers highest-tier long-term energy yields. Reduce operational electricity expenditure by up to 74% while securing 100% uninterrupted power during grid load shedding.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "Up to 74% Operational Bill Reduction",
                    desc: "Full Nepal Electricity Authority (NEA) net-metering interconnection support with bi-directional metering paperwork.",
                    icon: CheckCircle2,
                  },
                  {
                    title: "25-Year Performance Guarantee",
                    desc: "Tier-1 monocrystalline N-type bifacial modules paired with high-efficiency hybrid string inverters.",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Zero Load Shedding & Diesel Substitution",
                    desc: "High-density LiFePO4 battery storage racks provide instant seamless failover for factories and hotels.",
                    icon: Cpu,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 shadow-sm"
                  >
                    <item.icon className="size-6 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display text-base font-bold text-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  asChild
                  className="h-13 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 text-sm font-bold text-white shadow-xl hover:scale-[1.02] transition-all"
                >
                  <Link to="/shop" className="flex items-center gap-2">
                    <span>Schedule Commercial Site Assessment</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
                <img
                  src={projectImg}
                  alt="Solar Panel Installation Nepal"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-8 flex flex-col justify-end">
                  <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="size-5 text-emerald-400" />
                    <span>25-Year Performance Warranty Included</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
                    Commercial & Industrial Solar EPC
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                    Engineered to meet Nepal Electricity Authority (NEA) grid interconnection, surge protection, and net-metering technical standards.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── OUR SPECIALIZED SOLAR SERVICES (DARK EMERALD BENTO SHOWCASE 🌙) ── */}
        <section className="relative overflow-hidden bg-[#03140e] py-24 text-white border-y border-white/10">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-[600px] rounded-full bg-teal-500/10 blur-[150px]" />

          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
                <Sun className="size-4" />
                <span>Certified Engineering Verticals</span>
              </div>
              <h2 className="font-display text-4xl font-extrabold sm:text-6xl text-white tracking-tight">
                Our Specialized Solar Services
              </h2>
              <p className="mt-4 text-base text-white/70 leading-relaxed">
                Comprehensive engineering for residential homes, commercial complexes, remote resorts, and municipal infrastructure across Nepal.
              </p>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Residential Rooftop Systems",
                  desc: "Complete 3 kW to 15 kW solar rooftop setups with intelligent hybrid inverter auto-switch and LiFePO4 battery back-up.",
                  icon: Sun,
                  color: "#0ea5e9",
                  specs: ["Zero Load Shedding", "NEA Net Metering", "Mobile Monitoring App"],
                },
                {
                  title: "Commercial & Industrial EPC",
                  desc: "50 kW to 1 MW+ turnkey solar power plants designed for factories, schools, hotels, and hospitals to cut diesel generator costs.",
                  icon: Cpu,
                  color: "#6366f1",
                  specs: ["Peak Shaving", "Rapid ROI (< 4 Years)", "Heavy Duty Switchgear"],
                },
                {
                  title: "Off-Grid & Resort Microgrids",
                  desc: "Autonomous solar & lithium storage stations designed for high-altitude lodges, telecom towers, and off-grid Himalayan communities.",
                  icon: BatteryCharging,
                  color: "#10b981",
                  specs: ["Sub-Zero Battery Insulation", "100% Diesel Replacement", "Remote Telemetry"],
                },
                {
                  title: "NEA Net-Metering Approvals",
                  desc: "End-to-end paperwork, grid-impact study, bi-directional meter installation, and formal commissioning with Nepal Electricity Authority.",
                  icon: FileCheck,
                  color: "#f59e0b",
                  specs: ["Sanctioned Load Study", "Technical Single-Line Diagrams", "NEA Inspection Support"],
                },
                {
                  title: "Solar Water Pumping",
                  desc: "High-flow solar powered water lifting for agricultural irrigation and mountain village drinking water supply projects.",
                  icon: Gauge,
                  color: "#ec4899",
                  specs: ["Direct MPPT Pump Drives", "Zero Fuel Expenses", "Automatic Water Level Control"],
                },
                {
                  title: "Smart Solar Street Lighting",
                  desc: "All-in-one smart LED solar streetlights with motion sensors, dusk-to-dawn controllers, and rugged IP67 weather sealing.",
                  icon: Lightbulb,
                  color: "#8b5cf6",
                  specs: ["Lithium Iron Phosphate Battery", "50,000+ Hour LED Life", "Zero Grid Wiring"],
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[#051c14] p-7 shadow-2xl transition-all duration-500 hover:border-emerald-400/60 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(16,185,129,0.35)]">
                    <div>
                      <div
                        className="grid size-14 place-items-center rounded-2xl border border-white/20 shadow-lg mb-6 transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `color-mix(in srgb, ${item.color} 25%, #051c14)`,
                          color: item.color,
                          boxShadow: `0 0 20px 0 ${item.color}33`,
                        }}
                      >
                        <item.icon className="size-7" strokeWidth={2} />
                      </div>

                      <h3 className="font-display text-2xl font-extrabold text-white transition-colors duration-300 group-hover:text-emerald-300">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>

                    <ul className="mt-8 pt-5 border-t border-white/10 space-y-2.5">
                      {item.specs.map((s) => (
                        <li key={s} className="flex items-center gap-2.5 text-xs font-bold text-emerald-300">
                          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5-STEP ENGINEERING WORKFLOW (PROVEN EXECUTION PROCESS ⚡) ── */}
        <section className="bg-gradient-to-b from-[#020e09] via-[#041a12] to-[#020e09] py-24 text-white relative">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
                <ShieldCheck className="size-4" />
                <span>Turnkey Quality Standards</span>
              </div>
              <h2 className="font-display text-4xl font-extrabold sm:text-6xl text-white tracking-tight">
                Proven Execution Process
              </h2>
              <p className="mt-4 text-base text-white/70 font-medium">
                5 Steps from Initial Site Survey to Clean Renewable Power
              </p>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { num: "01", title: "Site & Load Survey", desc: "Our engineers analyze shadow angles, roof structural integrity, and hourly power usage." },
                { num: "02", title: "3D System Design", desc: "We model 3D solar yield forecasts, cable sizing, and protective switchgear layouts." },
                { num: "03", title: "Tier-1 Sourcing", desc: "Only IEC & TÜV certified panels, hybrid inverters, and pure copper cables dispatched." },
                { num: "04", title: "Installation & NEA", desc: "Certified electricians perform mounting, wiring, testing, and NEA net-meter sync." },
                { num: "05", title: "25-Yr Maintenance", desc: "Remote cloud monitoring, annual health checks, and prompt local technician dispatch." },
              ].map((step, i) => (
                <Reveal key={step.num} delay={i * 80} className="h-full">
                  <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-white/15 bg-[#051e16] p-6 shadow-xl transition-all duration-300 hover:border-emerald-400/60 hover:bg-[#07271c] hover:-translate-y-1.5">
                    <div>
                      <span className="font-display text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                        {step.num}
                      </span>
                      <h3 className="mt-4 font-display text-lg font-extrabold text-white transition-colors duration-300 group-hover:text-emerald-300">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-xs text-white/70 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                      <span>Step {i + 1} of 5</span>
                      <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONSULTATION CTA ── */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#051c14] to-[#093526] p-10 sm:p-16 border border-emerald-500/30 text-white shadow-2xl text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold">
              Ready to Power Your Property with Solar?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm text-white/70">
              Get a free technical consultation and customized solar quotation from OMSUN's senior engineering team in Nepal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="h-13 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 text-sm shadow-xl hover:scale-105 transition-all"
              >
                <Link to="/shop">Shop Recommended Bundles</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
