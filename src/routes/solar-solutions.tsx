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
  Calculator,
  Sliders,
  Sparkles,
  Building2,
  Factory,
  Hotel,
  HelpCircle,
  PhoneCall,
  Check,
  X,
  Zap,
  MapPin,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Layers,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import projectImg from "@/assets/project-nepal.webp";
import heroImg from "@/assets/banner-solar-farm.webp";
import rooftopImg from "@/assets/banner-rooftop.webp";
import storageImg from "@/assets/banner-storage.webp";
import inverterImg from "@/assets/banner-inverter.webp";
import heroSolutionsBg from "@/assets/hero-solutions-bg.webp";

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

/* ─── DATA & CONSTANTS ─── */

const solarVerticals = [
  {
    id: "residential",
    category: "Residential Solar",
    title: "Residential Rooftop Solar Systems",
    shortDesc: "3 kW to 15 kW intelligent rooftop solar setups with Lithium back-up.",
    fullDesc:
      "Designed specifically for Nepali households to eliminate load shedding, cut monthly NEA electricity bills by up to 80%, and automatically export excess solar energy back to the grid via NEA net-metering.",
    icon: Sun,
    color: "#03C987",
    image: rooftopImg,
    specs: ["3kW – 15kW Capacity", "LiFePO4 Storage", "NEA Net-Metering Ready"],
    hardware: [
      "580W+ N-Type Bifacial Solar Modules",
      "Smart Hybrid String Inverter",
      "Wall-Mount LiFePO4 Battery (5kWh – 15kWh)",
      "Double-Insulated TÜV Copper Solar Cables",
      "DC/AC Surge Protection & Breakers",
    ],
    targetApps: "Independent Homes, Villas, Duplexes, Apartments in Kathmandu & Valley cities",
  },
  {
    id: "commercial",
    category: "Commercial & Industrial",
    title: "Commercial & Industrial Solar EPC",
    shortDesc: "50 kW to 1 MW+ turnkey solar power plants for factories & businesses.",
    fullDesc:
      "High-yield industrial solar infrastructure that slashes daytime operational electricity expenses by up to 74%, replaces expensive diesel generator runtime, and delivers full financial payback in under 4 years.",
    icon: Cpu,
    color: "#03C987",
    image: heroImg,
    specs: ["50kW – 1MW+ Capacity", "Peak Load Shaving", "Rapid ROI (< 4 Years)"],
    hardware: [
      "Tier-1 Mono-PERC / Bifacial Modules",
      "High-Capacity Commercial String Inverters",
      "Custom Steel Structural Mounting Framework",
      "Industrial Heavy-Duty Switchgear & MCCB Panels",
      "24/7 Cloud Remote IoT Telemetry Portal",
    ],
    targetApps: "Manufacturing Plants, Textile Mills, Cold Storages, Schools, Private Hospitals",
  },
  {
    id: "offgrid",
    category: "Off-Grid Energy",
    title: "Off-Grid & Resort Microgrids",
    shortDesc: "Autonomous solar & lithium storage for remote Himalayan locations.",
    fullDesc:
      "Engineered for sub-zero temperature resilience in remote mountain terrains where grid power is unavailable. Operates 100% autonomously with heated LiFePO4 battery enclosures.",
    icon: BatteryCharging,
    color: "#03C987",
    image: storageImg,
    specs: ["100% Diesel Free", "Sub-Zero Thermal Storage", "High-Altitude Certified"],
    hardware: [
      "High-Efficiency Monocrystalline Panels",
      "Isolated Off-Grid Pure Sine-Wave Inverters",
      "Rack-Mounted Heavy Duty LiFePO4 Batteries",
      "Automated Generator Auto-Start Controller",
      "Sub-Zero Thermal Battery Enclosure",
    ],
    targetApps:
      "High-Altitude Trekking Lodges, Telecom Towers, Hydropower Field Offices, Army Outposts",
  },
  {
    id: "netmetering",
    category: "Grid Interconnection",
    title: "NEA Net-Metering Approvals",
    shortDesc: "Complete grid-tie paperwork, engineering diagrams & NEA approval.",
    fullDesc:
      "OMSUN handles the entire regulatory spectrum with Nepal Electricity Authority (NEA). From grid impact studies and single-line diagrams to bi-directional meter setup and commissioning.",
    icon: FileCheck,
    color: "#03C987",
    image: projectImg,
    specs: ["Sanctioned Load Study", "Technical SLD Diagrams", "NEA Inspection Support"],
    hardware: [
      "Bi-Directional Smart Net Meter",
      "Anti-Islanding Protection Relays",
      "NEA Standard Grid Isolator Switches",
      "Calibrated Current Transformers (CTs)",
      "Grid Protection Protocol Documentation",
    ],
    targetApps: "Commercial Rooftops, Grid-Connected Residential Solar, School & Office Buildings",
  },
  {
    id: "pumping",
    category: "Agriculture & Water",
    title: "Solar Water Pumping Systems",
    shortDesc: "Direct MPPT solar lifting for irrigation & mountain water supply.",
    fullDesc:
      "Battery-less solar water lifting systems that pump water directly from river beds or deep borewells to elevated farmland and hillside reservoirs with zero fuel expense.",
    icon: Gauge,
    color: "#03C987",
    image: inverterImg,
    specs: ["Direct MPPT Drive", "Zero Fuel Bills", "Automated Flow Control"],
    hardware: [
      "High-Flow Submersible / Surface Solar Pumps",
      "Dynamic MPPT Solar Variable Frequency Drive (VFD)",
      "Heavy-Duty Galvanized Ground Mount Racks",
      "Automatic Tank Level Sensing Controllers",
    ],
    targetApps: "Agricultural Tea Estates, Orange Orchards, Mountain Village Drinking Water Supply",
  },
  {
    id: "lighting",
    category: "Municipal Lighting",
    title: "Smart Solar Street Lighting",
    shortDesc: "All-in-one IP67 LED luminaires for highways, resorts & municipal roads.",
    fullDesc:
      "Autonomous dusk-to-dawn LED lighting solutions with integrated LiFePO4 batteries, radar motion sensors, and zero grid wiring requirements.",
    icon: Lightbulb,
    color: "#03C987",
    image: projectImg,
    specs: ["IP67 Weather Sealed", "Microwave Radar Sensor", "50,000+ Hr LED Lifespan"],
    hardware: [
      "High-Lumen Bridgelux LED Modules",
      "Integrated Monocrystalline Solar Top-Panel",
      "Lithium Iron Phosphate Battery Pack",
      "Octagonal Galvanized Pole & Brackets",
    ],
    targetApps: "Metropolitan Highways, Resort Paths, Hospital Campuses, Industrial Parks",
  },
];

