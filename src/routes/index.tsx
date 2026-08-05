import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Cable,
  Gauge,
  Lightbulb,
  PanelsTopLeft,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Wrench,
  Zap,
  PhoneCall,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { HeroSlider } from "@/components/site/HeroSlider";
import { partnerBrandLogos } from "@/components/site/PartnerLogos";
import { products } from "@/lib/products";

import panelImg from "@/assets/p-panel.jpg";
import inverterImg from "@/assets/p-inverter.jpg";
import batteryImg from "@/assets/p-battery.jpg";
import cableImg from "@/assets/p-cable.jpg";
import lightImg from "@/assets/p-light.jpg";
import switchgearImg from "@/assets/p-panelboard.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OMSUN Nepal — Solar, Electrical & Renewable Energy Solutions" },
      {
        name: "description",
        content:
          "OMSUN Nepal Pvt. Ltd. supplies premium solar panels, inverters, storage, cables, lighting and industrial switchgear — engineered for clean, reliable power across Nepal.",
      },
      { property: "og:title", content: "OMSUN Nepal — Clean Energy, Engineered" },
      {
        property: "og:description",
        content:
          "Premium solar, electrical and renewable energy products with nationwide installation and support.",
      },
    ],
  }),
  component: Home,
});

const categories = [
  {
    name: "Solar Panels",
    icon: Sun,
    note: "Mono-PERC & Bifacial N-Type high yield modules",
    tag: "Top Choice in Nepal",
    specs: "25-Year Performance Guarantee",
    badge: "580W N-Type Tier-1",
    color: "#0ea5e9",
    image: panelImg,
  },
  {
    name: "Hybrid Inverters",
    icon: Gauge,
    note: "Pure sine-wave, on-grid & off-grid intelligent controllers",
    tag: "99.2% Max Efficiency",
    specs: "Dual MPPT Trackers & Auto-Generator Start",
    badge: "5kW – 50kW Single/3-Phase",
    color: "#6366f1",
    image: inverterImg,
  },
  {
    name: "Energy Storage",
    icon: BatteryCharging,
    note: "LiFePO4 wall-mount & high-capacity battery racks",
    tag: "6,000+ Deep Cycles",
    specs: "Sub-Zero Thermal Insulation Enclosure",
    badge: "Lithium Iron Phosphate",
    color: "#10b981",
    image: batteryImg,
  },
  {
    name: "Cables & Wiring",
    icon: Cable,
    note: "Pure copper solar DC cables & armored main feeder lines",
    tag: "UV & Flame Proof",
    specs: "IEC 62930 Double Insulated Certification",
    badge: "TÜV Certified Copper",
    color: "#f59e0b",
    image: cableImg,
  },
  {
    name: "Solar Lighting",
    icon: Lightbulb,
    note: "All-in-one smart LED luminaires & municipal streetlights",
    tag: "IP67 Weather Sealed",
    specs: "Microwave Motion Sensor & Dusk-to-Dawn Control",
    badge: "50,000+ Hrs LED Lifespan",
    color: "#ec4899",
    image: lightImg,
  },
  {
    name: "Switchgear & Panels",
    icon: PanelsTopLeft,
    note: "Heavy duty MCCB breakers & industrial distribution panels",
    tag: "Industrial Grade",
    specs: "Surge Protection Device (SPD) Included",
    badge: "IEC 60947 Switchgear",
    color: "#8b5cf6",
    image: switchgearImg,
  },
];

const testimonials = [
  {
    quote:
      "OMSUN engineered our 320 kW rooftop plant end to end. Payback landed nine months earlier than projected.",
    name: "Sabin Shrestha",
    role: "Plant Head, Everest Textiles",
    location: "Bhaktapur",
    rating: 5,
  },
  {
    quote:
      "Their switchgear and cable quality is on another level for Nepal. Documentation and support are flawless.",
    name: "Anjana Karki",
    role: "Electrical Consultant",
    location: "Pokhara",
    rating: 5,
  },
  {
    quote:
      "We run six off-grid lodges on OMSUN storage. Three winters, zero downtime, zero diesel.",
    name: "Pemba Sherpa",
    role: "Owner, Khumbu Lodges",
    location: "Namche Bazaar",
    rating: 5,
  },
];

