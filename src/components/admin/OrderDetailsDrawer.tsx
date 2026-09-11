import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminOrder, OrderStatus } from "@/lib/adminData";
import { formatNPR } from "@/lib/products";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  UserCheck,
  MapPin,
  CreditCard,
  Package,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  Truck,
  Check,
  XCircle,
  Trash2,
  Eye,
  Phone,
  Mail,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Copy,
  ExternalLink,
  Save,
  FileText,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface OrderDetailsDrawerProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void | Promise<void>;
  onVerifyPayment?: (orderId: string, approve: boolean, rejectionReason?: string, notes?: string) => void | Promise<void>;
  onUpdateDelivery?: (orderId: string, deliveryData: any) => void | Promise<void>;
  onDeleteOrder?: (orderId: string) => void | Promise<void>;
}

export function OrderDetailsDrawer({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onVerifyPayment,
  onUpdateDelivery,
  onDeleteOrder,
}: OrderDetailsDrawerProps) {
  const [pendingStatusChange, setPendingStatusChange] = useState<OrderStatus | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [verifyConfirmOpen, setVerifyConfirmOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState(
    "Payment screenshot could not be verified. Please upload a clearer payment receipt."
  );
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Lightbox Zoom State
  const [zoomLevel, setZoomLevel] = useState(1);

  // Delivery Edit State
  const [deliveryData, setDeliveryData] = useState({
    deliveryStatus: "PENDING",
    deliveryCarrier: "OMSUN Express Fleet",
    deliveryPerson: "",
    deliveryPhone: "",
    trackingNumber: "",
    deliveryNotes: "",
    estimatedDelivery: "",
  });
  const [isSavingDelivery, setIsSavingDelivery] = useState(false);

  useEffect(() => {
    if (order) {
      setDeliveryData({
        deliveryStatus: (order.deliveryStatus || "PENDING").toUpperCase(),
        deliveryCarrier: order.deliveryCarrier || "OMSUN Express Logistics",
        deliveryPerson: order.deliveryPerson || "",
        deliveryPhone: order.deliveryPhone || "",
        trackingNumber: order.trackingNumber || "",
        deliveryNotes: order.deliveryNotes || "",
        estimatedDelivery: order.estimatedDelivery ? order.estimatedDelivery.slice(0, 10) : "",
      });
      setAdminNotesInput(order.adminNotes || "");
      setZoomLevel(1);
    }
  }, [order]);

  if (!order) return null;

  const handleConfirmStatusChange = () => {
    if (pendingStatusChange && order) {
      onUpdateStatus(order.id, pendingStatusChange);
      toast.success(`Order ${order.id} status updated to ${pendingStatusChange}`);
      setPendingStatusChange(null);
    }
  };

  const handleConfirmVerifyPayment = async () => {
    if (!order) return;
    setIsProcessingPayment(true);
    try {
      if (onVerifyPayment) {
        await onVerifyPayment(order.id, true, undefined, adminNotesInput);
      } else {
        await api.adminVerifyPayment(order.id, {
          approve: true,
          notes: adminNotesInput,
        });
      }
      toast.success(`Payment verified and order #${order.id} confirmed!`);
      setVerifyConfirmOpen(false);
      setReceiptModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to verify payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleConfirmRejectPayment = async () => {
    if (!order) return;
    setIsProcessingPayment(true);
    try {
      if (onVerifyPayment) {
        await onVerifyPayment(order.id, false, rejectionReasonInput, adminNotesInput);
      } else {
        await api.adminVerifyPayment(order.id, {
          approve: false,
          rejectionReason: rejectionReasonInput,
          notes: adminNotesInput,
        });
      }
      toast.success(`Payment rejected for order #${order.id}. Customer notified via email.`);
      setRejectModalOpen(false);
      setReceiptModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to reject payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSaveDelivery = async () => {
    if (!order) return;
    setIsSavingDelivery(true);
    try {
      if (onUpdateDelivery) {
        await onUpdateDelivery(order.id, deliveryData);
      } else {
        await api.adminUpdateDelivery(order.id, deliveryData);
      }
      toast.success("Delivery telemetry saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update delivery information");
    } finally {
      setIsSavingDelivery(false);
    }
  };

  const handleConfirmDelete = () => {
    if (order && onDeleteOrder) {
      onDeleteOrder(order.id);
      onClose();
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const getStatusBadge = (status: OrderStatus | string) => {
    const s = String(status).toLowerCase();
    if (s.includes("deliv") || s.includes("comp")) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    }
    if (s.includes("ship") || s.includes("out")) {
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
    }
    if (s.includes("proc") || s.includes("pack")) {
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30";
    }
    if (s.includes("canc")) {
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
    }
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-2xl p-0 overflow-y-auto bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl">
          {/* Header */}
          <SheetHeader className="p-6 bg-[#F2FBF4] dark:bg-[#12342B] border-b border-[#E2EDE7] dark:border-white/10 sticky top-0 z-10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#38B46A]">
                  Order Telemetry & Inspection
                </span>
                <SheetTitle className="font-display text-xl font-extrabold text-[#173226] dark:text-white font-mono flex items-center gap-2">
                  <span>{order.id}</span>
                  <button
                    onClick={() => copyToClipboard(order.id, "Order ID")}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                    title="Copy Order ID"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500 font-medium">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </SheetDescription>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </SheetHeader>

          <div className="p-6 space-y-6">
            {/* Quick Status Action Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <span className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Change Order Lifecycle Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { key: "Pending", label: "Pending", icon: Clock },
                  { key: "Processing", label: "Processing", icon: CheckCircle2 },
                  { key: "Shipped", label: "Shipped", icon: Truck },
                  { key: "Completed", label: "Delivered", icon: Check },
                  { key: "Cancelled", label: "Cancelled", icon: XCircle },
                ].map((st) => (
                  <button
                    key={st.key}
                    disabled={order.orderStatus === st.key}
                    onClick={() => setPendingStatusChange(st.key as OrderStatus)}
                    className={`px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1 ${
                      order.orderStatus === st.key
                        ? "bg-emerald-500/20 text-emerald-600 border-emerald-500"
                        : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <st.icon className="size-3.5" />
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1. CUSTOMER PROFILE & DIRECT CONTACT ACTION (Requirement #17) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="size-4 text-[#38B46A]" /> Customer Profile & Communication
                </h4>
                <span className="text-[10px] text-muted-foreground">Click below to contact customer directly</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-[#F8FBF8] dark:bg-white/5 border border-[#E2EDE7] dark:border-white/10 text-xs space-y-3 font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-bold text-[#173226] dark:text-white text-sm">
                    {order.customerName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Phone Number:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                    {order.customerPhone}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Email Address:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {order.customerEmail || "Not provided"}
                  </span>
                </div>

                <div className="flex justify-between items-start pt-2 border-t border-slate-200/60 dark:border-white/10">
                  <span className="text-slate-500 flex items-center gap-1 shrink-0">
                    <MapPin className="size-3.5 text-[#38B46A]" /> Delivery Address:
                  </span>
                  <span className="font-semibold text-[#173226] dark:text-slate-200 text-right max-w-[280px]">
                    {order.shippingAddress}
                  </span>
                </div>

                {/* Direct Call & Email Action Buttons (Requirement #17) */}
                <div className="flex gap-2 pt-2 border-t border-slate-200/60 dark:border-white/10">
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-8.5 gap-1.5 cursor-pointer shadow-xs"
                  >
                    <a href={`tel:${order.customerPhone}`}>
                      <Phone className="size-3.5" /> Call Customer
                    </a>
                  </Button>

                  {order.customerEmail && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-xl border-slate-300 dark:border-white/10 text-xs font-bold h-8.5 gap-1.5 cursor-pointer"
                    >
                      <a href={`mailto:${order.customerEmail}?subject=OMSUN%20Order%20${order.id}%20Update`}>
                        <Mail className="size-3.5" /> Email Customer
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* 2. PAYMENT TELEMETRY & SCREENSHOT REVIEW (Requirement #10 & #11) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="size-4 text-sky-500" /> Payment & Verification Proof
                </h4>
                <span className="text-[10px] text-muted-foreground">Compare slip with billed total</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FBF8] dark:bg-white/5 border border-[#E2EDE7] dark:border-white/10 text-xs space-y-3.5 font-medium">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-black/30 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Method</span>
                    <strong className="text-xs text-foreground truncate block">{order.paymentMethod}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-black/30 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Order Total</span>
                    <strong className="text-xs text-emerald-600 dark:text-emerald-400 font-mono block">
                      {formatNPR(order.totalAmount)}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-black/30 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Status</span>
                    <span className="text-[11px] font-bold text-foreground truncate block">
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-black/30 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Transaction Ref</span>
                    <span className="text-[11px] font-mono text-foreground truncate block">
                      {order.transactionRef || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Attached Screenshot Review Box */}
                {order.paymentReceipt ? (
                  <div className="p-4 bg-white dark:bg-black/30 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-emerald-600" /> Customer Payment Slip:
                      </span>
                      <div className="flex items-center gap-2">
                        {order.transactionRef && (
                          <button
                            onClick={() => copyToClipboard(order.transactionRef!, "Transaction Ref")}
                            className="text-[10px] font-mono font-bold text-slate-500 hover:text-foreground flex items-center gap-1 cursor-pointer"
                          >
                            Ref: {order.transactionRef} <Copy className="size-3" />
                          </button>
                        )}
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          Proof Uploaded
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => setReceiptModalOpen(true)}
                        className="relative group cursor-pointer shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                        title="Click to inspect slip in full resolution"
                      >
                        <img
                          src={order.paymentReceipt}
                          alt="Slip"
                          className="size-20 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="size-5" />
                        </div>
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="font-bold text-xs text-foreground">
                          Fonepay / Banking Transaction Slip
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Compare the slip amount with <strong className="text-emerald-600">{formatNPR(order.totalAmount)}</strong>.
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setReceiptModalOpen(true)}
                            className="text-xs text-emerald-600 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ZoomIn className="size-3.5" /> Full Zoom Inspector &rarr;
                          </button>
                          <a
                            href={order.paymentReceipt}
                            download={`receipt-${order.id}.jpg`}
                            className="text-xs text-slate-500 hover:text-foreground inline-flex items-center gap-1"
                          >
                            <Download className="size-3" /> Download
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Approve / Reject Actions (Requirement #11) */}
                    {order.paymentStatus !== "PAYMENT_VERIFIED" && (
                      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-2.5">
                        <Button
                          type="button"
                          onClick={() => setVerifyConfirmOpen(true)}
                          size="sm"
                          className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 cursor-pointer gap-1.5 shadow-xs"
                        >
                          <Check className="size-4" /> Verify Payment
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setRejectModalOpen(true)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold h-9 cursor-pointer gap-1.5"
                        >
                          <XCircle className="size-4" /> Reject Payment
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 text-xs space-y-1">
                    <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5" /> No Payment Receipt Attached
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Customer has not uploaded a transaction receipt yet. Verify via bank statement or call customer.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. DELIVERY MANAGEMENT SECTION (Requirement #18) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Truck className="size-4 text-indigo-500" /> Delivery & Logistics Management
                </h4>
                <span className="text-[10px] text-muted-foreground">Dispatch, driver & tracking</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FBF8] dark:bg-white/5 border border-[#E2EDE7] dark:border-white/10 text-xs space-y-3 font-medium">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Delivery Status
                    </label>
                    <select
                      value={deliveryData.deliveryStatus}
                      onChange={(e) => setDeliveryData({ ...deliveryData, deliveryStatus: e.target.value })}
                      className="w-full h-8.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/30 px-2.5 text-xs font-bold text-foreground"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="READY_FOR_DELIVERY">READY FOR DELIVERY</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Carrier Name
                    </label>
                    <Input
                      value={deliveryData.deliveryCarrier}
                      onChange={(e) => setDeliveryData({ ...deliveryData, deliveryCarrier: e.target.value })}
                      placeholder="e.g. OMSUN Express Fleet"
                      className="h-8.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Driver / Courier Agent
                    </label>
                    <Input
                      value={deliveryData.deliveryPerson}
                      onChange={(e) => setDeliveryData({ ...deliveryData, deliveryPerson: e.target.value })}
                      placeholder="e.g. Robin Thapa"
                      className="h-8.5 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Driver Phone #
                    </label>
                    <Input
                      value={deliveryData.deliveryPhone}
                      onChange={(e) => setDeliveryData({ ...deliveryData, deliveryPhone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className="h-8.5 rounded-xl font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Tracking / AWB #
                    </label>
                    <Input
                      value={deliveryData.trackingNumber}
                      onChange={(e) => setDeliveryData({ ...deliveryData, trackingNumber: e.target.value })}
                      placeholder="e.g. TRK-98234"
                      className="h-8.5 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Estimated Delivery Date
                    </label>
                    <Input
                      type="date"
                      value={deliveryData.estimatedDelivery}
                      onChange={(e) => setDeliveryData({ ...deliveryData, estimatedDelivery: e.target.value })}
                      className="h-8.5 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Delivery Instructions / Notes
                    </label>
                    <Input
                      value={deliveryData.deliveryNotes}
                      onChange={(e) => setDeliveryData({ ...deliveryData, deliveryNotes: e.target.value })}
                      placeholder="Gate instructions, warehouse serials, etc."
                      className="h-8.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={handleSaveDelivery}
                    disabled={isSavingDelivery}
                    size="sm"
                    className="h-8.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="size-3.5" />
                    <span>{isSavingDelivery ? "Saving Telemetry..." : "Save Delivery Information"}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* 4. ORDERED HARDWARE ITEMS */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Package className="size-4 text-[#38B46A]" /> Ordered Hardware Items ({order.items.length})
              </h4>
              <div className="rounded-2xl border border-[#E2EDE7] dark:border-white/10 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F2FBF4] dark:bg-white/5 font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="p-3 font-bold text-[#173226] dark:text-white flex items-center gap-2.5">
                          <img
                            src={item.image || "/p-panelboard.jpg"}
                            alt=""
                            className="size-8 rounded-lg object-cover bg-slate-100 border"
                          />
                          <span>{item.name}</span>
                        </td>
                        <td className="p-3 text-center font-bold">{item.quantity}</td>
                        <td className="p-3 text-right font-mono font-bold text-[#38B46A]">
                          {formatNPR(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Summary */}
              <div className="p-4 rounded-2xl bg-[#12342B] text-white space-y-1.5 text-xs font-medium">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatNPR(order.totalAmount + (order.discountAmount || 0))}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Discount Applied:</span>
                    <span className="font-mono">-{formatNPR(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-[#1e483c]">
                  <span>Total Payable:</span>
                  <span className="text-[#38B46A] font-mono">{formatNPR(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* 5. AUDIT TIMELINE */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="size-4 text-emerald-500" /> Lifecycle Audit History
              </h4>
              <div className="pl-4 border-l-2 border-[#38B46A]/30 space-y-4 text-xs">
                {order.timeline.map((tl, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-0.5 size-2.5 rounded-full bg-[#38B46A]" />
                    <div className="font-bold text-[#173226] dark:text-white">{tl.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tl.timestamp}</div>
                    {tl.note && (
                      <div className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 italic">
                        {tl.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 6. BOTTOM ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="flex-1 rounded-xl border-[#E2EDE7] font-bold text-xs gap-2 h-10 cursor-pointer"
              >
                <Printer className="size-4" /> Print Tax Invoice
              </Button>

              {onDeleteOrder && (
                <Button
                  onClick={() => setConfirmDeleteOpen(true)}
                  variant="outline"
                  className="rounded-xl border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold text-xs gap-1.5 h-10 cursor-pointer"
                >
                  <Trash2 className="size-4" /> Delete Order
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog for Payment Verification (Prevent Accidental Click) */}
      <AlertDialog open={verifyConfirmOpen} onOpenChange={setVerifyConfirmOpen}>
        <AlertDialogContent className="rounded-3xl bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display font-extrabold text-lg text-emerald-600">
              Confirm Payment Approval?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 space-y-2">
              <p>
                Are you sure you want to verify the manual payment for order{" "}
                <strong className="font-mono text-emerald-600">{order.id}</strong> of amount{" "}
                <strong className="font-mono text-emerald-600">{formatNPR(order.totalAmount)}</strong>?
              </p>
              <p className="text-[11px] text-slate-400">
                This will transition the order to <strong>PROCESSING</strong>, confirm reserved stock, and send an official confirmation email to the customer.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmVerifyPayment}
              disabled={isProcessingPayment}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              {isProcessingPayment ? "Approving..." : "Yes, Verify Payment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for Payment Rejection with Reason */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-extrabold text-lg text-rose-600">
              Reject Payment Proof
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <p className="text-slate-500">
              Provide a clear rejection reason. This will be displayed to the customer and emailed so they can re-upload their receipt.
            </p>
            <div className="space-y-1">
              <label className="font-bold text-foreground block">Reason for Rejection:</label>
              <textarea
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 text-xs font-medium focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isProcessingPayment}
              onClick={handleConfirmRejectPayment}
              size="sm"
              className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              {isProcessingPayment ? "Rejecting..." : "Confirm Rejection & Notify"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Lightbox with Zoom Controls (Requirement #11) */}
      <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 rounded-3xl shadow-2xl">
          <DialogHeader className="p-4 bg-[#F2FBF4] dark:bg-[#12342B] border-b border-[#E2EDE7] dark:border-white/10 flex flex-row items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#38B46A]">
                Payment Slip Zoom Telemetry
              </span>
              <DialogTitle className="font-display text-base font-extrabold text-[#173226] dark:text-white">
                Slip Verification — Order #{order.id}
              </DialogTitle>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-black/40 p-1 rounded-xl border border-slate-200">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="size-7 p-0"
                title="Zoom Out"
              >
                <ZoomOut className="size-3.5" />
              </Button>
              <span className="text-[10px] font-mono font-bold px-1">{Math.round(zoomLevel * 100)}%</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                className="size-7 p-0"
                title="Zoom In"
              >
                <ZoomIn className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(1)}
                className="size-7 p-0"
                title="Reset Zoom"
              >
                <RotateCcw className="size-3" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6 max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-900/10 dark:bg-black/60 select-none">
            {order.paymentReceipt && (
              <img
                src={order.paymentReceipt}
                alt={`Receipt for ${order.id}`}
                style={{ transform: `scale(${zoomLevel})`, transition: "transform 0.15s ease-out" }}
                className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-xl cursor-zoom-in"
                onClick={() => setZoomLevel((z) => (z === 1 ? 1.75 : 1))}
              />
            )}
          </div>

          <div className="p-4 bg-[#F8FBF8] dark:bg-white/5 border-t border-[#E2EDE7] dark:border-white/10 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs space-y-0.5">
              <div className="text-slate-500">
                Amount Payable: <strong className="text-emerald-600 font-mono text-sm">{formatNPR(order.totalAmount)}</strong>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Transaction Ref: <strong className="text-foreground">{order.transactionRef || "N/A"}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={order.paymentReceipt || "#"}
                download={`receipt-${order.id}.jpg`}
                className="h-8 px-3 rounded-xl border border-slate-200 text-xs font-bold inline-flex items-center gap-1 hover:bg-slate-100"
              >
                <Download className="size-3.5" /> Download
              </a>

              {order.paymentStatus !== "PAYMENT_VERIFIED" && (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      setReceiptModalOpen(false);
                      setVerifyConfirmOpen(true);
                    }}
                    className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    <Check className="size-3.5 mr-1" /> Approve Payment
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setReceiptModalOpen(false);
                      setRejectModalOpen(true);
                    }}
                    variant="outline"
                    className="h-8 rounded-xl border-rose-300 text-rose-600 text-xs font-bold"
                  >
                    <XCircle className="size-3.5 mr-1" /> Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Status Update */}
      <AlertDialog open={!!pendingStatusChange} onOpenChange={() => setPendingStatusChange(null)}>
        <AlertDialogContent className="rounded-3xl bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
              Confirm Order Status Update?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Are you sure you want to change order <strong className="font-mono text-[#38B46A]">{order.id}</strong> status from{" "}
              <strong>{order.orderStatus}</strong> to <strong>{pendingStatusChange}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              className="rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-bold text-xs"
            >
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Order Delete */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent className="rounded-3xl bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display font-extrabold text-lg text-red-600">
              Delete Order Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Are you sure you want to permanently delete order <strong className="font-mono text-red-500">{order.id}</strong>? This will remove the order record from the MySQL database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
