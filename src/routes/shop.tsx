import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
  ShieldCheck,
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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  BRANDS,
  CATEGORIES,
  PRODUCT_TAXONOMY,
  formatNPR,
  fallbackProducts,
  mapApiProductToProduct,
} from "@/lib/products";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

import panelImg from "@/assets/p-panel.jpg";
import inverterImg from "@/assets/p-inverter.jpg";
import batteryImg from "@/assets/p-battery.jpg";
import cableImg from "@/assets/p-cable.jpg";
import lightImg from "@/assets/p-light.jpg";
import switchgearImg from "@/assets/p-panelboard.jpg";

type ShopSearch = {
  q?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    return {
      q: typeof search.q === "string" ? search.q : undefined,
      category: typeof search.category === "string" ? search.category : undefined,
      subcategory: typeof search.subcategory === "string" ? search.subcategory : undefined,
      brand: typeof search.brand === "string" ? search.brand : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Shop Solar, UPS, Stabilizers & Security | OMSUN Nepal" },
      {
        name: "description",
        content:
          "Browse OMSUN Nepal's certified product catalog: Online & Offline UPS, Servo & Oil Cooled Stabilizers, CCTV Security, Hybrid Solar systems and LiFePO4 Battery Storage.",
      },
      { property: "og:title", content: "Shop Solar, UPS, Stabilizers & Security | OMSUN Nepal" },
      {
        property: "og:description",
        content: "Filter by category, subcategory, brand, price and availability. Nationwide delivery in Nepal.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();

  const [query, setQuery] = useState(search.q || "");
  const [cats, setCats] = useState<string[]>(search.category ? [search.category] : []);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    search.subcategory || null,
  );
  const [brands, setBrands] = useState<string[]>(search.brand ? [search.brand] : []);
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state whenever URL query params change (e.g. mega-menu navigation)
  useEffect(() => {
    if (search.q !== undefined) {
      setQuery(search.q);
    } else if (search.category === undefined && search.subcategory === undefined && search.brand === undefined) {
      setQuery("");
    }

    if (search.category !== undefined) {
      setCats([search.category]);
    } else if (search.q === undefined && search.subcategory === undefined) {
      setCats([]);
    }

    if (search.subcategory !== undefined) {
      setSelectedSubcategory(search.subcategory);
    } else if (search.category === undefined && search.q === undefined) {
      setSelectedSubcategory(null);
    }

    if (search.brand !== undefined) {
      setBrands([search.brand]);
    } else if (search.category === undefined && search.q === undefined) {
      setBrands([]);
    }
  }, [search.q, search.category, search.subcategory, search.brand]);

  const { data: apiProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const rows = await api.getProducts();
      return rows.map(mapApiProductToProduct);
    },
    staleTime: 5 * 60 * 1000,
  });

  const allProducts = apiProducts ?? fallbackProducts;

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategoryCarousel = (direction: "left" | "right") => {
    if (!categoryScrollRef.current) return;
    const distance = direction === "left" ? -300 : 300;
    categoryScrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  const toggle = (list: string[], set: (v: string[]) => void, value: string) => {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    setSelectedSubcategory(null);
  };

  const selectCategoryCard = (categoryKey: string) => {
    if (categoryKey === "All") {
      setCats([]);
      setSelectedSubcategory(null);
    } else {
      if (cats.length === 1 && cats[0] === categoryKey) {
        setCats([]);
        setSelectedSubcategory(null);
      } else {
        setCats([categoryKey]);
        setSelectedSubcategory(null);
      }
    }
  };

  const clearAllFilters = () => {
    setQuery("");
    setCats([]);
    setSelectedSubcategory(null);
    setBrands([]);
    setMaxPrice(1500000);
    setInStockOnly(false);
  };

  const categoryCards = [
    {
      name: "All Products",
      categoryKey: "All",
      icon: LayoutGrid,
      count: allProducts.length,
      image: null,
      badge: "Full Catalog",
      tag: "All Equipment",
    },
    {
      name: "Stabilizer",
      categoryKey: "Stabilizer",
      icon: Gauge,
      count: allProducts.filter((p) => p.category === "Stabilizer").length,
      image: switchgearImg,
      badge: "Voltage Control",
      tag: "Servo, AVR & Industrial",
    },
    {
      name: "UPS",
      categoryKey: "UPS",
      icon: Zap,
      count: allProducts.filter((p) => p.category === "UPS").length,
      image: inverterImg,
      badge: "Power Backup",
      tag: "Online LF & Industrial",
    },
    {
      name: "Solar",
      categoryKey: "Solar",
      icon: Sun,
      count: allProducts.filter((p) => p.category === "Solar").length,
      image: panelImg,
      badge: "Renewable PV",
      tag: "Panels, Inverters & Kits",
    },
    {
      name: "Battery",
      categoryKey: "Battery",
      icon: BatteryCharging,
      count: allProducts.filter((p) => p.category === "Battery").length,
      image: batteryImg,
      badge: "Energy Storage",
      tag: "LiFePO4 & Tubular",
    },
    {
      name: "Security",
      categoryKey: "Security",
      icon: ShieldCheck,
      count: allProducts.filter((p) => p.category === "Security").length,
      image: lightImg,
      badge: "Surveillance",
      tag: "4K PoE & Solar PTZ",
    },
  ];

  // Derive relevant subcategories based on selected category
  const activeSubcategories = useMemo(() => {
    if (cats.length === 1) {
      const match = PRODUCT_TAXONOMY.find((t) => t.name === cats[0]);
      return match ? match.subcategories : [];
    }
    if (cats.length > 1) {
      return PRODUCT_TAXONOMY.filter((t) => cats.includes(t.name)).flatMap((t) => t.subcategories);
    }
    return PRODUCT_TAXONOMY.flatMap((t) => t.subcategories);
  }, [cats]);

  const activeFilterCount = useMemo(() => {
    return (
      cats.length +
      brands.length +
      (selectedSubcategory ? 1 : 0) +
      (inStockOnly ? 1 : 0) +
      (query.trim() ? 1 : 0) +
      (maxPrice < 1500000 ? 1 : 0)
    );
  }, [cats, brands, selectedSubcategory, inStockOnly, query, maxPrice]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = allProducts.filter((p) => {
      if (q) {
        const specsStr = (p.specs || []).map((s) => `${s.label} ${s.value}`).join(" ");
        const corpus = `${p.name} ${p.category} ${p.subcategory || ""} ${p.brand} ${p.tagline || ""} ${specsStr}`.toLowerCase();
        if (!corpus.includes(q)) return false;
      }
      if (cats.length > 0 && !cats.includes(p.category)) {
        return false;
      }
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) {
        return false;
      }
      if (brands.length > 0 && !brands.includes(p.brand)) {
        return false;
      }
      if (p.price > maxPrice) {
        return false;
      }
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      return true;
    });

    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...filtered].sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [query, cats, selectedSubcategory, brands, maxPrice, inStockOnly, sort, allProducts]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-28 pt-28 sm:pt-36">
        {/* ── BREADCRUMB & PAGE HEADER ── */}
        <div className="flex items-center justify-between">
          <nav
            aria-label="Breadcrumb"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
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
              Showing {results.length} of {allProducts.length} certified products · Direct import
              with serialised 25-year performance warranties across Nepal.
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
                className={cn(
                  "h-9 w-9 rounded-lg transition-all",
                  view === "grid" && "bg-emerald-500 text-black font-bold shadow-md",
                )}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="List view"
                onClick={() => setView("list")}
                className={cn(
                  "h-9 w-9 rounded-lg transition-all",
                  view === "list" && "bg-emerald-500 text-black font-bold shadow-md",
                )}
              >
                <Rows3 className="size-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* ═══════════════ SLIDABLE HORIZONTAL CATEGORY CAROUSEL ═══════════════ */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <SlidersHorizontal className="size-3.5 text-emerald-500" />
                <span>Product Categories</span>
              </span>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  {activeFilterCount} {activeFilterCount === 1 ? "Filter Active" : "Filters Active"}
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
                  : cats.length === 1 && cats[0] === card.categoryKey;

              return (
                <button
                  key={card.name}
                  onClick={() => selectCategoryCard(card.categoryKey)}
                  className={cn(
                    "group relative shrink-0 snap-start flex items-center gap-3.5 rounded-2xl border p-3.5 min-w-[240px] transition-all duration-300 overflow-hidden text-left shadow-lg cursor-pointer",
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
                      loading="lazy"
                      decoding="async"
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
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                        {card.badge}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
                        {card.count}
                      </span>
                    </div>
                    <h4
                      className={cn(
                        "font-display text-xs font-extrabold truncate transition-colors mt-0.5",
                        isSelected
                          ? "text-emerald-300 font-extrabold"
                          : "text-foreground group-hover:text-emerald-400",
                      )}
                    >
                      {card.name}
                    </h4>
                    <p className="text-[10px] font-medium text-muted-foreground truncate">
                      {card.tag}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Subcategory Quick Chips (Dynamic based on selected category) ── */}
          {cats.length === 1 && activeSubcategories.length > 0 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar animate-in fade-in duration-200">
              <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap mr-1">
                {cats[0]} Types:
              </span>
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold transition-all shrink-0 cursor-pointer border",
                  selectedSubcategory === null
                    ? "bg-emerald-500 text-black border-emerald-500 shadow-xs"
                    : "bg-card text-muted-foreground border-white/10 hover:border-emerald-500/40 hover:text-white",
                )}
              >
                All {cats[0]}
              </button>
              {activeSubcategories.map((sub) => {
                const isSubSelected = selectedSubcategory === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(isSubSelected ? null : sub)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold transition-all shrink-0 cursor-pointer border",
                      isSubSelected
                        ? "bg-emerald-500 text-black border-emerald-500 shadow-xs"
                        : "bg-card text-muted-foreground border-white/10 hover:border-emerald-500/40 hover:text-white",
                    )}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ═══════════════ MAIN CONTENT: STICKY SIDEBAR + PRODUCT GRID ═══════════════ */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden">
            <Button
              type="button"
              onClick={() => setMobileFilterOpen((v) => !v)}
              className="flex h-12 w-full items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-emerald-500" />
                <span>{mobileFilterOpen ? "Hide Filter Engine" : "Filter Products & Brands"}</span>
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold">
                {activeFilterCount} Active
              </span>
            </Button>
          </div>

          {/* ── STICKY FIXED SIDEBAR (COLLAPSIBLE ON MOBILE) ── */}
          <aside
            className={cn(
              "h-fit rounded-3xl border border-slate-200 dark:border-white/12 bg-card p-6 shadow-xl lg:sticky lg:top-28 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto custom-scrollbar transition-all duration-300",
              mobileFilterOpen ? "block" : "hidden lg:block",
            )}
          >
            <div className="flex items-center justify-between font-display text-sm font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-emerald-500" />
                <span>Filter Engine</span>
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-emerald-500 hover:underline cursor-pointer"
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
            <FilterGroup title="Product Categories">
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

            {/* Subcategories Filter List */}
            {activeSubcategories.length > 0 && (
              <FilterGroup title="Subcategories">
                {activeSubcategories.map((sub) => (
                  <CheckRow
                    key={sub}
                    id={`subcat-${sub}`}
                    label={sub}
                    checked={selectedSubcategory === sub}
                    onChange={() =>
                      setSelectedSubcategory(selectedSubcategory === sub ? null : sub)
                    }
                  />
                ))}
              </FilterGroup>
            )}

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
                min={5000}
                max={1500000}
                step={5000}
                onValueChange={([v]) => setMaxPrice(v ?? 1500000)}
                aria-label="Maximum price"
                className="accent-emerald-500"
              />
              <div className="mt-2.5 flex items-center justify-between text-xs font-bold text-emerald-500 font-mono">
                <span>NPR 5,000</span>
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
            {/* Active Filter Title & Context Bar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-card border border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-display text-sm font-bold text-slate-800 dark:text-white">
                  {selectedSubcategory
                    ? selectedSubcategory
                    : cats.length === 1
                    ? `${cats[0]} Systems`
                    : "All Certified Electrical & Power Systems"}
                </span>
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs px-2 py-0.5 border border-emerald-300 dark:border-emerald-700/50">
                  {results.length} {results.length === 1 ? "Product" : "Products"}
                </span>
              </div>

              {/* Active Filter Chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {query && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-1 border border-emerald-500/20">
                      Search: &ldquo;{query}&rdquo;
                      <button
                        onClick={() => setQuery("")}
                        className="hover:text-emerald-800 dark:hover:text-emerald-200 cursor-pointer font-black"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {cats.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-1 border border-emerald-500/20"
                    >
                      {c}
                      <button
                        onClick={() => {
                          setCats((prev) => prev.filter((item) => item !== c));
                          setSelectedSubcategory(null);
                        }}
                        className="hover:text-emerald-800 dark:hover:text-emerald-200 cursor-pointer font-black"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedSubcategory && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white font-bold px-2.5 py-1 shadow-xs">
                      {selectedSubcategory}
                      <button
                        onClick={() => setSelectedSubcategory(null)}
                        className="hover:opacity-80 font-black ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {brands.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2.5 py-1 border border-blue-500/20"
                    >
                      {b}
                      <button
                        onClick={() => setBrands((prev) => prev.filter((item) => item !== b))}
                        className="hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer font-black"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {maxPrice < 1500000 && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-1 border border-amber-500/20">
                      Under {formatNPR(maxPrice)}
                      <button
                        onClick={() => setMaxPrice(1500000)}
                        className="hover:text-amber-800 dark:hover:text-amber-200 cursor-pointer font-black"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold px-2.5 py-1 border border-teal-500/20">
                      In Stock Only
                      <button
                        onClick={() => setInStockOnly(false)}
                        className="hover:text-teal-800 dark:hover:text-teal-200 cursor-pointer font-black"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-rose-500 hover:underline px-2 py-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 dark:border-white/12 bg-card grid place-items-center gap-3 p-16 text-center shadow-lg">
                <Search className="size-10 text-muted-foreground" />
                <h2 className="font-display text-xl font-bold">
                  No products match specified criteria
                </h2>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Try clearing your search keyword, adjusting the price ceiling, or selecting "All
                  Products".
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
                  "grid gap-3 sm:gap-6 items-stretch",
                  view === "grid"
                    ? "grid-cols-2 sm:grid-cols-2 xl:grid-cols-3"
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
    <div
      className="flex items-center gap-2.5 group cursor-pointer select-none py-0.5"
      onClick={onChange}
    >
      <Checkbox
        id={id}
        checked={checked}
        tabIndex={-1}
        className="size-4 rounded-md pointer-events-none transition-transform group-hover:scale-105"
      />
      <Label
        htmlFor={id}
        className="cursor-pointer text-xs font-semibold text-foreground/80 group-hover:text-emerald-500 transition-colors pointer-events-none"
      >
        {label}
      </Label>
    </div>
  );
}
