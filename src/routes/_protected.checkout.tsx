import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShoppingCart,
  CreditCard,
  Lock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Building2,
  ArrowRight,
  ChevronRight,
  DollarSign,
  Wallet,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatNPR } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_protected/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, subtotal: cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "khalti" | "bank" | "cod">("esewa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "Kathmandu",
    district: "Kathmandu Valley",
    notes: "",
  });

  const shippingFee = cartTotal > 50000 ? 0 : 1500;
  const grandTotal = cartTotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/30 bg-card p-8 sm:p-12 text-center shadow-2xl space-y-6">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
          <CheckCircle2 className="size-12" />
        </div>
        <h2 className="font-display text-3xl font-extrabold text-foreground">
          Order Successfully Confirmed!
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Thank you for choosing OMSUN Nepal. Your order reference{" "}
          <span className="font-bold text-emerald-500">#OMS-8942</span> has been created. Our
          Kathmandu warehouse logistics team will contact you shortly at{" "}
          <span className="font-bold text-foreground">{formData.phone || "your phone number"}</span>
          .
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Destination:</span>
            <span className="font-bold">{formData.city || "Kathmandu"}, Nepal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Selected:</span>
            <span className="font-bold uppercase text-emerald-500">{paymentMethod}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2 font-bold text-sm">
            <span>Total Paid:</span>
            <span className="text-emerald-500">{formatNPR(grandTotal)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            asChild
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-black"
          >
            <Link to="/dashboard">View My Orders</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 items-start">
      {/* Shipping & Payment Form */}
      <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
        {/* Shipping Section */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
            <Truck className="text-emerald-500 size-6" />
            <div>
              <h2 className="font-display text-xl font-extrabold text-foreground">
                1. Shipping & Dispatch Address
              </h2>
              <p className="text-xs text-muted-foreground">
                48-Hour Express Dispatch from Kathmandu Central Warehouse
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">First Name</label>
              <Input
                required
                placeholder="Ramesh"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">Last Name</label>
              <Input
                required
                placeholder="Adhikari"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">Phone Number</label>
              <Input
                required
                placeholder="98XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">City / Location</label>
              <Input
                required
                placeholder="e.g. Kathmandu / Pokhara"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5">Full Delivery Address</label>
            <Input
              required
              placeholder="Street name, Ward number, Tole / Landmark"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
            <CreditCard className="text-emerald-500 size-6" />
            <div>
              <h2 className="font-display text-xl font-extrabold text-foreground">
                2. Select Payment Method
              </h2>
              <p className="text-xs text-muted-foreground">Secure Nepal Payment Options</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: "esewa",
                label: "eSewa Mobile Wallet",
                sub: "Instant Digital Wallet",
                icon: Wallet,
                color: "#60bb46",
              },
              {
                id: "khalti",
                label: "Khalti Digital Wallet",
                sub: "Web & Mobile Payment",
                icon: CreditCard,
                color: "#5c2d91",
              },
              {
                id: "bank",
                label: "Direct Bank Wire",
                sub: "NABIL / NIMB Transfer",
                icon: Building2,
                color: "#0095D0",
              },
              {
                id: "cod",
                label: "Cash on Delivery",
                sub: "Pay Upon Receiving",
                icon: DollarSign,
                color: "#03C987",
              },
            ].map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => setPaymentMethod(method.id as "esewa" | "khalti" | "bank" | "cod")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === method.id
                    ? "border-emerald-500 bg-emerald-500/10 text-foreground shadow-sm"
                    : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <method.icon className="size-4 text-emerald-500" />
                  <span>{method.label}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{method.sub}</div>
              </button>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="w-full h-13 rounded-2xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-black text-sm shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Processing Order...</span>
            ) : (
              <>
                <Lock className="size-4" />
                <span>Confirm Order — {formatNPR(grandTotal)}</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Cart Summary Sidebar */}
      <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <h3 className="font-display text-xl font-extrabold text-foreground flex items-center gap-2">
            <ShoppingCart className="size-5 text-emerald-500" />
            <span>Order Summary ({cart.length})</span>
          </h3>
          <Link to="/shop" className="text-xs text-emerald-500 font-bold hover:underline">
            Edit Cart
          </Link>
        </div>

        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">
              Your cart is currently empty.
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="size-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Qty: {item.quantity}</div>
                </div>
                <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  {formatNPR(item.product.price * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-2.5 border-t border-slate-100 dark:border-white/10 pt-4 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Items Subtotal:</span>
            <span className="font-bold text-foreground">{formatNPR(cartTotal)}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Warehouse Logistics Delivery:</span>
            <span className="font-bold text-emerald-500">
              {shippingFee === 0 ? "FREE (Orders > 50,000)" : formatNPR(shippingFee)}
            </span>
          </div>

          <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-3 text-sm font-extrabold text-foreground">
            <span>Grand Total:</span>
            <span className="text-emerald-500">{formatNPR(grandTotal)}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 dark:text-emerald-400 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="size-4" />
            <span>OMSUN Verified Purchase Guarantee</span>
          </div>
          <p className="opacity-80 leading-relaxed">
            Includes serialised manufacturer warranty documentation and free technical support.
          </p>
        </div>
      </div>
    </div>
  );
}
