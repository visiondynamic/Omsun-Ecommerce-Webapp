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
  const [monthlyBill, setMonthlyBill] = useState<number>(15000);
  const estimatedSavings = Math.round(monthlyBill * 0.74);
  const annualSavings = estimatedSavings * 12;
  const paybackYears = (monthlyBill * 24 / (estimatedSavings * 12)).toFixed(1);

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
                  href="#calculator"
                  className="inline-flex h-13 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  <span>Calculate Solar Savings</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── SAVINGS CALCULATOR SECTION ── */}
        <section id="calculator" className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Return on Investment
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-5xl">
                Estimate Your Solar Financial Payback
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Solar in Nepal is one of the highest-yielding capital investments available. Cut electricity bills by up to 74% and enjoy guaranteed power during load shedding.
              </p>

              <div className="mt-8 surface-card p-6 rounded-2xl border border-white/10 space-y-6">
                <div>
                  <div className="flex items-center justify-between text-sm font-bold mb-2">
                    <span>Average Monthly Electricity Bill (NPR)</span>
                    <span className="text-primary font-mono text-base">NPR {monthlyBill.toLocaleString()}</span>
                  </div>
                  <Input
                    type="range"
                    min={3000}
                    max={150000}
                    step={1000}
                    value={monthlyBill}
                    onChange={(e) => setMonthlyBill(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>NPR 3,000</span>
                    <span>NPR 75,000</span>
                    <span>NPR 150,000+</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div className="p-3 bg-leaf-tint rounded-xl text-center">
                    <div className="text-xs font-semibold text-muted-foreground">Monthly Savings</div>
                    <div className="font-display text-lg font-bold text-primary mt-1">
                      NPR {estimatedSavings.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-leaf-tint rounded-xl text-center">
                    <div className="text-xs font-semibold text-muted-foreground">Annual Savings</div>
                    <div className="font-display text-lg font-bold text-primary mt-1">
                      NPR {annualSavings.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-leaf-tint rounded-xl text-center">
                    <div className="text-xs font-semibold text-muted-foreground">Est. Payback</div>
                    <div className="font-display text-lg font-bold text-primary mt-1">
                      ~{paybackYears} Years
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <img
                  src={projectImg}
                  alt="Solar Panel Installation Nepal"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="size-5" />
                    <span>25-Year Performance Warranty Included</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-white">
                    Commercial & Industrial Solar EPC
                  </h3>
                  <p className="mt-1 text-xs text-white/70">
                    Engineered to meet Nepal Electricity Authority (NEA) grid interconnection and net-metering technical standards.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── SOLUTIONS SPECTRUM ── */}
        <section className="bg-mist py-20">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                Our Specialized Solar Services
              </h2>
              <p className="mt-3 text-muted-foreground text-sm">
                Comprehensive engineering for residential homes, commercial complexes, remote resorts, and municipal infrastructure across Nepal.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Residential Rooftop Systems",
                  desc: "Complete 3 kW to 15 kW solar rooftop setups with intelligent hybrid inverter auto-switch and LiFePO4 battery back-up.",
                  icon: Sun,
                  specs: ["Zero Load Shedding", "NEA Net Metering", "Mobile Monitoring App"],
                },
                {
                  title: "Commercial & Industrial EPC",
                  desc: "50 kW to 1 MW+ turnkey solar power plants designed for factories, schools, hotels, and hospitals to cut diesel generator costs.",
                  icon: Cpu,
                  specs: ["Peak Shaving", "Rapid ROI (< 4 Years)", "Heavy Duty Switchgear"],
                },
                {
                  title: "Off-Grid & Resort Microgrids",
                  desc: "Autonomous solar & lithium storage stations designed for high-altitude lodges, telecom towers, and off-grid Himalayan communities.",
                  icon: BatteryCharging,
                  specs: ["Sub-Zero Battery Insulation", "100% Diesel Replacement", "Remote Telemetry"],
                },
                {
                  title: "NEA Net-Metering Approvals",
                  desc: "End-to-end paperwork, grid-impact study, bi-directional meter installation, and formal commissioning with Nepal Electricity Authority.",
                  icon: FileCheck,
                  specs: ["Sanctioned Load Study", "Technical Single-Line Diagrams", "NEA Inspection Support"],
                },
                {
                  title: "Solar Water Pumping",
                  desc: "High-flow solar powered water lifting for agricultural irrigation and mountain village drinking water supply projects.",
                  icon: Gauge,
                  specs: ["Direct MPPT Pump Drives", "Zero Fuel Expenses", "Automatic Water Level Control"],
                },
                {
                  title: "Smart Solar Street Lighting",
                  desc: "All-in-one smart LED solar streetlights with motion sensors, dusk-to-dawn controllers, and rugged IP67 weather sealing.",
                  icon: Lightbulb,
                  specs: ["Lithium Iron Phosphate Battery", "50,000+ Hour LED Life", "Zero Grid Wiring"],
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 70}>
                  <div className="surface-card hover-lift p-7 h-full flex flex-col justify-between border border-white/10 rounded-2xl">
                    <div>
                      <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-400 grid place-items-center mb-5">
                        <item.icon className="size-6" />
                      </div>
                      <h3 className="font-display text-xl font-bold">{item.title}</h3>
                      <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>

                    <ul className="mt-6 pt-4 border-t border-white/10 space-y-2">
                      {item.specs.map((s) => (
                        <li key={s} className="flex items-center gap-2 text-xs font-semibold text-white/80">
                          <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
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

        {/* ── 5-STEP ENGINEERING WORKFLOW ── */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Proven Execution Process
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              5 Steps from Site Survey to Clean Power
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { num: "01", title: "Site & Load Survey", desc: "Our engineers analyze shadow angles, roof structural integrity, and hourly power usage." },
              { num: "02", title: "3D System Design", desc: "We model 3D solar yield forecasts, cable sizing, and protective switchgear layouts." },
              { num: "03", title: "Tier-1 Sourcing", desc: "Only IEC & TÜV certified panels, hybrid inverters, and pure copper cables dispatched." },
              { num: "04", title: "Installation & NEA", desc: "Certified electricians perform mounting, wiring, testing, and NEA net-meter sync." },
              { num: "05", title: "25-Yr Maintenance", desc: "Remote cloud monitoring, annual health checks, and prompt local technician dispatch." },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <div className="relative p-6 rounded-2xl bg-card border border-white/10 h-full flex flex-col justify-between">
                  <div>
                    <span className="font-display text-3xl font-extrabold text-emerald-400/30">{step.num}</span>
                    <h3 className="mt-3 font-display text-base font-bold">{step.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CONSULTATION CTA ── */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061e15] to-[#0a3324] p-10 sm:p-16 border border-emerald-500/30 text-white shadow-2xl text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold">
              Ready to Power Your Property with Solar?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm text-white/70">
              Get a free technical consultation and customized solar quotation from OMSUN's senior engineering team in Nepal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 text-sm"
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
