import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Battery,
  Building2,
  CheckCircle2,
  Headphones,
  Heart,
  Home,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Star,
  Sun,
  Target,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import heroWhyOmsunBg from "@/assets/hero-why-omsun-bg.webp";
import projectImg from "@/assets/project-nepal.webp";

export const Route = createFileRoute("/why-omsun")({
  head: () => ({
    meta: [
      { title: "About Us | OMSUN Nepal Private Limited" },
      {
        name: "description",
        content:
          "OMSUN Nepal Private Limited delivers reliable power backup solutions including UPS, Inverters, Stabilizers, and Solar Products, serving customers across Nepal through its online platform and offline store.",
      },
    ],
  }),
  component: AboutPage,
});

const offerings = [
  { icon: Zap, label: "UPS & Power Backup Solutions" },
  { icon: Battery, label: "Inverter Systems" },
  { icon: ShieldCheck, label: "Voltage Stabilizers" },
  { icon: Battery, label: "Batteries & Battery Backup Solutions" },
  { icon: Sun, label: "Solar Panels & Solar Products" },
  { icon: Sun, label: "Solar Inverters & Related Accessories" },
  { icon: Zap, label: "Electrical & Power Protection Products" },
  { icon: Home, label: "Residential Power Solutions" },
  { icon: Building2, label: "Commercial & Institutional Power Solutions" },
  { icon: Wrench, label: "Installation, Maintenance & After-Sales Support" },
];

