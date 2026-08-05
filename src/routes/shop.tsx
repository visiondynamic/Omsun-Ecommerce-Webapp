import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  BatteryCharging,
  Cable,
  ChevronLeft,
  ChevronRight,
  Gauge,
  LayoutGrid,
  Lightbulb,
  PanelsTopLeft,
  Rows3,
  Search,
  SlidersHorizontal,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRANDS, CATEGORIES, formatNPR, products } from "@/lib/products";
import { cn } from "@/lib/utils";

import panelImg from "@/assets/p-panel.jpg";
import inverterImg from "@/assets/p-inverter.jpg";
import batteryImg from "@/assets/p-battery.jpg";
import cableImg from "@/assets/p-cable.jpg";
import lightImg from "@/assets/p-light.jpg";
import switchgearImg from "@/assets/p-panelboard.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Solar & Electrical Products | OMSUN Nepal" },
      {
        name: "description",
        content:
          "Browse OMSUN Nepal's catalogue of solar panels, hybrid inverters, storage batteries, copper cables, LED lighting and industrial switchgear with live stock levels.",
      },
      { property: "og:title", content: "Shop Solar & Electrical Products | OMSUN Nepal" },
      {
        property: "og:description",
        content: "Filter by category, brand, price and availability. Nationwide delivery in Nepal.",
      },
    ],
  }),
  component: Shop,
});

const categoryCards = [
  { name: "All Products", categoryKey: "All", icon: LayoutGrid, count: products.length, image: null },
  { name: "Solar Panels", categoryKey: "Solar Panels", icon: Sun, count: products.filter((p) => p.category === "Solar Panels").length, image: panelImg },
  { name: "Inverters", categoryKey: "Inverters", icon: Gauge, count: products.filter((p) => p.category === "Inverters").length, image: inverterImg },
  { name: "Energy Storage", categoryKey: "Energy Storage", icon: BatteryCharging, count: products.filter((p) => p.category === "Energy Storage").length, image: batteryImg },
  { name: "Cables & Wiring", categoryKey: "Cables & Wiring", icon: Cable, count: products.filter((p) => p.category === "Cables & Wiring").length, image: cableImg },
  { name: "Lighting", categoryKey: "Lighting", icon: Lightbulb, count: products.filter((p) => p.category === "Lighting").length, image: lightImg },
  { name: "Switchgear & Panels", categoryKey: "Switchgear & Panels", icon: PanelsTopLeft, count: products.filter((p) => p.category === "Switchgear & Panels").length, image: switchgearImg },
];

