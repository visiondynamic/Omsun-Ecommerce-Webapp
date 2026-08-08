import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Building2,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Youtube,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import omsunLogo from "@/assets/Omsun Nepal logo-WA0006.webp";

const columns = [
  {
    title: "Product Verticals",
    items: [
      { label: "Solar Panels", to: "/shop" },
      { label: "Hybrid Inverters", to: "/shop" },
      { label: "Energy Storage", to: "/shop" },
      { label: "Cables & Wiring", to: "/shop" },
      { label: "Solar Lighting", to: "/shop" },
      { label: "Switchgear & Panels", to: "/shop" },
    ],
  },
  {
    title: "Engineering Solutions",
    items: [
      { label: "Residential Solar", to: "/solar-solutions" },
      { label: "Commercial & Industrial EPC", to: "/solar-solutions" },
      { label: "Off-Grid Himalayan Microgrids", to: "/solar-solutions" },
      { label: "NEA Net-Metering", to: "/solar-solutions" },
      { label: "3D Shadow Analysis", to: "/solar-solutions" },
    ],
  },
  {
    title: "Company & Trust",
    items: [
      { label: "Why OMSUN", to: "/why-omsun" },
      { label: "Case Studies & Projects", to: "/projects" },
      { label: "Warranty & Support", to: "/why-omsun" },
      { label: "Central Kathmandu Hub", to: "/why-omsun" },
      { label: "Careers & Integration", to: "/why-omsun" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#03C987] text-[#0A2E20] border-t border-[#02B377]">
      {/* Background glow blooms */}
      <div className="pointer-events-none absolute -top-40 left-1/4 size-[500px] rounded-full bg-white/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 size-[400px] rounded-full bg-[#0A2E20]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-12">
        {/* ── TOP NEWSLETTER BANNER (DEEP NAVY ON ELECTRIC MINT GREEN) ── */}
        <div className="rounded-3xl border border-[#0A2E20] bg-[#0A2E20] p-8 sm:p-10 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold text-[#03C987] mb-3">
              <Zap className="size-3.5 text-[#03C987]" />
              <span>Renewable Energy Updates in Nepal</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Stay Informed on Solar Pricing & Tech
            </h3>
            <p className="mt-2 text-xs font-medium text-slate-300 leading-relaxed">
              Subscribe to OMSUN's engineering newsletter for market tariff updates, new N-type module shipments, and net-metering policy changes.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing to OMSUN Nepal updates!");
            }}
            className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2.5 shrink-0 max-w-md"
          >
            <Input
              type="email"
              placeholder="Enter your email address"
              required
              className="h-12 rounded-xl border-white/20 bg-black/40 text-xs text-white placeholder:text-white/50 focus-visible:ring-[#03C987] w-full"
            />
            <Button
              type="submit"
              className="h-12 rounded-full bg-[#03C987] text-[#0A2E20] font-extrabold text-xs px-6 hover:bg-white shrink-0 shadow-lg w-full sm:w-auto justify-center"
            >
              <span>Subscribe</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          </form>
        </div>

        {/* ── MAIN FOOTER CONTENT GRID ── */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2.5fr]">
          {/* Column 1: Official Logo & Contact Details */}
          <div className="space-y-6">
            <Link to="/" className="inline-block" aria-label="OMSUN Nepal Homepage">
              <img
                src={omsunLogo}
                alt="OMSUN Solar & Electrical Nepal"
                className="h-12 sm:h-14 w-auto object-contain block"
              />
            </Link>

            <p className="text-xs font-semibold text-[#173226]/90 leading-relaxed max-w-md">
              OMSUN Nepal Pvt. Ltd. is a premier EPC contractor, importer, and distributor of Tier-1 solar panels, hybrid inverters, LiFePO4 batteries, copper cables, and switchgear in Nepal.
            </p>

            <ul className="space-y-3 text-xs text-[#173226] font-bold">
              <li className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#173226] text-white border border-[#173226] shrink-0 shadow-xs">
                  <MapPin className="size-4 text-[#43B987]" />
                </span>
                <span>Teku Central Hub, Kathmandu, Nepal</span>
              </li>

              <li className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#173226] text-white border border-[#173226] shrink-0 shadow-xs">
                  <Phone className="size-4 text-[#43B987]" />
                </span>
                <div className="flex flex-col">
                  <span>+977 1 5320 118 / +977 9801 234 567</span>
                  <span className="text-[10px] text-[#173226]/80 font-medium">Mon–Fri: 9:00 AM – 6:00 PM</span>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#173226] text-white border border-[#173226] shrink-0 shadow-xs">
                  <Mail className="size-4 text-[#43B987]" />
                </span>
                <span>info@omsunnepal.com / sales@omsunnepal.com</span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              {[
                { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-xl border border-[#173226]/30 bg-white/40 text-[#173226] hover:bg-[#173226] hover:text-white transition-all shadow-xs"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: 3-Column Navigation Links */}
          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#173226] mb-5">
                  {col.title}
                </h4>
                <ul className="space-y-3 text-xs">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="text-[#173226]/80 hover:text-black font-bold transition-colors inline-flex items-center gap-1 group"
                      >
                        <span className="transition-transform group-hover:translate-x-1 duration-200">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── TRUST & CERTIFICATIONS STRIP ── */}
        <div className="mt-14 border-t border-[#173226]/20 pt-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#173226] font-bold">
            <span className="flex items-center gap-1.5 text-[#173226]">
              <ShieldCheck className="size-4 text-[#173226]" />
              <span>NEA Net-Metering Certified</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#173226]">
              <Award className="size-4 text-[#173226]" />
              <span>TÜV & IEC Certified Equipment</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#173226]">
              <Building2 className="size-4 text-[#173226]" />
              <span>ISO 9001:2015 Quality System</span>
            </span>
          </div>

          <div className="text-[11px] text-[#173226]/80 font-mono font-semibold">
            Direct Warehouse Logistics: Kathmandu · Pokhara · Biratnagar · Butwal
          </div>
        </div>
      </div>

      {/* ── BOTTOM COPYRIGHT BAR ── */}
      <div className="border-t border-[#3AA678] bg-[#38A678] py-6 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
          <p>© {new Date().getFullYear()} OMSUN Nepal Pvt. Ltd. All rights reserved.</p>

          <p className="hidden md:flex items-center gap-2 opacity-90">
            <span>Powering Clean Energy Infrastructure Across Nepal</span>
          </p>

          <div className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3.5 py-1 text-[11px] font-bold text-white shadow-sm">
            <span className="opacity-80 font-medium">Powered by</span>
            <span className="font-extrabold tracking-wide">Vision Dynamic Pvt. Ltd.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
