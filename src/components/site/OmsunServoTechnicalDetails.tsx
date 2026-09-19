import React from "react";
import {
  ShieldCheck,
  Zap,
  Cpu,
  RotateCw,
  Gauge,
  Thermometer,
  ShieldAlert,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Layers,
  Activity,
  Factory,
} from "lucide-react";
import type { Product } from "@/lib/products";

interface OmsunServoTechnicalDetailsProps {
  product: Product;
}

export const OMSUN_SERVO_FEATURES = [
  {
    feature: "Automatic Voltage Regulation",
    description: "Automatically adjusts the regulator position to maintain stable output voltage.",
    icon: Gauge,
    detail: "Maintains tight ±1% output precision (220V/380V/400V) regardless of upstream grid instability.",
  },
  {
    feature: "Servo Motor Control",
    description: "Drives the voltage regulator according to changes in input voltage or load.",
    icon: RotateCw,
    detail: "High-torque motorized servo smoothly shifts the carbon brush across toroidal copper windings.",
  },
  {
    feature: "Overload Protection",
    description: "Helps protect connected equipment during excessive load conditions.",
    icon: ShieldAlert,
    detail: "Immediate load-monitoring trip prevents thermal degradation and protects downstream wiring.",
  },
  {
    feature: "Low-Voltage Protection",
    description: "Helps protect equipment when the incoming voltage falls below the operating range.",
    icon: ArrowDownCircle,
    detail: "Safeguards motors, compressors, and power supplies from hazardous low-voltage brownouts.",
  },
  {
    feature: "High-Voltage Protection",
    description: "Helps protect equipment when the incoming voltage rises above the operating range.",
    icon: ArrowUpCircle,
    detail: "Instant cut-off blocks destructive over-voltage spikes and transient surges from reaching equipment.",
  },
  {
    feature: "Short-Circuit Protection",
    description: "Provides protection against short-circuit conditions.",
    icon: AlertTriangle,
    detail: "Ultra-fast magnetic/electronic breaker mechanism isolates internal and external fault currents.",
  },
  {
    feature: "High-Temperature Protection",
    description: "Helps protect the unit under high-temperature conditions.",
    icon: Thermometer,
    detail: "Integrated thermal sensor initiates protection if heavy continuous load increases internal heat.",
  },
];

const WHAT_THIS_PRODUCT_DOES = [
  {
    title: "Voltage Fluctuation Correction",
    desc: "Helps correct low and high input voltage dynamically to eliminate voltage dips and surges.",
    icon: Activity,
  },
  {
    title: "Automatic Voltage Regulation",
    desc: "Servo-controlled correction continuously helps maintain the specified regulated output voltage.",
    icon: RotateCw,
  },
  {
    title: "Stable Power Supply",
    desc: "Provides clean, balanced regulated voltage for connected industrial and commercial equipment.",
    icon: Zap,
  },
  {
    title: "Equipment Support & Longevity",
    desc: "Helps reduce electrical stress, premature burnout, and downtime associated with unstable voltage.",
    icon: ShieldCheck,
  },
  {
    title: "Oil / Forced Cooling",
    desc: "Supports efficient heat dissipation during continuous, demanding industrial operations.",
    icon: Thermometer,
  },
  {
    title: "Digital Voltage Monitoring",
    desc: "Front control panels provide digital voltage indication and status parameters for real-time monitoring.",
    icon: Gauge,
  },
];

const DEFAULT_APPLICATIONS = [
  "Factory & Manufacturing Equipment",
  "CNC Machines & Automation",
  "Heavy Electrical Machinery",
  "Printing & Packaging Equipment",
  "Medical & Diagnostic Equipment",
  "Laboratory & Testing Equipment",
  "Telecom Systems & Data Centers",
  "Commercial Buildings & Workshops",
  "Three-Phase Voltage-Sensitive Loads",
];

