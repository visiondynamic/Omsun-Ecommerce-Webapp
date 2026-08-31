import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
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
  onDeleteOrder?: (orderId: string) => void | Promise<void>;
}

export function OrderDetailsDrawer({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onDeleteOrder,
}: OrderDetailsDrawerProps) {
  const [pendingStatusChange, setPendingStatusChange] = useState<OrderStatus | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  if (!order) return null;

  const handleConfirmStatusChange = () => {
    if (pendingStatusChange && order) {
      onUpdateStatus(order.id, pendingStatusChange);
      toast.success(`Order ${order.id} status updated to ${pendingStatusChange}`);
      setPendingStatusChange(null);
    }
  };

  const handleConfirmDelete = () => {
    if (order && onDeleteOrder) {
      onDeleteOrder(order.id);
      onClose();
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "Shipped":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
      case "Processing":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30";
      case "Pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "Cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-xl p-0 overflow-y-auto bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl">
          <SheetHeader className="p-6 bg-[#F2FBF4] dark:bg-[#12342B] border-b border-[#E2EDE7] dark:border-white/10 sticky top-0 z-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#38B46A]">
                  Order Telemetry & Inspection
                </span>
                <SheetTitle className="font-display text-xl font-extrabold text-[#173226] dark:text-white font-mono">
                  {order.id}
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500 font-medium">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </SheetDescription>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>
          </SheetHeader>

          <div className="p-6 space-y-6">
            {/* Quick Status Action Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <span className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Change Order Lifecycle Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  disabled={order.orderStatus === "Pending"}
                  onClick={() => setPendingStatusChange("Pending")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    order.orderStatus === "Pending"
                      ? "bg-amber-500/20 text-amber-600 border-amber-500"
                      : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:border-amber-400"
                  }`}
                >
                  <Clock className="size-3.5" /> Pending
                </button>

                <button
                  disabled={order.orderStatus === "Processing"}
                  onClick={() => setPendingStatusChange("Processing")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    order.orderStatus === "Processing"
                      ? "bg-sky-500/20 text-sky-600 border-sky-500"
                      : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:border-sky-400"
                  }`}
                >
                  <CheckCircle2 className="size-3.5" /> Confirm / Prep
                </button>

                <button
                  disabled={order.orderStatus === "Shipped"}
                  onClick={() => setPendingStatusChange("Shipped")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    order.orderStatus === "Shipped"
                      ? "bg-indigo-500/20 text-indigo-600 border-indigo-500"
                      : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <Truck className="size-3.5" /> Shipped
                </button>

                <button
                  disabled={order.orderStatus === "Completed"}
                  onClick={() => setPendingStatusChange("Completed")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    order.orderStatus === "Completed"
                      ? "bg-emerald-500/20 text-emerald-600 border-emerald-500"
                      : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:border-emerald-400"
                  }`}
                >
                  <Check className="size-3.5" /> Delivered
                </button>

                <button
                  disabled={order.orderStatus === "Cancelled"}
                  onClick={() => setPendingStatusChange("Cancelled")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    order.orderStatus === "Cancelled"
                      ? "bg-red-500/20 text-red-600 border-red-500"
                      : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:border-red-400"
                  }`}
                >
                  <XCircle className="size-3.5" /> Reject / Cancel
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UserCheck className="size-4 text-[#38B46A]" /> Customer Profile
              </h4>
              <div className="p-4 rounded-2xl bg-[#F8FBF8] dark:bg-white/5 border border-[#E2EDE7] dark:border-white/10 text-xs space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-bold text-[#173226] dark:text-white">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {order.customerEmail}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                    {order.customerPhone}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-white/10">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="size-3 text-[#38B46A]" /> Delivery Destination:
                  </span>
                  <span className="font-semibold text-[#173226] dark:text-slate-200 text-right max-w-[240px]">
                    {order.shippingAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Record & Proof Verification */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="size-4 text-sky-500" /> Payment & Verification Proof
              </h4>
              <div className="p-4 rounded-2xl bg-[#F8FBF8] dark:bg-white/5 border border-[#E2EDE7] dark:border-white/10 text-xs space-y-3 font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-bold text-[#173226] dark:text-white bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      order.paymentStatus === "Paid"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                        : order.paymentStatus === "Pending Verification"
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                {/* Attached Receipt / Slip Preview Box */}
                {order.paymentReceipt ? (
                  <div className="p-3 bg-white dark:bg-black/30 rounded-xl border border-[#E2EDE7] dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-emerald-600" /> Attached Payment Receipt Slip
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        Proof Provided
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setReceiptModalOpen(true)}
                        className="relative group cursor-pointer shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                        title="Click to view full image"
                      >
                        <img
                          src={order.paymentReceipt}
                          alt="Payment Receipt Slip"
                          className="size-16 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="size-4" />
                        </div>
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          Customer Payment Screenshot
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Verify order amount ({formatNPR(order.totalAmount)}) against the transaction slip.
                        </p>
                        <button
                          type="button"
                          onClick={() => setReceiptModalOpen(true)}
                          className="text-[11px] text-emerald-600 hover:underline font-bold cursor-pointer"
                        >
                          View Full Resolution Slip &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Quick Approve Actions for Admin */}
                    {order.orderStatus === "Pending" && (
                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => {
                            onUpdateStatus(order.id, "Processing");
                            toast.success(`Payment verified and order ${order.id} confirmed!`);
                          }}
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-8"
                        >
                          <Check className="size-3.5 mr-1" /> Approve & Confirm Order
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            onUpdateStatus(order.id, "Cancelled");
                            toast.error(`Receipt rejected for order ${order.id}`);
                          }}
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs font-bold h-8 border-rose-300 text-rose-600 hover:bg-rose-50"
                        >
                          <XCircle className="size-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/30 text-slate-600 dark:text-slate-300 text-[11.5px]">
                    <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="size-3.5" /> No Payment Receipt Attached
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Customer has not uploaded a transaction slip yet. Confirm payment status via direct bank statement or phone before dispatching.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Ordered Items Table */}
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
                          {item.image && (
                            <img src={item.image} alt="" className="size-8 rounded object-cover" />
                          )}
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

              {/* Financial Calculation */}
              <div className="p-4 rounded-2xl bg-[#12342B] text-white space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-mono">
                    {formatNPR(order.totalAmount + order.discountAmount)}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Discount Applied:</span>
                    <span className="font-mono">-{formatNPR(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-[#1e483c]">
                  <span>Total Order Value (NPR):</span>
                  <span className="text-[#38B46A] font-mono">{formatNPR(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="size-4 text-emerald-500" /> Dispatch Timeline
              </h4>
              <div className="pl-4 border-l-2 border-[#38B46A]/30 space-y-4 text-xs">
                {order.timeline.map((tl, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-0.5 size-2.5 rounded-full bg-[#38B46A]" />
                    <div className="font-bold text-[#173226] dark:text-white">{tl.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tl.timestamp}</div>
                    {tl.note && (
                      <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 italic">
                        {tl.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Print Invoice & Delete Order */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Button
                onClick={() => toast.info("Printing official tax invoice PDF...")}
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

      {/* Lightbox Modal for Full Resolution Receipt Inspection */}
      <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 rounded-3xl shadow-2xl">
          <DialogHeader className="p-4 bg-[#F2FBF4] dark:bg-[#12342B] border-b border-[#E2EDE7] dark:border-white/10 flex flex-row items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#38B46A]">
                Payment Proof Inspection
              </span>
              <DialogTitle className="font-display text-base font-extrabold text-[#173226] dark:text-white">
                Transaction Slip — Order #{order.id}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-4 max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-900/10 dark:bg-black/40">
            {order.paymentReceipt && (
              <img
                src={order.paymentReceipt}
                alt={`Receipt for ${order.id}`}
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
              />
            )}
          </div>

          <div className="p-4 bg-[#F8FBF8] dark:bg-white/5 border-t border-[#E2EDE7] dark:border-white/10 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="text-slate-500">Total Billed: </span>
              <strong className="text-[#38B46A]">{formatNPR(order.totalAmount)}</strong>
            </div>

            {order.orderStatus === "Pending" ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(order.id, "Processing");
                    setReceiptModalOpen(false);
                    toast.success(`Payment verified and order ${order.id} confirmed!`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  <Check className="size-3.5 mr-1" /> Approve & Confirm Order
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(order.id, "Cancelled");
                    setReceiptModalOpen(false);
                    toast.error(`Receipt rejected for order ${order.id}`);
                  }}
                  variant="outline"
                  className="rounded-xl text-xs font-bold border-rose-300 text-rose-600"
                >
                  <XCircle className="size-3.5 mr-1" /> Reject Slip
                </Button>
              </div>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                Status: {order.orderStatus}
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

