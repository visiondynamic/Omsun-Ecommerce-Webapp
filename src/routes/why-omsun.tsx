import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  FileCheck2,
  Gauge,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import projectImg from "@/assets/project-nepal.jpg";

export const Route = createFileRoute("/why-omsun")({
  head: () => ({
    meta: [
      { title: "Why Choose OMSUN Nepal | Solar & Electrical Engineering" },
      {
        name: "description",
        content:
          "Discover why engineers, industries, and commercial developers specify OMSUN Nepal — Tier-1 certified equipment, licensed in-house EPC team, 48-hour local dispatch, and 25-year performance warranties.",
      },
    ],
  }),
  component: WhyOmsunPage,
});

function WhyOmsunPage() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      <Navbar />

      <main className="pt-24">
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden bg-[#051711] py-20 text-white">
          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="size-4" />
                <span>The OMSUN Engineering Difference</span>
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold sm:text-6xl leading-tight">
                Why Engineers & Industry Leaders Specify OMSUN
              </h1>

              <p className="mt-5 text-lg text-white/70 leading-relaxed">
                In an market flooded with unverified components and grey-market imports, OMSUN Nepal guarantees 100% Tier-1 certified equipment, in-house EPC engineering, and local warehouse stocking.
              </p>
            </Reveal>

            {/* Core Values Strip */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/10 pt-8">
              {[
                { title: "Tier-1 Sourced Only", sub: "IEC, TÜV & NS Approved" },
                { title: "In-House Licensed EPC", sub: "No Freelance Sub-Contracting" },
                { title: "25-Yr Performance Warranty", sub: "Serialised Warranty Cards" },
                { title: "48-Hour Local Dispatch", sub: "Kathmandu Central Warehouse" },
              ].map((v) => (
                <div key={v.title} className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="font-display text-sm font-bold text-emerald-400">{v.title}</div>
                  <div className="mt-1 text-[11px] text-white/60 font-medium">{v.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4 PILLARS OF EXCELLENCE ── */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Our Core Pillars
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-5xl">
              Engineered for Reliability in Himalayan Conditions
            </h2>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Certified Supply Chain",
                desc: "Every solar panel, hybrid inverter, cable, and breaker in our catalog carries verifiable IEC, TÜV, and NS test certification documentation.",
              },
              {
                icon: Wrench,
                title: "In-House Licensed EPC",
                desc: "We do not outsource installation. Certified Nepal Electrical Association engineers handle shadow modeling, cabling math, and NEA net-metering.",
              },
              {
                icon: Gauge,
                title: "Cloud Telemetry & Yield Data",
                desc: "Every solar system we install includes real-time remote cloud telemetry, allowing our engineers to diagnose performance anomalies instantly.",
              },
              {
                icon: Truck,
                title: "Stocked Central Warehouse",
                desc: "Our Kathmandu warehouse maintains millions in backup stock of panels, inverters, LiFePO4 batteries, and switchgear for fast 48-hour delivery.",
              },
            ].map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 80}>
                <div className="surface-card hover-lift p-8 rounded-2xl border border-white/10 h-full flex flex-col justify-between">
                  <div>
                    <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-400 grid place-items-center mb-6">
                      <pillar.icon className="size-7" />
                    </div>
                    <h3 className="font-display text-xl font-bold">{pillar.title}</h3>
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── COMPARISON TABLE: OMSUN VS ORDINARY VENDORS ── */}
        <section className="bg-mist py-20">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Uncompromising Standard
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
                OMSUN Nepal vs Uncertified Vendors
              </h2>
            </Reveal>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-white/10 rounded-2xl overflow-hidden surface-card">
                <thead>
                  <tr className="border-b border-white/15 bg-card">
                    <th className="p-5 text-sm font-bold">Feature / Standard</th>
                    <th className="p-5 text-sm font-bold text-emerald-400 bg-emerald-500/10">
                      OMSUN Nepal Standard
                    </th>
                    <th className="p-5 text-sm font-bold text-muted-foreground">
                      Ordinary Retail Vendors
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs font-medium">
                  {[
                    {
                      f: "Equipment Certification",
                      omsun: "IEC, TÜV & NS-Compliant Tier-1 Brands Only",
                      vendor: "Unverified Grey-Market Imports",
                    },
                    {
                      f: "Engineering & Installation",
                      omsun: "Licensed In-House Electrical Engineers",
                      vendor: "Hired Daily Wage Subcontractors",
                    },
                    {
                      f: "Warranty Coverage",
                      omsun: "25-Yr Serialised Performance Warranty Card",
                      vendor: "Verbal or 1-Year Vendor Promise",
                    },
                    {
                      f: "Spare Parts Availability",
                      omsun: "Full Spare Stock in Kathmandu Warehouse",
                      vendor: "Weeks of Waiting for Overseas Shipment",
                    },
                    {
                      f: "NEA Net Metering Paperwork",
                      omsun: "100% End-to-End Approval Handling",
                      vendor: "Customer Must Navigate NEA Alone",
                    },
                    {
                      f: "Remote Plant Telemetry",
                      omsun: "Real-time Mobile Monitoring & Alerting",
                      vendor: "None",
                    },
                  ].map((row) => (
                    <tr key={row.f} className="hover:bg-white/5 transition-colors">
                      <td className="p-5 font-bold">{row.f}</td>
                      <td className="p-5 text-emerald-300 font-semibold bg-emerald-500/5 flex items-center gap-2">
                        <Check className="size-4 text-emerald-400 shrink-0" />
                        <span>{row.omsun}</span>
                      </td>
                      <td className="p-5 text-muted-foreground flex items-center gap-2">
                        <X className="size-4 text-red-400 shrink-0" />
                        <span>{row.vendor}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION ── */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061e15] to-[#0a3324] p-10 sm:p-16 border border-emerald-500/30 text-white shadow-2xl text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold">
              Partner with Nepal's Trusted Solar Engineers
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm text-white/70">
              Browse our complete catalog of certified solar panels, hybrid inverters, energy storage, cables, and switchgear.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 text-sm"
              >
                <Link to="/shop">Visit Online Shop</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/20 bg-white/10 text-white font-bold px-8 text-sm hover:bg-white/20"
              >
                <Link to="/solar-solutions">View Solar Solutions</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