const energyComparison = [
  {
    metric: "Levelized Cost of Energy (LCOE)",
    icon: DollarSign,
    gridOnly: "NPR 11 – 15 / kWh (Rising ~8%/yr)",
    dieselGen: "NPR 38 – 48 / kWh (High Fuel & Oil)",
    omsunSolar: "NPR 3.50 / kWh (Fixed for 25 Years)",
  },
  {
    metric: "Uninterrupted Uptime Guarantee",
    icon: Zap,
    gridOnly: "Subject to load shedding & trips",
    dieselGen: "Manual start / 15-30s lag time",
    omsunSolar: "< 10ms Instant Seamless Switch",
  },
  {
    metric: "Operational Maintenance Cost",
    icon: Wrench,
    gridOnly: "Low (but 100% bill reliance)",
    dieselGen: "Very High (Filters, Oil, Engine Overhauls)",
    omsunSolar: "Near Zero (Periodic Glass Cleaning)",
  },
  {
    metric: "NEA Tariff Export Benefit",
    icon: FileCheck,
    gridOnly: "No (100% Expense)",
    dieselGen: "No (100% Expense)",
    omsunSolar: "Yes (Sell surplus solar energy to NEA)",
  },
  {
    metric: "Environmental & Noise Footprint",
    icon: ShieldCheck,
    gridOnly: "Fossil / Grid mix reliant",
    dieselGen: "High Noise, Toxic Exhaust & Smoke",
    omsunSolar: "100% Silent, Clean & Zero Emissions",
  },
];

const neaRoadmap = [
  {
    step: "01",
    title: "Sanctioned Load & Feasibility Audit",
    desc: "OMSUN engineers analyze your current NEA sanctioned meter capacity, phase configuration (1-Phase / 3-Phase), and roof shadow angles.",
  },
  {
    step: "02",
    title: "Single-Line Diagram (SLD) & Protection Design",
    desc: "We draft formal engineering SLDs complying with NEA technical standards, including anti-islanding safeguards and surge protection.",
  },
  {
    step: "03",
    title: "NEA Board Filing & Meter Approval",
    desc: "Submission of formal interconnection application to local NEA distribution center for net-metering clearance and bi-directional meter allocation.",
  },
  {
    step: "04",
    title: "EPC System Installation & Testing",
    desc: "Certified technicians mount Tier-1 bifacial panels, hybrid inverter, LiFePO4 battery storage, and complete high-voltage AC/DC isolation testing.",
  },
  {
    step: "05",
    title: "NEA Meter Sync & Official Commissioning",
    desc: "NEA engineers conduct joint final inspection, install the bi-directional meter, and activate net-metering billing credits.",
  },
];

