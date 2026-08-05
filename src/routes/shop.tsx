import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, Rows3, Search, SlidersHorizontal } from "lucide-react";
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

function Shop() {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

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
    <div className="min-h-dvh">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-40">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="px-2">/</span>
          <span className="font-semibold text-foreground">Shop</span>
        </nav>

        <header className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-5xl font-extrabold">All products</h1>
            <p className="mt-3 text-muted-foreground">
              {results.length} of {products.length} products · stocked in Kathmandu
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-12 w-48 rounded-2xl">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-2xl border p-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Grid view"
                onClick={() => setView("grid")}
                className={cn("min-h-11 min-w-11 rounded-xl", view === "grid" && "bg-muted")}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="List view"
                onClick={() => setView("list")}
                className={cn("min-h-11 min-w-11 rounded-xl", view === "list" && "bg-muted")}
              >
                <Rows3 className="size-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="surface-card h-fit p-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.16em]">
              <SlidersHorizontal className="size-4 text-primary" /> Filters
            </div>

            <div className="relative mt-6">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <label htmlFor="shop-search" className="sr-only">
                Search products
              </label>
              <Input
                id="shop-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="h-12 rounded-2xl pl-10"
              />
            </div>

            <FilterGroup title="Category">
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

            <FilterGroup title="Brand">
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

            <FilterGroup title="Max price">
              <Slider
                value={[maxPrice]}
                min={3000}
                max={500000}
                step={1000}
                onValueChange={([v]) => setMaxPrice(v ?? 500000)}
                aria-label="Maximum price"
              />
              <p className="mt-3 text-sm font-semibold">{formatNPR(maxPrice)}</p>
            </FilterGroup>

            <FilterGroup title="Availability">
              <CheckRow
                id="in-stock"
                label="In stock only"
                checked={inStockOnly}
                onChange={() => setInStockOnly((v) => !v)}
              />
            </FilterGroup>
          </aside>

          <section>
            {results.length === 0 ? (
              <div className="surface-card grid place-items-center gap-3 p-16 text-center">
                <Search className="size-8 text-muted-foreground" />
                <h2 className="font-display text-xl font-bold">No products match those filters</h2>
                <p className="text-sm text-muted-foreground">
                  Try widening the price range or clearing a category.
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-6",
                  view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 max-w-2xl",
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
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-3">{children}</div>
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
    <div className="flex items-center gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} className="size-5" />
      <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
        {label}
      </Label>
    </div>
  );
}
