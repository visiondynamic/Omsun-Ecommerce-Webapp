import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Box,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Layers,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Users,
  Zap,
} from "lucide-react";
import { products, formatNPR } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_admin/admin-dashboard")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [adminTab, setAdminTab] = useState<"inventory" | "orders" | "surveys">("inventory");
  const [searchQuery, setSearchQuery] = useState("");

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stock > 0).length;

  const mockSurveys = [
    {
      name: "Sabin Shrestha",
      location: "Bhaktapur",
      system: "320 kW Commercial Solar",
      status: "Survey Assigned",
      phone: "98510XXXXX",
    },
    {
      name: "Dr. Anjana Karki",
      location: "Pokhara",
      system: "15 kW Hospital UPS",
      status: "SLD Approved",
      phone: "98412XXXXX",
    },
    {
      name: "Pemba Sherpa",
      location: "Namche Bazaar",
      system: "45 kW Off-Grid Lodge",
      status: "NEA Pending",
      phone: "98034XXXXX",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>Total Revenue (2026)</span>
            <DollarSign className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {formatNPR(18450000)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-500 font-bold">+18.4% vs last month</div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>Hardware Catalog</span>
            <Box className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {totalProducts} SKUs
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground font-medium">
            {inStockCount} In Stock
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>Active EPC Surveys</span>
            <Zap className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            14 Inquiries
          </div>
          <div className="mt-1 text-[11px] text-amber-500 font-bold">3 Pending Field Audit</div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>NEA Net-Meter Syncs</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            142 Commissioned
          </div>
          <div className="mt-1 text-[11px] text-emerald-500 font-bold">
            100% Interconnection Pass
          </div>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-card p-6 sm:p-8 shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4 mb-6">
          <div className="flex gap-2">
            {[
              { id: "inventory", label: "Inventory Stock", icon: Box },
              { id: "surveys", label: "Site Assessment Inquiries", icon: Zap },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setAdminTab(t.id as "inventory" | "orders" | "surveys")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  adminTab === t.id
                    ? "bg-amber-500 text-black shadow-md"
                    : "bg-slate-100 dark:bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="size-4" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <Button className="h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-black text-xs gap-1.5">
            <Plus className="size-4" />
            <span>Add Product SKU</span>
          </Button>
        </div>

        {/* Tab 1: Inventory Stock Table */}
        {adminTab === "inventory" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 max-w-sm">
              <Input
                placeholder="Search catalog SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-bold uppercase text-muted-foreground">
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (NPR)</th>
                    <th className="p-4">Stock Level</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                        <td className="p-4 font-bold text-foreground flex items-center gap-3">
                          <img src={p.image} alt="" className="size-9 rounded-lg object-cover" />
                          <span>{p.name}</span>
                        </td>
                        <td className="p-4 text-muted-foreground">{p.category}</td>
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                          {formatNPR(p.price)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              p.stock > 10
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                : p.stock > 0
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                  : "bg-red-500/10 text-red-500 border-red-500/30"
                            }`}
                          >
                            {p.stock > 0 ? `${p.stock} Units` : "Out of Stock"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-xs font-bold text-emerald-500 hover:underline">
                            Edit Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Site Assessment Inquiries Table */}
        {adminTab === "surveys" && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-bold uppercase text-muted-foreground">
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Requested System</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Engineering Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                {mockSurveys.map((s) => (
                  <tr key={s.name} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                    <td className="p-4 font-bold text-foreground">{s.name}</td>
                    <td className="p-4 text-muted-foreground">{s.location}</td>
                    <td className="p-4 text-foreground font-bold">{s.system}</td>
                    <td className="p-4 font-mono text-muted-foreground">{s.phone}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