const projectCaseStudies = [
  {
    title: "Everest Textiles 320 kW Industrial Rooftop",
    location: "Bhaktapur Industrial Zone",
    capacity: "320 kWp Solar + 500 kVA Switchgear",
    payback: "3.2 Years Payback",
    savings: "NPR 48 Lakhs Saved Annually",
    desc: "Engineered with 580W N-Type bifacial solar panels and 3x 100kW string inverters, synchronized with factory main distribution panel.",
    image: projectImg,
  },
  {
    title: "Khumbu Valley Resort Off-Grid Microgrid",
    location: "Namche Bazaar (3,440m Altitude)",
    capacity: "45 kWp Solar + 120 kWh LiFePO4 Storage",
    payback: "2.8 Years Payback",
    savings: "100% Diesel Displacement",
    desc: "Powers 6 luxury eco-lodges with zero noise, zero emissions, and automated thermal battery heating enclosures for sub-zero Himalayan winters.",
    image: heroImg,
  },
  {
    title: "Pokhara Metropolitan Smart Solar Street Lighting",
    location: "Pokhara Lake Ring Road",
    capacity: "2,400 Smart LED Solar Luminaires",
    payback: "Zero Grid Draw",
    savings: "NPR 28 Lakhs/Yr Electricity Saved",
    desc: "All-in-one IP67 solar streetlights equipped with microwave motion sensors, Lithium Iron Phosphate batteries, and automated dusk-to-dawn dimming.",
    image: rooftopImg,
  },
];

const faqItems = [
  {
    tab: "General",
    q: "How does solar net-metering work with the Nepal Electricity Authority (NEA)?",
    a: "Under NEA net-metering regulations, your rooftop solar plant generates clean electricity during the day. Power first feeds your building loads. Any surplus solar power is exported back to the NEA electrical grid. A bi-directional meter records grid imports and exports. At the end of the billing cycle, NEA offsets your consumption, significantly reducing or neutralizing your monthly electricity bill.",
  },
  {
    tab: "General",
    q: "What happens during monsoon or overcast days in Nepal?",
    a: "Modern Tier-1 N-Type bifacial solar panels continue generating power under diffuse sunlight during cloudy or light rain conditions (typically 25% to 40% of peak rated capacity). When combined with an OMSUN hybrid LiFePO4 battery system, your stored energy automatically seamlessly powers your critical loads during dark rainy stretches.",
  },
  {
    tab: "Batteries & Tech",
    q: "Why does OMSUN recommend LiFePO4 (Lithium Iron Phosphate) batteries over traditional Lead-Acid?",
    a: "LiFePO4 batteries offer 6,000+ deep charge cycles (15+ years lifespan) compared to 800 cycles for lead-acid (2-3 years). They deliver 95% depth of discharge (DoD), zero toxic fumes, zero fluid maintenance, faster charging speeds, and operate safely in extreme hot or sub-zero Himalayan mountain environments.",
  },
  {
    tab: "Batteries & Tech",
    q: "What warranty and guarantees come with an OMSUN solar installation?",
    a: "Every OMSUN solar project includes a 25-Year Linear Power Performance Warranty on Tier-1 Solar Panels, a 10-Year Mechanical Inverter & LiFePO4 Battery Warranty, and a 2-Year Comprehensive Free In-Person Maintenance & Remote Telemetry SLA.",
  },
  {
    tab: "ROI & Commercial",
    q: "What is the typical Return on Investment (ROI) payback period for commercial solar in Nepal?",
    a: "For commercial factories, hotels, and office complexes in Nepal, solar payback typically ranges between 3.2 to 4.5 years. With panel lifespans exceeding 25 years, businesses enjoy 20+ years of virtually free, price-locked electricity.",
  },
  {
    tab: "ROI & Commercial",
    q: "Can OMSUN assist with commercial bank financing for solar projects?",
    a: "Yes! OMSUN provides complete bankable detailed engineering project reports (DPRs), energy yield simulations, and technical documentation required by leading Nepali commercial banks providing green energy loans.",
  },
];

/* ─── MAIN COMPONENT ─── */

