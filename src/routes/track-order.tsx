import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package,
  Search,
  Truck,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle,
  Phone,
  MessageCircle,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order & Access Tax Invoice | OMSUN Nepal" },
      {
        name: "description",
        content:
          "Track real-time order dispatch, delivery status, upload payment verification slips, and download official IRD Nepal VAT tax invoices.",
      },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const navigate = useNavigate();
  const [orderQuery, setOrderQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = orderQuery.trim();
    if (!raw) {
      toast.error("Please enter your Order Reference or Tracking ID");
      return;
    }

    // Format query: if numeric digits, prepend OMS-
    let cleanRef = raw.toUpperCase();
    if (/^\d+$/.test(cleanRef)) {
      cleanRef = `OMS-${cleanRef.padStart(6, "0")}`;
    }

    setIsSearching(true);
    setErrorMessage(null);

    try {
      // Test lookup with backend API
      const order = await api.getOrder(cleanRef);
      if (order && order.orderRef) {
        toast.success(`Order #${order.orderRef} located! Redirecting...`);
        navigate({ to: "/order/$ref", params: { ref: order.orderRef } });
      } else {
        navigate({ to: "/order/$ref", params: { ref: cleanRef } });
      }
    } catch (err: any) {
      // Still navigate so the dedicated order tracking page handles display or retry
      navigate({ to: "/order/$ref", params: { ref: cleanRef } });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#061410] flex flex-col justify-between">
      <Navbar />

      <main className="container mx-auto px-4 py-10 sm:py-16 max-w-4xl space-y-12">
        {/* Hero Search Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide">
            <Truck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>Live Nepal Logistics & Tax Invoice Portal</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
            Track Your Order &amp; Access Tax Invoice
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Enter your unique OMSUN Order Reference (e.g.{" "}
            <span className="font-mono font-bold text-foreground">OMS-2026-000001</span>) to view
            real-time dispatch telemetry, upload payment slips, or download official IRD Nepal VAT invoices.
          </p>
        </div>

        {/* Tracking Search Form Card */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0c241c] p-6 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Order Reference / Tracking ID
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="e.g. OMS-2026-000001 or 000001"
                  className="pl-12 h-14 rounded-2xl font-mono text-base font-bold bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 focus-visible:ring-emerald-500"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isSearching}
                className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {isSearching ? (
                  <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Track Order</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="size-4" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-emerald-500 shrink-0" />
              <span>Where can I find my Order ID?</span>
            </div>
            <p className="text-[11px]">
              Check your checkout confirmation screen or your registered email address.
            </p>
          </div>
        </div>

        {/* Feature Cards: What You Can Do */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Real-time Telemetry */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c241c] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="size-6" />
            </div>
            <h2 className="font-bold text-base text-foreground">Live Fulfillment Telemetry</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Daraz-style step progression tracking: Order Placed &rarr; Payment Verified &rarr; Warehouse Packed &rarr; Out for Delivery.
            </p>
          </div>

          {/* 2. Official Tax Invoice */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c241c] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
            <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileCheck className="size-6" />
            </div>
            <h2 className="font-bold text-base text-foreground">Official Nepal Tax Invoice</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Instant access to IRD Nepal compliant Tax Invoice (कर बीजक) with PAN/VAT 606847291, 13% VAT, and amount in words.
            </p>
          </div>

          {/* 3. Secure Verification */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c241c] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
            <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="size-6" />
            </div>
            <h2 className="font-bold text-base text-foreground">Fonepay &amp; Bank Slip Verification</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload payment screenshots directly to your order. OMSUN Finance reviews and confirms dispatches swiftly.
            </p>
          </div>
        </div>

        {/* Support Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="font-bold text-base text-foreground">Having trouble locating your order?</h2>
            <p className="text-xs text-muted-foreground max-w-md">
              Our Kathmandu customer support team can assist you with your reference or invoice.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-xl text-xs font-bold h-10 border-emerald-300">
              <a href="tel:+977-9800000000">
                <Phone className="size-3.5 mr-1.5" /> Call OMSUN
              </a>
            </Button>
            <Button asChild className="rounded-xl text-xs font-bold h-10 bg-emerald-600 hover:bg-emerald-500 text-white">
              <Link to="/contact">
                <MessageCircle className="size-3.5 mr-1.5" /> Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
