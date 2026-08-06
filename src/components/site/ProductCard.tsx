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
          "group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-3 transition-all duration-500 hover:-translate-y-1.5",
          isLight
            ? "border border-slate-200/90 bg-white text-slate-900 shadow-lg hover:border-emerald-500/80 hover:shadow-2xl"
            : "border border-white/12 bg-[#061e16]/90 text-white shadow-xl backdrop-blur-xl hover:border-emerald-400/50 hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)]",
        )}
      >
        {/* ── PHOTO CONTAINER ── */}
        <div className={cn("relative overflow-hidden rounded-2xl shrink-0", isLight ? "bg-slate-100" : "bg-[#03150e]")}>
          {/* Top Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            {product.badges.map((b) => (
              <span
                key={b}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md",
                  b === "Best Seller"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                    : b === "Featured"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                      : isLight
                        ? "bg-slate-900/80 text-white"
                        : "bg-white/20 text-white border border-white/20",
                )}
              >
                {b}
              </span>
            ))}

            {product.efficient && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                  isLight
                    ? "border border-emerald-500/30 bg-emerald-100 text-emerald-800"
                    : "border border-emerald-400/30 bg-emerald-400/20 text-emerald-300",
                )}
              >
                <Leaf className="size-3 text-emerald-600" /> Efficient
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {discountPercent && (
            <div className="absolute right-3 top-3 z-10 rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
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
              className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
          </Link>

          {/* Floating Quick View overlay button */}
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex gap-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
            <Button
              type="button"
              onClick={() => {
                setQuantity(1);
                setQuickViewOpen(true);
              }}
              className={cn(
                "h-11 flex-1 rounded-xl text-xs font-bold shadow-xl backdrop-blur-md transition-colors",
                isLight
                  ? "border border-slate-300 bg-white/90 text-slate-900 hover:bg-emerald-600 hover:text-white"
                  : "border border-white/20 bg-black/75 text-white hover:bg-emerald-500 hover:text-black",
              )}
            >
              <Eye className="size-4 mr-1.5" /> Quick View
            </Button>
          </div>
        </div>

        {/* ── CARD CONTENT ── */}
        <div className="flex flex-1 flex-col justify-between gap-3 p-3.5 pt-4">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className={cn(
                  "text-[11px] font-mono font-bold uppercase tracking-wider",
                  isLight ? "text-emerald-700" : "text-emerald-400",
                )}
              >
                {product.category}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border",
                  isLight
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : "text-amber-300 bg-amber-400/10 border-amber-400/20",
                )}
              >
                <Star className="size-3.5 fill-amber-400 text-amber-400" /> {product.rating}
              </span>
            </div>

            {/* Title */}
            <h3
              className={cn(
                "font-display text-base font-bold leading-snug line-clamp-2 min-h-[2.6rem] transition-colors",
                isLight
                  ? "text-slate-900 group-hover:text-emerald-700"
                  : "text-white group-hover:text-emerald-300",
              )}
            >
              <Link to="/product/$id" params={{ id: product.id }}>
                {product.name}
              </Link>
            </h3>

            {/* Tagline */}
            <p
              className={cn(
                "line-clamp-2 min-h-[2.5rem] text-xs font-medium leading-relaxed mt-1",
                isLight ? "text-slate-600" : "text-white/60",
              )}
            >
              {product.tagline}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="pt-2">
            <div
              className={cn(
                "flex items-end justify-between gap-2 pt-3 border-t mb-2.5",
                isLight ? "border-slate-200" : "border-white/10",
              )}
            >
              <div>
                <div className={cn("font-display text-lg font-extrabold", isLight ? "text-slate-900" : "text-white")}>
                  {formatNPR(product.price)}
                </div>
                {product.compareAt ? (
                  <div className={cn("text-xs line-through", isLight ? "text-slate-400" : "text-white/40")}>
                    {formatNPR(product.compareAt)}
                  </div>
                ) : (
                  <div className="text-xs opacity-0 font-mono">NPR 0</div>
                )}
              </div>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold shrink-0",
                  out
                    ? isLight
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                    : isLight
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    out ? "bg-red-400" : "bg-emerald-500 animate-pulse",
                  )}
                />
                {out ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>

            {/* DARAZ-STYLE DUAL ACTION BUTTONS: Add to Cart + Buy Now */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Button
                disabled={out}
                onClick={() => addToCart(product, 1)}
                variant="outline"
                className={cn(
                  "h-10 rounded-xl font-bold text-[11px] sm:text-xs px-2 sm:px-3 transition-all border",
                  isLight
                    ? "border-emerald-600 text-emerald-800 hover:bg-emerald-50 bg-emerald-50/50"
                    : "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 bg-emerald-500/10",
                )}
              >
                <ShoppingCart className="size-3.5 mr-1 shrink-0" />
                <span className="truncate">Add to Cart</span>
              </Button>

              <Button
                disabled={out}
                onClick={() => buyNow(product, 1)}
                className="h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-[11px] sm:text-xs px-2 sm:px-3 text-white shadow-md transition-all hover:scale-[1.02]"
              >
                <Zap className="size-3.5 mr-1 shrink-0" />
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
