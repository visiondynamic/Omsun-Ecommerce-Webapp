import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Copy,
  Upload,
  Camera,
  Trash2,
  Phone,
  MessageCircle,
  Printer,
  ChevronRight,
  ArrowLeft,
  DollarSign,
  User,
  MapPin,
  FileCheck,
  RotateCcw,
  ExternalLink,
  Info,
  Calendar,
  Building2,
} from "lucide-react";
import { api, OrderDetail } from "@/lib/api";
import { formatNPR } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/order/$ref")({
  component: OrderTrackingPage,
});

function OrderTrackingPage() {
  const { ref: orderRef } = Route.useParams();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Fetch live order data
  const { data: order, isLoading, isError, refetch } = useQuery({
    queryKey: ["order", orderRef],
    queryFn: () => api.getOrder(orderRef),
    refetchInterval: 10000, // auto-refresh telemetry every 10s
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Receipt screenshot must be under 5MB");
      return;
    }

    // Validate mime type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptBase64(reader.result as string);
      toast.success("Payment screenshot ready for submission");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptBase64) {
      toast.error("Please select a payment screenshot first");
      return;
    }

    setIsSubmittingProof(true);
    try {
      const res = await api.submitPaymentProof(orderRef, {
        receiptBase64,
        transactionRef: transactionRef.trim() || undefined,
      });

      toast.success(res.message || "Payment proof submitted successfully!");
      setReceiptBase64(null);
      setTransactionRef("");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["order", orderRef] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit proof. Please try again.");
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07130f] flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center space-y-4">
          <div className="size-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground font-medium">Loading live order telemetry #{orderRef}...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07130f] flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-6">
          <div className="size-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="size-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">Order Not Found</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We could not locate an order matching reference <span className="font-mono font-bold text-foreground">#{orderRef}</span>. Please verify your reference number or contact OMSUN support.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/shop">Browse Store</Link>
            </Button>
            <Button asChild className="rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-black">
              <Link to="/dashboard">My Orders</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Lifecycle progression mapping (Daraz style visual timeline)
  const steps = [
    { key: "ORDER_PLACED", label: "Order Placed", desc: "Order recorded in database" },
    { key: "PAYMENT_SUBMITTED", label: "Payment Submitted", desc: "Receipt proof uploaded" },
    { key: "PAYMENT_VERIFIED", label: "Payment Verified", desc: "Verified by OMSUN Finance" },
    { key: "PROCESSING", label: "Processing", desc: "Preparing warehouse hardware" },
    { key: "PACKED", label: "Packed", desc: "Quality-checked & packed" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Dispatched with courier" },
    { key: "DELIVERED", label: "Delivered", desc: "Completed at destination" },
  ];

  const getActiveStepIndex = () => {
    const rawStatus = (order.status || "").toUpperCase();
    const payStatus = (order.paymentStatus || "").toUpperCase();

    if (rawStatus === "CANCELLED") return -1;
    if (rawStatus === "DELIVERED" || rawStatus === "COMPLETED") return 6;
    if (rawStatus === "OUT_FOR_DELIVERY" || rawStatus === "SHIPPED") return 5;
    if (rawStatus === "PACKED") return 4;
    if (rawStatus === "PROCESSING") return 3;
    if (payStatus === "PAYMENT_VERIFIED") return 2;
    if (payStatus === "PAYMENT_SUBMITTED" || order.paymentReceipt) return 1;
    return 0;
  };

  const activeStepIdx = getActiveStepIndex();
  const isPaymentRejected = order.paymentStatus === "PAYMENT_REJECTED";
  const isPaymentVerified = order.paymentStatus === "PAYMENT_VERIFIED";
  const isProofSubmitted = order.paymentStatus === "PAYMENT_SUBMITTED" || (order.paymentReceipt && !isPaymentRejected);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#061410] flex flex-col justify-between">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to My Orders
          </Link>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => window.print()}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold gap-1.5 h-8 border-slate-200 dark:border-white/10"
            >
              <Printer className="size-3.5" /> Print Order Invoice
            </Button>
          </div>
        </div>

        {/* Hero Order Status Header */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0c241c] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  OMSUN Official Order
                </span>
                <span className="text-xs text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground font-mono tracking-tight">
                  {order.orderRef}
                </h1>
                <button
                  onClick={() => copyToClipboard(order.orderRef, "Order Reference")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title="Copy Reference"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Payment Status Badge */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                  Payment Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${
                    isPaymentVerified
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : isPaymentRejected
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      : isProofSubmitted
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-300"
                  }`}
                >
                  {isPaymentVerified && <CheckCircle2 className="size-3.5" />}
                  {isPaymentRejected && <AlertCircle className="size-3.5" />}
                  {isProofSubmitted && !isPaymentVerified && !isPaymentRejected && <Clock className="size-3.5" />}
                  <span>
                    {isPaymentVerified
                      ? "Payment Verified"
                      : isPaymentRejected
                      ? "Payment Proof Rejected"
                      : isProofSubmitted
                      ? "Pending Verification"
                      : "Unpaid / Action Required"}
                  </span>
                </span>
              </div>

              {/* Grand Total Value */}
              <div className="text-right pl-4 border-l border-slate-100 dark:border-white/10">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                  Total Payable
                </span>
                <span className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400">
                  {formatNPR(order.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Daraz-Style Visual Step Progress Stepper */}
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">
              Live Order Progress & Fulfillment Telemetry
            </h3>

            {order.status === "CANCELLED" ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="size-4" /> This order has been cancelled. If you believe this is in error, please contact OMSUN customer care.
              </div>
            ) : (
              <div className="relative">
                {/* Horizontal Stepper on md+ */}
                <div className="hidden md:grid grid-cols-7 gap-2 relative">
                  {/* Connecting Track */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 dark:bg-white/10 -z-0" />
                  <div
                    className="absolute top-4 left-6 h-1 bg-emerald-500 transition-all duration-700 -z-0"
                    style={{
                      width: `${Math.max(0, (activeStepIdx / (steps.length - 1)) * 100)}%`,
                    }}
                  />

                  {steps.map((step, idx) => {
                    const isDone = activeStepIdx > idx;
                    const isCurrent = activeStepIdx === idx;
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center z-10 space-y-2">
                        <div
                          className={`size-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                              : isCurrent
                              ? "bg-emerald-500 text-black ring-4 ring-emerald-500/20 shadow-lg animate-pulse"
                              : "bg-slate-100 dark:bg-[#12342B] border border-slate-300 dark:border-white/10 text-muted-foreground"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="size-4.5" /> : idx + 1}
                        </div>
                        <div>
                          <div className={`text-xs font-bold leading-tight ${isCurrent ? "text-emerald-600 dark:text-emerald-400" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vertical Stepper on mobile */}
                <div className="md:hidden space-y-4 pl-2 border-l-2 border-emerald-500/30">
                  {steps.map((step, idx) => {
                    const isDone = activeStepIdx > idx;
                    const isCurrent = activeStepIdx === idx;
                    return (
                      <div key={step.key} className="relative pl-6">
                        <div
                          className={`absolute -left-[11px] top-0.5 size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isDone
                              ? "bg-emerald-500 text-black"
                              : isCurrent
                              ? "bg-emerald-500 text-black ring-4 ring-emerald-500/20 animate-pulse"
                              : "bg-slate-200 dark:bg-white/10 text-muted-foreground"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="size-3" /> : idx + 1}
                        </div>
                        <div className={`text-xs font-bold ${isCurrent ? "text-emerald-600 dark:text-emerald-400" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT REJECTION NOTICE (If Rejected) */}
        {isPaymentRejected && (
          <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-300 dark:border-rose-900/40 space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-rose-900 dark:text-rose-200">
                  Action Required: Payment Verification Update
                </h3>
                <p className="text-xs text-rose-700 dark:text-rose-300">
                  Our accounts team could not verify your previous payment slip. Please review the reason below and submit a clear screenshot.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-black/30 rounded-2xl border border-rose-200 dark:border-rose-900/30 text-xs">
              <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1">OMSUN Finance Verification Note:</span>
              <p className="text-slate-700 dark:text-slate-300 italic">
                "{order.rejectionReason || "Payment screenshot could not be verified. Please upload a clearer payment receipt showing transaction amount and reference."}"
              </p>
            </div>
          </div>
        )}

        {/* MAIN TWO-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Fonepay QR & Payment Proof Section (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* If Order is using Fonepay and not yet fully verified, show interactive Fonepay Gateway */}
            {order.paymentMethod === "fonepay" && (
              <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/30 bg-white dark:bg-[#0c241c] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 px-3 rounded-xl bg-[#E31837] text-white flex items-center justify-center font-black tracking-tight text-xs shadow-xs">
                      fone<span className="text-yellow-300">pay</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-foreground">
                        Official Fonepay Merchant Payment
                      </h2>
                      <p className="text-xs text-muted-foreground">Scan with any Mobile Banking App in Nepal</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#E31837] border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800">
                    Instant QR
                  </span>
                </div>

                {/* QR Display Card */}
                <div className="p-5 bg-gradient-to-b from-rose-50/40 to-slate-50 dark:from-black/40 dark:to-black/20 rounded-2xl border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center gap-6">
                  {/* High Contrast Scalable QR */}
                  <div className="size-40 bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-900 dark:border-white flex flex-col items-center justify-center relative shrink-0">
                    <svg viewBox="0 0 100 100" className="size-full text-slate-950">
                      <rect x="5" y="5" width="26" height="26" fill="currentColor" rx="4" />
                      <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                      <rect x="13" y="13" width="10" height="10" fill="currentColor" rx="1" />

                      <rect x="69" y="5" width="26" height="26" fill="currentColor" rx="4" />
                      <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                      <rect x="77" y="13" width="10" height="10" fill="currentColor" rx="1" />

                      <rect x="5" y="69" width="26" height="26" fill="currentColor" rx="4" />
                      <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
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
                      <circle cx="50" cy="50" r="11" fill="white" />
                      <circle cx="50" cy="50" r="9" fill="#E31837" />
                      <text x="50" y="53" textAnchor="middle" fill="white" fontSize="6" fontWeight="900" fontFamily="sans-serif">f</text>
                    </svg>
                  </div>

                  <div className="space-y-2 text-xs text-center sm:text-left flex-1 min-w-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Official Merchant</span>
                      <strong className="text-sm font-extrabold text-slate-900 dark:text-white block">
                        OMSUN NEPAL PVT. LTD.
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Merchant PAN / Tax ID</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">609823412</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Exact Payable Amount</span>
                      <span className="font-mono font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                        {formatNPR(order.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6-Step Banking Instructions */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    How to Complete Manual Payment:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      "1. Open your Mobile Banking or eSewa/Khalti app",
                      "2. Tap 'Scan to Pay' and scan the QR above",
                      `3. Enter exact amount: ${formatNPR(order.grandTotal)}`,
                      "4. Mention Order # in the remarks: " + order.orderRef,
                      "5. Save or screenshot the payment slip",
                      "6. Upload the receipt below for instant approval",
                    ].map((inst, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-muted-foreground flex items-center gap-2"
                      >
                        <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                          ✓
                        </span>
                        <span className="text-[11px] leading-tight font-medium">{inst}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Proof Submission Form */}
                <form onSubmit={handleSubmitProof} className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/10">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Attach Payment Screenshot / Receipt</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Formats: JPG, PNG, WebP (Max 5MB)</span>
                  </h4>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {receiptBase64 ? (
                    <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={receiptBase64}
                          alt="Slip Preview"
                          className="size-16 rounded-xl object-cover border border-slate-300 shadow-xs"
                        />
                        <div>
                          <div className="font-bold text-xs text-foreground">New Screenshot Attached</div>
                          <div className="text-[10px] text-emerald-600 font-bold">Ready to upload</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 text-xs rounded-xl"
                        >
                          Change
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setReceiptBase64(null)}
                          className="h-8 text-xs text-rose-500 hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-6 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-900/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-center space-y-2"
                    >
                      <div className="size-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                        <Upload className="size-6" />
                      </div>
                      <div className="text-xs font-bold text-foreground">
                        Click or drag to upload your Fonepay Transaction Screenshot
                      </div>
                      <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                        Make sure transaction amount ({formatNPR(order.grandTotal)}) and reference code are clearly visible.
                      </p>
                    </div>
                  )}

                  {/* Optional Transaction ID Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Fonepay Transaction ID / Reference Number (Optional)
                    </label>
                    <Input
                      placeholder="e.g. FP-9823412-A89 or Bank Ref #"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="rounded-xl font-mono text-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmittingProof || !receiptBase64}
                    className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmittingProof ? (
                      <span>Submitting Proof to Accounts...</span>
                    ) : (
                      <>
                        <ShieldCheck className="size-4" />
                        <span>Submit Payment Proof for Verification</span>
                      </>
                    )}
                  </Button>
                </form>

                {/* Submitted Proof Card (If already submitted) */}
                {order.paymentReceipt && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <FileCheck className="size-4 text-emerald-500" /> Currently Attached Payment Slip:
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={order.paymentReceipt}
                        alt="Receipt"
                        className="size-16 rounded-xl object-cover border border-slate-300 shadow-xs cursor-pointer"
                        onClick={() => window.open(order.paymentReceipt!, "_blank")}
                        title="Click to view full image"
                      />
                      <div className="text-xs space-y-1">
                        <div className="font-mono text-muted-foreground text-[11px]">
                          Ref: <strong className="text-foreground">{order.transactionRef || "Screenshot Only"}</strong>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Uploaded: {order.paymentSubmittedAt ? new Date(order.paymentSubmittedAt).toLocaleString() : "Recently"}
                        </p>
                        <a
                          href={order.paymentReceipt}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-600 hover:underline font-bold inline-flex items-center gap-1"
                        >
                          View Full Resolution Slip <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bank Transfer Information (If Bank Transfer Selected) */}
            {order.paymentMethod === "bank" && (
              <div className="rounded-3xl border border-sky-200 dark:border-sky-900/30 bg-white dark:bg-[#0c241c] p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                  <Building2 className="size-6 text-sky-500" />
                  <div>
                    <h2 className="font-bold text-base text-foreground">OMSUN Corporate Bank Transfer</h2>
                    <p className="text-xs text-muted-foreground">Deposit directly to our verified commercial accounts</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-sky-600 uppercase">Nabil Bank Ltd.</span>
                    <div className="font-extrabold text-foreground">OMSUN NEPAL PVT. LTD.</div>
                    <div className="font-mono text-slate-600 dark:text-slate-300">A/C: 01920017502391</div>
                    <div className="text-[10px] text-slate-400">Branch: Tinkune / Kathmandu</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-sky-600 uppercase">NIC Asia Bank</span>
                    <div className="font-extrabold text-foreground">OMSUN NEPAL PVT. LTD.</div>
                    <div className="font-mono text-slate-600 dark:text-slate-300">A/C: 28405001928371</div>
                    <div className="text-[10px] text-slate-400">Branch: Baneshwor / Kathmandu</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cash on Delivery Banner (If COD Selected) */}
            {order.paymentMethod === "cod" && (
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="size-6 text-emerald-500" />
                  <div>
                    <h2 className="font-bold text-base text-foreground">Doorstep Delivery with Cash / Fonepay</h2>
                    <p className="text-xs text-muted-foreground">Pay upon physical inspection of equipment</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our delivery personnel will bring your equipment directly to your address. You can pay in cash or scan the courier's official Fonepay QR upon receipt.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Delivery Telemetry, Address & Hardware Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Telemetry Card */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0c241c] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/10 pb-3">
                <Truck className="size-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-foreground">Dispatch & Delivery Telemetry</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier:</span>
                  <span className="font-bold text-foreground">{order.deliveryCarrier || "OMSUN Express Central Logistics"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Status:</span>
                  <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">
                    {order.deliveryStatus || "Pending Logistics Allocation"}
                  </span>
                </div>

                {order.trackingNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tracking #:</span>
                    <button
                      onClick={() => copyToClipboard(order.trackingNumber!, "Tracking ID")}
                      className="font-mono font-bold text-foreground hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {order.trackingNumber} <Copy className="size-3 text-slate-400" />
                    </button>
                  </div>
                )}

                {order.deliveryPerson && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Courier Agent:</span>
                    <div className="text-right">
                      <span className="font-bold text-foreground block">{order.deliveryPerson}</span>
                      {order.deliveryPhone && (
                        <a
                          href={`tel:${order.deliveryPhone}`}
                          className="font-mono text-[11px] text-emerald-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Phone className="size-3" /> {order.deliveryPhone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {order.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <span className="font-bold text-foreground">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                )}

                {order.deliveryNotes && (
                  <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 text-[11px] text-muted-foreground italic">
                    Note: {order.deliveryNotes}
                  </div>
                )}
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0c241c] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/10 pb-3">
                <MapPin className="size-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-foreground">Delivery Destination</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Recipient</span>
                  <strong className="text-foreground text-sm">{order.customerName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Contact Phone</span>
                  <a href={`tel:${order.customerPhone}`} className="font-mono text-emerald-600 font-bold hover:underline">
                    {order.customerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Address</span>
                  <p className="text-foreground font-medium">
                    {order.shippingAddress}, {order.shippingCity}, Nepal
                  </p>
                </div>
              </div>
            </div>

            {/* Hardware Items Summary */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0c241c] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="size-5 text-emerald-500" />
                  <h3 className="font-bold text-sm text-foreground">Ordered Hardware ({order.items.length})</h3>
                </div>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10"
                  >
                    <img
                      src={item.image || "/p-panelboard.jpg"}
                      alt={item.name}
                      className="size-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        Qty: {item.qty} × {formatNPR(item.unitPrice ?? item.price ?? 0)}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-xs text-foreground">
                      {formatNPR((item.unitPrice ?? item.price ?? 0) * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-slate-100 dark:border-white/10 pt-3 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items Subtotal:</span>
                  <span className="font-mono text-foreground">{formatNPR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Logistics Shipping:</span>
                  <span className="font-mono text-emerald-600">
                    {order.shippingFee === 0 ? "FREE" : formatNPR(order.shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between font-extrabold text-sm border-t border-slate-200 dark:border-white/10 pt-2 text-foreground">
                  <span>Grand Total:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {formatNPR(order.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Support Contact Widget */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-3">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Need Order Assistance?</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Our support engineers in Kathmandu are available 9:00 AM – 7:00 PM to assist with payment verification or delivery logistics.
              </p>
              <div className="flex gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-xl text-xs font-bold h-8 border-emerald-300"
                >
                  <a href="tel:+977-9800000000">
                    <Phone className="size-3 mr-1" /> Call Support
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="flex-1 rounded-xl text-xs font-bold h-8 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <a
                    href={`https://wa.me/9779800000000?text=Hi%20OMSUN,%20inquiry%20regarding%20Order%20${order.orderRef}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="size-3 mr-1" /> WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
