import React from "react";
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Menu,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AdminNotification } from "@/lib/adminData";
import { AdminSection } from "./AdminSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface AdminHeaderProps {
  activeSection: AdminSection;
  onOpenSearch: () => void;
  onOpenMobileSidebar: () => void;
  onQuickAction: () => void;
  notifications: AdminNotification[];
  onMarkNotificationRead: (id: string) => void;
  onSelectSection: (section: AdminSection) => void;
}

const SECTION_TITLES: Record<
  AdminSection,
  { title: string; subtitle: string; actionLabel?: string }
> = {
  overview: {
    title: "Dashboard Overview",
    subtitle: "Store Operations & Real-Time E-Commerce Analytics",
    actionLabel: "Generate Report",
  },
  products: {
    title: "Product Catalog",
    subtitle: "Solar, Inverters, Storage & Electrical Hardware SKUs",
    actionLabel: "Add Product",
  },
  categories: {
    title: "Categories Management",
    subtitle: "5 Core Hardware Verticals: UPS, Stabilizer, Security, Solar & Battery",
    actionLabel: "Add Category",
  },
  inventory: {
    title: "Inventory Control",
    subtitle: "Real-time Stock Levels, Low Stock Alerts & Warehouse Tracking",
    actionLabel: "Update Stock",
  },
  orders: {
    title: "Order Fulfillment",
    subtitle: "Customer Purchases, Fonepay Verification & Courier Dispatch",
    actionLabel: "Export Orders",
  },
  inquiries: {
    title: "Inquiries & Project Leads",
    subtitle: "Solar EPC quotes, customer messages & newsletter subscribers",
    actionLabel: "Export Leads",
  },
  customers: {
    title: "Client Accounts",
    subtitle: "Registered Accounts, Purchasing History & VIP Profiles",
    actionLabel: "Export Clients",
  },

  reports: {
    title: "Reports & Financial Analytics",
    subtitle: "Revenue Breakdown, Sales Growth & Stock Movement",
    actionLabel: "Export CSV",
  },
  partners: {
    title: "Partner Brands",
    subtitle: "Authorized Distribution (Dyna, Excite, Luminous, Smarten)",
    actionLabel: "Add Partner",
  },
  team: {
    title: "Executive Team",
    subtitle: "Leadership Profiles, Executive Team Bios & Governance",
    actionLabel: "Add Team Member",
  },
  settings: {
    title: "Admin & Store Settings",
    subtitle: "Store Details, Nepal Tax, NPR Currency & Staff Permissions",
    actionLabel: "Save Changes",
  },
};

export function AdminHeader({
  activeSection,
  onOpenSearch,
  onOpenMobileSidebar,
  onQuickAction,
  notifications,
  onMarkNotificationRead,
  onSelectSection,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const currentInfo = SECTION_TITLES[activeSection] || SECTION_TITLES.overview;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#0c241c]/90 backdrop-blur-md border-b border-[#E2EDE7] dark:border-white/10 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="size-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-[#38B46A] font-bold">OMSUN Admin</span>
              <span>/</span>
              <span className="text-slate-700 dark:text-slate-200 font-bold capitalize">
                {activeSection}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold font-display text-[#173226] dark:text-white leading-tight">
              {currentInfo.title}
            </h1>
          </div>
        </div>

        {/* Center: Global Search Bar Trigger */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-[#38B46A]/50 transition-all cursor-pointer group shadow-inner"
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <Search className="size-4 text-slate-400 group-hover:text-[#38B46A] transition-colors" />
              <span>Search products, orders, customers (Press ⌘K)...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-white dark:bg-white/10 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Mobile Icon */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
            title="Search catalog & orders"
          >
            <Search className="size-4" />
          </button>

          {/* Customer Site Preview Link */}
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-[#38B46A] hover:bg-emerald-50 text-xs font-bold transition-all border border-slate-200 dark:border-white/10"
          >
            <ExternalLink className="size-3.5" />
            <span>Storefront</span>
          </Link>

          {/* Quick Action Button */}
          <Button
            onClick={onQuickAction}
            className="h-9 px-3.5 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 gap-1.5 cursor-pointer"
          >
            <Plus className="size-4" />
            <span className="hidden xs:inline">{currentInfo.actionLabel || "Action"}</span>
          </Button>

          {/* Notification Center Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200 dark:border-white/10"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-black ring-2 ring-white dark:ring-[#0c241c]">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-96 p-0 rounded-2xl bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#F2FBF4] dark:bg-[#12342B] border-b border-[#E2EDE7] dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="size-4 text-[#38B46A]" />
                  <span className="font-extrabold text-xs text-[#173226] dark:text-white">
                    System Telemetry & Alerts
                  </span>
                </div>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {unreadCount} Unread
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 text-xs transition-colors ${
                        !n.read ? "bg-emerald-50/60 dark:bg-emerald-950/20" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-[#173226] dark:text-slate-100">
                          {n.title}
                        </span>
                        {!n.read && (
                          <button
                            onClick={() => onMarkNotificationRead(n.id)}
                            className="text-[10px] text-[#38B46A] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            <Check className="size-3" /> Mark read
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                        {n.message}
                      </p>
                      <span className="mt-1.5 block text-[10px] font-mono text-slate-400">
                        {n.timestamp}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 text-center bg-slate-50 dark:bg-white/5 border-t border-[#E2EDE7] dark:border-white/10">
                <button
                  onClick={() => onSelectSection("reports")}
                  className="text-xs font-bold text-[#38B46A] hover:underline cursor-pointer"
                >
                  View All Operational Logs
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Admin Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer border border-slate-200 dark:border-white/10">
                <div className="size-7 rounded-lg bg-[#12342B] text-[#38B46A] flex items-center justify-center font-extrabold text-xs">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <span className="hidden sm:inline font-bold text-xs text-[#173226] dark:text-slate-200">
                  {user?.name || "Admin"}
                </span>
                <ChevronDown className="size-3.5 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl p-1.5 bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-xl"
            >
              <DropdownMenuLabel className="p-2">
                <div className="text-xs font-bold text-[#173226] dark:text-white">
                  {user?.name || "Executive Admin"}
                </div>
                <div className="text-[11px] font-medium text-slate-500 truncate">
                  {user?.email || "admin@omsun.com.np"}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onSelectSection("settings")}
                className="rounded-xl text-xs font-semibold cursor-pointer gap-2 p-2"
              >
                <Settings className="size-4 text-[#38B46A]" />
                <span>Store Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSelectSection("overview")}
                className="rounded-xl text-xs font-semibold cursor-pointer gap-2 p-2"
              >
                <Sparkles className="size-4 text-sky-500" />
                <span>System Telemetry</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="rounded-xl text-xs font-bold text-red-600 dark:text-red-400 cursor-pointer gap-2 p-2 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