const reasons = [
  {
    icon: ShieldCheck,
    title: "Reliable Products",
    desc: "Quality-assured power backup products that deliver consistent performance for homes, businesses, and institutions across Nepal.",
  },
  {
    icon: Users,
    title: "Professional Guidance",
    desc: "Our expert team works closely with customers to recommend the right solution based on power capacity, usage, budget, and application.",
  },
  {
    icon: Star,
    title: "Competitive Value",
    desc: "High-performance products at fair and transparent pricing, ensuring maximum value for every customer's investment.",
  },
  {
    icon: Heart,
    title: "Customer-Focused Service",
    desc: "We prioritize your satisfaction at every step — from initial consultation to installation, maintenance, and ongoing support.",
  },
  {
    icon: Headphones,
    title: "Long-Term Support",
    desc: "Our commitment goes beyond product sales. We build lasting relationships through dependable after-sales service and maintenance.",
  },
  {
    icon: MapPin,
    title: "Nationwide Service",
    desc: "Serving customers across Nepal through both our online platform and offline store, ensuring accessibility wherever you are.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#041a12] pt-28 pb-20 lg:pt-36 lg:pb-24 text-white border-b border-white/10">
          <img
            src={heroWhyOmsunBg}
            alt="About OMSUN Nepal Private Limited"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center pointer-events-none opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03150e]/95 via-[#03150e]/80 to-[#03150e]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03150e]/40 via-transparent to-[#041a12]" />
          <div className="pointer-events-none absolute -top-32 left-1/3 size-[500px] rounded-full bg-[#03C987]/12 blur-[140px]" />
          <div className="pointer-events-none absolute bottom-0 right-10 size-[350px] rounded-full bg-emerald-500/8 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#03C987] mb-6">
                <Building2 className="size-4" />
                <span>About OMSUN Nepal Private Limited</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Powering Nepal with{" "}
                <span className="text-[#03C987]">Reliable Energy Solutions</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                A Nepal-based power and energy solutions company dedicated to providing reliable,
                efficient, and practical solutions for homes, businesses, institutions, and
                commercial establishments across Nepal.
              </p>
              <div className="mt-10 inline-flex flex-wrap items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest">
                <span className="text-[#03C987]">Reliable Power</span>
                <span className="text-white/30">•</span>
                <span className="text-[#03C987]">Trusted Solutions</span>
                <span className="text-white/30">•</span>
                <span className="text-[#03C987]">Nationwide Service</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-14 lg:grid-cols-2 items-center">
              <Reveal>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#03C987]/30 bg-[#03C987]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#03C987]">
                    <Lightbulb className="size-4" />
                    <span>Who We Are</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                    About OMSUN Nepal Private Limited
                  </h2>
                  <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-medium">
                    <p>
                      OMSUN Nepal Private Limited is a Nepal-based power and energy solutions
                      company dedicated to providing reliable, efficient, and practical solutions
                      for homes, businesses, institutions, and commercial establishments across Nepal.
                    </p>
                    <p>
                      We specialize in UPS systems, inverters, voltage stabilizers, batteries,
                      solar products, power backup solutions, and related electrical and energy
                      products. Our goal is to help customers maintain uninterrupted power, protect
                      their valuable electrical and electronic equipment, and adopt smarter and more
                      sustainable energy solutions.
                    </p>
                    <p>
                      At OMSUN, we understand that reliable power is essential for modern homes and
                      businesses. From everyday household requirements to demanding commercial and
                      institutional applications, we focus on providing products and solutions that
                      combine quality, performance, reliability, and value for money.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={projectImg}
                    alt="OMSUN Nepal Power Solutions"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041a12]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-md px-5 py-4 text-white">
                      <div className="text-xs font-bold text-[#03C987] uppercase tracking-wider mb-1">
                        Serving Nepal Since Day One
                      </div>
                      <div className="text-sm font-semibold">
                        Online Platform & Offline Store — Nationwide
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* OUR COMMITMENT */}
        <section className="bg-gradient-to-r from-[#E5F7EF] via-[#F2FBF6] to-[#EFF8FF] py-20 lg:py-24 border-y border-[#43B987]/30 text-[#173226]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="max-w-3xl mx-auto text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#43B987]/40 bg-[#43B987]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#173226] mb-4">
                <Heart className="size-4 text-[#03C987]" />
                <span>Our Commitment</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#173226]">
                Simple, Transparent & Dependable
              </h2>
            </Reveal>
            <div className="grid gap-8 lg:grid-cols-2">
              <Reveal>
                <div className="rounded-3xl border border-[#43B987]/30 bg-white p-8 shadow-xl h-full">
                  <div className="size-12 rounded-2xl bg-[#03C987]/15 grid place-items-center mb-5">
                    <Users className="size-6 text-[#03C987]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#173226] mb-3">Customer-First Approach</h3>
                  <p className="text-sm text-[#475569] leading-relaxed font-medium">
                    We believe that choosing the right power solution should be simple, transparent,
                    and dependable. Our team works closely with customers to understand their
                    requirements and recommend suitable products based on their power capacity,
                    usage, budget, and application.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-3xl border border-[#43B987]/30 bg-white p-8 shadow-xl h-full">
                  <div className="size-12 rounded-2xl bg-[#03C987]/15 grid place-items-center mb-5">
                    <Wrench className="size-6 text-[#03C987]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#173226] mb-3">Beyond Product Sales</h3>
                  <p className="text-sm text-[#475569] leading-relaxed font-medium">
                    Our commitment goes beyond product sales. We aim to build long-term relationships
                    with our customers through professional guidance, dependable products, installation
                    support, maintenance, and after-sales service.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* WHAT WE OFFER */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#03C987]/30 bg-[#03C987]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#03C987] mb-4">
                <Zap className="size-4" />
                <span>What We Offer</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
                Comprehensive Power & Energy Solutions
              </h2>
              <p className="mt-3 text-sm text-muted-foreground font-medium">
                From everyday household requirements to demanding commercial and institutional
                applications — we have you covered.
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {offerings.map((item, i) => (
                <Reveal key={item.label + i} delay={i * 40}>
                  <div className="group flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-card p-5 shadow-sm hover:border-[#03C987]/50 hover:shadow-lg hover:shadow-[#03C987]/5 transition-all duration-300 h-full">
                    <div className="size-9 shrink-0 rounded-xl bg-[#03C987]/10 grid place-items-center group-hover:bg-[#03C987] transition-colors duration-300">
                      <item.icon className="size-4 text-[#03C987] group-hover:text-[#041a12] transition-colors duration-300" />
                    </div>
                    <span className="text-xs font-bold text-foreground leading-snug mt-1">
                      {item.label}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* VISION & MISSION */}
        <section className="bg-[#041a12] py-20 lg:py-28 text-white border-y border-emerald-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#03C987] mb-4">
                <Target className="size-4" />
                <span>Our Direction</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Vision & Mission
              </h2>
            </Reveal>
            <div className="grid gap-8 lg:grid-cols-2">
              <Reveal>
                <div className="rounded-3xl border border-emerald-900/50 bg-[#06241a] p-8 shadow-xl h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="size-12 rounded-2xl bg-[#03C987] grid place-items-center">
                      <Star className="size-6 text-[#041a12]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#03C987]">Our Vision</div>
                      <h3 className="text-xl font-extrabold text-white">Trusted & Recognized Nationwide</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    To become a trusted and recognized power and energy solutions company in Nepal,
                    providing dependable technology and sustainable energy solutions for homes,
                    businesses, and institutions.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-3xl border border-emerald-900/50 bg-[#06241a] p-8 shadow-xl h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="size-12 rounded-2xl bg-[#03C987] grid place-items-center">
                      <Target className="size-6 text-[#041a12]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#03C987]">Our Mission</div>
                      <h3 className="text-xl font-extrabold text-white">Quality, Service & Long-Term Support</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    To deliver quality products, practical solutions, professional service, and
                    long-term customer support while continuously adapting to the evolving power
                    and energy needs of Nepal.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE OMSUN */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#03C987]/30 bg-[#03C987]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#03C987] mb-4">
                <CheckCircle2 className="size-4" />
                <span>Why Choose OMSUN?</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
                Solutions You Can Depend On
              </h2>
              <p className="mt-3 text-sm text-muted-foreground font-medium">
                Today and for the future — OMSUN Nepal Private Limited is committed to powering your needs.
              </p>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map((r, i) => (
                <Reveal key={r.title} delay={i * 60}>
                  <div className="group rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-7 shadow-xl hover:border-[#03C987]/50 hover:shadow-2xl hover:shadow-[#03C987]/5 transition-all duration-300 h-full flex flex-col">
                    <div className="size-12 rounded-2xl bg-[#03C987]/10 grid place-items-center mb-5 group-hover:bg-[#03C987] transition-colors duration-300">
                      <r.icon className="size-6 text-[#03C987] group-hover:text-[#041a12] transition-colors duration-300" />
                    </div>
                    <h3 className="font-display text-lg font-extrabold text-foreground mb-2">{r.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{r.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041a12] via-[#073d2c] to-[#041a12] p-10 sm:p-16 border border-[#03C987]/30 text-white shadow-2xl text-center">
                <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 size-[400px] rounded-full bg-[#03C987]/10 blur-[100px]" />
                <div className="relative">
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                    Ready to Power Your Home or Business?
                  </h2>
                  <p className="mt-4 max-w-xl mx-auto text-sm text-emerald-100/80 leading-relaxed font-medium">
                    Browse our complete range of UPS, Inverters, Stabilizers, Batteries, and Solar
                    Products — or reach out to our team for expert guidance.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button
                      asChild
                      className="h-12 rounded-2xl bg-[#03C987] hover:bg-white text-[#041a12] font-extrabold px-8 text-sm shadow-xl cursor-pointer transition-colors"
                    >
                      <Link to="/shop">Shop Now</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 rounded-2xl border-white/25 bg-white/10 text-white font-bold px-8 text-sm hover:bg-white/20 backdrop-blur-md"
                    >
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
