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
  Sun,
  Wrench,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { HeroSlider } from "@/components/site/HeroSlider";
import { partnerBrandLogos } from "@/components/site/PartnerLogos";
import { products } from "@/lib/products";
import projectImg from "@/assets/project-nepal.jpg";

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
  { name: "Solar Panels", icon: Sun, note: "Mono & bifacial modules" },
  { name: "Inverters", icon: Gauge, note: "Hybrid, on-grid, off-grid" },
  { name: "Energy Storage", icon: BatteryCharging, note: "LiFePO₄ systems" },
  { name: "Cables & Wiring", icon: Cable, note: "Pure copper, IEC rated" },
  { name: "Lighting", icon: Lightbulb, note: "LED & smart luminaires" },
];

const stats = [
  { value: "18 MW+", label: "Solar capacity installed" },
  { value: "4,200+", label: "Projects delivered" },
  { value: "77", label: "Districts served" },
  { value: "24/7", label: "Engineering support" },
];

const testimonials = [
  {
    quote:
      "OMSUN engineered our 320 kW rooftop plant end to end. Payback landed nine months earlier than projected.",
    name: "Sabin Shrestha",
    role: "Plant Head, Everest Textiles",
  },
  {
    quote:
      "Their switchgear and cable quality is on another level for Nepal. Documentation and support are flawless.",
    name: "Anjana Karki",
    role: "Electrical Consultant, Pokhara",
  },
  {
    quote:
      "We run six off-grid lodges on OMSUN storage. Three winters, zero downtime, zero diesel.",
    name: "Pemba Sherpa",
    role: "Owner, Khumbu Lodges",
  },
];

