import { createFileRoute } from "@tanstack/react-router";
import { Users, Package, ShoppingBag, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin-dashboard")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-800/80 border border-zinc-700/80 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <ShoppingBag className="size-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold">1,248</p>
          </div>
        </div>
        <div className="bg-zinc-800/80 border border-zinc-700/80 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <BarChart3 className="size-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm">Revenue (Month)</p>
            <p className="text-2xl font-bold">NPR 4.2M</p>
          </div>
        </div>
        <div className="bg-zinc-800/80 border border-zinc-700/80 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Users className="size-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm">Total Customers</p>
            <p className="text-2xl font-bold">8,592</p>
          </div>
        </div>
        <div className="bg-zinc-800/80 border border-zinc-700/80 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
            <Package className="size-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm">Active Products</p>
            <p className="text-2xl font-bold">142</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-400 border-b border-zinc-700">
                <tr>
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/50">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td className="py-4">#OMS-{(8800 + i).toString()}</td>
                    <td className="py-4">Customer {i}</td>
                    <td className="py-4">NPR {20000 * i}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                        Shipped
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Inventory Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 font-medium text-sm">Low Stock: 500W Solar Panel</p>
              <p className="text-xs text-red-400/70 mt-1">Only 4 items remaining in warehouse.</p>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-400 font-medium text-sm">Reorder: String Inverter 5kW</p>
              <p className="text-xs text-amber-400/70 mt-1">
                Stock drops below 10 next week based on trend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
