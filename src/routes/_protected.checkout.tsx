import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
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
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  FileCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatNPR } from "@/lib/products";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_protected/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, subtotal: cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const receiptFileInputRef = useRef<HTMLInputElement>(null);

  const [paymentMethod, setPaymentMethod] = useState<"fonepay" | "bank" | "cod">("fonepay");
  const [paymentReceipt, setPaymentReceipt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderRef, setOrderRef] = useState("");

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

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Receipt image must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPaymentReceipt(reader.result as string);
      toast.success("Payment receipt screenshot attached!");
    };
    reader.readAsDataURL(file);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await api.createOrder({
        items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        shipping: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          notes: formData.notes,
        },
        paymentMethod,
        paymentReceipt: paymentReceipt || null,
      });
      setOrderRef(result.orderRef);
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();
    } catch {
      setIsSubmitting(false);
      toast.error("Order failed. Please try again.");
    }
  };

  if (orderComplete) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/30 bg-card p-8 sm:p-12 text-center shadow-2xl space-y-6">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
          <CheckCircle2 className="size-12" />
        </div>
        <h2 className="font-display text-3xl font-extrabold text-foreground">
          Order Successfully Placed!
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Thank you for choosing OMSUN Nepal. Your order reference{" "}
          <span className="font-bold text-emerald-500">#{orderRef}</span> has been created.
          {paymentMethod === "fonepay" && (
            <span className="block mt-1 font-semibold text-amber-600 dark:text-amber-400">
              {paymentReceipt
                ? "Payment screenshot submitted • Awaiting Admin Verification."
                : "Fonepay QR selected • Awaiting Payment Slip verification."}
            </span>
          )}
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Destination:</span>
            <span className="font-bold">{formData.city || "Kathmandu"}, Nepal</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Payment Method:</span>
            <span className="font-bold uppercase text-emerald-500">{paymentMethod}</span>
          </div>
          {paymentReceipt && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="text-muted-foreground flex items-center gap-1">
                <FileCheck className="size-3.5 text-emerald-500" /> Attached Slip:
              </span>
              <img
                src={paymentReceipt}
                alt="Receipt Proof"
                className="size-12 rounded-lg object-cover border border-slate-200 shadow-xs"
              />
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2 font-bold text-sm">
            <span>Total Payable:</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "fonepay",
                label: "Fonepay QR",
                sub: "Scan with any Bank App",
                badge: "Active",
                color: "#E31837",
              },
              {
                id: "cod",
                label: "Cash on Delivery",
                sub: "Pay at Doorstep",
                badge: "Nationwide",
                color: "#03C987",
              },
              {
                id: "bank",
                label: "Bank Transfer",
                sub: "NABIL / NIC Asia",
                badge: "Direct",
                color: "#0095D0",
              },
            ].map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => setPaymentMethod(method.id as "fonepay" | "bank" | "cod")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === method.id
                    ? "border-emerald-500 bg-emerald-500/10 text-foreground shadow-sm ring-1 ring-emerald-500/40"
                    : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>{method.label}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                    {method.badge}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{method.sub}</div>
              </button>
            ))}
          </div>

          {/* Fonepay Interactive QR Display Box if Fonepay selected */}
          {paymentMethod === "fonepay" && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-50/50 to-rose-100/30 dark:from-rose-950/20 dark:to-black/30 border border-rose-200 dark:border-rose-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 px-2 rounded-md bg-[#E31837] text-white flex items-center justify-center font-black text-[11px]">
                    fone<span className="text-yellow-300">pay</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Scan Merchant QR to Pay {formatNPR(grandTotal)}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">PAN: 609823412</span>
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-black/40 p-3.5 rounded-xl border border-slate-200 dark:border-white/10">
                {/* QR Code */}
                <div className="size-24 bg-white p-1 rounded-lg border border-slate-300 dark:border-white shrink-0 flex items-center justify-center relative shadow-xs">
                  <svg viewBox="0 0 100 100" className="size-full text-slate-950">
                    <rect x="5" y="5" width="26" height="26" fill="currentColor" rx="3" />
                    <rect x="9" y="9" width="18" height="18" fill="white" rx="1.5" />
                    <rect x="13" y="13" width="10" height="10" fill="currentColor" rx="1" />
                    <rect x="69" y="5" width="26" height="26" fill="currentColor" rx="3" />
                    <rect x="73" y="9" width="18" height="18" fill="white" rx="1.5" />
                    <rect x="77" y="13" width="10" height="10" fill="currentColor" rx="1" />
                    <rect x="5" y="69" width="26" height="26" fill="currentColor" rx="3" />
                    <rect x="9" y="73" width="18" height="18" fill="white" rx="1.5" />
                    <rect x="13" y="77" width="10" height="10" fill="currentColor" rx="1" />
                    <rect x="36" y="8" width="5" height="5" fill="currentColor" />
                    <rect x="45" y="8" width="5" height="5" fill="currentColor" />
                    <rect x="36" y="18" width="5" height="5" fill="currentColor" />
                    <rect x="48" y="18" width="5" height="5" fill="currentColor" />
                    <rect x="8" y="36" width="5" height="5" fill="currentColor" />
                    <rect x="18" y="36" width="5" height="5" fill="currentColor" />
                    <rect x="36" y="36" width="5" height="5" fill="currentColor" />
                    <rect x="45" y="36" width="5" height="5" fill="currentColor" />
                    <rect x="65" y="36" width="5" height="5" fill="currentColor" />
                    <rect x="8" y="46" width="5" height="5" fill="currentColor" />
                    <rect x="68" y="46" width="5" height="5" fill="currentColor" />
                    <rect x="8" y="56" width="5" height="5" fill="currentColor" />
                    <rect x="36" y="56" width="5" height="5" fill="currentColor" />
                    <rect x="65" y="56" width="5" height="5" fill="currentColor" />
                    <rect x="36" y="68" width="5" height="5" fill="currentColor" />
                    <rect x="48" y="68" width="5" height="5" fill="currentColor" />
                    <rect x="75" y="68" width="5" height="5" fill="currentColor" />
                    <rect x="36" y="78" width="5" height="5" fill="currentColor" />
                    <rect x="65" y="78" width="5" height="5" fill="currentColor" />
                    <circle cx="50" cy="50" r="10" fill="white" />
                    <circle cx="50" cy="50" r="8" fill="#E31837" />
                    <text x="50" y="53" textAnchor="middle" fill="white" fontSize="5" fontWeight="900" fontFamily="sans-serif">f</text>
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-extrabold text-slate-900 dark:text-white">OMSUN NEPAL PVT. LTD.</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Open Nabil, NIC Asia, Global IME, eSewa, Khalti or any Nepal banking app & scan.
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold pt-0.5">
                    ● Instant Verification Ready
                  </div>
                </div>
              </div>

              {/* Upload Screenshot / Receipt Box */}
              <div className="p-3.5 bg-white dark:bg-black/30 rounded-xl border border-dashed border-rose-300 dark:border-rose-800 space-y-2">
                <input
                  ref={receiptFileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleReceiptFileChange}
                  className="hidden"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="size-4 text-rose-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Attach Payment Screenshot / Receipt (Slip)
                    </span>
                  </div>
                  {paymentReceipt && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Attached
                    </span>
                  )}
                </div>

                {paymentReceipt ? (
                  <div className="flex items-center justify-between gap-3 p-2 bg-slate-50 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={paymentReceipt}
                        alt="Payment Receipt"
                        className="size-12 rounded-md object-cover border border-slate-300 shadow-xs"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900 dark:text-white">Fonepay Transaction Slip</div>
                        <div className="text-[10px] text-slate-400">Ready for Admin Approval</div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setPaymentReceipt(null)}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                    >
                      <Trash2 className="size-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                    <p className="text-[11px] text-slate-400">
                      Upload screenshot of your completed Fonepay transaction for instant verification.
                    </p>
                    <Button
                      type="button"
                      onClick={() => receiptFileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs font-bold h-8 border-rose-300 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0 gap-1.5 cursor-pointer"
                    >
                      <Upload className="size-3.5" />
                      <span>Upload Slip</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cash on Delivery Notice */}
          {paymentMethod === "cod" && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Truck className="size-4" />
                <span>Doorstep Delivery & Cash / Fonepay</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                You can pay in cash or scan the courier's official Fonepay QR upon receipt of your hardware.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="w-full h-13 rounded-2xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
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