function Home() {
  const featured = products.slice(0, 3);
  const bestSellers = products.filter((p) => p.badges.includes("Best Seller"));

  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      <Navbar />
      <main>
        {/* HERO — Animated Slider (DARK HERO) */}
        <HeroSlider />

        {/* TRUSTED BRANDS (LIGHT MARQUEE SECTION ☀️) */}
        <section className="border-y border-slate-200/80 bg-[#f8faf9] py-9">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
            Authorised distributor & integration partner
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
              {[...partnerBrandLogos, ...partnerBrandLogos].map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  className="group relative flex h-16 min-w-[140px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-2 shadow-sm transition-all duration-300 hover:border-emerald-500 hover:shadow-md hover:scale-105"
                  title={brand.name}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-8 sm:h-9 w-auto max-w-[120px] object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SHOP BY CATEGORY — ADVANCED BENTO SHOWCASE (DARK EMERALD SECTION 🌙) */}
        <section className="relative overflow-hidden bg-[#03120c] py-28 text-white">
          <div className="pointer-events-none absolute -top-40 right-0 size-[600px] rounded-full bg-emerald-500/10 blur-[140px]" />
          <div className="pointer-events-none absolute -bottom-40 left-0 size-[600px] rounded-full bg-teal-500/10 blur-[140px]" />

          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-14">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="size-4" />
                  <span>Product Verticals & Families</span>
                </div>
                <h2 className="mt-4 font-display text-4xl font-extrabold sm:text-6xl text-white tracking-tight">
                  Shop by Engineering Category
                </h2>
                <p className="mt-4 text-base text-white/70 leading-relaxed">
                  Six certified product families engineered for Nepal's climate. Stocked in our central Kathmandu warehouse and dispatched nationwide with serialised warranties.
                </p>
              </div>
              <Button
                asChild
                className="h-13 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-7 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/shop" className="flex items-center gap-2">
                  <span>View All Categories</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>

            {/* HIGH-END BENTO GRID */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, i) => (
                <Reveal key={c.name} delay={i * 70}>
                  <Link
                    to="/shop"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[#051c14] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-400/60 hover:shadow-[0_25px_60px_-15px_rgba(16,185,129,0.35)] hover:-translate-y-1.5 h-full min-h-[300px]"
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      className="absolute inset-0 size-full object-cover opacity-30 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-45"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04160f] via-[#04160f]/85 to-[#04160f]/40" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span
                        className="grid size-14 place-items-center rounded-2xl border border-white/20 shadow-lg transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `color-mix(in srgb, ${c.color} 25%, #051c14)`,
                          color: c.color,
                          boxShadow: `0 0 20px 0 ${c.color}33`,
                        }}
                      >
                        <c.icon className="size-7" strokeWidth={2} />
                      </span>

                      <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                        {c.tag}
                      </span>
                    </div>

                    <div className="relative z-10 mt-12">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/50">
                            {c.badge}
                          </span>
                          <h3 className="mt-1 font-display text-2xl font-extrabold text-white transition-colors duration-300 group-hover:text-emerald-300">
                            {c.name}
                          </h3>
                          <p className="mt-2 text-xs font-medium text-white/70 leading-relaxed max-w-md">
                            {c.note}
                          </p>
                        </div>

                        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition-all duration-300 group-hover:border-emerald-400 group-hover:bg-emerald-500 group-hover:text-black">
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>

                      <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-3.5 text-[11px] font-semibold text-emerald-400/90">
                        <CheckCircle2 className="size-3.5 shrink-0" />
                        <span>{c.specs}</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS (LIGHT MODE SECTION ☀️) */}
        <section className="bg-slate-100/90 py-28 text-slate-900 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Sparkles className="size-4 text-emerald-600" />
                  <span>Curated High-Performance Hardware</span>
                </div>
                <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl text-slate-900">
                  Featured Power Systems
                </h2>
                <p className="mt-3 text-sm text-slate-600 font-medium">
                  Top-tier monocrystalline solar modules, hybrid string inverters, and high-density LiFePO4 energy storage.
                </p>
              </div>
              <Button
                asChild
                className="h-12 rounded-xl bg-slate-900 text-white font-bold px-6 text-sm hover:bg-emerald-700 shadow-md"
              >
                <Link to="/shop">View Full Catalog &rarr;</Link>
              </Button>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 80} className="h-full">
                  <ProductCard product={p} variant="light" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* BEST SELLERS — SPLIT COMPOSITION (DARK EMERALD SECTION 🌙) */}
        <section className="bg-[#020d08] py-28 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:items-center">
              <Reveal className="h-full">
                <div className="rounded-3xl border border-white/15 bg-[#051e16] p-8 sm:p-10 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 right-0 size-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                  
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-6">
                      <Zap className="size-4" />
                      <span>Nationwide Demand</span>
                    </div>

                    <h2 className="font-display text-3xl font-extrabold sm:text-5xl text-white">
                      What Nepal Keeps Ordering
                    </h2>

                    <p className="mt-4 text-sm text-white/70 leading-relaxed">
                      Field-proven across monsoon humidity and high-altitude Himalayan winters. Every system ships with serialised warranty cards and local technical support.
                    </p>

                    <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
                      {[
                        "100% Certified Tier-1 Equipment",
                        "48-Hour Kathmandu Warehouse Dispatch",
                        "Full Nepal Net-Metering Paperwork Support",
                      ].map((h) => (
                        <div key={h} className="flex items-center gap-2.5 text-xs font-bold text-emerald-300">
                          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    asChild
                    className="mt-8 h-13 w-full rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-xl"
                  >
                    <Link to="/shop">Explore All Best Sellers</Link>
                  </Button>
                </div>
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2">
                {bestSellers.map((p, i) => (
                  <Reveal key={p.id} delay={i * 80} className="h-full">
                    <ProductCard product={p} variant="dark" />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHY OMSUN (LIGHT MODE SECTION ☀️) */}
        <section id="why" className="bg-[#f3f7f5] py-28 text-slate-900 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                The Engineering Advantage
              </span>
              <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl text-slate-900">
                Why Engineers Specify OMSUN
              </h2>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Certified Supply Chain",
                  metric: "100% Tier-1",
                  desc: "Every module and inverter is sourced from Tier-1 IEC/TÜV certified manufacturers.",
                  icon: ShieldCheck,
                },
                {
                  title: "In-House EPC Team",
                  metric: "Licensed Engineers",
                  desc: "Certified electrical engineers for shadow modeling, cable sizing, and NEA net-metering.",
                  icon: Wrench,
                },
                {
                  title: "Performance Guarantee",
                  metric: "25-Yr Output",
                  desc: "25-year linear output warranty on panels, 5-year full warranty on inverters and storage.",
                  icon: Sparkles,
                },
                {
                  title: "Stocked in Nepal",
                  metric: "48-Hr Dispatch",
                  desc: "Kathmandu central warehouse keeps high-velocity SKUs ready for 48-hour dispatch.",
                  icon: Zap,
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 70}>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group hover:border-emerald-500">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                          <item.icon className="size-7" strokeWidth={1.8} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                          {item.metric}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs font-medium text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS (LIGHT MODE SECTION ☀️) */}
        <section className="bg-white py-28 text-slate-900">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                Client Testimonials
              </span>
              <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl text-slate-900">
                Trusted by Engineers & Enterprise Clients
              </h2>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 80}>
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Quote className="size-8 text-emerald-600/40" />
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: t.rating }).map((_, idx) => (
                            <Star key={idx} className="size-4 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm italic text-slate-700 leading-relaxed font-medium">
                        "{t.quote}"
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm font-display text-slate-900">{t.name}</div>
                        <div className="text-xs font-semibold text-emerald-700">{t.role}</div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full">
                        <MapPin className="size-3 text-emerald-600" />
                        {t.location}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HIGH-IMPACT FINAL CTA BANNER ── */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041810] via-[#072a1d] to-[#041810] p-10 sm:p-16 border border-emerald-500/30 text-white shadow-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-6">
                <Sun className="size-4" />
                <span>Free Technical Consultation</span>
              </div>

              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight">
                Ready to Power Your Property with Clean Energy?
              </h2>

              <p className="mt-4 max-w-xl mx-auto text-sm text-white/70 leading-relaxed">
                Get a free technical site survey, 3D shadow analysis, and financial payback proposal from OMSUN's licensed engineering team in Nepal.
              </p>

              <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <Button
                  asChild
                  className="h-13 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 text-sm shadow-xl"
                >
                  <Link to="/solar-solutions">Request Free Site Survey</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-13 rounded-2xl border-white/20 bg-white/10 text-white font-bold px-8 text-sm hover:bg-white/20"
                >
                  <Link to="/shop">Browse Products</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
