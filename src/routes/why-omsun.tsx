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
  FileText,
  BadgeCheck,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import projectImg from "@/assets/project-nepal.webp";
import solarFarmImg from "@/assets/banner-solar-farm.webp";
import heroWhyOmsunBg from "@/assets/hero-why-omsun-bg.webp";

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

      <main>
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden bg-[#041a12] pt-28 pb-20 lg:pt-36 lg:pb-24 text-white border-b border-white/10">
          <img
            src={heroWhyOmsunBg}
            alt="Why OMSUN Nepal - Engineering Difference"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center pointer-events-none opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03150e]/90 via-[#03150e]/70 to-[#03150e]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03150e]/40 via-transparent to-[#041a12]" />

          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <ShieldCheck className="size-4" />
                <span>The OMSUN Engineering Difference</span>
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold sm:text-6xl leading-tight text-white">
                Why Engineers & Industry Leaders Specify OMSUN
              </h1>

              <p className="mt-5 text-lg text-emerald-100/80 leading-relaxed font-normal">
                In a market flooded with unverified components and grey-market imports, OMSUN Nepal
                guarantees 100% Tier-1 certified equipment, in-house EPC engineering, and local
                warehouse stocking.
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
                <div
                  key={v.title}
                  className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white"
                >
                  <div className="font-display text-sm font-bold text-emerald-400">{v.title}</div>
                  <div className="mt-1 text-[11px] text-white/60 font-medium">{v.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4 PILLARS OF EXCELLENCE ── */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#03C987]">
              Our Core Pillars
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-5xl text-foreground">
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
                <div className="hover-lift p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-card shadow-xl h-full flex flex-col justify-between hover:border-[#03C987]/50 transition-all">
                  <div>
                    <div className="size-14 rounded-2xl bg-[#03C987]/15 text-[#03C987] grid place-items-center mb-6">
                      <pillar.icon className="size-7" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CERTIFICATIONS & COMPLIANCE SHOWCASE (SIGNATURE LIGHT LEAF MINT SECTION 🌿) ── */}
        <section className="bg-gradient-to-r from-[#E5F7EF] via-[#F2FBF6] to-[#EFF8FF] py-24 text-[#173226] border-y border-[#43B987]/30">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#03C987]">
                Verified Global Standards
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl text-[#173226]">
                Engineering Certifications & Compliance
              </h2>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "IEC 61215 / 61730",
                  label: "Solar Module Photovoltaic Standard",
                  sub: "PID Resistance & Hail Testing",
                },
                {
                  name: "TÜV Rheinland",
                  label: "German Quality Certification",
                  sub: "Double Insulated Solar DC Cable",
                },
                {
                  name: "Nepal Standard (NS)",
                  label: "Government Quality Mark",
                  sub: "Nepal Bureau of Standards",
                },
                {
                  name: "NEA Interconnection",
                  label: "NEA Net-Metering Standard",
                  sub: "Bi-Directional Grid Synchronization",
                },
              ].map((cert) => (
                <div
                  key={cert.name}
                  className="p-6 rounded-3xl border border-[#43B987]/30 bg-white shadow-lg"
                >
                  <BadgeCheck className="size-8 text-[#03C987] mb-4" />
                  <div className="font-display text-lg font-extrabold text-[#173226]">
                    {cert.name}
                  </div>
                  <div className="mt-1 text-xs font-bold text-[#03C987]">{cert.label}</div>
                  <div className="mt-1 text-[11px] text-[#475569] font-medium">{cert.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE: OMSUN VS ORDINARY VENDORS ── */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#03C987]">
                Uncompromising Standard
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl text-foreground">
                OMSUN Nepal vs Uncertified Vendors
              </h2>
            </Reveal>

            <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-card shadow-xl">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Feature / Standard
                    </th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#03C987] bg-[#03C987]/10">
                      OMSUN Nepal Standard
                    </th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Ordinary Retail Vendors
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-xs font-medium">
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
                    <tr
                      key={row.f}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="p-5 font-bold text-foreground">{row.f}</td>
                      <td className="p-5 text-[#03C987] font-semibold bg-[#03C987]/5 flex items-center gap-2">
                        <Check className="size-4 text-[#03C987] shrink-0" />
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
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041a12] via-[#073d2c] to-[#041a12] p-10 sm:p-16 border border-[#03C987]/30 text-white shadow-2xl text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
              Partner with Nepal's Trusted Solar Engineers
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm text-emerald-100/80 leading-relaxed font-medium">
              Browse our complete catalog of certified solar panels, hybrid inverters, energy
              storage, cables, and switchgear.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="h-13 rounded-2xl bg-[#03C987] hover:bg-[#02b377] text-black font-extrabold px-8 text-sm shadow-xl cursor-pointer"
              >
                <Link to="/shop">Visit Online Shop</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-13 rounded-2xl border-white/25 bg-white/10 text-white font-bold px-8 text-sm hover:bg-white/20 backdrop-blur-md"
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
