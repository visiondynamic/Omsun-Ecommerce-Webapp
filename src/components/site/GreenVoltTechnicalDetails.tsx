import React from "react";
import {
  ShieldCheck,
  Zap,
  Cpu,
  Clock,
  Activity,
  Award,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  Building2,
  Info,
} from "lucide-react";
import type { Product } from "@/lib/products";

interface GreenVoltTechnicalDetailsProps {
  product: Product;
}

export const GREEN_VOLT_FEATURES = [
  {
    feature: "Made in India",
    details: "Quality & durability",
    icon: Award,
    description: "Manufactured to high engineering standards ensuring prolonged lifespan and resilient operation.",
  },
  {
    feature: "Wide Range",
    details: "1 kVA – 10 kVA; single-phase models for home & office applications",
    icon: Sliders,
    description: "Engineered to protect appliances across single-phase grids with multi-step wide voltage input regulation.",
  },
  {
    feature: "Smart Protection",
    details: "Overload, short circuit, and high/low-voltage cut-off protection",
    icon: ShieldAlert,
    description: "Automatic instantaneous cutoff safeguards your expensive electronics from dangerous voltage surges and brownouts.",
  },
  {
    feature: "Compressor Delay",
    details: "Delay function designed to help protect compressor-based equipment",
    icon: Clock,
    description: "Integrated intelligent time-delay circuit prevents back-pressure damage to air conditioners and refrigerators.",
  },
  {
    feature: "Zero-Crossing Technology",
    details: "Supports controlled electronic voltage regulation",
    icon: Activity,
    description: "Switches relays precisely at zero voltage crossing to eliminate arcing, reduce electrical noise, and extend contact life.",
  },
  {
    feature: "Advanced Microcontroller-Based Design",
    details: "Modern control technology for accurate and automatic voltage regulation",
    icon: Cpu,
    description: "Real-time high-speed digital MCU constantly analyzes grid fluctuations to deliver stable 220V ±5% output.",
  },
];

export function GreenVoltTechnicalDetails({ product }: GreenVoltTechnicalDetailsProps) {
  return (
    <div className="space-y-6">
      {/* ── BRAND HERO HEADER ── */}
      <div className="surface-card relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-background to-emerald-950/20 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <Zap className="size-3.5" />
              <span>Official Digital Stabilizer Datasheet</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              GREENNV VOLT<span className="text-emerald-500 text-lg sm:text-xl font-bold">™</span>
            </h2>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mt-0.5">
              Digital Voltage Stabilizers
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-white/70 dark:bg-black/40 px-3 py-1.5 text-foreground backdrop-blur-sm">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              Single Phase
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-white/70 dark:bg-black/40 px-3 py-1.5 text-foreground backdrop-blur-sm">
              <Building2 className="size-3.5 text-emerald-500" />
              Home & Office
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-white/70 dark:bg-black/40 px-3 py-1.5 text-emerald-600 dark:text-emerald-400 backdrop-blur-sm">
              <Award className="size-3.5" />
              Made in India
            </span>
          </div>
        </div>

        {/* Highlight Specifications Strip */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-emerald-500/15">
          <div className="rounded-xl bg-white/60 dark:bg-white/5 p-3 border border-emerald-500/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Capacity Range
            </span>
            <span className="text-sm sm:text-base font-extrabold text-foreground">
              1 kVA – 10 kVA
            </span>
          </div>

          <div className="rounded-xl bg-white/60 dark:bg-white/5 p-3 border border-emerald-500/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Phase Configuration
            </span>
            <span className="text-sm sm:text-base font-extrabold text-foreground">
              Single Phase (220V AC)
            </span>
          </div>

          <div className="rounded-xl bg-white/60 dark:bg-white/5 p-3 border border-emerald-500/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Target Applications
            </span>
            <span className="text-sm sm:text-base font-extrabold text-foreground">
              Home & Office Equipment
            </span>
          </div>
        </div>
      </div>

      {/* ── ABOUT GREENNV VOLT ── */}
      <div className="surface-card rounded-2xl p-6 sm:p-7 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="size-5 text-emerald-500" />
          <h3 className="font-display text-lg font-extrabold text-foreground">
            About GREENNV VOLT
          </h3>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          <strong className="text-foreground font-semibold">GREENNV VOLT</strong> is a trusted brand in digital voltage stabilizers for air conditioners, refrigerators, and home & office equipment. Its stabilizers are designed to help protect appliances from voltage fluctuations commonly experienced in Nepal.
        </p>
        {product.tagline && (
          <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            Model Focus: {product.tagline}
          </p>
        )}
      </div>

      {/* ── WHY GREENNV VOLT? FEATURE MATRIX ── */}
      <div className="surface-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
              Why GREENNV VOLT?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Engineered protection features & technical performance advantages
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
            Official Feature Matrix
          </span>
        </div>

        {/* Responsive Table / Card Breakdown */}
        <div className="divide-y divide-border">
          {GREEN_VOLT_FEATURES.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 sm:p-5 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors items-start md:items-center"
              >
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <IconComponent className="size-4.5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-foreground block">
                      {item.feature}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-8 pl-12 md:pl-0">
                  <span className="font-semibold text-sm text-foreground block mb-0.5">
                    {item.details}
                  </span>
                  <span className="text-xs text-muted-foreground leading-normal block">
                    {item.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── OMSUN GUARANTEE & SERVICE BACKUP ── */}
      <div className="surface-card rounded-2xl p-6 flex items-start gap-4 border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/10">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-white shadow-md">
          <ShieldCheck className="size-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-display text-sm font-bold text-foreground">
            OMSUN Nepal Authorized Distribution & Local Support
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {product.name} is supplied by OMSUN Nepal with full manufacturer documentation, test certificates, and a serialised 1-year warranty card. Our Teku Kathmandu technical desk provides direct after-sales service, sizing consultations, and fast nationwide delivery across Nepal.
          </p>
        </div>
      </div>
    </div>
  );
}
