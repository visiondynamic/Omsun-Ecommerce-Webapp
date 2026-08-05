import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      <h2 className="text-xl font-semibold mb-6">Order History</h2>

      {/* Mock Orders */}
      <div className="space-y-4">
        {[1, 2, 3].map((order) => (
          <div
            key={order}
            className="bg-slate-900/50 p-4 rounded-xl flex items-center justify-between border border-slate-700/50"
          >
            <div>
              <p className="font-medium">Order #OMS-{Math.floor(Math.random() * 10000)}</p>
              <p className="text-sm text-slate-400">Placed on Oct {10 + order}, 2026</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-emerald-400">Processing</p>
              <p className="text-sm text-slate-400">NPR {45000 * order}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
