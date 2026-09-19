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
  X,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

import projectImg from "@/assets/project-nepal.webp";
import heroImg from "@/assets/banner-rooftop.webp";
import solarFarmImg from "@/assets/banner-solar-farm.webp";
import storageImg from "@/assets/banner-storage.webp";
import bannerNepal from "@/assets/banner-nepal.webp";
import heroProjectsBg from "@/assets/hero-projects-bg.webp";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Featured Projects & Case Studies | OMSUN Nepal" },
      {
        name: "description",
        content:
          "Explore completed solar EPC and electrical engineering projects across Nepal — industrial rooftops, Himalayan off-grid microgrids, commercial complexes, and municipal lighting.",
      },
    ],
  }),
  component: ProjectsPage,
});

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  location: string;
  capacity: string;
  year: string;
  impact: string;
  image: string;
  details: string;
  specs: string[];
  equipment: string[];
}

const projectsList: ProjectItem[] = [
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
    specs: ["320 kWp Peak Capacity", "3.2 Years Payback", "NEA Bi-Directional Net-Metering"],
    equipment: [
      "580W N-Type Bifacial Modules",
      "Commercial 100kW String Inverters",
      "Heavy Duty MCCB Switchgear",
    ],
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
    specs: ["100% Autonomous", "Sub-Zero Rated Enclosure", "2.8 Years Payback"],
    equipment: [
      "High-Altitude Monocrystalline Panels",
      "Isolated Pure Sine Wave Inverters",
      "LiFePO4 120kWh Rack Enclosure",
    ],
  },
  {
    id: 3,
    title: "Municipal Smart Solar LED Streetlight Project",
    category: "Public Infrastructure",
    location: "Pokhara Metropolitan City",
    capacity: "2,400 Smart LED Solar Luminaires",
    year: "2025",
    impact: "Zero City Grid Electricity Consumption",
    image: solarFarmImg,
    details:
      "All-in-one IP67 smart solar streetlights equipped with microwave motion radar, Lithium Iron Phosphate batteries, and automated dusk-to-dawn dimming profiles.",
    specs: ["IP67 Weather Sealed", "50,000+ Hr LED Lifespan", "Microwave Radar Control"],
    equipment: [
      "Bridgelux LED Luminaires",
      "Integrated Top Solar Module",
      "Lithium Iron Phosphate Packs",
    ],
  },
  {
    id: 4,
    title: "Private Hospital Emergency Solar Backup",
    category: "Healthcare & Critical Power",
    location: "Kathmandu Valley • Tertiary Hospital",
    capacity: "150 kW Solar + 200 kWh Hybrid UPS",
    year: "2025",
    impact: "0ms Seamless Transfer for ICU & Operating Theaters",
    image: storageImg,
    details:
      "Dual hybrid inverter configuration running parallel online double-conversion backup for critical medical equipment during central grid outages.",
    specs: ["0ms Seamless Switchover", "Dual Redundant Inverters", "24/7 Remote Monitoring"],
    equipment: [
      "Tier-1 Solar Panels",
      "Medical Grade Hybrid Inverters",
      "Online UPS LiFePO4 Racks",
    ],
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
    specs: ["Battery-less MPPT Drive", "Zero Fuel Bills", "Automated River Water Lift"],
    equipment: [
      "Multi-Stage Submersible Solar Pump",
      "Dynamic MPPT VFD Inverter",
      "Galvanized Racks",
    ],
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
    specs: ["11 kV Substation Standard", "Motorized ACB Breakers", "SPD Protection Device"],
    equipment: [
      "1250A Industrial Main Panelboard",
      "Digital Power Quality Metering",
      "HT Vacuum Circuit Breaker",
    ],
  },
];

