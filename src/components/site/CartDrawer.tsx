import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatNPR } from "@/lib/products";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#051c14] border-l border-white/15 text-white p-0 flex flex-col justify-between shadow-2xl backdrop-blur-2xl"
      >
        {/* ── HEADER ── */}
        <SheetHeader className="p-6 border-b border-white/10 text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl font-extrabold text-white flex items-center gap-2.5">
              <ShoppingCart className="size-5 text-emerald-400" />
              <span>Shopping Cart</span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30 font-mono">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* ── CART ITEMS LIST ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-white/60 space-y-4">
              <div className="size-16 rounded-full bg-white/5 border border-white/10 grid place-items-center">
                <ShoppingCart className="size-8 text-white/40" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-white">Your cart is empty</h3>
                <p className="text-xs text-white/60 max-w-xs">
                  Browse our certified solar panels, hybrid inverters, and battery storage solutions.
                </p>
              </div>
              <Button
                onClick={() => setIsCartOpen(false)}
                asChild
                className="mt-4 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400"
              >
                <Link to="/shop">Browse Store Catalog</Link>
              </Button>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="group relative flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all hover:border-emerald-500/40"
              >
                {/* Thumbnail */}
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-black/40 border border-white/10">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                        {product.category}
                      </span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <h4 className="font-display text-xs font-bold text-white line-clamp-1">
                      {product.name}
                    </h4>

                    <div className="mt-1 font-display text-sm font-extrabold text-emerald-300">
                      {formatNPR(product.price)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[11px] font-semibold text-white/60">Qty:</span>
                    <div className="flex items-center rounded-lg border border-white/15 bg-black/40 p-0.5">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="grid size-6 place-items-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-bold text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="grid size-6 place-items-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── FOOTER & CHECKOUT SUMMARY ── */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#03150e]/95 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-white">{formatNPR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Kathmandu Warehouse Shipping</span>
                <span className="font-bold text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>VAT / Taxes</span>
                <span className="text-white/50">Included</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-extrabold text-white">
                <span>Total Amount</span>
                <span className="font-mono text-emerald-400 font-display text-lg">
                  {formatNPR(subtotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-[11px] text-emerald-300 font-semibold">
              <Truck className="size-4 shrink-0 text-emerald-400" />
              <span>Ships within 48 hours across Nepal with warranty card.</span>
            </div>

            <div className="grid gap-2">
              <Button
                asChild
                onClick={() => setIsCartOpen(false)}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-xs text-white shadow-lg hover:from-emerald-400 hover:to-teal-500"
              >
                <Link to="/protected/checkout" className="flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setIsCartOpen(false)}
                className="h-10 w-full text-xs font-bold text-white/70 hover:text-white hover:bg-white/5"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
