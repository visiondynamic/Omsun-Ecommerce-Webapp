import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import { formatNPR } from "@/lib/products";
import omsunLogo from "@/assets/Omsun Nepal logo-WA0006.webp";

// Number to Words converter for Nepalese Rupees
function numberToWordsNPR(num: number): string {
  if (num === 0) return "Zero Nepalese Rupees Only";
  
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(n: number): string {
    if (n === 0) return "";
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + inWords(n % 1000) : "");
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + inWords(n % 10000000) : "");
  }

  const rounded = Math.round(num);
  return `Nepalese Rupees ${inWords(rounded).trim()} Only`;
}

export interface TaxInvoiceOrder {
  id?: string | number;
  orderRef?: string;
  order_ref?: string;
  customerName?: string;
  shipping_name?: string;
  customerPhone?: string;
  shipping_phone?: string;
  customerEmail?: string;
  shipping_email?: string;
  shippingAddress?: string;
  shipping_address?: string;
  shippingCity?: string;
  shipping_city?: string;
  items?: Array<{
    id?: string | number;
    productId?: string;
    product_id?: string;
    name?: string;
    product_name?: string;
    quantity?: number;
    qty?: number;
    price?: number;
    unit_price?: number;
    unitPrice?: number;
  }>;
  subtotal?: number;
  shippingFee?: number;
  shipping_fee?: number;
  totalAmount?: number;
  grand_total?: number;
  grandTotal?: number;
  paymentMethod?: string;
  payment_method?: string;
  paymentStatus?: string;
  payment_status?: string;
  transactionRef?: string | null;
  transaction_ref?: string | null;
  createdAt?: string;
  created_at?: string;
  verifiedBy?: string | null;
  verified_by?: string | null;
}

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: TaxInvoiceOrder | null;
}

