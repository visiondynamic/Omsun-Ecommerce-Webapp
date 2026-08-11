import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import {
  Package,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileCheck2,
  Sun,
  Truck,
  ArrowUpRight,
  User,
  Settings,
} from "lucide-react";
import { formatNPR } from "@/lib/products";

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();

  const mockOrders = [
    {
      id: "OMS-8942",
      date: "August 04, 2026",
      items: "580W N-Type Bifacial Panel x4, 5kW Hybrid Inverter x1",
      total: 245000,
      status: "Processing",
      statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "OMS-7419",
      date: "May 18, 2026",
      items: "LiFePO4 10kWh Storage Wall Rack x1, TÜV Cables 50m",
      total: 185000,
      status: "Delivered",
      statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "OMS-6102",
      date: "January 12, 2026",
      items: "Smart IP67 LED Solar Streetlight 100W x6",
      total: 96000,
      status: "Delivered",
      statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Active Orders", val: "1 Order", sub: "Dispatched from Kathmandu" },
          { label: "Total Purchases", val: formatNPR(526000), sub: "3 Completed Transactions" },
          { label: "Registered Warranty", val: "25 Years", sub: "Serialised Tier-1 Guarantee" },
          { label: "NEA Net-Meter Sync", val: "Approved", sub: "Grid Interconnection Active" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 dark:border-white/10 bg-card p-5 shadow-sm"
          >
            <div className="text-xs font-bold text-muted-foreground">{stat.label}</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-foreground">
              {stat.val}
            </div>
            <div className="mt-0.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Order History Section */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4 mb-6">
          <h2 className="font-display text-xl font-extrabold text-foreground flex items-center gap-2">
            <Package className="size-5 text-emerald-500" />
            <span>Order History & Dispatch Tracking</span>
          </h2>
          <Link to="/shop" className="text-xs text-emerald-500 font-bold hover:underline">
            Shop Catalogue
          </Link>
        </div>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-extrabold text-base text-foreground">
                    {order.id}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-1 text-xs font-medium text-foreground">{order.items}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">Placed on {order.date}</div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 border-slate-200 dark:border-white/10 pt-3 sm:pt-0">
                <div className="font-display font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                  {formatNPR(order.total)}
                </div>
                <div className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 hover:underline cursor-pointer">
                  <span>Track Shipment</span>
                  <ArrowUpRight className="size-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solar System Warranty Card */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#031c14] to-[#073d2c] p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            <Sun className="size-3.5 text-amber-400" />
            <span>Registered Solar Installation</span>
          </div>
          <h3 className="font-display text-2xl font-extrabold text-white">
            5.8 kWp Residential Solar System
          </h3>
          <p className="text-xs text-white/70">
            Installed at {user?.name}'s Property • Serial #OMS-W-881902 • 25-Year Performance
            Guarantee Active
          </p>
        </div>

        <button className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-black text-xs shadow-lg transition-all shrink-0">
          Download Serialized Warranty Certificate
        </button>
      </div>
    </div>
  );
}