function SolarSolutionsPage() {
  // Calculator State
  const [monthlyBill, setMonthlyBill] = useState<number>(25000);
  const [sector, setSector] = useState<"residential" | "commercial" | "industrial" | "offgrid">(
    "residential",
  );
  const [backupType, setBackupType] = useState<"ongrid" | "hybrid" | "offgrid">("hybrid");

  // Filter State for Verticals
  const [selectedVerticalCategory, setSelectedVerticalCategory] = useState<string>("All");

  // Filter State for FAQs
  const [faqTab, setFaqTab] = useState<string>("General");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Modal State for Consultation / Quotation Wizard
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "Kathmandu",
    propertyType: "Residential Home",
    roofArea: "",
    message: "",
  });

  // Calculate Calculator Metrics based on state
  const tariffRate = sector === "residential" ? 11.5 : 14.0;
  const targetMonthlyKwh = monthlyBill / tariffRate;
  const calculatedKwp = Math.max(1.5, Math.round((targetMonthlyKwh / 130) * 10) / 10);
  const calculatedBatteryKwh =
    backupType === "ongrid"
      ? 0
      : Math.round(calculatedKwp * (backupType === "offgrid" ? 2.5 : 1.8));

  // Turnkey Cost Estimations in NPR
  const costPerKwp = backupType === "ongrid" ? 95000 : backupType === "hybrid" ? 145000 : 185000;
  const estimatedInvestment = Math.round(calculatedKwp * costPerKwp);
  const estimatedMonthlySavings = Math.round(monthlyBill * 0.85);
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;
  const paybackYears = Math.max(
    2.5,
    Math.round((estimatedInvestment / estimatedAnnualSavings) * 10) / 10,
  );
  const twentyFiveYrSavingsMillions =
    Math.round(((estimatedAnnualSavings * 25 - estimatedInvestment) / 100000) * 10) / 10;
  const co2OffsetTons = Math.round(calculatedKwp * 1.3 * 10) / 10;
  const equivalentTrees = Math.round(calculatedKwp * 58);

  // Handle Form Submission
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsModalOpen(false);
      setFormData({
        name: "",
        phone: "",
        district: "Kathmandu",
        propertyType: "Residential Home",
        roofArea: "",
        message: "",
      });
    }, 3000);
  };

  const filteredVerticals =
    selectedVerticalCategory === "All"
      ? solarVerticals
      : solarVerticals.filter(
          (v) =>
            v.category.toLowerCase().includes(selectedVerticalCategory.toLowerCase()) ||
            v.title.toLowerCase().includes(selectedVerticalCategory.toLowerCase()),
        );

  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      <Navbar />

      <main>
        {/* ── 1. HERO BANNER & STATS TICKER (CLEAN & HIGH CONTRAST ⚡) ── */}
        <section className="relative overflow-hidden bg-[#041a12] pt-28 pb-20 lg:pt-36 lg:pb-28 text-white border-b border-emerald-500/20">
          {/* Ambient light glows */}
          <div className="pointer-events-none absolute -top-40 left-1/4 size-[650px] rounded-full bg-emerald-500/20 blur-[150px]" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-[600px] rounded-full bg-teal-400/20 blur-[150px]" />
          <div className="pointer-events-none absolute top-10 right-10 size-[300px] rounded-full bg-amber-400/10 blur-[120px]" />

          {/* Background image & gradient overlay */}
          <img
            src={heroSolutionsBg}
            alt="OMSUN Rooftop & Commercial Solar Installation"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center pointer-events-none opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03150e]/90 via-[#03150e]/70 to-[#03150e]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03150e]/40 via-transparent to-[#041a12]" />

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 shadow-md backdrop-blur-md">
                    <Sun className="size-4 text-amber-400 animate-spin-slow" />
                    <span>Turnkey Solar EPC & Engineering Nepal</span>
                  </div>

                  <h1 className="mt-6 font-display text-4xl font-extrabold sm:text-6xl lg:text-6xl leading-[1.15] tracking-tight text-white">
                    Tailored Solar Solutions for Homes & Enterprises in Nepal
                  </h1>

                  <p className="mt-6 text-base sm:text-lg text-emerald-100/80 leading-relaxed max-w-2xl font-medium">
                    From residential rooftop solar systems to high-capacity industrial hybrid plants
                    and remote off-grid microgrids — OMSUN handles design, procurement, NEA
                    net-metering, and lifetime maintenance.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex h-13 items-center gap-2.5 rounded-2xl bg-[#03C987] hover:bg-[#02b377] px-8 text-sm font-extrabold text-black shadow-[0_0_30px_rgba(3,201,135,0.5)] transition-all hover:scale-105 cursor-pointer"
                    >
                      <Calculator className="size-4 text-black" />
                      <span>Schedule Site Assessment</span>
                    </button>

                    <a
                      href="#roi-calculator"
                      className="inline-flex h-13 items-center gap-2.5 rounded-2xl border border-white/25 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-[#03C987]/60"
                    >
                      <span>Calculate Solar ROI</span>
                      <ArrowRight className="size-4 text-[#03C987]" />
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Dynamic Tech Matrix Card */}
              <div className="lg:col-span-5">
                <Reveal delay={150}>
                  <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#062c1e]/95 to-[#031810]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-white/15 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="size-3 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-display text-xs font-bold uppercase tracking-wider text-emerald-300">
                          NEA Grid Tie Standard
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
                        100% Net Metering Ready
                      </span>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition-colors">
                        <ShieldCheck className="size-6 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-white">Tier-1 Equipment Only</div>
                          <div className="text-xs text-white/70">
                            IEC & TÜV Certified N-Type Solar Modules
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition-colors">
                        <Cpu className="size-6 text-teal-300 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-white">
                            Pure Sine Wave Hybrid Storage
                          </div>
                          <div className="text-xs text-white/70">
                            LiFePO4 6,000+ Cycle Wall Racks
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition-colors">
                        <FileCheck className="size-6 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-white">
                            In-House Engineering & NEA Paperwork
                          </div>
                          <div className="text-xs text-white/70">
                            Licensed Electrical Engineers & Installation
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
                      <span>Kathmandu Central Stock</span>
                      <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                        <Zap className="size-3.5" /> 48-Hr Local Dispatch
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/15 pt-8">
              {[
                { label: "Total Solar Capacity", val: "4.2 MW+", sub: "Installed across Nepal" },
                { label: "Completed Projects", val: "4,200+", sub: "Homes, Factories & Resorts" },
                {
                  label: "Max Bill Savings",
                  val: "Up to 74%",
                  sub: "NEA Net-Metering tariff offset",
                },
                { label: "Performance Warranty", val: "25 Years", sub: "Tier-1 Linear Guarantee" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white"
                >
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    {stat.val}
                  </div>
                  <div className="mt-1 text-xs font-bold text-emerald-400">{stat.label}</div>
                  <div className="mt-0.5 text-[11px] text-white/60">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. INTERACTIVE SOLAR SAVINGS & ROI CALCULATOR WIDGET (NEPAL CONTEXT) ── */}
        <section id="roi-calculator" className="mx-auto max-w-7xl px-6 py-24 scroll-mt-24">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
              <Calculator className="size-4" />
              <span>Instant Financial Estimator</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold sm:text-5xl tracking-tight text-foreground">
              Nepal Solar Savings & ROI Calculator
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Estimate your recommended plant capacity (kWp), battery storage (kWh), monthly savings
              (NPR), and payback duration tailored to your property.
            </p>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Input Controls Column */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 sm:p-8 shadow-xl">
              <h3 className="font-display text-xl font-extrabold text-foreground mb-6 flex items-center gap-2">
                <Sliders className="size-5 text-emerald-500" />
                <span>1. Customize Your System Requirements</span>
              </h3>

              {/* Slider for Monthly Bill */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <label className="font-bold text-foreground">
                    Average Monthly Electricity Bill
                  </label>
                  <span className="font-display text-base font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">
                    NPR {monthlyBill.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={250000}
                  step={1000}
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                  <span>NPR 3,000</span>
                  <span>NPR 100,000</span>
                  <span>NPR 250,000+</span>
                </div>
              </div>

              {/* Sector Selection */}
              <div className="mt-8 space-y-3">
                <label className="font-bold text-sm text-foreground">Property Sector</label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {[
                    { id: "residential", label: "Home", icon: Sun },
                    { id: "commercial", label: "Office", icon: Building2 },
                    { id: "industrial", label: "Factory", icon: Factory },
                    { id: "offgrid", label: "Resort", icon: Hotel },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        setSector(
                          item.id as "residential" | "commercial" | "industrial" | "offgrid",
                        )
                      }
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        sector === item.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="size-5 mb-1.5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Backup Need */}
              <div className="mt-8 space-y-3">
                <label className="font-bold text-sm text-foreground">
                  Backup & Battery Requirement
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "ongrid", title: "Grid Tie", sub: "Net Metering Only" },
                    { id: "hybrid", title: "Hybrid", sub: "Grid + Lithium" },
                    { id: "offgrid", title: "Off-Grid", sub: "100% Battery" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBackupType(b.id as "ongrid" | "hybrid" | "offgrid")}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        backupType === b.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10"
                      }`}
                    >
                      <div className="text-xs font-bold">{b.title}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{b.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Calculation Output Column */}
            <div className="lg:col-span-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#05261a] via-[#083b28] to-[#041a12] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-emerald-400/20 blur-3xl" />

              <h3 className="font-display text-xl font-extrabold mb-6 flex items-center gap-2 text-white">
                <Sparkles className="size-5 text-emerald-400" />
                <span>2. Estimated Sizing & Financial Payback</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <div className="text-xs text-white/70 font-semibold">Recommended Plant Size</div>
                  <div className="mt-1 font-display text-3xl font-extrabold text-emerald-400">
                    {calculatedKwp} kWp
                  </div>
                  <div className="mt-1 text-[11px] text-white/60">
                    ~{(calculatedKwp * 75).toFixed(0)} sq. ft roof needed
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <div className="text-xs text-white/70 font-semibold">Recommended Battery</div>
                  <div className="mt-1 font-display text-3xl font-extrabold text-teal-300">
                    {calculatedBatteryKwh > 0 ? `${calculatedBatteryKwh} kWh` : "Grid Tie Only"}
                  </div>
                  <div className="mt-1 text-[11px] text-white/60">LiFePO4 Long Life Wall Rack</div>
                </div>
              </div>

              <div className="mt-4 p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2.5">
                  <span className="text-white/80">Estimated Monthly Bill Savings</span>
                  <span className="font-display font-extrabold text-emerald-400 text-lg">
                    NPR {estimatedMonthlySavings.toLocaleString()} / mo
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2.5">
                  <span className="text-white/80">Estimated System Investment</span>
                  <span className="font-display font-bold text-white">
                    NPR {estimatedInvestment.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2.5">
                  <span className="text-white/80">Payback Period Duration</span>
                  <span className="font-display font-extrabold text-amber-300 text-base">
                    {paybackYears} Years
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm pt-0.5">
                  <span className="text-white/80">25-Year Cumulative Savings</span>
                  <span className="font-display font-extrabold text-emerald-300 text-lg">
                    NPR {twentyFiveYrSavingsMillions} Lakhs
                  </span>
                </div>
              </div>

              {/* Environmental Impact Badges */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">{co2OffsetTons} Tons CO2</span>
                    <span className="text-[10px] text-white/60">Offset per year</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Sun className="size-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">{equivalentTrees} Trees</span>
                    <span className="text-[10px] text-white/60">Planted equivalent</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    message: `Interested in calculated ${calculatedKwp} kWp Solar System (${calculatedBatteryKwh} kWh storage) for monthly bill NPR ${monthlyBill.toLocaleString()}.`,
                  }));
                  setIsModalOpen(true);
                }}
                className="mt-6 w-full py-4 rounded-2xl bg-[#03C987] hover:bg-[#02b377] font-extrabold text-black text-sm shadow-[0_0_25px_rgba(3,201,135,0.4)] hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Request Official Proposal for this System</span>
                <ArrowRight className="size-4 text-black" />
              </button>
            </div>
          </div>
        </section>

        {/* ── 3. FILTERABLE SOLAR SOLUTIONS VERTICALS (TABBED SHOWCASE) ── */}
        {/* ── 3. FILTERABLE SOLAR SOLUTIONS VERTICALS (SIGNATURE SOLID ELECTRIC MINT GREEN #03C987 BACKGROUND 🌿) ── */}
        <section className="relative overflow-hidden bg-[#03C987] py-28 text-[#0A2E20] border-y border-[#02B377]">
          <div className="pointer-events-none absolute -top-40 right-0 size-[600px] rounded-full bg-white/15 blur-[140px]" />
          <div className="pointer-events-none absolute -bottom-40 left-0 size-[600px] rounded-full bg-[#0A2E20]/12 blur-[140px]" />

          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0A2E20] bg-[#0A2E20] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                <Layers className="size-4 text-[#03C987]" />
                <span>Engineered Energy Verticals</span>
              </div>
              <h2 className="mt-4 font-display text-4xl font-extrabold sm:text-6xl text-[#0A2E20] tracking-tight">
                Our Specialized Solar Verticals
              </h2>
              <p className="mt-4 text-base text-[#0A2E20]/90 leading-relaxed font-medium">
                Explore our full scope of solar engineering capabilities for residential homes,
                industrial enterprises, municipal projects, and off-grid mountain microgrids.
              </p>
            </Reveal>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-14">
              {[
                "All",
                "Residential",
                "Commercial",
                "Off-Grid",
                "Grid Interconnection",
                "Agriculture",
                "Municipal",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedVerticalCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    selectedVerticalCategory === cat
                      ? "bg-[#0A2E20] text-white shadow-lg shadow-[#0A2E20]/30 scale-105"
                      : "bg-white/25 text-[#0A2E20] hover:bg-white/40 border border-[#0A2E20]/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Verticals Grid — Floating Natural Cards */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVerticals.map((item, i) => (
                <Reveal key={item.id} delay={i * 80}>
                  <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/40 bg-black/40 p-7 shadow-xl backdrop-blur-md transition-all duration-500 hover:border-white hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)] hover:-translate-y-2">
                    {/* Natural Image in Full Color */}
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-95"
                    />
                    {/* Dark overlay mask for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041a12] via-[#041a12]/80 to-[#041a12]/40" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#03C987] bg-[#041a12]/80 border border-[#03C987]/30 px-3 py-1 rounded-full backdrop-blur-md">
                          {item.category}
                        </span>
                        <div className="grid size-10 place-items-center rounded-xl bg-[#03C987] text-black shadow-md">
                          <item.icon className="size-5" />
                        </div>
                      </div>

                      <h3 className="mt-2 font-display text-2xl font-extrabold text-white transition-colors duration-300 group-hover:text-[#03C987]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
                        {item.fullDesc}
                      </p>
                    </div>

                    <div className="relative z-10 mt-6 pt-5 border-t border-white/20 space-y-3">
                      <div className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                        Key Specifications:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.specs.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#03C987]/20 text-[#03C987] border border-[#03C987]/30 backdrop-blur-md"
                          >
                            <CheckCircle2 className="size-3 text-[#03C987] shrink-0" />
                            <span>{s}</span>
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            propertyType: item.title,
                            message: `Inquiring about ${item.title} solution vertical.`,
                          }));
                          setIsModalOpen(true);
                        }}
                        className="mt-4 w-full py-3 rounded-xl border border-white/30 bg-white/10 font-bold text-xs text-white hover:bg-[#03C987] hover:text-black hover:border-[#03C987] transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
                      >
                        <span>Inquire About Vertical</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. ENERGY ECONOMICS & DIESEL COMPARISON MATRIX (EXECUTIVE REDESIGN) ── */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#03C987]/30 bg-[#03C987]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#03C987] mb-3">
              <TrendingUp className="size-4 text-[#03C987]" />
              <span>Commercial Energy Auditing & Financial ROI</span>
            </div>
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl tracking-tight text-foreground">
              Energy Economics & Source Comparison
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed font-medium">
              Compare operational performance, electricity generation costs, and long-term power
              security across grid power, diesel generators, and OMSUN Hybrid Solar.
            </p>
          </Reveal>

          {/* Matrix Container */}
          <Reveal delay={100}>
            <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/15 bg-card shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 font-display text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                      <th className="p-6 w-[28%]">Performance Metric</th>
                      <th className="p-6 w-[24%]">NEA Grid Only</th>
                      <th className="p-6 w-[24%]">Diesel Generator</th>
                      <th className="p-6 w-[24%] bg-[#03C987] text-[#041a12] relative">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm">OMSUN Solar + Lithium</span>
                          <span className="rounded-full bg-[#041a12] px-2.5 py-0.5 text-[9px] font-black uppercase text-[#03C987]">
                            Recommended
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10 text-xs sm:text-sm font-medium">
                    {energyComparison.map((row) => (
                      <tr
                        key={row.metric}
                        className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="p-6 font-extrabold text-foreground flex items-center gap-3">
                          <div className="grid size-9 place-items-center rounded-xl bg-[#03C987]/15 text-[#03C987] shrink-0">
                            <row.icon className="size-4.5" />
                          </div>
                          <span>{row.metric}</span>
                        </td>
                        <td className="p-6 text-muted-foreground">
                          <div className="font-semibold">{row.gridOnly}</div>
                        </td>
                        <td className="p-6 text-muted-foreground">
                          <div className="font-semibold text-rose-500/90 dark:text-rose-400">
                            {row.dieselGen}
                          </div>
                        </td>
                        <td className="p-6 bg-[#03C987]/10 font-bold text-[#03C987]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold">{row.omsunSolar}</span>
                            <CheckCircle2 className="size-4.5 text-[#03C987] shrink-0" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3 Key Takeaway Stat Chips */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-card shadow-lg flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#03C987]/15 text-[#03C987] shrink-0">
                  <DollarSign className="size-6" />
                </div>
                <div>
                  <div className="font-display text-xl font-extrabold text-foreground">
                    92% Cost Savings
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    NPR 3.50/kWh vs NPR 48/kWh Diesel
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-card shadow-lg flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#03C987]/15 text-[#03C987] shrink-0">
                  <Zap className="size-6" />
                </div>
                <div>
                  <div className="font-display text-xl font-extrabold text-foreground">
                    &lt; 10ms Uptime
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Instant automatic switch for zero lag
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-card shadow-lg flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#03C987]/15 text-[#03C987] shrink-0">
                  <FileCheck className="size-6" />
                </div>
                <div>
                  <div className="font-display text-xl font-extrabold text-foreground">
                    NEA Export Tariff
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Sell surplus solar energy back to NEA
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── 5. NEA NET-METERING INTERCONNECTION ROADMAP ── */}
        {/* ── 5. NEA NET-METERING INTERCONNECTION ROADMAP (LEAF GREEN LIGHT BLEND 🌿) ── */}
        <section className="bg-gradient-to-r from-[#E5F7EF] via-[#F2FBF6] to-[#EFF8FF] py-24 text-[#173226] border-y border-[#43B987]/30 relative">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#43B987]/40 bg-[#43B987]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#173226] mb-3">
                <FileCheck className="size-4 text-[#03C987]" />
                <span>Nepal Regulatory Compliance</span>
              </div>
              <h2 className="font-display text-4xl font-extrabold sm:text-5xl text-[#173226] tracking-tight">
                NEA Net-Metering Interconnection Roadmap
              </h2>
              <p className="mt-4 text-base text-[#173226]/80 font-medium">
                OMSUN handles 100% of paperwork, technical Single-Line Diagrams (SLD), and formal
                NEA approval.
              </p>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {neaRoadmap.map((item, i) => (
                <Reveal key={item.step} delay={i * 80} className="h-full">
                  <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-[#43B987]/30 bg-white p-6 shadow-lg transition-all duration-300 hover:border-[#43B987] hover:shadow-xl hover:-translate-y-1">
                    <div>
                      <span className="font-display text-3xl font-extrabold text-[#03C987]">
                        Step {item.step}
                      </span>
                      <h3 className="mt-4 font-display text-base font-extrabold text-[#173226] group-hover:text-[#03C987] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs text-[#475569] leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#43B987]/20 text-[11px] font-bold text-[#03C987] flex items-center gap-1">
                      <span>Phase {i + 1} of 5</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. FEATURED CASE STUDIES & FIELD RESULTS IN NEPAL ── */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Verified Project Performance
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-5xl tracking-tight text-foreground">
              Featured Nepal Solar Installations
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Real-world case studies demonstrating clean power generation and fast financial
              payback across Nepal.
            </p>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projectCaseStudies.map((cs, i) => (
              <Reveal key={cs.title} delay={i * 90}>
                <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-card shadow-xl flex flex-col justify-between h-full hover:border-emerald-500/40 transition-all">
                  <div>
                    <div className="relative h-52">
                      <img
                        src={cs.image}
                        alt={cs.title}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-4 flex flex-col justify-end">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          <span>{cs.location}</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-display text-xl font-extrabold text-foreground">
                        {cs.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {cs.desc}
                      </p>

                      <div className="mt-6 space-y-2 border-t border-slate-100 dark:border-white/10 pt-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground font-medium">
                            Capacity Installed:
                          </span>
                          <span className="font-bold text-foreground">{cs.capacity}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground font-medium">
                            Verified Payback:
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {cs.payback}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground font-medium">
                            Annual Financial Impact:
                          </span>
                          <span className="font-bold text-amber-500">{cs.savings}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Button
                      asChild
                      className="w-full rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-emerald-600 hover:text-white text-xs font-bold"
                    >
                      <Link to="/projects">View Full Case Study</Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 7. CATEGORIZED INTERACTIVE FAQS ACCORDION ── */}
        <section className="bg-slate-50 dark:bg-white/5 py-24 border-t border-slate-200 dark:border-white/10">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                <HelpCircle className="size-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl tracking-tight text-foreground">
                Solar Technology & Regulatory Insights
              </h2>
            </Reveal>

            {/* FAQ Tabs */}
            <div className="flex justify-center gap-2 mb-10">
              {["General", "Batteries & Tech", "ROI & Commercial"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFaqTab(t);
                    setOpenFaqIndex(0);
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    faqTab === t
                      ? "bg-emerald-500 text-black font-extrabold shadow-md scale-105"
                      : "bg-slate-200 dark:bg-white/10 text-muted-foreground hover:bg-slate-300 dark:hover:bg-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Accordions */}
            <div className="space-y-4">
              {faqItems
                .filter((item) => item.tab === faqTab)
                .map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.q}
                      className="rounded-2xl border border-slate-200 dark:border-white/10 bg-card shadow-sm overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left font-display font-extrabold text-sm sm:text-base text-foreground cursor-pointer hover:text-emerald-500 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="size-5 text-emerald-500 shrink-0 ml-4" />
                        ) : (
                          <ChevronDown className="size-5 text-muted-foreground shrink-0 ml-4" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* ── 8. BOTTOM CONSULTATION CTA BANNER ── */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041a12] via-[#073d2c] to-[#041a12] p-10 sm:p-16 border border-emerald-500/30 text-white shadow-2xl text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
              Ready to Power Your Property with Solar?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm text-emerald-100/80 leading-relaxed">
              Get a free technical site consultation, 3D shadow simulation, and customized solar
              quotation from OMSUN's senior engineering team.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="h-13 rounded-2xl bg-[#03C987] hover:bg-[#02b377] text-black font-extrabold px-8 text-sm shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <PhoneCall className="size-4 text-black" />
                <span>Schedule Free Engineering Survey</span>
              </button>
              <Button
                asChild
                className="h-13 rounded-2xl border border-white/25 bg-white/10 text-white hover:bg-white/20 font-bold px-8 text-sm backdrop-blur-md"
              >
                <Link to="/shop">Shop Solar Bundles & Products</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── 9. INTERACTIVE SITE ASSESSMENT & QUOTATION REQUEST MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-card p-6 sm:p-8 text-foreground shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="size-5 text-muted-foreground" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="size-10" />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-foreground">
                  Survey Request Received!
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Thank you! An OMSUN senior solar engineer will contact you at{" "}
                  <span className="font-bold text-foreground">{formData.phone}</span> within 2 hours
                  to confirm your site audit.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">
                  <Sun className="size-4" />
                  <span>Free Engineering Site Survey</span>
                </div>
                <h3 className="font-display text-2xl font-extrabold text-foreground">
                  Request Solar Proposal
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-6">
                  Fill in your details for a customized system design and NEA net-metering estimate.
                </p>

                <form onSubmit={handleSubmitForm} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold mb-1">Your Full Name</label>
                    <Input
                      required
                      placeholder="e.g. Ramesh Adhikari"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold mb-1">Phone Number</label>
                      <Input
                        required
                        placeholder="98XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">District / City</label>
                      <Input
                        required
                        placeholder="e.g. Kathmandu / Pokhara"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold mb-1">Property Type</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option>Residential Home</option>
                        <option>Commercial Office</option>
                        <option>Industrial Factory</option>
                        <option>Hotel / Resort</option>
                        <option>Agricultural Farm</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Roof Area (sq ft)</label>
                      <Input
                        placeholder="e.g. 1,200 sq ft"
                        value={formData.roofArea}
                        onChange={(e) => setFormData({ ...formData, roofArea: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Additional Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify backup needs or current electricity bill..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-[#03C987] hover:bg-[#02b377] font-extrabold text-black text-xs shadow-lg transition-all cursor-pointer"
                  >
                    Submit Survey Request
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
