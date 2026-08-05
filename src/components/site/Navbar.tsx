import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  ShoppingCart,
  Zap,
  X,
  ArrowUpRight,
  ChevronDown,
  Sun,
  Gauge,
  BatteryCharging,
  Cable,
  Lightbulb,
  PanelsTopLeft,
  ArrowRight,
  Cpu,
  FileCheck,
  Factory,
  Hotel,
  Building2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/context/CartContext";
import { products, formatNPR } from "@/lib/products";
import omsunLogo from "@/assets/Omsun Nepal logo-WA0006.webp";

import panelImg from "@/assets/p-panel.jpg";
import inverterImg from "@/assets/p-inverter.jpg";
import batteryImg from "@/assets/p-battery.jpg";
import cableImg from "@/assets/p-cable.jpg";
import lightImg from "@/assets/p-light.jpg";
import switchgearImg from "@/assets/p-panelboard.jpg";
import projectImg from "@/assets/project-nepal.jpg";
import heroImg from "@/assets/banner-solar-farm.png";

const links = [
  { label: "Home", to: "/", color: "#f43f5e", glow: "rgba(244,63,94,0.5)", hasMenu: false },
  { label: "Shop", to: "/shop", color: "#818cf8", glow: "rgba(129,140,248,0.5)", hasMenu: true },
  { label: "Solar Solutions", to: "/solar-solutions", color: "#38bdf8", glow: "rgba(56,189,248,0.5)", hasMenu: true },
  { label: "Projects", to: "/projects", color: "#2dd4bf", glow: "rgba(45,212,191,0.5)", hasMenu: true },
  { label: "Why OMSUN", to: "/why-omsun", color: "#a78bfa", glow: "rgba(167,139,250,0.5)", hasMenu: false },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [pillColor, setPillColor] = useState("rgba(255,255,255,0.08)");
  const [activeMenu, setActiveMenu] = useState<"Shop" | "Solar Solutions" | "Projects" | null>(null);

  /* ── Search Modal State ── */
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navListRef = useRef<HTMLUListElement>(null);
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { user, logout } = useAuth();

  /* ── Keyboard shortcut listener for Search (Ctrl+K or Cmd+K) ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleMenuEnter(menuName: string) {
    if (menuName === "Shop" || menuName === "Solar Solutions" || menuName === "Projects") {
      if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
      setActiveMenu(menuName);
    }
  }

  function handleMenuLeave() {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  }

  /* ── scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close mobile menu on nav ── */
  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
    setSearchOpen(false);
  }, [pathname]);

  /* ── sliding coloured pill ── */
  function onLinkEnter(e: React.MouseEvent<HTMLAnchorElement>, link: (typeof links)[0]) {
    setHoveredLink(link.label);
    if (!navListRef.current) return;
    const nr = navListRef.current.getBoundingClientRect();
    const lr = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPillStyle({ left: lr.left - nr.left, width: lr.width, opacity: 1 });
    setPillColor(`color-mix(in srgb, ${link.color} 18%, transparent)`);
  }

  function onNavLeave() {
    setHoveredLink(null);
    setPillStyle((s) => ({ ...s, opacity: 0 }));
  }

  /* Filter products for instant search modal */
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products.slice(0, 4);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled ? "py-2" : "py-3",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ═══════════════ NAV PILL (RELATIVE CONTAINER FOR POP-OVER) ═══════════════ */}
        <nav
          className={cn(
            "relative flex items-center justify-between gap-4 rounded-2xl px-5 py-2.5",
            "border border-white/10 bg-[#071b14]/92 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.55)] backdrop-blur-2xl",
            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
        >
          {/* ── LOGO (START OF NAVBAR) ── */}
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="OMSUN Nepal home"
          >
            <img
              src={omsunLogo}
              alt="OMSUN logo"
              className="h-11 sm:h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <ul
            ref={navListRef}
            className="relative hidden items-center gap-0.5 lg:flex"
            onMouseLeave={onNavLeave}
          >
            {/* Coloured sliding pill */}
            <span
              className="pointer-events-none absolute top-0 h-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left: pillStyle.left,
                width: pillStyle.width,
                opacity: pillStyle.opacity,
                background: pillColor,
                boxShadow: hoveredLink
                  ? `0 0 16px 0 ${links.find((l) => l.label === hoveredLink)?.glow ?? "transparent"}`
                  : "none",
              }}
            />

            {links.map((l) => {
              const isActive =
                pathname === l.to ||
                (l.to !== "/" && pathname.startsWith((l.to ?? "").split("#")[0] ?? ""));
              const isHovered = hoveredLink === l.label;
              const isDropdownOpen = activeMenu === l.label;

              return (
                <li
                  key={l.label}
                  onMouseEnter={() => handleMenuEnter(l.label)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link
                    to={l.to}
                    onMouseEnter={(e) => onLinkEnter(e, l)}
                    className="relative inline-flex min-h-10 items-center gap-1 rounded-full px-4 text-sm font-semibold transition-all duration-200"
                    style={{
                      color:
                        isHovered || isDropdownOpen
                          ? l.color
                          : isActive
                            ? "#fff"
                            : "rgba(255,255,255,0.6)",
                      textShadow:
                        isHovered || isDropdownOpen ? `0 0 18px ${l.glow}` : "none",
                    }}
                  >
                    <span>{l.label}</span>
                    {l.hasMenu && (
                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform duration-300",
                          isDropdownOpen ? "rotate-180 text-emerald-400" : "opacity-60",
                        )}
                      />
                    )}

                    {/* Animated gradient underline bar */}
                    <span
                      className="absolute inset-x-3 bottom-1.5 h-[2px] rounded-full origin-left transition-all duration-300"
                      style={{
                        background: `linear-gradient(90deg, ${l.color}, ${l.color}88)`,
                        transform:
                          isHovered || isActive || isDropdownOpen
                            ? "scaleX(1)"
                            : "scaleX(0)",
                        boxShadow:
                          isHovered || isDropdownOpen ? `0 0 8px 1px ${l.glow}` : "none",
                      }}
                    />

                    {/* Active dot */}
                    {isActive && !isHovered && !isDropdownOpen && (
                      <span
                        className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full"
                        style={{ background: l.color, boxShadow: `0 0 6px 1px ${l.glow}` }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── RIGHT ACTIONS (END OF NAVBAR) ── */}
          <div className="flex items-center justify-end gap-2">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              title="Search products (Ctrl+K)"
              className="group relative flex min-h-10 min-w-10 items-center justify-center rounded-full text-white/70 transition-all duration-300 hover:text-white"
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400/0 transition-all duration-300 group-hover:bg-emerald-400/12 group-hover:shadow-[0_0_18px_2px_rgba(52,211,153,0.3)]" />
              <Search className="relative size-5 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
            </button>

            {/* Cart — glowing badge */}
            <button
              aria-label="Open cart"
              className="group relative hidden min-h-10 min-w-10 items-center justify-center rounded-full text-white/60 transition-all duration-300 hover:text-white sm:inline-flex"
            >
              <span className="absolute inset-0 rounded-full bg-amber-400/0 transition-all duration-300 group-hover:bg-amber-400/12 group-hover:shadow-[0_0_18px_2px_rgba(251,191,36,0.3)]" />
              <ShoppingCart className="relative size-5 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
              <span className="absolute right-1.5 top-1.5 flex size-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                <span className="relative size-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
              </span>
            </button>

            {/* User Auth Section */}
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                  className="group relative hidden min-h-10 items-center rounded-full border border-white/0 px-4 text-sm font-semibold text-white/65 transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:text-white sm:inline-flex"
                >
                  {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
                </Link>
                <button
                  onClick={logout}
                  className="group relative hidden min-h-10 items-center rounded-full border border-white/0 px-4 text-sm font-semibold text-white/65 transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:text-white sm:inline-flex"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="group relative hidden min-h-10 items-center rounded-full border border-white/0 px-4 text-sm font-semibold text-white/65 transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:text-white sm:inline-flex"
              >
                Sign In
              </Link>
            )}

            {/* Get a Quote — animated shimmer CTA */}
            <Link
              to="/shop"
              className="navbar-cta-btn group relative hidden min-h-10 items-center gap-2 overflow-hidden rounded-full px-5 text-sm font-bold text-white lg:inline-flex"
              style={{ background: "linear-gradient(120deg,#6366f1,#0ea5e9,#14b8a6)" }}
            >
              <span className="absolute inset-0 -translate-x-full skew-x-[-18deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[120%]" />
              <Zap className="relative size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="relative">Get a Quote</span>
              <ArrowUpRight className="relative size-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
            </Link>

            {/* Mobile hamburger */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="group relative inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-white/75 transition-all duration-300 hover:text-white lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* ═══════════════ 1. SHOP MEGA MENU POP-OVER ═══════════════ */}
          <div
            className={cn(
              "absolute inset-x-0 top-full z-50 mt-3 w-full pt-1 transition-all duration-300 ease-out",
              activeMenu === "Shop"
                ? "pointer-events-auto visible translate-y-0 opacity-100 scale-100"
                : "pointer-events-none invisible -translate-y-2 opacity-0 scale-95",
            )}
            onMouseEnter={() => handleMenuEnter("Shop")}
            onMouseLeave={handleMenuLeave}
          >
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#051711]/98 p-7 shadow-[0_35px_80px_-10px_rgba(0,0,0,0.9)] backdrop-blur-3xl">
              <div className="grid grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Feature Highlight & Intro */}
                <div className="col-span-4 flex flex-col justify-between border-r border-white/10 pr-8">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Solar & Power Verticals</span>
                    </div>

                    <h3 className="mt-3 font-display text-xl font-bold text-white tracking-tight leading-snug">
                      Engineering Clean Energy for Nepal
                    </h3>

                    <p className="mt-2.5 text-xs text-white/60 leading-relaxed">
                      OMSUN Nepal powers homes, commercial buildings & utility projects with Tier-1 solar panels, smart hybrid storage, and high-voltage grid distribution.
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-white/80">
                        <span className="flex size-4 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 text-[10px]">✓</span>
                        <span>Tier-1 Mono PERC & N-Type Panels</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-medium text-white/80">
                        <span className="flex size-4 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 text-[10px]">✓</span>
                        <span>25-Year Product Performance Guarantee</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/shop"
                    onClick={() => setActiveMenu(null)}
                    className="group/cta mt-6 inline-flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-white"
                  >
                    <span>Browse Full Product Catalog</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
                  </Link>
                </div>

                {/* Right Column: Category Cards with Photos */}
                <div className="col-span-8 grid grid-cols-3 gap-3.5 pl-2">
                  {[
                    { name: "Solar Panels", desc: "Mono-PERC & Bifacial N-Type", icon: Sun, color: "#0ea5e9", image: panelImg },
                    { name: "Hybrid Inverters", desc: "On-Grid & Off-Grid Controllers", icon: Gauge, color: "#6366f1", image: inverterImg },
                    { name: "Energy Storage", desc: "LiFePO4 Powerwalls & Batteries", icon: BatteryCharging, color: "#10b981", image: batteryImg },
                    { name: "Cables & Wiring", desc: "Solar DC Cables & Copper Armor", icon: Cable, color: "#f59e0b", image: cableImg },
                    { name: "Solar Lighting", desc: "Smart Street & All-in-One Lights", icon: Lightbulb, color: "#ec4899", image: lightImg },
                    { name: "Switchgear & Panels", desc: "Industrial Distribution & Breakers", icon: PanelsTopLeft, color: "#8b5cf6", image: switchgearImg },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to="/shop"
                      onClick={() => setActiveMenu(null)}
                      className="group/card relative overflow-hidden rounded-xl border border-white/12 bg-[#082218] transition-all duration-300 hover:border-white/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)] h-full min-h-[92px]"
                    >
                      <img src={item.image} alt={item.name} className="absolute inset-0 size-full object-cover opacity-25 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:opacity-40" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#051a12]/95 via-[#051a12]/85 to-[#051a12]/50" />
                      <div className="relative flex items-center gap-3 p-3 z-10 h-full">
                        <div className="relative shrink-0">
                          <img src={item.image} alt={item.name} className="size-11 rounded-lg border border-white/20 object-cover shadow-md transition-transform duration-300 group-hover/card:scale-105" />
                          <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-md border border-white/20 text-[10px] shadow-sm" style={{ background: item.color, color: "#fff" }}>
                            <item.icon className="size-3" strokeWidth={2.2} />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-display text-xs font-bold text-white transition-colors group-hover/card:text-emerald-300 truncate">
                              {item.name}
                            </h4>
                            <ArrowRight className="size-3.5 shrink-0 text-white/40 opacity-0 -translate-x-1.5 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-x-0 group-hover/card:text-emerald-400" />
                          </div>
                          <p className="mt-0.5 text-[11px] font-medium text-white/60 leading-tight line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════ 2. SOLAR SOLUTIONS MEGA MENU POP-OVER ═══════════════ */}
          <div
            className={cn(
              "absolute inset-x-0 top-full z-50 mt-3 w-full pt-1 transition-all duration-300 ease-out",
              activeMenu === "Solar Solutions"
                ? "pointer-events-auto visible translate-y-0 opacity-100 scale-100"
                : "pointer-events-none invisible -translate-y-2 opacity-0 scale-95",
            )}
            onMouseEnter={() => handleMenuEnter("Solar Solutions")}
            onMouseLeave={handleMenuLeave}
          >
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#051711]/98 p-7 shadow-[0_35px_80px_-10px_rgba(0,0,0,0.9)] backdrop-blur-3xl">
              <div className="grid grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Solution Highlights */}
                <div className="col-span-4 flex flex-col justify-between border-r border-white/10 pr-8">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                      <Sun className="size-3.5" />
                      <span>EPC & Engineering Services</span>
                    </div>

                    <h3 className="mt-3 font-display text-xl font-bold text-white tracking-tight leading-snug">
                      Turnkey Solar EPC & Grid Approvals
                    </h3>

                    <p className="mt-2.5 text-xs text-white/60 leading-relaxed">
                      Custom solar engineering for residential rooftops, factory power plants, mountain resorts, and NEA net-metering synchronization.
                    </p>
                  </div>

                  <Link
                    to="/solar-solutions"
                    onClick={() => setActiveMenu(null)}
                    className="group/cta mt-6 inline-flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-xs font-bold text-sky-300 transition-all duration-300 hover:border-sky-400 hover:bg-sky-500/20 hover:text-white"
                  >
                    <span>View All Solar Solutions</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
                  </Link>
                </div>

                {/* Right Column: 4 Key Solution Cards */}
                <div className="col-span-8 grid grid-cols-2 gap-4 pl-2">
                  {[
                    {
                      title: "Residential Rooftop Systems",
                      desc: "3 kW to 15 kW Systems with Intelligent Auto-Backup & NEA Net Metering",
                      icon: Sun,
                      color: "#38bdf8",
                      image: heroImg,
                    },
                    {
                      title: "Commercial & Industrial EPC",
                      desc: "50 kW to 1 MW+ Solar Plants for Factories, Hotels & Hospitals",
                      icon: Cpu,
                      color: "#818cf8",
                      image: projectImg,
                    },
                    {
                      title: "Off-Grid & Resort Microgrids",
                      desc: "Sub-Zero LiFePO4 Battery Storage for Himalayan Lodges & Remote Sites",
                      icon: BatteryCharging,
                      color: "#2dd4bf",
                      image: heroImg,
                    },
                    {
                      title: "NEA Net-Metering Approvals",
                      desc: "End-to-End Sanctioned Load Study, Wiring Diagrams & Inspection",
                      icon: FileCheck,
                      color: "#fbbf24",
                      image: projectImg,
                    },
                  ].map((sol) => (
                    <Link
                      key={sol.title}
                      to="/solar-solutions"
                      onClick={() => setActiveMenu(null)}
                      className="group/sol relative overflow-hidden rounded-xl border border-white/12 bg-[#082218] p-4 transition-all duration-300 hover:border-white/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)] flex flex-col justify-between"
                    >
                      <img src={sol.image} alt={sol.title} className="absolute inset-0 size-full object-cover opacity-20 transition-transform duration-500 group-hover/sol:scale-110 group-hover/sol:opacity-35" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#051a12]/95 via-[#051a12]/85 to-[#051a12]/60" />
                      
                      <div className="relative z-10 flex items-start gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover/sol:scale-110" style={{ background: `color-mix(in srgb, ${sol.color} 20%, transparent)`, color: sol.color, border: `1px solid ${sol.color}40` }}>
                          <sol.icon className="size-5" strokeWidth={1.8} />
                        </span>
                        <div>
                          <h4 className="font-display text-sm font-bold text-white transition-colors group-hover/sol:text-sky-300">
                            {sol.title}
                          </h4>
                          <p className="mt-1 text-[11px] font-medium text-white/60 leading-snug">
                            {sol.desc}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════ 3. PROJECTS MEGA MENU POP-OVER ═══════════════ */}
          <div
            className={cn(
              "absolute inset-x-0 top-full z-50 mt-3 w-full pt-1 transition-all duration-300 ease-out",
              activeMenu === "Projects"
                ? "pointer-events-auto visible translate-y-0 opacity-100 scale-100"
                : "pointer-events-none invisible -translate-y-2 opacity-0 scale-95",
            )}
            onMouseEnter={() => handleMenuEnter("Projects")}
            onMouseLeave={handleMenuLeave}
          >
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#051711]/98 p-7 shadow-[0_35px_80px_-10px_rgba(0,0,0,0.9)] backdrop-blur-3xl">
              <div className="grid grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Track Record Summary */}
                <div className="col-span-4 flex flex-col justify-between border-r border-white/10 pr-8">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-300">
                      <Zap className="size-3.5" />
                      <span>18 MW+ Installed Capacity</span>
                    </div>

                    <h3 className="mt-3 font-display text-xl font-bold text-white tracking-tight leading-snug">
                      Proven Track Record Across Nepal
                    </h3>

                    <p className="mt-2.5 text-xs text-white/60 leading-relaxed">
                      Over 4,200+ completed installations across all 77 districts — from industrial factories in Biratnagar to high-altitude lodge microgrids in Khumbu.
                    </p>
                  </div>

                  <Link
                    to="/projects"
                    onClick={() => setActiveMenu(null)}
                    className="group/cta mt-6 inline-flex items-center justify-between rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2.5 text-xs font-bold text-teal-300 transition-all duration-300 hover:border-teal-400 hover:bg-teal-500/20 hover:text-white"
                  >
                    <span>Explore All Project Case Studies</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
                  </Link>
                </div>

                {/* Right Column: 3 Featured Project Case Studies */}
                <div className="col-span-8 grid grid-cols-3 gap-3.5 pl-2">
                  {[
                    {
                      title: "320 kW Industrial Rooftop",
                      location: "Bhaktapur • Textile Factory",
                      stat: "74% Bill Offset",
                      icon: Factory,
                      color: "#38bdf8",
                      image: projectImg,
                    },
                    {
                      title: "Resort Off-Grid Microgrid",
                      location: "Khumbu Valley • Hospitality",
                      stat: "100% Diesel Free",
                      icon: Hotel,
                      color: "#2dd4bf",
                      image: heroImg,
                    },
                    {
                      title: "Municipal Smart LED Lighting",
                      location: "Pokhara • 2,400 Luminaires",
                      stat: "Zero Grid Power",
                      icon: Building2,
                      color: "#fbbf24",
                      image: projectImg,
                    },
                  ].map((proj) => (
                    <Link
                      key={proj.title}
                      to="/projects"
                      onClick={() => setActiveMenu(null)}
                      className="group/proj relative overflow-hidden rounded-xl border border-white/12 bg-[#082218] p-4 transition-all duration-300 hover:border-white/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)] flex flex-col justify-between h-full min-h-[140px]"
                    >
                      <img src={proj.image} alt={proj.title} className="absolute inset-0 size-full object-cover opacity-30 transition-transform duration-500 group-hover/proj:scale-110 group-hover/proj:opacity-45" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#051a12]/98 via-[#051a12]/80 to-transparent" />

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="grid size-9 place-items-center rounded-lg text-white" style={{ background: proj.color }}>
                          <proj.icon className="size-4" />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                          {proj.stat}
                        </span>
                      </div>

                      <div className="relative z-10 mt-6">
                        <h4 className="font-display text-xs font-bold text-white transition-colors group-hover/proj:text-teal-300">
                          {proj.title}
                        </h4>
                        <p className="mt-1 text-[10px] font-medium text-white/60">
                          {proj.location}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </nav>

        {/* ═══════════════ SEARCH MODAL DIALOG ═══════════════ */}
        {searchOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
            onClick={() => setSearchOpen(false)}
          >
            <div
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-[#061a13] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top bar with input & close button */}
              <div className="relative flex items-center border-b border-white/10 pb-4">
                <Search className="size-5 text-emerald-400 shrink-0 mr-3" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search solar panels, inverters, batteries, cables..."
                  className="w-full bg-transparent text-white placeholder-white/40 text-base font-medium focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-white/40 hover:text-white mr-3"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setSearchOpen(false)}
                  className="grid size-8 place-items-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Quick Filter Tags */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 mr-1">
                  Quick Search:
                </span>
                {["Solar Panel", "Inverter", "Battery", "Cable", "Lighting", "Switchgear"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/70 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Matching Results List */}
              <div className="mt-6 max-h-[50vh] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      to="/product/$id"
                      params={{ id: p.id }}
                      onClick={() => setSearchOpen(false)}
                      className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition-all hover:border-emerald-500/30 hover:bg-white/[0.08]"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="size-12 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 truncate">
                            {p.name}
                          </h4>
                          <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                            {formatNPR(p.price)}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 truncate mt-0.5">{p.shortDesc}</p>
                      </div>
                      <ArrowRight className="size-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  ))
                ) : (
                  <div className="py-12 text-center text-white/50 text-sm">
                    No products found for "{searchQuery}". Try searching for <span className="text-emerald-400">Panel</span> or <span className="text-emerald-400">Inverter</span>.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ MOBILE DRAWER ═══════════════ */}
        <div
          className={cn(
            "mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#071b14]/92 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
            open
              ? "max-h-[36rem] opacity-100 shadow-[0_20px_50px_-8px_rgba(0,0,0,0.65)]"
              : "max-h-0 opacity-0 shadow-none",
          )}
        >
          <div className="p-3">
            <ul className="space-y-0.5">
              {links.map((l, i) => {
                const isActive =
                  pathname === l.to ||
                  (l.to !== "/" && pathname.startsWith(l.to.split("#")[0] || ""));
                return (
                  <li
                    key={l.label}
                    style={{ transitionDelay: open ? `${i * 55}ms` : "0ms" }}
                    className={cn(
                      "transition-all duration-400",
                      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                    )}
                  >
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="group flex min-h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold transition-all duration-200"
                      style={{
                        color: isActive ? l.color : "rgba(255,255,255,0.6)",
                        background: isActive
                          ? `color-mix(in srgb, ${l.color} 12%, transparent)`
                          : "transparent",
                      }}
                    >
                      <span>{l.label}</span>
                      {isActive && (
                        <span
                          className="size-2 rounded-full"
                          style={{ background: l.color, boxShadow: `0 0 8px 2px ${l.glow}` }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div
              className="my-3 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
              }}
            />

            <div
              className={cn(
                "space-y-2 transition-all duration-400",
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
              style={{ transitionDelay: open ? "220ms" : "0ms" }}
            >
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-xl border border-white/10 text-sm font-semibold text-white/65 transition-all duration-200 hover:border-white/20 hover:bg-white/8 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="navbar-cta-btn group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(120deg,#6366f1,#0ea5e9,#14b8a6)" }}
              >
                <span className="absolute inset-0 -translate-x-full skew-x-[-18deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[120%]" />
                <Zap className="relative size-4" />
                <span className="relative">Get a Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