export function OmsunServoTechnicalDetails({ product }: OmsunServoTechnicalDetailsProps) {
  // Extract dynamic values from specs if available
  const capacitySpec = product.specs?.find(
    (s) => s.label.toLowerCase().includes("capacity") || s.label.toLowerCase().includes("rating")
  )?.value;
  const phaseSpec = product.specs?.find((s) => s.label.toLowerCase().includes("phase"))?.value;
  const inputVoltageSpec = product.specs?.find((s) => s.label.toLowerCase().includes("input"))?.value;
  const outputVoltageSpec = product.specs?.find((s) => s.label.toLowerCase().includes("output"))?.value;
  const coolingSpec = product.specs?.find((s) => s.label.toLowerCase().includes("cooling"))?.value;
  const currentSpec = product.specs?.find(
    (s) => s.label.toLowerCase().includes("current") || s.label.toLowerCase().includes("lead")
  )?.value;

  const displayCapacity = capacitySpec
    ? `${capacitySpec}${phaseSpec ? ` (${phaseSpec})` : ""}`
    : "1 kVA – 150 kVA Industrial Range";

  const displayInput = inputVoltageSpec || "Wide Input Range (Automatic Correction)";
  const displayOutput = outputVoltageSpec || "220V / 380V AC ±1% Precision";

  return (
    <div className="space-y-6">
      {/* ── BRAND HERO HEADER ── */}
      <div className="surface-card relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-background to-emerald-950/20 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <Zap className="size-3.5" />
              <span>Official Engineering Datasheet</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              OMSUN SERVO STABILIZER
            </h2>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mt-0.5">
              High-Precision Motorized Voltage Regulation
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-white/70 dark:bg-black/40 px-3 py-1.5 text-foreground backdrop-blur-sm">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              ±1% Output Precision
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-white/70 dark:bg-black/40 px-3 py-1.5 text-foreground backdrop-blur-sm">
              <Cpu className="size-3.5 text-emerald-500" />
              Servo Motor Controlled
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-white/70 dark:bg-black/40 px-3 py-1.5 text-emerald-600 dark:text-emerald-400 backdrop-blur-sm">
              <ShieldCheck className="size-3.5" />
              7-Point Protection Suite
            </span>
          </div>
        </div>

        {/* Dynamic Highlight Specifications Strip */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-emerald-500/15">
          <div className="rounded-xl bg-white/60 dark:bg-white/5 p-3 border border-emerald-500/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Capacity / Rating
            </span>
            <span className="text-sm sm:text-base font-extrabold text-foreground">
              {displayCapacity}
            </span>
            {currentSpec && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                Rated: {currentSpec} {coolingSpec ? `· ${coolingSpec}` : ""}
              </span>
            )}
          </div>

          <div className="rounded-xl bg-white/60 dark:bg-white/5 p-3 border border-emerald-500/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Input Voltage Range
            </span>
            <span className="text-sm sm:text-base font-extrabold text-foreground">
              {displayInput}
            </span>
            <span className="text-xs text-muted-foreground block mt-0.5">
              Wide Fluctuation Tolerance
            </span>
          </div>

          <div className="rounded-xl bg-white/60 dark:bg-white/5 p-3 border border-emerald-500/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Output Voltage Accuracy
            </span>
            <span className="text-sm sm:text-base font-extrabold text-foreground">
              {displayOutput}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
              Ultra-Stable Regulation
            </span>
          </div>
        </div>
      </div>

      {/* ── PRODUCT OVERVIEW & DESCRIPTION ── */}
      <div className="surface-card rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="size-5 text-emerald-500" />
          <h3 className="font-display text-lg font-extrabold text-foreground">
            Product Overview & Operation
          </h3>
        </div>

        {product.description ? (
          <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium">
            {product.description}
          </p>
        ) : (
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            <strong className="text-foreground font-semibold">OMSUN Servo Stabilizer</strong> is specially designed to manage voltage fluctuations and maintain a consistent output voltage. It consists of a voltage regulation circuit, control circuit, and servo motor.
          </p>
        )}

        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-4 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2">
          <p>
            <strong className="text-foreground">How it works:</strong> When the input voltage or output load changes, the intelligent control circuit samples and magnifies the variation. It immediately drives the precision servo motor to adjust the position of the carbon brush along the toroidal auto-transformer windings.
          </p>
          <p>
            The stabilizer continuously maintains stable voltage by automatically adjusting the ratio of the inductor. This safeguards connected heavy electrical equipment from voltage surges, sags, phase unbalance, and thermal stress.
          </p>
        </div>

        {product.tagline && (
          <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium pt-1">
            Model Configuration: {product.tagline}
          </p>
        )}
      </div>

      {/* ── WHAT THIS PRODUCT DOES ── */}
      <div className="surface-card rounded-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <Layers className="size-5 text-emerald-500" />
            <h3 className="font-display text-lg font-extrabold text-foreground">
              What This Product Does
            </h3>
          </div>
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
            Performance Highlights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHAT_THIS_PRODUCT_DOES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/80 bg-background/50 p-4 transition-all hover:border-emerald-500/30 hover:shadow-sm"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Icon className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TYPICAL APPLICATIONS ── */}
      <div className="surface-card rounded-2xl p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-4">
          <Factory className="size-5 text-emerald-500" />
          <div>
            <h3 className="font-display text-lg font-extrabold text-foreground">
              Typical Applications
            </h3>
            <p className="text-xs text-muted-foreground">
              Engineered for demanding industrial, commercial, and precision electrical equipment
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {DEFAULT_APPLICATIONS.map((app, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-emerald-500/40 transition-colors"
            >
              <CheckCircle2 className="size-3 text-emerald-500" />
              {app}
            </span>
          ))}
        </div>
      </div>

      {/* ── KEY FEATURES & 7-POINT PROTECTION SUITE ── */}
      <div className="surface-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
              7-Point Protection Suite & Core Specifications
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive hardware defense against all common electrical anomalies
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
            Hardware Protection
          </span>
        </div>

        {/* Responsive Breakdown */}
        <div className="divide-y divide-border">
          {OMSUN_SERVO_FEATURES.map((item, idx) => {
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
                    {item.description}
                  </span>
                  <span className="text-xs text-muted-foreground leading-normal block">
                    {item.detail}
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
            OMSUN Nepal Direct Manufacturer Warranty & Support
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {product.name} is supplied directly by OMSUN Nepal with full manufacturer test certificates, serialised warranty card, and comprehensive post-sales service. Our engineering team provides precision sizing, protection coordination, and nationwide maintenance support.
          </p>
        </div>
      </div>
    </div>
  );
}
