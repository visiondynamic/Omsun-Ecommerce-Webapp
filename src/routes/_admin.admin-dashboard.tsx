import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Ticket,
  Image as ImageIcon,
  Handshake,
  FileCode2,
  Settings as SettingsIcon,
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Download,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  Radio,
  Check,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  products as initialCatalogProducts,
  Product,
  formatNPR,
  CATEGORIES,
  BRANDS,
  mapApiProductToProduct,
} from "@/lib/products";
import { api } from "@/lib/api";
import {
  OMSUN_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_PARTNERS,
  INITIAL_NOTIFICATIONS,
  AdminOrder,
  AdminCustomer,
  AdminCoupon,
  AdminBanner,
  AdminPartner,
  AdminNotification,
  OrderStatus,
} from "@/lib/adminData";

import { AdminSidebar, AdminSection } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GlobalSearchModal } from "@/components/admin/GlobalSearchModal";
import { OrderDetailsDrawer } from "@/components/admin/OrderDetailsDrawer";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { StockEditModal } from "@/components/admin/StockEditModal";
import { CouponFormModal } from "@/components/admin/CouponFormModal";
import { BannerEditModal } from "@/components/admin/BannerEditModal";
import { PartnerFormModal } from "@/components/admin/PartnerFormModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin-dashboard")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const queryClient = useQueryClient();
  // Navigation & Layout State
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Fetch products from API
  const { data: apiProductsList } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const rows = await api.getAdminProducts();
      return rows.map(mapApiProductToProduct);
    },
    staleTime: 2 * 60 * 1000,
  });

  // Fetch orders from API
  const { data: apiOrdersList } = useQuery<AdminOrder[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const rows = await api.getAdminOrders();
      return rows.map((r) => ({
        ...r,
        paymentMethod: r.paymentMethod as AdminOrder["paymentMethod"],
        paymentStatus: r.paymentStatus as AdminOrder["paymentStatus"],
        orderStatus: r.orderStatus as AdminOrder["orderStatus"],
      }));
    },
    staleTime: 2 * 60 * 1000,
  });

  // Fetch customers from API
  const { data: apiCustomersList } = useQuery<AdminCustomer[]>({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const rows = await api.getAdminCustomers();
      return rows.map((r) => ({
        ...r,
        status: r.status as AdminCustomer["status"],
      }));
    },
    staleTime: 2 * 60 * 1000,
  });

  // Fetch coupons from API
  const { data: apiCouponsList } = useQuery<AdminCoupon[]>({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const rows = await api.getAdminCoupons();
      return rows.map((r) => ({
        ...r,
        discountType: r.discountType as AdminCoupon["discountType"],
        status: r.status as AdminCoupon["status"],
      }));
    },
    staleTime: 2 * 60 * 1000,
  });

  // Fetch banners from API
  const { data: apiBannersList } = useQuery<AdminBanner[]>({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const rows = await api.getAdminBanners();
      return rows.map((r) => ({
        ...r,
        status: r.status as AdminBanner["status"],
      }));
    },
    staleTime: 2 * 60 * 1000,
  });

  // Fetch partners from API
  const { data: apiPartnersList } = useQuery<AdminPartner[]>({
    queryKey: ["admin-partners"],
    queryFn: async () => {
      const rows = await api.getAdminPartners();
      return rows.map((r) => ({
        ...r,
        status: r.status as AdminPartner["status"],
      }));
    },
    staleTime: 2 * 60 * 1000,
  });

  // Fetch stats from API
  const { data: apiStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.getAdminStats(),
    staleTime: 2 * 60 * 1000,
  });

  // Core Reactive Data State
  const [productsList, setProductsList] = useState<Product[]>(initialCatalogProducts);
  const effectiveProducts = apiProductsList ?? productsList;
  const [ordersList, setOrdersList] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const effectiveOrders = apiOrdersList ?? ordersList;
  const [customersList, setCustomersList] = useState<AdminCustomer[]>(INITIAL_CUSTOMERS);
  const effectiveCustomers = apiCustomersList ?? customersList;
  const [couponsList, setCouponsList] = useState<AdminCoupon[]>(INITIAL_COUPONS);
  const effectiveCoupons = apiCouponsList ?? couponsList;
  const [bannersList, setBannersList] = useState<AdminBanner[]>(INITIAL_BANNERS);
  const effectiveBanners = apiBannersList ?? bannersList;
  const [partnersList, setPartnersList] = useState<AdminPartner[]>(INITIAL_PARTNERS);
  const effectivePartners = apiPartnersList ?? partnersList;
  const [notificationsList, setNotificationsList] =
    useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);

  // Search & Filter States
  const [productQuery, setProductQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [orderQuery, setOrderQuery] = useState("");
  const [selectedOrderStatusFilter, setSelectedOrderStatusFilter] = useState("All");

  // Modals & Drawers State
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<AdminOrder | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState<Product | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedBannerForEdit, setSelectedBannerForEdit] = useState<AdminBanner | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  // Calculated Telemetry
  const totalRevenue = apiStats?.totalRevenue ?? effectiveOrders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalProductsCount = apiStats?.productCount ?? effectiveProducts.length;
  const lowStockCount = apiStats?.lowStockItems ?? effectiveProducts.filter((p) => p.stock <= 10).length;
  const pendingOrdersCount = apiStats?.pendingOrders ?? effectiveOrders.filter((o) => o.orderStatus === "Pending").length;

  // Sales trend from API or fallback
  const salesTrendData = apiStats?.monthlyTrend?.length
    ? apiStats.monthlyTrend.map((r) => ({ month: r.month.slice(5), revenue: r.revenue, orders: r.orders }))
    : [
        { month: "Jan", revenue: 14200000, orders: 120 },
        { month: "Feb", revenue: 15800000, orders: 135 },
        { month: "Mar", revenue: 13900000, orders: 110 },
        { month: "Apr", revenue: 17100000, orders: 152 },
        { month: "May", revenue: 16400000, orders: 140 },
        { month: "Jun", revenue: 18900000, orders: 168 },
        { month: "Jul", revenue: 17800000, orders: 155 },
        { month: "Aug", revenue: 19450000, orders: 180 },
      ];

  // Category distribution from API or fallback
  const pieColors = ["#38B46A", "#2F80ED", "#F4B400", "#12342B", "#D97706", "#7C3AED", "#059669", "#2563EB"];
  const categoryDistributionData = apiStats?.categoryDistribution?.length
    ? apiStats.categoryDistribution.map((r, i) => ({ name: r.name, value: r.value, color: pieColors[i % pieColors.length] }))
    : [
        { name: "Batteries", value: 38, color: "#38B46A" },
        { name: "Inverters", value: 28, color: "#2F80ED" },
        { name: "Solar Panel", value: 20, color: "#F4B400" },
        { name: "UPS & Stabilizers", value: 14, color: "#12342B" },
      ];

  // Handlers for Products
  const handleSaveProduct = async (prod: Product) => {
    try {
      const exists =
        initialCatalogProducts.some((p) => p.id === prod.id) ||
        apiProductsList?.some((p) => p.id === prod.id);
      if (exists) {
        await api.updateProduct(prod.id, {
          name: prod.name,
          category: prod.category,
          subcategory: prod.subcategory || null,
          brand: prod.brand,
          tagline: prod.tagline,
          description: (prod as any).description || prod.tagline || null,
          price: prod.price,
          mrp: prod.compareAt ?? null,
          image: prod.image,
          stock: prod.stock,
          rating: prod.rating,
          badges: prod.badges,
          specs: prod.specs,
        });
      } else {
        await api.createProduct({
          id: prod.id,
          name: prod.name,
          category: prod.category,
          subcategory: prod.subcategory || null,
          brand: prod.brand,
          tagline: prod.tagline,
          description: (prod as any).description || prod.tagline || null,
          price: prod.price,
          mrp: prod.compareAt ?? null,
          image: prod.image,
          stock: prod.stock,
          rating: prod.rating,
          badges: prod.badges,
          specs: prod.specs,
          features: [],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Product "${prod.name}" saved to database`);
    } catch {
      setProductsList((prev) => {
        const exists = prev.some((p) => p.id === prod.id);
        if (exists) return prev.map((p) => (p.id === prod.id ? prod : p));
        return [prod, ...prev];
      });
      toast.success(`Product "${prod.name}" saved locally`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    try {
      await api.deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch {
      // offline fallback
    }
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    toast.success(`Product "${name}" deleted from catalog`);
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: `copy-${Date.now().toString(36)}`,
      name: `${prod.name} (Copy)`,
      stock: 10,
    };
    setProductsList((prev) => [duplicated, ...prev]);
    toast.success(`Duplicated "${prod.name}"`);
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      await api.updateStock(productId, newStock);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch {
      // offline fallback
    }
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)),
    );
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const ref = orderId.replace("OMS-", "");
    try {
      await api.updateOrderStatus(ref, newStatus.toLowerCase());
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(`Order ${orderId} updated to ${newStatus}`);
    } catch {
      toast.success(`Order ${orderId} status changed to ${newStatus}`);
    }
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)),
    );
    if (selectedOrderForDrawer && selectedOrderForDrawer.id === orderId) {
      setSelectedOrderForDrawer((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const ref = orderId.replace("OMS-", "");
    try {
      await api.deleteAdminOrder(ref);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(`Order ${orderId} deleted from database`);
    } catch {
      toast.info(`Order ${orderId} removed`);
    }
    setOrdersList((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrderForDrawer && selectedOrderForDrawer.id === orderId) {
      setSelectedOrderForDrawer(null);
    }
  };

  const handleRefreshOrders = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] }),
    ]);
    toast.success("Orders synced with database");
  };

  // Notification Handler
  const handleMarkNotificationRead = (id: string) => {
    setNotificationsList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Dynamic Header Action Button
  const handleHeaderQuickAction = () => {
    switch (activeSection) {
      case "products":
        setSelectedProductForEdit(null);
        setIsProductModalOpen(true);
        break;
      case "coupons":
        setIsCouponModalOpen(true);
        break;
      case "partners":
        setIsPartnerModalOpen(true);
        break;
      default:
        setSelectedProductForEdit(null);
        setIsProductModalOpen(true);
    }
  };

  return (
    <div className="flex min-h-dvh bg-[#F2FBF4] dark:bg-[#071A12] text-[#173226] dark:text-slate-100 font-sans">
      {/* Desktop Sidebar - Sticky Fixed on Left */}
      <div className="hidden md:flex sticky top-0 h-dvh flex-shrink-0 self-start z-30">
        <AdminSidebar
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          pendingOrdersCount={pendingOrdersCount}
          lowStockCount={lowStockCount}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-[#12342B] border-none h-full">
          <AdminSidebar
            activeSection={activeSection}
            onSelectSection={(sec) => {
              setActiveSection(sec);
              setMobileSidebarOpen(false);
            }}
            collapsed={false}
            onToggleCollapse={() => setMobileSidebarOpen(false)}
            pendingOrdersCount={pendingOrdersCount}
            lowStockCount={lowStockCount}
          />
        </SheetContent>
      </Sheet>

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          activeSection={activeSection}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onQuickAction={handleHeaderQuickAction}
          notifications={notificationsList}
          onMarkNotificationRead={handleMarkNotificationRead}
          onSelectSection={(sec) => setActiveSection(sec)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full">
          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 1: DASHBOARD OVERVIEW */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "overview" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Executive KPI Cards Grid — 2 Col Mobile, 3 Col Tablet, 6 Col Desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                {/* 1. Total Sales */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-white to-[#F2FBF4]/50 dark:from-[#0c241c] dark:to-[#071A12] p-3.5 sm:p-4.5 border border-[#E2EDE7] dark:border-white/10 shadow-xs transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#38B46A] hover:shadow-xl hover:shadow-[#38B46A]/15 border-t-2 border-t-[#38B46A]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                      Total Revenue
                    </span>
                    <div className="flex size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center text-[#38B46A] group-hover:scale-110 transition-transform">
                      <DollarSign className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    {formatNPR(totalRevenue)}
                  </div>
                  <div className="mt-1 text-[11px] text-[#38B46A] font-bold flex items-center gap-1">
                    <TrendingUp className="size-3" /> +18.4% vs last month
                  </div>
                </div>

                {/* 2. Total Orders */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-white to-[#EFF8FF]/50 dark:from-[#0c241c] dark:to-[#071A12] p-4 sm:p-4.5 border border-[#E2EDE7] dark:border-white/10 shadow-xs transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#2F80ED] hover:shadow-xl hover:shadow-[#2F80ED]/15 border-t-2 border-t-[#2F80ED]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                      Total Orders
                    </span>
                    <div className="flex size-8 rounded-xl bg-sky-500/10 border border-sky-500/20 items-center justify-center text-[#2F80ED] group-hover:scale-110 transition-transform">
                      <ShoppingBag className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    {effectiveOrders.length} Orders
                  </div>
                  <div className="mt-1 text-[11px] text-[#2F80ED] font-bold">
                    {pendingOrdersCount} Pending Dispatch
                  </div>
                </div>

                {/* 3. Hardware Catalog */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-white to-[#ECFDF3]/50 dark:from-[#0c241c] dark:to-[#071A12] p-4 sm:p-4.5 border border-[#E2EDE7] dark:border-white/10 shadow-xs transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#12342B] hover:shadow-xl hover:shadow-[#12342B]/15 border-t-2 border-t-[#12342B]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                      Catalog SKUs
                    </span>
                    <div className="flex size-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Box className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    {totalProductsCount} SKUs
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 font-semibold">
                    5 Core Categories
                  </div>
                </div>

                {/* 4. Low Stock Alert */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-white to-[#FFFBEB]/50 dark:from-[#0c241c] dark:to-[#071A12] p-4 sm:p-4.5 border border-[#E2EDE7] dark:border-white/10 shadow-xs transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#F4B400] hover:shadow-xl hover:shadow-[#F4B400]/20 border-t-2 border-t-[#F4B400]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                      Low Stock Alert
                    </span>
                    <div className="flex size-8 rounded-xl bg-amber-500/10 border border-amber-500/20 items-center justify-center text-[#F4B400] group-hover:scale-110 transition-transform">
                      <Boxes className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
                    {lowStockCount} Items
                  </div>
                  <div className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                    Stock threshold ≤ 10
                  </div>
                </div>

                {/* 5. Registered Clients */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-white to-[#F2FBF4]/50 dark:from-[#0c241c] dark:to-[#071A12] p-4 sm:p-4.5 border border-[#E2EDE7] dark:border-white/10 shadow-xs transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#38B46A] hover:shadow-xl hover:shadow-[#38B46A]/15 border-t-2 border-t-[#38B46A]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                      Clients
                    </span>
                    <div className="flex size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center text-[#38B46A] group-hover:scale-110 transition-transform">
                      <Users className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    {effectiveCustomers.length} Accounts
                  </div>
                  <div className="mt-1 text-[11px] text-[#38B46A] font-bold">{effectiveCustomers.filter((c) => c.status === "VIP").length} VIP Contractors</div>
                </div>

                {/* 6. NEA Net-Meter Sync */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-white to-[#EFF8FF]/50 dark:from-[#0c241c] dark:to-[#071A12] p-4 sm:p-4.5 border border-[#E2EDE7] dark:border-white/10 shadow-xs transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#2F80ED] hover:shadow-xl hover:shadow-[#2F80ED]/15 border-t-2 border-t-[#2F80ED]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                      NEA Net-Meter
                    </span>
                    <div className="flex size-8 rounded-xl bg-sky-500/10 border border-sky-500/20 items-center justify-center text-[#2F80ED] group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    142 Synced
                  </div>
                  <div className="mt-1 text-[11px] text-[#2F80ED] font-bold">
                    100% Interconnection Pass
                  </div>
                </div>
              </div>

              {/* Low Stock Alert Bar */}
              {lowStockCount > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 rounded-xl bg-amber-400 text-black items-center justify-center font-bold shadow-md shadow-amber-400/30 shrink-0">
                      <AlertTriangle className="size-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-amber-800 dark:text-amber-300">
                        {lowStockCount} Hardware Items Operating Below Reorder Threshold (≤ 10 Units)
                      </div>
                      <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                        Critical stock alerts in Kathmandu hub. Generate vendor purchase order to replenish inventory.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setActiveSection("inventory");
                    }}
                    className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs h-9 px-4 shadow-sm shrink-0 cursor-pointer"
                  >
                    Resolve Inventory
                  </Button>
                </div>
              )}

              {/* Data Visualization Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                {/* Sales Trend Chart */}
                <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#0c241c] p-4.5 sm:p-6 border border-[#E2EDE7] dark:border-white/10 shadow-sm space-y-4 hover:border-[#38B46A]/40 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-display font-extrabold text-base text-[#173226] dark:text-white">
                        Revenue & Order Growth Telemetry
                      </h3>
                      <p className="text-xs text-slate-500">
                        Monthly NPR Sales breakdown (Jan - Aug 2026)
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-[#38B46A] bg-[#ECFDF3] dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-[#38B46A]/30">
                      FY 2082/83 Nepal
                    </span>
                  </div>

                  <div className="h-56 sm:h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesTrendData}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38B46A" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#38B46A" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EDE7" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#64748b" }}
                          tickFormatter={(val) => `Rs ${(val / 100000).toFixed(0)}L`}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#12342B",
                            borderColor: "#38B46A",
                            borderRadius: "12px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                          formatter={(value: any) => [formatNPR(Number(value)), "Revenue"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#38B46A"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#revenueGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Sales Share Pie Chart */}
                <div className="rounded-3xl bg-white dark:bg-[#0c241c] p-4.5 sm:p-6 border border-[#E2EDE7] dark:border-white/10 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#2F80ED]/40 transition-colors">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-[#173226] dark:text-white">
                      Category Revenue Distribution
                    </h3>
                    <p className="text-xs text-slate-500">
                      Sales share across OMSUN hardware segments
                    </p>
                  </div>

                  <div className="h-48 sm:h-52 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {categoryDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#12342B",
                            borderColor: "#38B46A",
                            borderRadius: "12px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                          formatter={(value: any) => [`${value}%`, "Share"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    {categoryDistributionData.map((c) => (
                      <div key={c.name} className="flex items-center gap-1.5">
                        <span
                          className="size-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-slate-600 dark:text-slate-300 truncate">
                          {c.name}
                        </span>
                        <span className="ml-auto font-mono font-bold text-[#173226] dark:text-white">
                          {c.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders Summary */}
              <div className="rounded-3xl bg-white dark:bg-[#0c241c] p-4.5 sm:p-6 border border-[#E2EDE7] dark:border-white/10 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-[#173226] dark:text-white">
                      Recent High-Priority Dispatch Orders
                    </h3>
                    <p className="text-xs text-slate-500">
                      Latest customer purchases awaiting dispatch
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveSection("orders")}
                    variant="outline"
                    className="h-8.5 px-3.5 rounded-xl border-[#38B46A]/40 text-xs font-extrabold text-[#38B46A] hover:bg-[#ECFDF3] cursor-pointer transition-all hover:scale-105"
                  >
                    View All Orders ({effectiveOrders.length}) &rarr;
                  </Button>
                </div>

                {/* Mobile Orders Card Stack (< sm) */}
                <div className="block sm:hidden space-y-3">
                  {effectiveOrders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl bg-[#F8FBF8] dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-extrabold text-[#173226] dark:text-white">
                          {ord.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            ord.orderStatus === "Completed"
                              ? "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                              : ord.orderStatus === "Processing"
                                ? "bg-[#EFF8FF] text-[#2F80ED] border-[#2F80ED]/30"
                                : "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </div>
                      <div className="font-bold text-[#173226] dark:text-white">
                        {ord.customerName}
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-white/10">
                        <span className="font-mono font-extrabold text-[#38B46A]">
                          {formatNPR(ord.totalAmount)}
                        </span>
                        <button
                          onClick={() => setSelectedOrderForDrawer(ord)}
                          className="text-xs font-bold text-[#38B46A] hover:underline"
                        >
                          Inspect &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Orders Table (≥ sm) */}
                <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 bg-[#F2FBF4] dark:bg-white/5 font-extrabold uppercase text-slate-500">
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Customer Name</th>
                        <th className="p-3.5">Amount (NPR)</th>
                        <th className="p-3.5">Payment</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                      {effectiveOrders.slice(0, 4).map((ord) => (
                        <tr
                          key={ord.id}
                          className="hover:bg-[#F2FBF4]/80 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="p-3.5 font-mono font-bold text-[#173226] dark:text-white">
                            {ord.id}
                          </td>
                          <td className="p-3.5 font-bold">{ord.customerName}</td>
                          <td className="p-3.5 font-mono font-extrabold text-[#38B46A]">
                            {formatNPR(ord.totalAmount)}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                ord.orderStatus === "Completed"
                                  ? "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                                  : ord.orderStatus === "Processing"
                                    ? "bg-[#EFF8FF] text-[#2F80ED] border-[#2F80ED]/30"
                                    : "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setSelectedOrderForDrawer(ord)}
                              className="text-xs font-bold text-[#38B46A] hover:underline cursor-pointer"
                            >
                              Inspect Order &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 2: PRODUCT CATALOG MANAGEMENT */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "products" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Product Header & Filters Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0c241c] p-4 sm:p-4.5 rounded-3xl border border-[#E2EDE7] dark:border-white/10 shadow-sm">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                    <Input
                      placeholder="Search hardware title or SKU..."
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      className="pl-9 rounded-xl text-xs"
                    />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-[#173226] dark:text-slate-200"
                  >
                    <option value="All">All Categories ({effectiveProducts.length})</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => {
                    setSelectedProductForEdit(null);
                    setIsProductModalOpen(true);
                  }}
                  className="h-9 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform"
                >
                  <Plus className="size-4" /> Add Hardware SKU
                </Button>
              </div>

              {/* Mobile Products Card Stack (< sm) */}
              <div className="block sm:hidden space-y-3">
                {effectiveProducts
                  .filter(
                    (p) =>
                      (selectedCategoryFilter === "All" || p.category === selectedCategoryFilter) &&
                      (p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
                        p.category.toLowerCase().includes(productQuery.toLowerCase())),
                  )
                  .map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-xs space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt=""
                          className="size-12 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold text-[#173226] dark:text-white truncate">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-[#38B46A] font-bold">
                            {prod.category} • {prod.brand}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">SKU: {prod.id}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10 text-xs">
                        <div className="font-mono font-extrabold text-[#38B46A]">
                          {formatNPR(prod.price)}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedStockProduct(prod);
                            setIsStockModalOpen(true);
                          }}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            prod.stock > 10
                              ? "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                              : prod.stock > 0
                                ? "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                                : "bg-red-500/10 text-red-600 border-red-500/30"
                          }`}
                        >
                          {prod.stock > 0 ? `${prod.stock} Units` : "Out of Stock"}
                        </button>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          onClick={() => {
                            setSelectedProductForEdit(prod);
                            setIsProductModalOpen(true);
                          }}
                          variant="outline"
                          className="h-8 px-2.5 rounded-lg text-xs font-bold text-sky-600"
                        >
                          <Edit className="size-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          onClick={() => handleDuplicateProduct(prod)}
                          variant="outline"
                          className="h-8 px-2.5 rounded-lg text-xs font-bold text-[#38B46A]"
                        >
                          <Copy className="size-3.5 mr-1" /> Copy
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          variant="outline"
                          className="h-8 px-2.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Desktop Product Table (≥ sm) */}
              <div className="hidden sm:block rounded-3xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2EDE7] dark:border-white/10 bg-[#F2FBF4] dark:bg-white/5 font-extrabold uppercase text-slate-500">
                        <th className="p-4">Product Details</th>
                        <th className="p-4">Category & Brand</th>
                        <th className="p-4">Selling Price</th>
                        <th className="p-4">Stock Status</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                      {effectiveProducts
                        .filter(
                          (p) =>
                            (selectedCategoryFilter === "All" ||
                              p.category === selectedCategoryFilter) &&
                            (p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(productQuery.toLowerCase())),
                        )
                        .map((prod) => (
                          <tr
                            key={prod.id}
                            className="hover:bg-[#F2FBF4]/80 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="p-4 font-bold text-[#173226] dark:text-white flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt=""
                                className="size-11 rounded-xl object-cover border border-slate-200 dark:border-white/10 shadow-xs"
                              />
                              <div>
                                <div className="text-xs font-extrabold">{prod.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono font-normal">
                                  SKU: {prod.id}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-slate-700 dark:text-slate-300">
                                {prod.category}
                              </div>
                              <div className="text-[10px] font-bold text-[#38B46A]">
                                {prod.brand}
                              </div>
                            </td>
                            <td className="p-4 font-mono font-extrabold text-[#38B46A] text-sm">
                              {formatNPR(prod.price)}
                              {prod.compareAt && (
                                <span className="block text-[10px] text-slate-400 line-through font-normal">
                                  {formatNPR(prod.compareAt)}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => {
                                  setSelectedStockProduct(prod);
                                  setIsStockModalOpen(true);
                                }}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all hover:scale-105 cursor-pointer ${
                                  prod.stock > 10
                                    ? "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                                    : prod.stock > 0
                                      ? "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                                      : "bg-red-500/10 text-red-600 border-red-500/30"
                                }`}
                              >
                                {prod.stock > 0 ? `${prod.stock} Units` : "Out of Stock"}
                              </button>
                            </td>
                            <td className="p-4 font-bold text-amber-500">★ {prod.rating}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedProductForEdit(prod);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-transform hover:scale-110"
                                  title="Edit Product"
                                >
                                  <Edit className="size-4 text-sky-500" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateProduct(prod)}
                                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-transform hover:scale-110"
                                  title="Duplicate Product"
                                >
                                  <Copy className="size-4 text-[#38B46A]" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 cursor-pointer transition-transform hover:scale-110"
                                  title="Delete Product"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 3: CATEGORIES MANAGEMENT — Mobile Card Grid */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "categories" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                    OMSUN Hardware Portfolio Categories
                  </h3>
                  <p className="text-xs text-slate-500">
                    5 core energy & power hardware verticals with specialized subcategories
                  </p>
                </div>
                <Button
                  onClick={() => toast.info("Category management active.")}
                  className="h-9 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white text-xs font-extrabold gap-1 cursor-pointer hover:scale-105 transition-transform"
                >
                  <Plus className="size-4" /> Add Category
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5">
                {OMSUN_CATEGORIES.map((cat, idx) => {
                  const isGreen = idx % 4 === 0;
                  const isBlue = idx % 4 === 1;
                  const isGold = idx % 4 === 2;

                  const borderTopColor = isGreen
                    ? "border-t-4 border-t-[#38B46A]"
                    : isBlue
                      ? "border-t-4 border-t-[#2F80ED]"
                      : isGold
                        ? "border-t-4 border-t-[#F4B400]"
                        : "border-t-4 border-t-[#12342B]";

                  const badgeStyle = isGreen
                    ? "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                    : isBlue
                      ? "bg-[#EFF8FF] text-[#2F80ED] border-[#2F80ED]/30"
                      : isGold
                        ? "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                        : "bg-[#F2FBF4] text-[#12342B] border-[#12342B]/30";

                  return (
                    <div
                      key={cat.name}
                      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-white to-[#F2FBF4]/40 dark:from-[#0c241c] dark:to-[#071A12] p-5 sm:p-6 border border-[#E2EDE7] dark:border-white/10 shadow-xs transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl hover:shadow-[#38B46A]/12 space-y-3.5 ${borderTopColor}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          SKU Prefix: {cat.skuPrefix}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeStyle}`}
                        >
                          {cat.status}
                        </span>
                      </div>

                      <h4 className="font-display font-extrabold text-base text-[#173226] dark:text-white group-hover:text-[#38B46A] transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {cat.description}
                      </p>

                      {/* Subcategories list tags */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                            Subcategories:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {cat.subcategories.map((sub) => (
                              <span
                                key={sub}
                                className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                        <span>{cat.itemCount} SKUs Configured</span>
                        <button
                          onClick={() => {
                            setSelectedCategoryFilter(cat.name);
                            setActiveSection("products");
                          }}
                          className="text-[#38B46A] hover:underline font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                        >
                          View Items &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 4: INVENTORY CONTROL */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "inventory" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                    Warehouse Inventory Telemetry
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live stock counts, threshold monitors & reorder alerts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#D97706] bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#F4B400]/40">
                    Low Stock Threshold: ≤ 10 Units
                  </span>
                </div>
              </div>

              {/* Mobile Inventory Card Stack (< sm) */}
              <div className="block sm:hidden space-y-3">
                {effectiveProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#173226] dark:text-white text-xs">
                        {prod.name}
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          prod.stock > 10
                            ? "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                            : prod.stock > 0
                              ? "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                              : "bg-red-500/10 text-red-600 border-red-500/30"
                        }`}
                      >
                        {prod.stock > 10
                          ? "In Stock"
                          : prod.stock > 0
                            ? "Low Stock Alert"
                            : "Out of Stock"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-white/10">
                      <span className="text-slate-500">{prod.category}</span>
                      <span className="font-mono font-extrabold text-[#173226] dark:text-white">
                        {prod.stock} Units
                      </span>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedStockProduct(prod);
                        setIsStockModalOpen(true);
                      }}
                      variant="outline"
                      className="w-full h-8.5 rounded-xl border-[#38B46A]/30 text-xs font-bold text-[#38B46A] hover:bg-[#ECFDF3]"
                    >
                      Adjust Stock &rarr;
                    </Button>
                  </div>
                ))}
              </div>

              {/* Desktop Inventory Table (≥ sm) */}
              <div className="hidden sm:block rounded-3xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2EDE7] dark:border-white/10 bg-[#F2FBF4] dark:bg-white/5 font-extrabold uppercase text-slate-500">
                      <th className="p-4">Hardware SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Last Telemetry Audit</th>
                      <th className="p-4 text-right">Quick Stock Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                    {effectiveProducts.map((prod) => (
                      <tr
                        key={prod.id}
                        className="hover:bg-[#F2FBF4]/80 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-bold text-[#173226] dark:text-white flex items-center gap-3">
                          <img src={prod.image} alt="" className="size-9 rounded-lg object-cover" />
                          <div>
                            <div>{prod.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{prod.id}</div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 font-semibold">
                          {prod.category}
                        </td>
                        <td className="p-4 font-mono font-extrabold text-sm text-[#173226] dark:text-white">
                          {prod.stock} Units
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                              prod.stock > 10
                                ? "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                                : prod.stock > 0
                                  ? "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                                  : "bg-red-500/10 text-red-600 border-red-500/30"
                            }`}
                          >
                            {prod.stock > 10
                              ? "In Stock"
                              : prod.stock > 0
                                ? "Low Stock Alert"
                                : "Out of Stock"}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-400 text-[11px]">
                          Today 14:30 GMT+5:45
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            onClick={() => {
                              setSelectedStockProduct(prod);
                              setIsStockModalOpen(true);
                            }}
                            variant="outline"
                            className="h-8 px-3 rounded-xl border-[#38B46A]/30 text-xs font-bold text-[#38B46A] hover:bg-[#ECFDF3] cursor-pointer transition-all hover:scale-105"
                          >
                            Adjust Stock &rarr;
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 5: ORDERS MANAGEMENT */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "orders" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header with Title & Live Refresh */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#0c241c] p-4 sm:p-5 rounded-3xl border border-[#E2EDE7] dark:border-white/10 shadow-sm">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                      Live Customer Orders Lifecycle
                    </h3>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#ECFDF3] text-[#38B46A] border border-[#38B46A]/30">
                      <span className="size-2 rounded-full bg-[#38B46A] animate-pulse" />
                      {effectiveOrders.length} Total Orders
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage real-time hardware orders, confirmation, carrier dispatch, cancellation & deletion.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Button
                    onClick={handleRefreshOrders}
                    variant="outline"
                    className="rounded-xl border-[#38B46A]/40 text-[#38B46A] hover:bg-[#ECFDF3] font-bold text-xs gap-1.5 h-9 cursor-pointer"
                  >
                    <RefreshCw className="size-3.5" /> Sync Orders
                  </Button>
                </div>
              </div>

              {/* Filter Tabs & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0c241c] p-4 sm:p-4.5 rounded-3xl border border-[#E2EDE7] dark:border-white/10 shadow-sm">
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {(["All", "Pending", "Processing", "Shipped", "Completed", "Cancelled"] as const).map((st) => {
                    const count =
                      st === "All"
                        ? effectiveOrders.length
                        : effectiveOrders.filter((o) => o.orderStatus === st).length;
                    return (
                      <button
                        key={st}
                        onClick={() => setSelectedOrderStatusFilter(st)}
                        className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                          selectedOrderStatusFilter === st
                            ? "bg-[#12342B] text-white shadow-md border border-[#38B46A]/40"
                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        <span>{st} Orders</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                            selectedOrderStatusFilter === st
                              ? "bg-white/20 text-white"
                              : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  <Input
                    placeholder="Search Order Ref, customer, or phone..."
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    className="pl-9 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Mobile Orders Card Stack (< sm) */}
              <div className="block sm:hidden space-y-3">
                {effectiveOrders
                  .filter(
                    (o) =>
                      (selectedOrderStatusFilter === "All" ||
                        o.orderStatus === selectedOrderStatusFilter) &&
                      (o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
                        o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
                        o.customerPhone.toLowerCase().includes(orderQuery.toLowerCase())),
                  )
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-xs space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-extrabold text-[#173226] dark:text-white text-sm">
                          {ord.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            ord.orderStatus === "Completed"
                              ? "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                              : ord.orderStatus === "Shipped"
                                ? "bg-[#EEF2FF] text-[#6366F1] border-[#6366F1]/30"
                                : ord.orderStatus === "Processing"
                                  ? "bg-[#EFF8FF] text-[#2F80ED] border-[#2F80ED]/30"
                                  : ord.orderStatus === "Cancelled"
                                    ? "bg-red-500/10 text-red-600 border-red-500/30"
                                    : "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-bold text-[#173226] dark:text-white">
                          {ord.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {ord.customerPhone} • {ord.shippingAddress}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10">
                        <span className="font-mono font-extrabold text-[#38B46A] text-sm">
                          {formatNPR(ord.totalAmount)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {ord.items.length} item(s) • {ord.paymentMethod}
                        </span>
                      </div>

                      {/* Quick Lifecycle Action Buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <Button
                          onClick={() => setSelectedOrderForDrawer(ord)}
                          className="flex-1 h-8 rounded-xl bg-[#12342B] text-white text-xs font-bold"
                        >
                          View Details &rarr;
                        </Button>

                        {ord.orderStatus === "Pending" && (
                          <Button
                            onClick={() => handleUpdateOrderStatus(ord.id, "Processing")}
                            className="h-8 px-2.5 rounded-xl bg-[#38B46A] text-white text-xs font-bold"
                            title="Confirm & Start Processing"
                          >
                            Confirm
                          </Button>
                        )}

                        {ord.orderStatus === "Processing" && (
                          <Button
                            onClick={() => handleUpdateOrderStatus(ord.id, "Shipped")}
                            className="h-8 px-2.5 rounded-xl bg-[#2F80ED] text-white text-xs font-bold"
                            title="Mark as Shipped"
                          >
                            Ship
                          </Button>
                        )}

                        {ord.orderStatus === "Shipped" && (
                          <Button
                            onClick={() => handleUpdateOrderStatus(ord.id, "Completed")}
                            className="h-8 px-2.5 rounded-xl bg-[#059669] text-white text-xs font-bold"
                            title="Mark as Delivered"
                          >
                            Deliver
                          </Button>
                        )}

                        <Button
                          onClick={() => handleDeleteOrder(ord.id)}
                          variant="outline"
                          className="h-8 px-2.5 rounded-xl border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs"
                          title="Delete Order"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Desktop Orders Master Table (≥ sm) */}
              <div className="hidden sm:block rounded-3xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2EDE7] dark:border-white/10 bg-[#F2FBF4] dark:bg-white/5 font-extrabold uppercase text-slate-500">
                        <th className="p-4">Order Ref</th>
                        <th className="p-4">Customer Contact</th>
                        <th className="p-4">Destination</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Order Status</th>
                        <th className="p-4 text-right">Quick Lifecycle Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                      {effectiveOrders
                        .filter(
                          (o) =>
                            (selectedOrderStatusFilter === "All" ||
                              o.orderStatus === selectedOrderStatusFilter) &&
                            (o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
                              o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
                              o.customerPhone.toLowerCase().includes(orderQuery.toLowerCase())),
                        )
                        .map((ord) => (
                          <tr
                            key={ord.id}
                            className="hover:bg-[#F2FBF4]/80 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="p-4">
                              <div className="font-mono font-extrabold text-[#173226] dark:text-white">
                                {ord.id}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {new Date(ord.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-[#173226] dark:text-white">
                                {ord.customerName}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {ord.customerPhone}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-slate-700 dark:text-slate-300 max-w-[160px] truncate font-medium">
                                {ord.shippingAddress}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold">
                                {ord.items.length} Product(s)
                              </div>
                            </td>
                            <td className="p-4 font-mono font-black text-[#38B46A] text-sm">
                              {formatNPR(ord.totalAmount)}
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="font-bold text-slate-800 dark:text-slate-200">
                                  {ord.paymentMethod}
                                </div>
                                {ord.paymentReceipt ? (
                                  <button
                                    onClick={() => setSelectedOrderForDrawer(ord)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-300 dark:border-emerald-800 hover:scale-105 transition-transform cursor-pointer"
                                    title="View customer payment receipt screenshot"
                                  >
                                    <ShieldCheck className="size-3 text-emerald-600" /> Slip Attached
                                  </button>
                                ) : ord.paymentMethod === "Fonepay QR" ? (
                                  <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200">
                                    Awaiting Slip
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {ord.paymentStatus}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                                  ord.orderStatus === "Completed"
                                    ? "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                                    : ord.orderStatus === "Shipped"
                                      ? "bg-[#EEF2FF] text-[#6366F1] border-[#6366F1]/30"
                                      : ord.orderStatus === "Processing"
                                        ? "bg-[#EFF8FF] text-[#2F80ED] border-[#2F80ED]/30"
                                        : ord.orderStatus === "Cancelled"
                                          ? "bg-red-500/10 text-red-600 border-red-500/30"
                                          : "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                                }`}
                              >
                                {ord.orderStatus}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Direct State Shift Button */}
                                {ord.orderStatus === "Pending" && (
                                  <>
                                    <Button
                                      onClick={() => handleUpdateOrderStatus(ord.id, "Processing")}
                                      className="h-8 px-2.5 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-bold text-xs cursor-pointer shadow-xs transition-all hover:scale-105"
                                      title="Confirm Order"
                                    >
                                      Confirm
                                    </Button>
                                    <Button
                                      onClick={() => handleUpdateOrderStatus(ord.id, "Cancelled")}
                                      variant="outline"
                                      className="h-8 px-2 rounded-xl border-red-500/30 text-red-500 hover:bg-red-50 text-xs font-bold cursor-pointer"
                                      title="Reject Order"
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}

                                {ord.orderStatus === "Processing" && (
                                  <Button
                                    onClick={() => handleUpdateOrderStatus(ord.id, "Shipped")}
                                    className="h-8 px-2.5 rounded-xl bg-[#2F80ED] hover:bg-[#256fd1] text-white font-bold text-xs cursor-pointer shadow-xs transition-all hover:scale-105"
                                    title="Mark as Shipped"
                                  >
                                    Ship
                                  </Button>
                                )}

                                {ord.orderStatus === "Shipped" && (
                                  <Button
                                    onClick={() => handleUpdateOrderStatus(ord.id, "Completed")}
                                    className="h-8 px-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs cursor-pointer shadow-xs transition-all hover:scale-105"
                                    title="Mark as Delivered"
                                  >
                                    Deliver
                                  </Button>
                                )}

                                <Button
                                  onClick={() => setSelectedOrderForDrawer(ord)}
                                  className="h-8 px-2.5 rounded-xl bg-[#12342B] hover:bg-[#1a4237] text-white font-bold text-xs cursor-pointer shadow-xs transition-all hover:scale-105"
                                  title="Inspect Full Order"
                                >
                                  View
                                </Button>

                                <button
                                  onClick={() => handleDeleteOrder(ord.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-transform hover:scale-110"
                                  title="Delete Order Permanently"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 6: CUSTOMERS DATABASE */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "customers" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                    Registered Client Accounts & Contractors
                  </h3>
                  <p className="text-xs text-slate-500">
                    Commercial & residential clients across Nepal
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2EDE7] dark:border-white/10 bg-[#F2FBF4] dark:bg-white/5 font-extrabold uppercase text-slate-500">
                      <th className="p-4">Client Profile</th>
                      <th className="p-4">Contact Information</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Orders Count</th>
                      <th className="p-4">Lifetime Spend (NPR)</th>
                      <th className="p-4">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                    {effectiveCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#F2FBF4]/80 dark:hover:bg-white/5">
                        <td className="p-4 font-bold text-[#173226] dark:text-white flex items-center gap-3">
                          <div className="size-9 rounded-full bg-[#12342B] text-[#38B46A] flex items-center justify-center font-extrabold text-xs">
                            {cust.name[0]}
                          </div>
                          <div>
                            <div>{cust.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">
                              ID: {cust.id}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-slate-700 dark:text-slate-300">
                            {cust.email}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{cust.phone}</div>
                        </td>
                        <td className="p-4 font-bold text-slate-600 dark:text-slate-300">
                          {cust.city}
                        </td>
                        <td className="p-4 font-bold">{cust.totalOrders} Orders</td>
                        <td className="p-4 font-mono font-extrabold text-[#38B46A]">
                          {formatNPR(cust.totalSpent)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                              cust.status === "VIP"
                                ? "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30"
                                : "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30"
                            }`}
                          >
                            {cust.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 7: COUPONS & PROMOTIONS */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "coupons" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                    Promotional Coupon & Discount Management
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active checkout promotional codes & campaign limits
                  </p>
                </div>
                <Button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="h-9 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white text-xs font-extrabold gap-1 cursor-pointer hover:scale-105 transition-transform"
                >
                  <Plus className="size-4" /> Create Coupon Code
                </Button>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2EDE7] dark:border-white/10 bg-[#F2FBF4] dark:bg-white/5 font-extrabold uppercase text-slate-500">
                      <th className="p-4">Promo Code</th>
                      <th className="p-4">Discount Value</th>
                      <th className="p-4">Min Order Spend</th>
                      <th className="p-4">Usage Redemptions</th>
                      <th className="p-4">Expiry Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                    {effectiveCoupons.map((cpn) => (
                      <tr key={cpn.id} className="hover:bg-[#F2FBF4]/80 dark:hover:bg-white/5">
                        <td className="p-4 font-mono font-extrabold text-sm text-[#38B46A]">
                          {cpn.code}
                        </td>
                        <td className="p-4 font-bold text-[#173226] dark:text-white">
                          {cpn.discountType === "Percentage"
                            ? `${cpn.discountValue}% OFF`
                            : `Rs ${cpn.discountValue} OFF`}
                        </td>
                        <td className="p-4 font-mono">{formatNPR(cpn.minSpend)}</td>
                        <td className="p-4 font-bold">
                          {cpn.usageCount} / {cpn.usageLimit}
                        </td>
                        <td className="p-4 font-mono text-slate-500">{cpn.expiryDate}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#ECFDF3] text-[#38B46A] border border-[#38B46A]/30">
                            {cpn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 9: REPORTS & FINANCIAL ANALYTICS */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "reports" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                    Financial Reports & Executive Telemetry
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive sales, inventory turns & customer growth analytics
                  </p>
                </div>
                <Button
                  onClick={() => toast.success("Exporting financial statement CSV...")}
                  className="h-9 rounded-xl bg-[#12342B] text-white text-xs font-extrabold gap-1.5 cursor-pointer hover:scale-105 transition-transform"
                >
                  <Download className="size-4" /> Export Report (CSV)
                </Button>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#0c241c] p-4.5 sm:p-6 border border-[#E2EDE7] dark:border-white/10 shadow-sm space-y-4">
                <h4 className="font-display font-extrabold text-base text-[#173226] dark:text-white">
                  Monthly Revenue Performance (NPR)
                </h4>
                <div className="h-64 sm:h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EDE7" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickFormatter={(val) => `Rs ${(val / 100000).toFixed(0)}L`}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#12342B",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                        formatter={(val: any) => [formatNPR(Number(val)), "Revenue"]}
                      />
                      <Bar dataKey="revenue" fill="#38B46A" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 10: PARTNER BRANDS */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "partners" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                    Authorized OEM Brand Partnerships
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official manufacturers (Dyna, Excite, Luminous, Smarten)
                  </p>
                </div>
                <Button
                  onClick={() => setIsPartnerModalOpen(true)}
                  className="h-9 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white text-xs font-extrabold gap-1 cursor-pointer hover:scale-105 transition-transform"
                >
                  <Plus className="size-4" /> Add Partner
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
                {effectivePartners.map((prt, idx) => {
                  const colors = [
                    {
                      border: "border-t-[#38B46A]",
                      badge: "bg-[#ECFDF3] text-[#38B46A] border-[#38B46A]/30",
                    },
                    {
                      border: "border-t-[#2F80ED]",
                      badge: "bg-[#EFF8FF] text-[#2F80ED] border-[#2F80ED]/30",
                    },
                    {
                      border: "border-t-[#F4B400]",
                      badge: "bg-[#FFFBEB] text-[#D97706] border-[#F4B400]/30",
                    },
                    {
                      border: "border-t-[#12342B]",
                      badge: "bg-[#F2FBF4] text-[#12342B] border-[#12342B]/30",
                    },
                  ];
                  const activeTheme = colors[idx % colors.length]!;

                  return (
                    <div
                      key={prt.id}
                      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-white to-[#F2FBF4]/50 dark:from-[#0c241c] dark:to-[#071A12] p-5 sm:p-6 border border-[#E2EDE7] dark:border-white/10 shadow-xs transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl hover:shadow-[#38B46A]/12 space-y-3.5 border-t-4 ${activeTheme.border}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-9 rounded-xl bg-[#12342B] text-[#38B46A] flex items-center justify-center font-extrabold text-sm shadow-xs group-hover:scale-110 transition-transform">
                            {prt.name[0]}
                          </div>
                          <h4 className="font-display font-black text-lg text-[#173226] dark:text-white group-hover:text-[#38B46A] transition-colors">
                            {prt.name}
                          </h4>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${activeTheme.badge}`}
                        >
                          {prt.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 dark:text-slate-200 font-bold">
                        Specialty: {prt.category}
                      </div>

                      <p className="text-xs text-slate-500 font-medium italic">{prt.notes}</p>

                      <div className="pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Partner Since {prt.partnerSince}</span>
                        <span className="text-[#38B46A] font-sans font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                          Authorized Partner &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 12: SETTINGS */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "settings" && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                  OMSUN System Administration & Store Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Configure store details, tax registration, and permissions
                </p>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#0c241c] p-4.5 sm:p-6 border border-[#E2EDE7] dark:border-white/10 shadow-sm space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#173226] dark:text-slate-200">
                      Company Legal Name
                    </label>
                    <Input
                      defaultValue="OMSUN Solar & Renewable Energy Pvt. Ltd."
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#173226] dark:text-slate-200">
                      Nepal PAN / VAT Number
                    </label>
                    <Input defaultValue="601982340" className="rounded-xl font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#173226] dark:text-slate-200">
                      Default Currency
                    </label>
                    <Input
                      defaultValue="NPR (Nepalese Rupee)"
                      disabled
                      className="rounded-xl font-bold text-[#38B46A]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#173226] dark:text-slate-200">
                      Nepal Value Added Tax (VAT)
                    </label>
                    <Input defaultValue="13%" className="rounded-xl font-mono" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                  <Button
                    onClick={() => toast.success("Store settings saved successfully!")}
                    className="h-9 px-4 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs cursor-pointer hover:scale-105 transition-transform"
                  >
                    Save Store Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Search Dialog Palette */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={effectiveProducts}
        orders={effectiveOrders}
        customers={effectiveCustomers}
        onSelectSection={(sec) => setActiveSection(sec)}
        onSelectOrder={(ord) => setSelectedOrderForDrawer(ord)}
      />

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrderForDrawer}
        isOpen={!!selectedOrderForDrawer}
        onClose={() => setSelectedOrderForDrawer(null)}
        onUpdateStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
      />

      {/* Product Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={selectedProductForEdit}
        onSaveProduct={handleSaveProduct}
      />

      {/* Stock Edit Modal */}
      <StockEditModal
        product={selectedStockProduct}
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onUpdateStock={handleUpdateStock}
      />

      {/* Coupon Modal */}
      <CouponFormModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onSaveCoupon={async (cpn) => {
          try {
            await api.createCoupon({
              code: cpn.code,
              discountType: cpn.discountType === "Percentage" ? "percentage" : "fixed",
              discountValue: cpn.discountValue,
              minSpend: cpn.minSpend,
              usageLimit: cpn.usageLimit,
              expiryDate: cpn.expiryDate,
            });
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
            toast.success(`Coupon "${cpn.code}" created in database`);
          } catch {
            setCouponsList((prev) => [cpn, ...prev]);
            toast.success(`Coupon "${cpn.code}" saved locally`);
          }
        }}
      />

      {/* Banner Modal */}
      <BannerEditModal
        bannerToEdit={selectedBannerForEdit}
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onSaveBanner={async (ban) => {
          try {
            if (selectedBannerForEdit) {
              await api.updateBanner(ban.id, {
                title: ban.title,
                subtitle: ban.subtitle,
                ctaText: ban.ctaText,
                ctaLink: ban.ctaLink,
                image: ban.image,
                tagBadge: ban.tagBadge,
                displayOrder: ban.displayOrder,
                status: ban.status === "Active" ? "active" : "draft",
              });
            } else {
              await api.createBanner({
                title: ban.title,
                subtitle: ban.subtitle,
                ctaText: ban.ctaText,
                ctaLink: ban.ctaLink,
                image: ban.image,
                tagBadge: ban.tagBadge,
                displayOrder: ban.displayOrder,
                status: ban.status === "Active" ? "active" : "draft",
              });
            }
            queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
            toast.success(`Banner "${ban.title}" saved to database`);
          } catch {
            setBannersList((prev) =>
              prev.some((b) => b.id === ban.id)
                ? prev.map((b) => (b.id === ban.id ? ban : b))
                : [ban, ...prev],
            );
            toast.success(`Banner saved locally`);
          }
        }}
      />

      {/* Partner Modal */}
      <PartnerFormModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        onSavePartner={async (prt) => {
          try {
            await api.createPartner({
              name: prt.name,
              category: prt.category,
              partnerSince: prt.partnerSince,
              status: prt.status === "Active Authorized" ? "active" : "pending",
              notes: prt.notes,
            });
            queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
            toast.success(`Partner "${prt.name}" added to database`);
          } catch {
            setPartnersList((prev) => [prt, ...prev]);
            toast.success(`Partner saved locally`);
          }
        }}
      />
    </div>
  );
}