function Home() {
  const featured = products.slice(0, 3);
  const bestSellers = products.filter((p) => p.badges.includes("Best Seller"));
  const newArrivals = products.slice(3);

  return (
    <div className="min-h-dvh overflow-x-clip">
      <Navbar />
      <main>
        {/* HERO — Animated Slider */}
        <HeroSlider />

        {/* TRUSTED BRANDS */}
        <section className="border-y border-white/10 bg-[#061710]/95 py-9">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.24em] text-emerald-400/90">
            Authorised distributor & integration partner
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
              {[...partnerBrandLogos, ...partnerBrandLogos].map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  className="group relative flex h-16 min-w-[140px] items-center justify-center rounded-xl border border-white/15 bg-white/90 px-6 py-2 shadow-sm transition-all duration-300 hover:border-white hover:bg-white hover:shadow-lg hover:scale-105"
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

        {/* SHOP BY CATEGORY */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Shop by category</h2>
              <p className="mt-4 text-muted-foreground">
                Six product families, one engineering standard. Everything is stocked in Kathmandu
                and shipped nationwide.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary"
            >
              View all products <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 60}>
                <Link
                  to="/shop"
                  className="surface-card hover-lift group flex items-center gap-5 p-6"
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-leaf-tint text-primary transition-colors duration-500 group-hover:bg-energy group-hover:text-primary-foreground">
                    <c.icon className="size-6" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-bold">{c.name}</span>
                    <span className="block truncate text-sm text-muted-foreground">{c.note}</span>
                  </span>
                  <ArrowRight className="ml-auto size-5 shrink-0 text-muted-foreground transition-transform duration-500 group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="bg-mist py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
                Featured this season
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* BEST SELLERS — split composition */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:items-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Best sellers
              </span>
              <h2 className="mt-4 font-display text-4xl font-extrabold">
                What Nepal keeps ordering
              </h2>
              <p className="mt-4 text-muted-foreground">
                Field-proven across monsoon heat and Himalayan cold. Every unit ships with a
                serialised warranty card and free installation guidance.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-8 h-12 rounded-2xl border-2 px-6 font-semibold"
              >
                <Link to="/shop">Browse best sellers</Link>
              </Button>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {bestSellers.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHY OMSUN */}
        <section id="why" className="bg-navy py-24 text-primary-foreground">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
                Why engineers specify OMSUN
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-primary-foreground/15 bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ShieldCheck,
                  t: "Certified supply",
                  d: "IEC, TÜV and NS-compliant products only — full test documentation on request.",
                },
                {
                  icon: Wrench,
                  t: "In-house EPC",
                  d: "Licensed engineers handle design, load study, installation and commissioning.",
                },
                {
                  icon: Gauge,
                  t: "Performance data",
                  d: "Remote monitoring on every solar plant we deliver, with monthly yield reports.",
                },
                {
                  icon: Zap,
                  t: "Stocked locally",
                  d: "Kathmandu warehouse with 48-hour dispatch to all seven provinces.",
                },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * 70} className="bg-navy p-8">
                  <f.icon className="size-7 text-lime" strokeWidth={1.7} />
                  <h3 className="mt-6 font-display text-lg font-bold">{f.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">{f.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ENERGY SAVING + SOLAR SOLUTIONS */}
        <section id="solar" className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal className="order-2 lg:order-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Energy saving
              </span>
              <h2 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
                Cut your bill by up to 74%
              </h2>
              <p className="mt-5 text-muted-foreground">
                A typical 5 kW OMSUN rooftop system offsets ~7,800 units a year. We model your load
                profile before quoting, so the numbers you see are the numbers you get.
              </p>
              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {[
                  { k: "74%", v: "Average bill offset" },
                  { k: "4.1 yr", v: "Typical payback" },
                  { k: "5.2 t", v: "CO₂ avoided / year" },
                ].map((s) => (
                  <div key={s.k} className="surface-card p-5">
                    <div className="font-display text-2xl font-extrabold text-gradient">{s.k}</div>
                    <div className="mt-1 text-xs font-semibold text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120} className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-[2rem] border shadow-[var(--shadow-lift)]">
                <img
                  src={projectImg}
                  alt="OMSUN engineers installing a hillside solar array in Nepal"
                  loading="lazy"
                  width={1400}
                  height={900}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y bg-card py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <div className="font-display text-4xl font-extrabold">{s.value}</div>
                <div className="mt-2 text-sm font-semibold text-muted-foreground">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">New arrivals</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newArrivals.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-mist py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
                Trusted on site, not just on paper
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 80}>
                  <figure className="surface-card hover-lift flex h-full flex-col p-8">
                    <Quote className="size-7 text-primary" />
                    <blockquote className="mt-6 flex-1 text-base leading-relaxed">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-8 border-t pt-5">
                      <div className="font-display font-bold">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Latest projects</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              { t: "320 kW industrial rooftop", l: "Bhaktapur • Textiles", v: "Commissioned 2026" },
              {
                t: "Off-grid lodge microgrid",
                l: "Khumbu • Hospitality",
                v: "6 sites, 84 kWh storage",
              },
              { t: "Municipal LED retrofit", l: "Pokhara • Public works", v: "2,400 luminaires" },
            ].map((p, i) => (
              <Reveal key={p.t} delay={i * 80}>
                <article className="surface-card hover-lift flex h-full flex-col justify-between gap-10 bg-leaf-tint p-8">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    {p.v}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold leading-tight">{p.t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.l}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="mx-auto max-w-7xl px-6 pb-8">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-energy px-8 py-16 text-center shadow-glow sm:px-16">
              <div className="absolute -right-16 -top-16 -z-10 size-72 rounded-full bg-primary-foreground/20 blur-3xl" />
              <h2 className="mx-auto max-w-2xl font-display text-4xl font-extrabold text-primary-foreground sm:text-5xl">
                Get the OMSUN energy brief
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Monthly pricing updates, new product drops and subsidy news for Nepal.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("You're subscribed. Welcome aboard!");
                }}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="h-14 rounded-2xl border-0 bg-card px-5 text-base"
                />
                <Button
                  type="submit"
                  className="h-14 shrink-0 rounded-2xl bg-navy px-8 text-base font-semibold text-primary-foreground"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