export function TaxInvoiceModal({ isOpen, onClose, order }: TaxInvoiceModalProps) {
  if (!order) return null;

  const orderRef = order.orderRef || order.order_ref || String(order.id || "OMS-2026");
  const customerName = order.customerName || order.shipping_name || "Valued Customer";
  const customerPhone = order.customerPhone || order.shipping_phone || "+977-XXXXXXXXXX";
  const customerEmail = order.customerEmail || order.shipping_email || "N/A";
  const shippingAddress = order.shippingAddress || order.shipping_address || "Kathmandu";
  const shippingCity = order.shippingCity || order.shipping_city || "Kathmandu";

  const items = (order.items || []).map((item) => {
    const name = item.name || item.product_name || "Solar / Power Equipment";
    const qty = Number(item.quantity || item.qty || 1);
    const unitPrice = Number(item.price || item.unit_price || item.unitPrice || 0);
    return { name, qty, unitPrice, total: qty * unitPrice };
  });

  const grandTotal = Number(order.grandTotal || order.grand_total || order.totalAmount || 0);
  const shippingFee = Number(order.shippingFee || order.shipping_fee || 0);
  const itemsSubtotal = Number(order.subtotal || grandTotal - shippingFee);

  // Nepal 13% VAT Calculation (standard VAT-inclusive catalog model)
  const taxableBase = Math.round(itemsSubtotal / 1.13);
  const vatAmount = itemsSubtotal - taxableBase;

  const paymentMethod = (order.paymentMethod || order.payment_method || "Fonepay QR").toUpperCase();
  const paymentStatus = (order.paymentStatus || order.payment_status || "UNPAID").toUpperCase();
  const isPaid = paymentStatus.includes("PAID") || paymentStatus.includes("VERIFIED");
  const transactionRef = order.transactionRef || order.transaction_ref;
  const createdAt = order.createdAt || order.created_at || new Date().toISOString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[96vw] max-h-[92vh] overflow-y-auto p-0 bg-white dark:bg-[#071610] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">
          Official Nepal Tax Invoice #{orderRef}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Nepal IRD compliant VAT Tax Invoice for OMSUN Nepal Order #{orderRef}
        </DialogDescription>

        {/* Action Header - Hidden during print */}
        <div className="no-print sticky top-0 z-20 flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/95 dark:bg-[#0c241c]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800">
              Official Tax Invoice
            </span>
            <span className="font-mono text-xs text-slate-500 font-bold">#{orderRef}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" /> Print / Save as PDF
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="h-8 rounded-xl text-xs font-bold border-slate-200 dark:border-white/10 cursor-pointer"
            >
              <X className="size-3.5" /> Close
            </Button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* OFFICIAL PRINTABLE TAX INVOICE (कर बीजक)                     */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div
          id="printable-tax-invoice"
          className="p-6 sm:p-10 bg-white text-slate-900 font-sans leading-relaxed text-xs selection:bg-emerald-100"
        >
          {/* Top Company Letterhead */}
          <div className="border-b-2 border-slate-800 pb-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={omsunLogo}
                alt="OMSUN Nepal"
                className="h-14 w-auto object-contain shrink-0"
              />
              <div>
                <h1 className="font-black text-xl text-emerald-800 tracking-tight leading-none uppercase">
                  OMSUN NEPAL PVT. LTD.
                </h1>
                <p className="text-[11px] font-bold text-slate-600 mt-1">
                  Solar Energy, Online UPS, Inverters & Industrial Batteries
                </p>
                <p className="text-[10px] text-slate-500">
                  Registered Office: Tripureshwor, Ward 11, Kathmandu, Nepal
                </p>
                <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-slate-500 mt-0.5 font-medium">
                  <span>Tel: +977-1-4589201</span>
                  <span>•</span>
                  <span>WhatsApp: +977-9801234567</span>
                  <span>•</span>
                  <span>Email: billing@omsunnepal.com</span>
                </div>
              </div>
            </div>

            {/* Official PAN/VAT Card Box */}
            <div className="text-left sm:text-right border border-slate-300 rounded-xl p-3 bg-slate-50 min-w-[200px]">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Nepal IRD Registration
              </div>
              <div className="text-sm font-black text-slate-900 font-mono mt-0.5 tracking-wider">
                PAN / VAT: 606847291
              </div>
              <div className="text-[9.5px] text-slate-500 mt-0.5 font-medium">
                Reg. No: 189204/074/075
              </div>
            </div>
          </div>

          {/* Invoice Document Title Banner */}
          <div className="text-center py-2 bg-slate-100 rounded-lg border border-slate-300 mb-5">
            <h2 className="font-black text-sm uppercase tracking-widest text-slate-900">
              TAX INVOICE / कर बीजक
            </h2>
            <p className="text-[9.5px] text-slate-600">
              Issued in accordance with the Value Added Tax Act, 2052 (Nepal)
            </p>
          </div>

          {/* Meta Grid: Bill To & Invoice Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-5 text-[11px]">
            {/* Buyer Details */}
            <div className="space-y-1">
              <span className="text-[9.5px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                Billed To (Customer Details)
              </span>
              <div className="font-bold text-sm text-slate-900">{customerName}</div>
              <div>
                <span className="text-slate-500">Phone:</span>{" "}
                <span className="font-mono font-semibold">{customerPhone}</span>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>{" "}
                <span className="font-mono">{customerEmail}</span>
              </div>
              <div>
                <span className="text-slate-500">Destination:</span>{" "}
                <span className="font-medium">{shippingAddress}, {shippingCity}, Nepal</span>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="space-y-1 sm:text-right">
              <span className="text-[9.5px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                Invoice & Payment Credentials
              </span>
              <div>
                <span className="text-slate-500">Invoice Number:</span>{" "}
                <span className="font-mono font-bold text-slate-900">INV-{orderRef}</span>
              </div>
              <div>
                <span className="text-slate-500">Order Reference:</span>{" "}
                <span className="font-mono font-bold text-emerald-700">#{orderRef}</span>
              </div>
              <div>
                <span className="text-slate-500">Issue Date:</span>{" "}
                <span className="font-mono">{new Date(createdAt).toLocaleDateString()} {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div>
                <span className="text-slate-500">Payment Mode:</span>{" "}
                <span className="font-bold uppercase text-slate-800">{paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-500">Payment Status:</span>{" "}
                <span className={`font-bold uppercase px-1.5 py-0.5 rounded text-[10px] ${
                  isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {isPaid ? "✓ PAID & VERIFIED" : paymentStatus}
                </span>
              </div>
              {transactionRef && (
                <div>
                  <span className="text-slate-500">Tx Slip Ref:</span>{" "}
                  <span className="font-mono font-semibold">{transactionRef}</span>
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-5">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[9.5px]">
                <tr>
                  <th className="p-2.5 w-12 text-center border-r border-slate-300">S.N.</th>
                  <th className="p-2.5 border-r border-slate-300">Particulars / Hardware Description</th>
                  <th className="p-2.5 w-16 text-center border-r border-slate-300">Qty</th>
                  <th className="p-2.5 w-28 text-right border-r border-slate-300">Rate (NPR)</th>
                  <th className="p-2.5 w-32 text-right">Amount (NPR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">
                      Standard Hardware Fulfillment ({orderRef})
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2.5 text-center font-mono border-r border-slate-200 text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-900">
                        {item.name}
                      </td>
                      <td className="p-2.5 text-center font-mono border-r border-slate-200">
                        {item.qty}
                      </td>
                      <td className="p-2.5 text-right font-mono border-r border-slate-200">
                        {formatNPR(item.unitPrice)}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        {formatNPR(item.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            {/* Amount in Words */}
            <div className="flex-1 p-3.5 rounded-xl border border-slate-200 bg-slate-50 w-full sm:w-auto">
              <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-1">
                Amount In Words
              </span>
              <p className="font-bold text-slate-800 text-[11px] leading-snug">
                {numberToWordsNPR(grandTotal)}
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[9.5px] text-slate-500 space-y-0.5">
                <div>• All rates include 13% Government VAT per Inland Revenue rules.</div>
                <div>• Tier-1 manufacturer hardware warranty applicable per serialized registry.</div>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="w-full sm:w-80 border border-slate-300 rounded-xl overflow-hidden text-[11px]">
              <div className="flex justify-between p-2 border-b border-slate-200 text-slate-600">
                <span>Taxable Base Amount (Excl. VAT):</span>
                <span className="font-mono">{formatNPR(taxableBase)}</span>
              </div>
              <div className="flex justify-between p-2 border-b border-slate-200 text-slate-600">
                <span>13% Value Added Tax (VAT):</span>
                <span className="font-mono">{formatNPR(vatAmount)}</span>
              </div>
              <div className="flex justify-between p-2 border-b border-slate-200 text-slate-600">
                <span>Items Subtotal (VAT Incl.):</span>
                <span className="font-mono font-bold text-slate-900">{formatNPR(itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between p-2 border-b border-slate-200 text-slate-600">
                <span>Logistics & Delivery Freight:</span>
                <span className="font-mono">{shippingFee === 0 ? "FREE" : formatNPR(shippingFee)}</span>
              </div>
              <div className="flex justify-between p-3 bg-emerald-50 text-emerald-950 font-black text-sm border-t-2 border-emerald-600">
                <span>Grand Total Payable:</span>
                <span className="font-mono text-emerald-800">{formatNPR(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Official Stamp Block */}
          <div className="pt-6 border-t-2 border-dashed border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-[10px]">
            <div>
              <div className="h-14 border-b border-slate-400 flex items-end justify-center pb-1">
                <span className="text-slate-400 italic">{customerName}</span>
              </div>
              <span className="font-bold text-slate-600 mt-1 block">Customer Acceptance</span>
            </div>

            <div className="hidden sm:block">
              <div className="h-14 border-b border-slate-400 flex items-center justify-center">
                <div className="size-12 rounded-full border border-emerald-500/40 text-[7px] text-emerald-700 font-bold uppercase flex items-center justify-center text-center p-1 leading-tight">
                  OMSUN NEPAL<br />OFFICIAL SEAL
                </div>
              </div>
              <span className="font-bold text-slate-600 mt-1 block">Official Company Seal</span>
            </div>

            <div>
              <div className="h-14 border-b border-slate-400 flex items-end justify-center pb-1">
                <span className="text-emerald-800 font-bold tracking-wider">OMSUN Finance Dept.</span>
              </div>
              <span className="font-bold text-slate-600 mt-1 block">Authorized Signatory</span>
            </div>
          </div>

          {/* Document Footer */}
          <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[9px] text-slate-400 space-y-0.5">
            <div>
              This is a valid, system-generated computer tax invoice printed from OMSUN Nepal ERP.
            </div>
            <div>
              For technical warranty support, dial +977-1-4589201 or visit https://omsun.com.np
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
