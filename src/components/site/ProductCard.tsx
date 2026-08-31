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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatNPR, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  variant = "light",
}: {
  product: Product;
  variant?: "dark" | "light";
}) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, buyNow } = useCart();

  const out = product.stock === 0;

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
          "border border-[#D8F2DF] bg-white text-[#173226] shadow-sm hover:border-[#38B46A] hover:shadow-lg hover:shadow-[#38B46A]/15 dark:border-white/10 dark:bg-[#071f17] dark:text-white",
        )}
      >
        {/* ── PHOTO CONTAINER ── */}
        <div className="relative overflow-hidden rounded-2xl shrink-0 bg-slate-50 dark:bg-black/20">
          {/* Top Badges (Left Stock Status, Right Discount Tag with Zero Overlap) */}
          <div className="absolute inset-x-2.5 top-2.5 z-10 flex items-start justify-between gap-1.5 pointer-events-none">
            {out ? (
              <span className="rounded-md bg-slate-700/95 backdrop-blur-xs px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                Out of Stock
              </span>
            ) : (
              <span className="rounded-md bg-emerald-600/95 backdrop-blur-xs px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                In Stock
              </span>
            )}

            {discountPercent ? (
              <span className="rounded-md bg-amber-500/95 backdrop-blur-xs px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-white shadow-xs shrink-0">
                -{discountPercent}% OFF
              </span>
            ) : null}
          </div>

          {/* Product Image Link */}
          <Link to="/product/$id" params={{ id: product.id }} aria-label={product.name}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
              className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Quick View overlay button */}
          <div className="pointer-events-none absolute inset-x-2 bottom-2 flex gap-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
            <Button
              type="button"
              onClick={() => {
                setQuantity(1);
                setQuickViewOpen(true);
              }}
              className="h-9 flex-1 rounded-xl text-[11px] font-bold shadow-lg transition-all border border-slate-200 bg-white/95 text-[#173226] hover:bg-[#38B46A] hover:text-white hover:border-[#38B46A]"
            >
              <Eye className="size-3.5 mr-1" /> Quick View
            </Button>
          </div>
        </div>

        {/* ── CARD CONTENT ── */}
        <div className="flex flex-1 flex-col justify-between gap-2 p-1.5 pt-2.5">
          <div>
            {/* Brand & Subcategory Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider font-mono shadow-2xs",
                  product.brand === "OMSUN"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50"
                    : product.brand === "Green Volt"
                    ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/50"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700/50",
                )}
              >
                {product.brand}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {product.subcategory || product.category}
              </span>
            </div>

            {/* Title (Crisp, High Contrast Dark Font on Light Card) */}
            <h3 className="font-display text-xs sm:text-sm font-bold leading-snug line-clamp-2 min-h-[2.4rem] text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <Link to="/product/$id" params={{ id: product.id }}>
                {product.name}
              </Link>
            </h3>

            {/* Key Distinct Specs Chips */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {product.specs.slice(1, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-md bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 text-[9.5px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 truncate max-w-full"
                  >
                    <span className="text-slate-400 dark:text-slate-500 mr-1">{s.label}:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{s.value}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Price & Discount Row (OMSUN Theme) */}
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-1">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="font-display text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatNPR(product.price)}
                </span>
                {product.compareAt ? (
                  <span className="text-[11px] line-through font-mono text-slate-400 dark:text-white/40">
                    {formatNPR(product.compareAt)}
                  </span>
                ) : null}
              </div>
              <span className="text-[9px] font-bold text-emerald-600/90 dark:text-emerald-400/90 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40">
                13% VAT Incl.
              </span>
            </div>

            {/* Star Rating & Warranty Note */}
            <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-muted-foreground font-medium">
              <span className="flex items-center gap-0.5 font-bold text-amber-400">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">1 Year Warranty</span>
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
                className="h-9 rounded-xl font-bold text-[10px] sm:text-xs px-1 sm:px-2 transition-all border border-emerald-600 text-emerald-800 hover:bg-emerald-50 bg-emerald-50/50 dark:border-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-500/20 dark:bg-emerald-500/10"
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

                <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-slate-900 dark:text-white">
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
                    <div
                      key={h}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-emerald-300"
                    >
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
                    <span className="w-10 text-center font-mono text-sm font-bold">{quantity}</span>
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
