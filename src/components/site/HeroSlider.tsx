import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sun,
  BatteryCharging,
  Gauge,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import bannerSolarFarm from "@/assets/banner-solar-farm.png";
import bannerStorage from "@/assets/banner-storage.png";
import bannerRooftop from "@/assets/banner-rooftop.png";
import bannerInverter from "@/assets/banner-inverter.png";
import bannerNepal from "@/assets/banner-nepal.png";

interface Slide {
  id: number;
  image: string;
  badge: string;
  badgeIcon: ReactNode;
  headline: string[];
  accentWord: string;
  sub: string;
  cta: { label: string; to?: string; action?: () => void };
  ctaSecondary: { label: string; to?: string; action?: () => void };
  accent: string; // tailwind gradient class or CSS value
  accentGlow: string;
}

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const SLIDE_DURATION = 4000;

  const slides: Slide[] = [
    {
      id: 0,
      image: bannerSolarFarm,
      badge: "Nepal's #1 Solar Partner",
      badgeIcon: <Sun className="size-3.5" />,
      headline: ["Power That", "Pays You"],
      accentWord: "Back.",
      sub: "Premium monocrystalline & bifacial solar panels engineered for Nepal's climate — from 50 W to multi-MW utility installations.",
      cta: { label: "Explore Solar Panels", to: "/shop" },
      ctaSecondary: {
        label: "Get Free Sizing",
        action: () => toast.success("Our engineer will call you within 24 hours."),
      },
      accent: "linear-gradient(120deg,#6366f1,#0ea5e9,#14b8a6)",
      accentGlow: "rgba(99,102,241,0.4)",
    },
    {
      id: 1,
      image: bannerStorage,
      badge: "LiFePO₄ Storage Systems",
      badgeIcon: <BatteryCharging className="size-3.5" />,
      headline: ["Store Every", "Ray of"],
      accentWord: "Sunlight.",
      sub: "Modular lithium iron-phosphate battery walls with 6,000+ cycle life — keep your facility running through grid outages and peak tariffs.",
      cta: { label: "Browse Storage", to: "/shop" },
      ctaSecondary: {
        label: "Talk to an Engineer",
        action: () => toast.success("Our engineer will call you within 24 hours."),
      },
      accent: "linear-gradient(120deg,#0ea5e9,#3b82f6,#6366f1)",
      accentGlow: "rgba(14,165,233,0.35)",
    },
    {
      id: 2,
      image: bannerRooftop,
      badge: "Rooftop Solar Installation",
      badgeIcon: <Sun className="size-3.5" />,
      headline: ["Clean Energy", "From Your"],
      accentWord: "Rooftop.",
      sub: "End-to-end rooftop solar design, supply and installation — OMSUN engineers handle everything from site survey to grid connection.",
      cta: {
        label: "Request Installation",
        action: () => toast.success("Our engineer will call you within 24 hours."),
      },
      ctaSecondary: { label: "View Projects", to: "/shop" },
      accent: "linear-gradient(120deg,#10b981,#059669,#0d9488)",
      accentGlow: "rgba(16,185,129,0.35)",
    },
    {
      id: 3,
      image: bannerInverter,
      badge: "Hybrid Inverter Technology",
      badgeIcon: <Gauge className="size-3.5" />,
      headline: ["Smart Hybrid", "Power"],
      accentWord: "Control.",
      sub: "Huawei, Growatt, Schneider — full hybrid, on-grid and off-grid inverters stocked in Kathmandu, shipped nationwide within 48 hours.",
      cta: { label: "Shop Inverters", to: "/shop" },
      ctaSecondary: { label: "Compare Models", to: "/shop" },
      accent: "linear-gradient(120deg,#8b5cf6,#6366f1,#0ea5e9)",
      accentGlow: "rgba(139,92,246,0.35)",
    },
    {
      id: 4,
      image: bannerNepal,
      badge: "Powering All 77 Districts",
      badgeIcon: <Globe className="size-3.5" />,
      headline: ["Lighting Up", "Every Corner"],
      accentWord: "of Nepal.",
      sub: "From the Terai to the Himalayas — 18 MW+ installed, 4,200+ projects delivered, zero-compromise engineering support across Nepal.",
      cta: { label: "Our Projects", to: "/shop" },
      ctaSecondary: {
        label: "Become a Partner",
        action: () => toast.success("Partnership enquiry received. We'll reach out shortly."),
      },
      accent: "linear-gradient(120deg,#6366f1,#818cf8,#a78bfa)",
      accentGlow: "rgba(99,102,241,0.35)",
    },
  ];

  const goTo = useCallback(
    (index: number, dir: "left" | "right") => {
      if (animating || index === current) return;
      setDirection(dir);
      setPrev(current);
      setAnimating(true);
      setCurrent(index);
      setProgress(0);
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 800);
    },
    [animating, current],
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, "left");
  }, [current, goTo, slides.length]);

  const prev_ = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "right");
  }, [current, goTo, slides.length]);

  // Keep stable refs so interval/keyboard never need next/prev as deps
  const nextRef = useRef(next);
  const prevRef = useRef(prev_);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);
  useEffect(() => {
    prevRef.current = prev_;
  }, [prev_]);

  // Auto-play — only depends on `paused`, NOT on `next`
  // Using the ref means the interval always calls the freshest next()
  // without restarting the timer on every slide change.
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => nextRef.current(), SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  // Progress bar tick — resets when slide changes or paused toggles
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const tick = 50;
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (tick / SLIDE_DURATION) * 100, 100));
    }, tick);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, paused]);

  // Arrow-key navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextRef.current();
      else if (e.key === "ArrowLeft") prevRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const slide = slides[current];
  if (!slide) return null;

  return (
    <section
      className="hero-slider relative isolate h-[100svh] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background slides ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={[
            "hero-slide absolute inset-0",
            i === current && animating ? `hero-slide--enter-${direction}` : "",
            i === current && !animating ? "hero-slide--active" : "",
            i === prev ? `hero-slide--exit-${direction}` : "",
            i !== current && i !== prev ? "hero-slide--hidden" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <img
            src={s.image}
            alt={s.headline.join(" ")}
            className="absolute inset-0 size-full object-cover"
            draggable={false}
          />
          {/* Dark overlay with accent color tint */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.6) 100%)`,
            }}
          />
          {/* Bottom gradient fade */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
          {/* Decorative diagonal accent */}
          <div
            className="hero-diagonal-accent absolute right-0 top-0 h-full w-1/2 opacity-20"
            style={{
              background: s.accent,
              clipPath: "polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
          {/* Glow orb */}
          <div
            className="absolute right-[15%] top-[20%] size-[40rem] rounded-full blur-[120px] opacity-30"
            style={{ background: s.accentGlow }}
          />
        </div>
      ))}

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full flex-col justify-center px-6 pt-24 sm:px-12 lg:px-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            key={`badge-${current}`}
            className="hero-content-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md"
            style={{ animationDelay: "0ms" }}
          >
            <span style={{ color: "var(--color-primary)" }}>{slide.badgeIcon}</span>
            {slide.badge}
          </div>

          {/* Headline */}
          <h1
            key={`h1-${current}`}
            className="hero-content-in font-display text-5xl font-extrabold leading-[0.95] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{ animationDelay: "80ms" }}
          >
            {slide.headline.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
            <span
              key={`accent-${current}`}
              className="hero-content-in block"
              style={{
                background: slide.accent,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animationDelay: "140ms",
              }}
            >
              {slide.accentWord}
            </span>
          </h1>

          {/* Subtext */}
          <p
            key={`sub-${current}`}
            className="hero-content-in mt-7 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg"
            style={{ animationDelay: "200ms" }}
          >
            {slide.sub}
          </p>

          {/* CTAs */}
          <div
            key={`cta-${current}`}
            className="hero-content-in mt-9 flex flex-wrap gap-3"
            style={{ animationDelay: "280ms" }}
          >
            {slide.cta.to ? (
              <Button
                asChild
                className="h-14 rounded-2xl px-8 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]"
                style={{ background: slide.accent }}
              >
                <Link to={slide.cta.to}>
                  {slide.cta.label} <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            ) : (
              <Button
                className="h-14 rounded-2xl px-8 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: slide.accent }}
                onClick={slide.cta.action}
              >
                {slide.cta.label} <ArrowRight className="ml-2 size-5" />
              </Button>
            )}

            {slide.ctaSecondary.to ? (
              <Button
                asChild
                variant="outline"
                className="h-14 rounded-2xl border-2 border-white/30 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:border-white/50"
              >
                <Link to={slide.ctaSecondary.to}>{slide.ctaSecondary.label}</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="h-14 rounded-2xl border-2 border-white/30 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:border-white/50"
                onClick={slide.ctaSecondary.action}
              >
                {slide.ctaSecondary.label}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="absolute bottom-20 left-0 right-0 z-10 flex justify-center px-6">
        <div className="flex flex-wrap gap-6 sm:gap-10">
          {[
            { value: "18 MW+", label: "Installed" },
            { value: "4,200+", label: "Projects" },
            { value: "77", label: "Districts" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dots + progress ── */}
      <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i, i > current ? "left" : "right")}
            className="hero-dot relative overflow-hidden rounded-full transition-all duration-500"
            style={{
              width: i === current ? "2.5rem" : "0.5rem",
              height: "0.5rem",
              background: i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
            }}
          >
            {i === current && (
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-white/40 transition-none"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Prev / Next arrows ── */}
      <button
        aria-label="Previous slide"
        onClick={prev_}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:scale-110 sm:left-6 sm:size-14"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:scale-110 sm:right-6 sm:size-14"
      >
        <ChevronRight className="size-6" />
      </button>

      {/* ── Live badge top-right ── */}
      <div className="absolute right-6 top-24 z-10 hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
        <span className="relative size-2 rounded-full bg-green-400">
          <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75" />
        </span>
        <span className="text-xs font-bold text-white/90">Live: 18.4 MW generating</span>
        <Zap className="size-3.5 text-yellow-400" />
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute right-6 bottom-7 z-10 hidden sm:block text-xs font-bold text-white/50 font-display">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
