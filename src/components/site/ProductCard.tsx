import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Leaf,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatNPR, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  variant = "dark",
}: {
  product: Product;
  variant?: "dark" | "light";
}) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, buyNow } = useCart();

  const out = product.stock === 0;
  const isLight = variant === "light";

  // Calculate discount percentage if compareAt exists
  const discountPercent =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : null;

  return (
    <>
      <article
        className={cn(
          "group relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] p-3 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.02]",
          "border border-[#D8F2DF] bg-white text-[#173226] shadow-sm hover:border-[#38B46A] hover:shadow-lg hover:shadow-[#38B46A]/15",
        )}
      >
        {/* ── PHOTO CONTAINER ── */}
        <div className="relative overflow-hidden rounded-2xl shrink-0 bg-slate-50">
          {/* Top Badges */}
          <div className="absolute left-2.5 top-2.5 z-10 flex flex-wrap gap-1.5">
            {out ? (
              <span className="rounded-lg bg-[#94A3B8] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                Out of Stock
              </span>
            ) : (
              <span className="rounded-lg bg-[#38B46A] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                In Stock
              </span>
            )}
            {product.badges.slice(0, 1).map((b) => {
              const lower = b.toLowerCase();
              let badgeBg = "bg-[#2F80ED]"; // Default Featured (Blue)
              if (lower.includes("new")) badgeBg = "bg-[#38B46A]"; // Green
              if (lower.includes("sale") || lower.includes("off")) badgeBg = "bg-[#F59E0B]"; // Orange
              if (lower.includes("top") || lower.includes("rate")) badgeBg = "bg-[#F4B400]"; // Gold

              return (
                <span
                  key={b}
                  className={cn("rounded-lg px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm", badgeBg)}
                >
                  {b}
                </span>
              );
            })}
          </div>

          {/* Discount Badge */}
          {discountPercent && (
            <div className="absolute right-2.5 top-2.5 z-10 rounded-lg bg-[#F59E0B] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
              -{discountPercent}% OFF
            </div>
          )}

          {/* Product Image Link */}
          <Link to="/product/$id" params={{ id: product.id }} aria-label={product.name}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={800}
              height={800}
              className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Quick View overlay button */}
          <div className="pointer-events-none absolute inset-x-2 bottom-2 flex gap-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
            <Button
              type="button"
              onClick={() => {
                setQuantity(1);
                setQuickViewOpen(true);
              }}
              className="h-9 flex-1 rounded-xl text-[11px] font-bold shadow-lg backdrop-blur-md transition-all border border-slate-200 bg-white/95 text-[#173226] hover:bg-[#38B46A] hover:text-white hover:border-[#38B46A]"
            >
              <Eye className="size-3.5 mr-1" /> Quick View
            </Button>
          </div>
        </div>

        {/* ── CARD CONTENT ── */}
        <div className="flex flex-1 flex-col justify-between gap-2 p-1.5 pt-2.5">
          <div>
            {/* Category */}
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-500/90 mb-0.5">
              {product.category}
            </div>

            {/* Title (2 lines max - Daraz style) */}
            <h3
              className={cn(
                "font-display text-xs sm:text-sm font-bold leading-tight line-clamp-2 min-h-[2.3rem] transition-colors",
                isLight
                  ? "text-slate-900 group-hover:text-emerald-700"
                  : "text-white group-hover:text-emerald-300",
              )}
            >
              <Link to="/product/$id" params={{ id: product.id }}>
                {product.name}
              </Link>
            </h3>

            {/* Price & Discount Row (OMSUN Theme) */}
            <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
              <span className={cn("font-display text-sm sm:text-base font-extrabold", isLight ? "text-emerald-700" : "text-emerald-400")}>
                {formatNPR(product.price)}
              </span>
              {product.compareAt ? (
                <span className={cn("text-[11px] line-through font-mono", isLight ? "text-slate-400" : "text-white/40")}>
                  {formatNPR(product.compareAt)}
                </span>
              ) : null}
            </div>

            {/* Star Rating & Sold Count */}
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              <span className="flex items-center gap-0.5 font-bold text-amber-400">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </span>
              <span>•</span>
              <span>388 sold</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-1.5 border-t border-slate-200/60 dark:border-white/10 mt-2">
            {/* OMSUN DUAL ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              <Button
                disabled={out}
                onClick={() => addToCart(product, 1)}
                variant="outline"
                className={cn(
                  "h-9 rounded-xl font-bold text-[10px] sm:text-xs px-1 sm:px-2 transition-all border",
                  isLight
                    ? "border-emerald-600 text-emerald-800 hover:bg-emerald-50 bg-emerald-50/50"
                    : "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 bg-emerald-500/10",
                )}
              >
                <ShoppingCart className="size-3 mr-1 shrink-0 hidden sm:inline-block" />
                <span className="truncate">Cart</span>
              </Button>

              <Button
                disabled={out}
                onClick={() => buyNow(product, 1)}
                className="h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-extrabold text-[10px] sm:text-xs px-1 sm:px-2 text-white shadow-md transition-all hover:from-emerald-400 hover:to-teal-500 hover:scale-[1.02]"
              >
                <Zap className="size-3 mr-1 shrink-0 hidden sm:inline-block" />
                <span className="truncate">Buy Now</span>
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* ═══════════════ DARAZ-STYLE QUICK VIEW DIALOG MODAL ═══════════════ */}
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border-slate-200 dark:border-white/15 bg-white dark:bg-[#061e16] p-0 shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{product.name} Quick View</DialogTitle>
          </DialogHeader>

          <div className="grid gap-0 md:grid-cols-2">
            {/* Left Image Section */}
            <div className="relative bg-slate-100 dark:bg-[#03140e] p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-500 border border-amber-400/20">
                  <Star className="size-3.5 fill-amber-400" /> {product.rating}
                </span>
              </div>

              <div className="my-6 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 p-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover rounded-xl"
                />
              </div>

              {/* Daraz Trust Badges */}
              <div className="space-y-2 border-t border-slate-200 dark:border-white/10 pt-3 text-[11px] font-semibold text-slate-600 dark:text-white/70">
                <div className="flex items-center gap-2">
                  <Truck className="size-3.5 text-emerald-500" />
                  <span>48-Hour Kathmandu Warehouse Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="size-3.5 text-emerald-500" />
                  <span>7 Days Easy Return Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  <span>100% Genuine Warranty Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Right Details & Dual Action Buttons */}
            <div className="p-6 sm:p-8 flex flex-col justify-between text-slate-900 dark:text-white">
              <div>
                <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Brand: {product.brand}
                </div>

                <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight">
                  {product.name}
                </h2>

                <p className="mt-2 text-xs font-medium text-slate-600 dark:text-white/70 leading-relaxed">
                  {product.tagline}
                </p>

                {/* Price Section */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-display text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                    {formatNPR(product.price)}
                  </span>
                  {product.compareAt && (
                    <span className="text-xs text-slate-400 dark:text-white/40 line-through font-medium">
                      {formatNPR(product.compareAt)}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-extrabold text-red-500 border border-red-500/20">
                      -{discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Specs List */}
                <div className="mt-6 space-y-2 border-t border-b border-slate-200 dark:border-white/10 py-4">
                  {[
                    "Certified Tier-1 Engineering Specification",
                    "Built for High-Altitude & Monsoonal Conditions",
                    "Nepal Grid Net-Metering Paperwork Included",
                  ].map((h) => (
                    <div key={h} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-emerald-300">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Dual Actions */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-white/70">
                    Quantity:
                  </span>
                  <div className="flex items-center rounded-xl border border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-black/30 p-1">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="grid size-8 place-items-center rounded-lg text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-10 text-center font-mono text-sm font-bold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= (product.stock || 1)}
                      onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                      className="grid size-8 place-items-center rounded-lg text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    disabled={out}
                    onClick={() => {
                      addToCart(product, quantity);
                      setQuickViewOpen(false);
                    }}
                    className="h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs hover:bg-emerald-500 hover:text-black"
                  >
                    <ShoppingCart className="size-4 mr-1.5" />
                    Add to Cart
                  </Button>

                  <Button
                    disabled={out}
                    onClick={() => {
                      setQuickViewOpen(false);
                      buyNow(product, quantity);
                    }}
                    className="h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs shadow-lg hover:from-orange-400 hover:to-amber-500"
                  >
                    <Zap className="size-4 mr-1.5" />
                    Buy Now
                  </Button>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="h-10 w-full rounded-xl border-slate-300 dark:border-white/20 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <Link
                    to="/product/$id"
                    params={{ id: product.id }}
                    onClick={() => setQuickViewOpen(false)}
                    className="flex items-center justify-center gap-1.5"
                  >
                    <span>View Full Product Page</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
