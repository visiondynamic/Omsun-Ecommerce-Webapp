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
  accent: string;
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
  const SLIDE_DURATION = 4200;

  const slides: Slide[] = [
    {
      id: 0,
      image: bannerSolarFarm,
      badge: "Nepal's #1 Solar Partner",
      badgeIcon: <Sun className="size-3.5" />,
      headline: ["Power That", "Pays You"],
      accentWord: "Back.",
      sub: "Tier-1 monocrystalline & bifacial solar modules engineered for high altitude Himalayan sun & monsoon reliability.",
      cta: { label: "Explore Solar Panels", to: "/shop" },
      ctaSecondary: {
        label: "Get Free Site Sizing",
        action: () => toast.success("Our sales engineer will reach out within 24 hours."),
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
      sub: "Modular lithium iron-phosphate powerwalls with 6,000+ deep cycle life for continuous off-grid reliability.",
      cta: { label: "Browse Battery Storage", to: "/shop" },
      ctaSecondary: {
        label: "Talk to an Engineer",
        action: () => toast.success("Our sales engineer will reach out within 24 hours."),
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
      sub: "Complete rooftop solar design, equipment supply & turnkey EPC commissioning across all 7 provinces of Nepal.",
      cta: {
        label: "Request Installation",
        action: () => toast.success("Our sales engineer will reach out within 24 hours."),
      },
      ctaSecondary: { label: "View Nepal Projects", to: "/projects" },
      accent: "linear-gradient(120deg,#10b981,#059669,#0d9488)",
      accentGlow: "rgba(16,185,129,0.35)",
    },
    {
      id: 3,
      image: bannerInverter,
      badge: "Hybrid Inverter Tech",
      badgeIcon: <Gauge className="size-3.5" />,
      headline: ["Smart Hybrid", "Power"],
      accentWord: "Control.",
      sub: "Certified hybrid, on-grid & off-grid inverters stocked in Kathmandu and dispatched nationwide within 48 hours.",
      cta: { label: "Shop Hybrid Inverters", to: "/shop" },
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
      sub: "18 MW+ installed capacity and 4,200+ active energy projects backed by zero-compromise warranty support.",
      cta: { label: "View Our Projects", to: "/projects" },
      ctaSecondary: {
        label: "Become a Distributor",
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

  const nextRef = useRef(next);
  const prevRef = useRef(prev_);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);
  useEffect(() => {
    prevRef.current = prev_;
  }, [prev_]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => nextRef.current(), SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

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
      className="hero-slider relative isolate min-h-[580px] h-[85dvh] sm:h-[90svh] lg:h-[94svh] overflow-hidden bg-[#020d08]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background Slides ── */}
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
          {/* Contrast Dark Gradient Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(2,13,8,0.88) 0%, rgba(2,13,8,0.65) 50%, rgba(2,13,8,0.95) 100%)`,
            }}
          />
        </div>
      ))}

      {/* ── Main Content Container with Guaranteed Navbar Clearance (pt-36 sm:pt-40 lg:pt-44) ── */}
      <div className="relative z-10 flex h-full flex-col justify-center px-5 sm:px-12 lg:px-20 pt-36 sm:pt-40 lg:pt-44 pb-16">
        <div className="max-w-3xl">
          {/* Eyebrow Pill Badge */}
          <div
            key={`badge-${current}`}
            className="hero-content-in mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md"
          >
            <span className="text-emerald-400">{slide.badgeIcon}</span>
            <span>{slide.badge}</span>
          </div>

          {/* Responsive Headline */}
          <h1
            key={`h1-${current}`}
            className="hero-content-in font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.05] text-white tracking-tight"
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
              }}
            >
              {slide.accentWord}
            </span>
          </h1>

          {/* Subtext */}
          <p
            key={`sub-${current}`}
            className="hero-content-in mt-4 sm:mt-6 max-w-xl text-xs sm:text-base lg:text-lg font-medium text-white/85 leading-relaxed"
          >
            {slide.sub}
          </p>

          {/* Action CTAs */}
          <div
            key={`cta-${current}`}
            className="hero-content-in mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3"
          >
            {slide.cta.to ? (
              <Button
                asChild
                className="h-13 sm:h-14 rounded-xl sm:rounded-2xl px-7 sm:px-8 text-xs sm:text-base font-bold text-white shadow-2xl transition-all hover:scale-[1.02] w-full sm:w-auto"
                style={{ background: slide.accent }}
              >
                <Link to={slide.cta.to}>
                  {slide.cta.label} <ArrowRight className="ml-2 size-4 sm:size-5" />
                </Link>
              </Button>
            ) : (
              <Button
                className="h-13 sm:h-14 rounded-xl sm:rounded-2xl px-7 sm:px-8 text-xs sm:text-base font-bold text-white shadow-2xl transition-all hover:scale-[1.02] w-full sm:w-auto"
                style={{ background: slide.accent }}
                onClick={slide.cta.action}
              >
                {slide.cta.label} <ArrowRight className="ml-2 size-4 sm:size-5" />
              </Button>
            )}

            {slide.ctaSecondary.to ? (
              <Button
                asChild
                variant="outline"
                className="h-13 sm:h-14 rounded-xl sm:rounded-2xl border border-white/30 bg-white/10 px-7 sm:px-8 text-xs sm:text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 w-full sm:w-auto"
              >
                <Link to={slide.ctaSecondary.to}>{slide.ctaSecondary.label}</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="h-13 sm:h-14 rounded-xl sm:rounded-2xl border border-white/30 bg-white/10 px-7 sm:px-8 text-xs sm:text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 w-full sm:w-auto"
                onClick={slide.ctaSecondary.action}
              >
                {slide.ctaSecondary.label}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Slide Dots Indicator Bar ── */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i, i > current ? "left" : "right")}
            className="hero-dot relative overflow-hidden rounded-full transition-all duration-500"
            style={{
              width: i === current ? "2.2rem" : "0.5rem",
              height: "0.45rem",
              background: i === current ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
            }}
          >
            {i === current && (
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-400 transition-none"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Wide Desktop Only Side Arrows (xl:grid to avoid any floating on tablet) ── */}
      <button
        aria-label="Previous slide"
        onClick={prev_}
        className="absolute left-6 top-1/2 z-10 hidden xl:grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 hover:scale-110"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="absolute right-6 top-1/2 z-10 hidden xl:grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 hover:scale-110"
      >
        <ChevronRight className="size-6" />
      </button>
    </section>
  );
}
