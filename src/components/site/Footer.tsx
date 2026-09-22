import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";
import omsunLogo from "@/assets/Omsun Nepal logo-WA0006.webp";

const columns = [
  {
    title: "Products",
    items: [
      { label: "UPS Systems", to: "/shop" },
      { label: "Inverters", to: "/shop" },
      { label: "Batteries", to: "/shop" },
      { label: "Voltage Stabilizers", to: "/shop" },
      { label: "Solar Products", to: "/shop" },
      { label: "Power Backup Solutions", to: "/shop" },
      { label: "Electrical Products", to: "/shop" },
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
    title: "Quick Links",
    items: [
      { label: "About Us", to: "/why-omsun" },
      { label: "Track Order & Invoice", to: "/track-order" },
      { label: "Contact Us", to: "/contact" },
      { label: "FAQ", to: "/faq" },
      { label: "Projects", to: "/projects" },
      { label: "Warranty & Support", to: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#03C987] text-[#0A2E20] border-t border-[#02B377]">
      {/* Background glow blooms */}
      <div className="pointer-events-none absolute -top-40 left-1/4 size-[500px] rounded-full bg-white/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 size-[400px] rounded-full bg-[#0A2E20]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-28 lg:pb-12">
        {/* ── TOP NEWSLETTER BANNER (DEEP NAVY ON ELECTRIC MINT GREEN) ── */}
        <div className="rounded-3xl border border-[#0A2E20] bg-[#0A2E20] p-8 sm:p-10 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold text-[#03C987] mb-3">
              <Zap className="size-3.5 text-[#03C987]" />
              <span>Reliable Power. Smarter Energy. Better Solutions.</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Stay Informed on Solar Pricing & Tech
            </h3>
            <p className="mt-2 text-xs font-medium text-slate-300 leading-relaxed">
              Subscribe to OMSUN's engineering newsletter for market tariff updates, new N-type
              module shipments, and net-metering policy changes.
            </p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
              const email = emailInput?.value;
              if (!email) return;
              try {
                await api.subscribeNewsletter(email);
                toast.success("Subscribed to OMSUN Nepal updates!", {
                  description:
                    "Market tariff updates, N-type module shipments & net-metering policy changes.",
                });
                emailInput.value = "";
              } catch {
                toast.error("Subscription failed. Please try again.");
              }
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
              OMSUN Nepal Private Limited delivers reliable power backup solutions, including UPS,
              Inverters, Stabilizers, and Solar Products, serving customers across Nepal through
              both its online platform and offline store.
            </p>
            <p className="text-[11px] font-bold text-[#173226]/70 tracking-wide uppercase">
              Reliable Power · Trusted Solutions · Nationwide Service
            </p>

            <ul className="space-y-3.5 text-xs text-[#173226] font-bold">
              <li className="flex items-start gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#173226] text-white border border-[#173226] shrink-0 shadow-xs mt-0.5">
                  <Building2 className="size-4 text-[#43B987]" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#173226]/75">
                    Registered Office
                  </span>
                  <span>Budhanilkantha-8, Kathmandu, Nepal</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#173226] text-white border border-[#173226] shrink-0 shadow-xs mt-0.5">
                  <MapPin className="size-4 text-[#43B987]" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#173226]/75">
                    Showroom & Service Center
                  </span>
                  <span>Bhotebahal Marg-11, Kathmandu, Nepal</span>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#173226] text-white border border-[#173226] shrink-0 shadow-xs">
                  <Phone className="size-4 text-[#43B987]" />
                </span>
                <div className="flex flex-col">
                  <span>+977-9801828498 / +977-9841403747</span>
                  <span className="text-[10px] text-[#173226]/80 font-medium">
                    +977-9841285760 / 01-53114114
                  </span>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#173226] text-white border border-[#173226] shrink-0 shadow-xs">
                  <Mail className="size-4 text-[#43B987]" />
                </span>
                <span>nepalomsun@gmail.com</span>
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