function Shop() {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategoryCarousel = (direction: "left" | "right") => {
    if (!categoryScrollRef.current) return;
    const distance = direction === "left" ? -300 : 300;
    categoryScrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const selectSingleCategory = (catKey: string) => {
    if (catKey === "All") {
      setCats([]);
    } else {
      setCats([catKey]);
    }
  };

  const clearAllFilters = () => {
    setQuery("");
    setCats([]);
    setBrands([]);
    setMaxPrice(500000);
    setInStockOnly(false);
  };

  const results = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (!query ||
          `${p.name} ${p.category} ${p.brand}`.toLowerCase().includes(query.toLowerCase())) &&
        (cats.length === 0 || cats.includes(p.category)) &&
        (brands.length === 0 || brands.includes(p.brand)) &&
        p.price <= maxPrice &&
        (!inStockOnly || p.stock > 0),
    );
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...filtered].sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [query, cats, brands, maxPrice, inStockOnly, sort]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-28 pt-28 sm:pt-36">
        {/* ── BREADCRUMB & PAGE HEADER ── */}
        <div className="flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="px-2 text-white/30">/</span>
            <span className="text-emerald-500 font-bold">Catalog</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
            <Zap className="size-3.5" />
            <span>Kathmandu Warehouse Dispatched</span>
          </span>
        </div>

        <header className="mt-4 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl tracking-tight">
              Solar & Electrical Hardware Catalog
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-medium max-w-2xl">
              Showing {results.length} of {products.length} certified products · Direct import with serialised 25-year performance warranties across Nepal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-11 w-48 rounded-xl border-slate-300 dark:border-white/15 bg-card text-xs font-semibold">
                <SelectValue placeholder="Sort Catalog" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated Only</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-xl border border-slate-300 dark:border-white/15 p-1 bg-card">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Grid view"
                onClick={() => setView("grid")}
                className={cn("h-9 w-9 rounded-lg transition-all", view === "grid" && "bg-emerald-500 text-black font-bold shadow-md")}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="List view"
                onClick={() => setView("list")}
                className={cn("h-9 w-9 rounded-lg transition-all", view === "list" && "bg-emerald-500 text-black font-bold shadow-md")}
              >
                <Rows3 className="size-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* ═══════════════ SLIDABLE HORIZONTAL CATEGORY CAROUSEL ═══════════════ */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <SlidersHorizontal className="size-3.5 text-emerald-500" />
                <span>Product Categories</span>
              </span>
              {(cats.length > 0 || brands.length > 0 || query || inStockOnly) && (
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  Filters Active
                </span>
              )}
            </div>

            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCategoryCarousel("left")}
                aria-label="Scroll left"
                className="grid size-8 place-items-center rounded-lg border border-white/15 bg-card text-muted-foreground hover:text-white hover:border-white/30 transition-all"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => scrollCategoryCarousel("right")}
                aria-label="Scroll right"
                className="grid size-8 place-items-center rounded-lg border border-white/15 bg-card text-muted-foreground hover:text-white hover:border-white/30 transition-all"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div
            ref={categoryScrollRef}
            className="no-scrollbar flex gap-3.5 overflow-x-auto scroll-smooth pb-3 snap-x"
          >
            {categoryCards.map((card) => {
              const isSelected =
                card.categoryKey === "All"
                  ? cats.length === 0
                  : cats.includes(card.categoryKey);

              return (
                <button
                  key={card.name}
                  onClick={() => selectSingleCategory(card.categoryKey)}
                  className={cn(
                    "group relative shrink-0 snap-start flex items-center gap-3.5 rounded-2xl border p-3.5 min-w-[220px] transition-all duration-300 overflow-hidden text-left shadow-lg",
                    isSelected
                      ? "border-emerald-500 bg-[#072b1e] text-white shadow-emerald-500/20 ring-2 ring-emerald-500/60"
                      : "border-slate-200 dark:border-white/12 bg-card hover:border-emerald-400/60 hover:bg-emerald-500/5",
                  )}
                >
                  {/* Category Image Overlay */}
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.name}
                      className="absolute inset-0 size-full object-cover opacity-15 group-hover:opacity-25 transition-opacity"
                    />
                  )}

                  {/* Icon */}
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-xl transition-all duration-300 relative z-10",
                      isSelected
                        ? "bg-emerald-500 text-black shadow-md"
                        : "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black",
                    )}
                  >
                    <card.icon className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1 relative z-10">
                    <h4
                      className={cn(
                        "font-display text-xs font-bold truncate transition-colors",
                        isSelected ? "text-emerald-300 font-extrabold" : "text-foreground group-hover:text-emerald-400",
                      )}
                    >
                      {card.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {card.count} {card.count === 1 ? "Product" : "Products"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══════════════ MAIN CONTENT: STICKY SIDEBAR + PRODUCT GRID ═══════════════ */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* ── STICKY FIXED SIDEBAR ── */}
          <aside className="h-fit rounded-3xl border border-slate-200 dark:border-white/12 bg-card p-6 shadow-xl lg:sticky lg:top-28 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between font-display text-sm font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-emerald-500" />
                <span>Filter Engine</span>
              </span>
              {(cats.length > 0 || brands.length > 0 || query || inStockOnly) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-emerald-500 hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Instant Search Input */}
            <div className="relative mt-5">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search specs or brands..."
                className="h-11 rounded-xl pl-10 border-slate-300 dark:border-white/15 text-xs font-medium focus-visible:ring-emerald-500"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Category Checkbox List */}
            <FilterGroup title="Product Families">
              {CATEGORIES.map((c) => (
                <CheckRow
                  key={c}
                  id={`cat-${c}`}
                  label={c}
                  checked={cats.includes(c)}
                  onChange={() => toggle(cats, setCats, c)}
                />
              ))}
            </FilterGroup>

            {/* Brand Checkbox List */}
            <FilterGroup title="Certified Manufacturers">
              {BRANDS.map((b) => (
                <CheckRow
                  key={b}
                  id={`brand-${b}`}
                  label={b}
                  checked={brands.includes(b)}
                  onChange={() => toggle(brands, setBrands, b)}
                />
              ))}
            </FilterGroup>

            {/* Max Price Slider */}
            <FilterGroup title="Price Range Limit">
              <Slider
                value={[maxPrice]}
                min={3000}
                max={500000}
                step={1000}
                onValueChange={([v]) => setMaxPrice(v ?? 500000)}
                aria-label="Maximum price"
                className="accent-emerald-500"
              />
              <div className="mt-2.5 flex items-center justify-between text-xs font-bold text-emerald-500 font-mono">
                <span>NPR 3,000</span>
                <span>{formatNPR(maxPrice)}</span>
              </div>
            </FilterGroup>

            {/* Stock Availability */}
            <FilterGroup title="Inventory Status">
              <CheckRow
                id="in-stock"
                label="Stocked in Kathmandu Only"
                checked={inStockOnly}
                onChange={() => setInStockOnly((v) => !v)}
              />
            </FilterGroup>
          </aside>

          {/* ── PRODUCT RESULTS GRID ── */}
          <section>
            {results.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 dark:border-white/12 bg-card grid place-items-center gap-3 p-16 text-center shadow-lg">
                <Search className="size-10 text-muted-foreground" />
                <h2 className="font-display text-xl font-bold">No products match specified criteria</h2>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Try clearing your search keyword, adjusting the price ceiling, or selecting "All Products".
                </p>
                <Button
                  onClick={clearAllFilters}
                  className="mt-4 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-md hover:bg-emerald-400"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-6 items-stretch",
                  view === "grid"
                    ? "sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1 max-w-3xl",
                )}
              >
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-slate-200 dark:border-white/10 pt-5">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
        {title}
      </h2>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer" onClick={onChange}>
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} className="size-4 rounded-md" />
      <Label htmlFor={id} className="cursor-pointer text-xs font-semibold text-foreground/80 group-hover:text-emerald-500 transition-colors">
        {label}
      </Label>
    </div>
  );
}