function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const categories = [
    "All",
    "Industrial Solar EPC",
    "Off-Grid Lithium Storage",
    "Public Infrastructure",
    "Healthcare & Critical Power",
    "Agricultural Solar",
  ];

  const filteredProjects =
    filter === "All" ? projectsList : projectsList.filter((p) => p.category === filter);

  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      <Navbar />

      <main>
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden bg-[#041a12] pt-28 pb-20 lg:pt-36 lg:pb-24 text-white border-b border-white/10">
          <img
            src={heroProjectsBg}
            alt="OMSUN Projects Nepal"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center pointer-events-none opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03150e]/90 via-[#03150e]/70 to-[#03150e]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03150e]/40 via-transparent to-[#041a12]" />

          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Globe2 className="size-4" />
                <span>Nationwide Proven Track Record</span>
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold sm:text-6xl leading-tight text-white">
                Our Engineering Projects Across Nepal
              </h1>

              <p className="mt-5 text-lg text-emerald-100/80 leading-relaxed font-normal">
                Explore our portfolio of solar, backup power, and energy engineering installations
                across Nepal — from Himalayan lodge microgrids to mega industrial factories in
                Biratnagar.
              </p>
            </Reveal>
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filter === cat
                      ? "bg-[#03C987] text-black font-extrabold shadow-lg shadow-[#03C987]/30 scale-105"
                      : "border border-slate-200 dark:border-white/10 bg-card text-muted-foreground hover:text-foreground hover:border-[#03C987]/40"
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
                <div
                  onClick={() => setActiveProject(p)}
                  className="group hover-lift cursor-pointer overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-card shadow-xl h-full flex flex-col justify-between hover:border-[#03C987]/50 transition-all"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-[#03C987] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-black">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-1 font-bold">
                          <MapPin className="size-3.5 text-[#03C987]" />
                          {p.location}
                        </span>
                        <span className="font-mono font-bold text-[#03C987]">{p.year}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-extrabold leading-snug group-hover:text-[#03C987] transition-colors text-foreground">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-medium">
                        {p.details}
                      </p>
                    </div>
                  </div>

                  {/* Impact Footer */}
                  <div className="p-6 pt-0 border-t border-slate-100 dark:border-white/10 mt-4">
                    <div className="pt-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-[#03C987]">
                        <Zap className="size-4 shrink-0 text-[#03C987]" />
                        <span>{p.capacity}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#03C987] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PROJECT INQUIRY CTA ── */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041a12] via-[#073d2c] to-[#041a12] p-10 sm:p-16 border border-[#03C987]/30 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
                Have a Custom Energy Project in Mind?
              </h2>
              <p className="mt-3 text-sm text-emerald-100/80 leading-relaxed font-medium">
                Our licensed electrical engineers provide full feasibility reports, single-line
                diagrams, and turnkey EPC proposals for commercial & industrial clients across
                Nepal.
              </p>
            </div>
            <Button
              asChild
              className="h-13 rounded-2xl bg-[#03C987] hover:bg-[#02b377] text-black font-extrabold px-8 text-sm shrink-0 shadow-xl cursor-pointer"
            >
              <Link to="/solar-solutions">Request Engineering Survey</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* ── INTERACTIVE PROJECT DETAIL MODAL ── */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/30 bg-card p-6 sm:p-8 text-foreground shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="size-5 text-muted-foreground" />
            </button>

            <div className="relative h-60 rounded-2xl overflow-hidden mb-6">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  {activeProject.category} • Commissioned {activeProject.year}
                </span>
                <h3 className="font-display text-2xl font-extrabold text-white mt-1">
                  {activeProject.title}
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
                  Project Overview
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {activeProject.details}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Award className="size-4" />
                  <span>Verified Operational Impact</span>
                </div>
                <div className="font-display font-extrabold text-foreground text-sm">
                  {activeProject.impact}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Layers className="size-3.5 text-emerald-500" />
                    <span>Technical Specs</span>
                  </div>
                  <ul className="space-y-1 text-xs font-semibold text-foreground">
                    {activeProject.specs.map((s) => (
                      <li key={s} className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-teal-500" />
                    <span>Hardware Specified</span>
                  </div>
                  <ul className="space-y-1 text-xs font-semibold text-foreground">
                    {activeProject.equipment.map((eq) => (
                      <li key={eq} className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-teal-500 shrink-0" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  onClick={() => setActiveProject(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  Close Detail
                </Button>
                <Button
                  asChild
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-black text-xs"
                >
                  <Link to="/solar-solutions">Request Similar Installation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
