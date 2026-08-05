import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Factory,
  Globe2,
  Hotel,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import projectImg from "@/assets/project-nepal.jpg";
import heroImg from "@/assets/banner-rooftop.png";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Featured Projects & Case Studies | OMSUN Nepal" },
      {
        name: "description",
        content:
          "Explore 4,200+ completed solar EPC and electrical projects across Nepal — industrial rooftops, Himalayan off-grid microgrids, commercial complexes, and municipal lighting.",
      },
    ],
  }),
  component: ProjectsPage,
});

const projectsList = [
  {
    id: 1,
    title: "320 kW Commercial Industrial Rooftop",
    category: "Industrial Solar EPC",
    location: "Bhaktapur • Textile & Garments Factory",
    capacity: "320 kWp Solar + 500 kVA Switchgear",
    year: "2026",
    impact: "74% Electricity Bill Reduction (~NPR 48 Lakhs/Year)",
    image: projectImg,
    details:
      "Engineered with 580W N-Type bifacial solar panels and 3x 100kW string inverters. Integrated with factory main distribution panel and NEA bi-directional net-metering system.",
  },
  {
    id: 2,
    title: "High-Altitude Resort Off-Grid Microgrid",
    category: "Off-Grid Lithium Storage",
    location: "Khumbu Valley • High-Altitude Hospitality",
    capacity: "45 kWp Solar + 120 kWh LiFePO4 Battery",
    year: "2025",
    impact: "100% Diesel Generator Displacement (Sub-Zero Operating)",
    image: heroImg,
    details:
      "Powers 6 luxury eco-lodges with zero noise, zero emissions, and automated thermal battery heating enclosures for sub-zero Himalayan winters.",
  },
  {
    id: 3,
    title: "Municipal Smart Solar LED Streetlight Project",
    category: "Public Infrastructure",
    location: "Pokhara Metropolitan City",
    capacity: "2,400 Smart LED Solar Luminaires",
    year: "2025",
    impact: "Zero City Grid Electricity Consumption",
    image: projectImg,
    details:
      "All-in-one IP67 smart solar streetlights equipped with microwave motion radar, Lithium Iron Phosphate batteries, and automated dusk-to-dawn dimming profiles.",
  },
  {
    id: 4,
    title: "Private Hospital Emergency Solar Backup",
    category: "Healthcare & Critical Power",
    location: "Kathmandu Valley • Tertiary Hospital",
    capacity: "150 kW Solar + 200 kWh Hybrid UPS",
    year: "2025",
    impact: "0ms Seamless Transfer for ICU & Operating Theaters",
    image: heroImg,
    details:
      "Dual hybrid inverter configuration running parallel online double-conversion backup for critical medical equipment during central grid outages.",
  },
  {
    id: 5,
    title: "Tea Estate Solar Pumping & Irrigation",
    category: "Agricultural Solar",
    location: "Ilam • Commercial Plantation",
    capacity: "60 kW Solar Drive Pumping",
    year: "2024",
    impact: "350,000 Liters Daily Water Lifted from River Bed",
    image: projectImg,
    details:
      "Direct solar MPPT pump controller driving multi-stage high-head water pumps without batteries or diesel engines.",
  },
  {
    id: 6,
    title: "Industrial Substation & Switchgear Upgrade",
    category: "Electrical Switchgear",
    location: "Biratnagar Industrial Corridor",
    capacity: "11 kV Substation + 1250A Main Panel",
    year: "2024",
    impact: "Zero Unplanned Factory Downtime & Overload Faults",
    image: heroImg,
    details:
      "Designed and commissioned custom LT/HT switchgear panels with motorized air circuit breakers, surge protection devices, and digital power analyzers.",
  },
];

function ProjectsPage() {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Industrial Solar EPC", "Off-Grid Lithium Storage", "Public Infrastructure", "Healthcare & Critical Power"];

  const filteredProjects =
    filter === "All"
      ? projectsList
      : projectsList.filter((p) => p.category === filter);

  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      <Navbar />

      <main className="pt-24">
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden bg-[#051711] py-20 text-white">
          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Globe2 className="size-4" />
                <span>Nationwide Proven Track Record</span>
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold sm:text-6xl leading-tight">
                Our Engineering Projects Across Nepal
              </h1>

              <p className="mt-5 text-lg text-white/70 leading-relaxed">
                Over 18 MW+ of solar capacity installed across 4,200+ projects in all 77 districts. From Himalayan lodge microgrids to mega industrial factories in Biratnagar.
              </p>
            </Reveal>

            {/* Quick Metrics Bar */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/10 pt-8">
              {[
                { v: "18 MW+", l: "Solar Power Installed" },
                { v: "4,200+", l: "Projects Executed" },
                { v: "77", l: "Districts Covered" },
                { v: "99.8%", l: "System Uptime Rate" },
              ].map((m) => (
                <div key={m.l}>
                  <div className="font-display text-3xl font-extrabold text-emerald-400">{m.v}</div>
                  <div className="mt-1 text-xs text-white/60 font-medium">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FILTER & PROJECTS GRID ── */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === cat
                      ? "bg-emerald-500 text-black shadow-lg"
                      : "bg-surface-card border border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Showing {filteredProjects.length} Projects
            </div>
          </div>

          {/* Projects Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <div className="group surface-card hover-lift overflow-hidden rounded-2xl border border-white/10 h-full flex flex-col justify-between">
                  <div>
                    {/* Image Header */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="size-3.5 text-emerald-400" />
                          {p.location}
                        </span>
                        <span className="font-mono font-bold text-emerald-300">{p.year}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold leading-snug group-hover:text-emerald-400 transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                        {p.details}
                      </p>
                    </div>
                  </div>

                  {/* Impact Footer */}
                  <div className="p-6 pt-0 border-t border-white/10 mt-4">
                    <div className="pt-4">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Capacity & Impact
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Zap className="size-4 shrink-0" />
                        <span>{p.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PROJECT INQUIRY CTA ── */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-card border border-white/15 p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                Have a Custom Energy Project in Mind?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Our licensed electrical engineers provide full feasibility reports, single-line diagrams, and turnkey EPC proposals for commercial & industrial clients.
              </p>
            </div>
            <Button
              asChild
              className="h-13 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 text-sm shrink-0"
            >
              <Link to="/shop">Request Project Proposal</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
