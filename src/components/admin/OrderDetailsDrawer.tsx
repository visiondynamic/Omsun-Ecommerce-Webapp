import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrderDetailsDrawer({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}: OrderDetailsDrawerProps) {
  const [pendingStatusChange, setPendingStatusChange] = useState<OrderStatus | null>(null);

  if (!order) return null;

  const handleConfirmStatusChange = () => {
    if (pendingStatusChange && order) {
      onUpdateStatus(order.id, pendingStatusChange);
      toast.success(`Order ${order.id} status updated to ${pendingStatusChange}`);
      setPendingStatusChange(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
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
            {/* Quick Status Update Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Update Order Status:
              </span>
              <div className="flex flex-wrap gap-2">
                {(["Pending", "Processing", "Completed", "Cancelled"] as OrderStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      disabled={order.orderStatus === st}
                      onClick={() => setPendingStatusChange(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        order.orderStatus === st
                          ? "bg-[#12342B] text-white border-[#38B46A]"
                          : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:border-[#38B46A]"
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
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
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {order.customerPhone}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-white/10">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="size-3 text-[#38B46A]" /> Delivery Address:
                  </span>
                  <span className="font-semibold text-[#173226] dark:text-slate-200 text-right max-w-[240px]">
                    {order.shippingAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Record */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="size-4 text-sky-500" /> Payment & Billing
              </h4>
              <div className="p-4 rounded-2xl bg-[#F8FBF8] dark:bg-white/5 border border-[#E2EDE7] dark:border-white/10 text-xs space-y-2 font-medium">
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
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Package className="size-4 text-[#38B46A]" /> Line Items ({order.items.length})
              </h4>
              <div className="rounded-2xl border border-[#E2EDE7] dark:border-white/10 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F2FBF4] dark:bg-white/5 font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Item</th>
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
                  <span>Total Amount Paid (NPR):</span>
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

            {/* Print / Export Action */}
            <Button
              onClick={() => toast.info("Printing official tax invoice PDF...")}
              variant="outline"
              className="w-full rounded-xl border-[#E2EDE7] font-bold text-xs gap-2 h-10 cursor-pointer"
            >
              <Printer className="size-4" /> Print Commercial Tax Invoice
            </Button>
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
              <strong>{order.orderStatus}</strong> to <strong>{pendingStatusChange}</strong>? This action will update customer tracking and log to audit telemetry.
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
    </>
  );
}
