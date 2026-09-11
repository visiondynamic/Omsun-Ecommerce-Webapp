import React from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  MessageSquare,
  Users,
  Ticket,
  BarChart3,
  Handshake,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import omsunLogo from "@/assets/Omsun Nepal logo-WA0006.webp";

export type AdminSection =
  | "overview"
  | "products"
  | "categories"
  | "inventory"
  | "orders"
  | "inquiries"
  | "customers"
  | "coupons"
  | "reports"
  | "partners"
  | "settings";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingOrdersCount?: number;
  lowStockCount?: number;
  inquiriesCount?: number;
}

export function AdminSidebar({
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  pendingOrdersCount = 0,
  lowStockCount = 0,
  inquiriesCount = 0,
}: AdminSidebarProps) {
  const { user, logout } = useAuth();

  const navItems: {
    id: AdminSection;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "products", label: "Product Catalog", icon: Package },
    { id: "categories", label: "Categories", icon: FolderTree },
    {
      id: "inventory",
      label: "Inventory Control",
      icon: Boxes,
      ...(lowStockCount > 0
        ? { badge: lowStockCount, badgeColor: "bg-amber-500 text-black font-bold" }
        : {}),
    },
    {
      id: "orders",
      label: "Order Fulfillment",
      icon: ShoppingBag,
      ...(pendingOrdersCount > 0
        ? { badge: pendingOrdersCount, badgeColor: "bg-emerald-500 text-black font-bold" }
        : {}),
    },
    {
      id: "inquiries",
      label: "Inquiries & Leads",
      icon: MessageSquare,
      ...(inquiriesCount > 0
        ? { badge: inquiriesCount, badgeColor: "bg-sky-400 text-black font-bold" }
        : {}),
    },
    { id: "customers", label: "Client Accounts", icon: Users },
    { id: "coupons", label: "Coupons / Promos", icon: Ticket },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
    { id: "partners", label: "Partner Brands", icon: Handshake },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col h-full bg-[#12342B] text-white transition-all duration-300 select-none z-30 shadow-2xl border-r border-[#1e483c] ${
        collapsed ? "w-20" : "w-64 sm:w-72"
      }`}
    >
      {/* Sidebar Header / Official OMSUN Logo */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#1c4539]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src={omsunLogo}
            alt="OMSUN Nepal Official Logo"
            className="h-9 sm:h-10 w-auto object-contain drop-shadow-md brightness-110 shrink-0"
          />

          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#38B46A] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 w-fit">
                Store Operations
              </span>
              <span className="text-[10px] font-mono text-slate-300 mt-0.5">OMSUN Nepal</span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center size-7 rounded-lg bg-[#184237] text-slate-300 hover:text-white hover:bg-[#205245] transition-colors cursor-pointer border border-[#245b4e] shrink-0"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Live System Telemetry Strip (Expanded Only) */}
      {!collapsed && (
        <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-[#0b251d] border border-[#184537] flex items-center justify-between text-[11px] text-emerald-400 font-mono font-medium">
          <div className="flex items-center gap-1.5">
            <Radio className="size-3 text-emerald-400 animate-pulse" />
            <span>OMSUN Store Online</span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans">Nepal GMT+5:45</span>
        </div>
      )}

      {/* Navigation List */}
      <TooltipProvider delayDuration={150}>
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            const buttonContent = (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`group relative flex items-center w-full rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#1f4a3c] text-white shadow-md border border-[#38B46A]/40"
                    : "text-slate-300/80 hover:bg-[#184237] hover:text-white"
                } ${collapsed ? "justify-center" : "justify-start gap-3.5"}`}
              >
                {/* Active Bar Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#38B46A] shadow-[0_0_8px_#38B46A]" />
                )}

                <Icon
                  className={`size-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-[#38B46A]" : "text-slate-400 group-hover:text-emerald-400"
                  }`}
                />

                {!collapsed && (
                  <span className="truncate font-sans font-semibold tracking-wide">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-[10px] ${
                      item.badgeColor || "bg-emerald-500 text-black font-bold"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-400 ring-2 ring-[#12342B]" />
                )}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-[#0b241c] text-white border-[#1e4a3d] font-bold text-xs"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return buttonContent;
          })}
        </div>
      </TooltipProvider>

      {/* Footer Profile & Logout */}
      <div className="p-3 sm:p-4 border-t border-[#1c4539] bg-[#0d2821]">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex size-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 items-center justify-center text-emerald-400 font-extrabold text-xs">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">
                  {user?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="size-3 text-emerald-400" />
                  Super Admin
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Sign Out of OMSUN Admin"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="flex items-center justify-center size-10 mx-auto rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="size-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
