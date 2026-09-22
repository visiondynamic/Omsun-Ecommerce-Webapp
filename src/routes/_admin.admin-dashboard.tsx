import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
  EyeOff,
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
  Truck,
  ArrowUpDown,
  SlidersHorizontal,
  Mail,
  Phone,
  Inbox,
  MessageSquare,
  FileSpreadsheet,
  ArrowUp,
  ArrowDown,
  UserCheck,
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
  PRODUCT_TAXONOMY,
  mapApiProductToProduct,
} from "@/lib/products";
import { api, ContactMessageRow, NewsletterSubscriberRow } from "@/lib/api";
import {
  OMSUN_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_BANNERS,
  INITIAL_PARTNERS,
  INITIAL_NOTIFICATIONS,
  AdminOrder,
  AdminCustomer,
  AdminBanner,
  AdminPartner,
  AdminNotification,
  OrderStatus,
} from "@/lib/adminData";
import {
  exportOrdersCsv,
  exportInquiriesCsv,
  exportSubscribersCsv,
  exportProductsCsv,
  exportCustomersCsv,
  exportFinancialSummaryCsv,
} from "@/lib/exportCsv";

import { AdminSidebar, AdminSection } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GlobalSearchModal } from "@/components/admin/GlobalSearchModal";
import { OrderDetailsDrawer } from "@/components/admin/OrderDetailsDrawer";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { StockEditModal } from "@/components/admin/StockEditModal";
import { BannerEditModal } from "@/components/admin/BannerEditModal";
import { PartnerFormModal } from "@/components/admin/PartnerFormModal";
import { TeamMemberModal } from "@/components/admin/TeamMemberModal";
import type { TeamMember } from "@/lib/teamData";
import { initialFallbackTeam } from "@/lib/teamData";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

  // Fetch team members from API
  const { data: apiTeamList } = useQuery<TeamMember[]>({
    queryKey: ["admin-team"],
    queryFn: async () => {
      return await api.getAdminTeam();
    },
    staleTime: 60 * 1000,
  });
  const effectiveTeam: TeamMember[] = apiTeamList ?? initialFallbackTeam;

  // Fetch stats from API
  const { data: apiStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.getAdminStats(),
    staleTime: 2 * 60 * 1000,
  });

  // Fetch inquiries & subscribers from API
  const { data: apiInquiriesData, refetch: refetchInquiries } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => api.getAdminInquiries(),
    staleTime: 60 * 1000,
  });
  const effectiveContactMessages: ContactMessageRow[] = apiInquiriesData?.contactMessages ?? [];
  const effectiveSubscribers: NewsletterSubscriberRow[] = apiInquiriesData?.subscribers ?? [];

  // Core Reactive Data State
  const [productsList, setProductsList] = useState<Product[]>(initialCatalogProducts);
  const effectiveProducts = apiProductsList ?? productsList;

  // Disabled / Inactive Product IDs
  const [disabledProductIds, setDisabledProductIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("omsun_disabled_products");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const handleToggleProductStatus = (id: string, name: string) => {
    setDisabledProductIds((prev) => {
      const next = new Set(prev);
      const isCurrentlyDisabled = next.has(id);
      if (isCurrentlyDisabled) {
        next.delete(id);
        toast.success(`Product "${name}" is now enabled and visible.`);
      } else {
        next.add(id);
        toast.info(`Product "${name}" is now disabled and hidden.`);
      }
      try {
        localStorage.setItem("omsun_disabled_products", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const handleMoveProductOrder = (productId: string, direction: "up" | "down") => {
    setProductsList((prev) => {
      const list = [...prev];
      const index = list.findIndex((p) => p.id === productId);
      if (index === -1) return prev;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const current = list[index];
      const target = list[targetIndex];
      if (!current || !target) return prev;
      list[index] = target;
      list[targetIndex] = current;
      toast.success(`Display order updated for "${current.name}"`);
      return list;
    });
  };

  const [ordersList, setOrdersList] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const effectiveOrders = apiOrdersList ?? ordersList;
  const [customersList, setCustomersList] = useState<AdminCustomer[]>(INITIAL_CUSTOMERS);
  const effectiveCustomers = apiCustomersList ?? customersList;
  const [bannersList, setBannersList] = useState<AdminBanner[]>(INITIAL_BANNERS);
  const effectiveBanners = apiBannersList ?? bannersList;
  const [partnersList, setPartnersList] = useState<AdminPartner[]>(INITIAL_PARTNERS);
  const effectivePartners = apiPartnersList ?? partnersList;
  const [notificationsList, setNotificationsList] =
    useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);

  // Search & Filter States
  const [productQuery, setProductQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState("All");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("All");
  const [targetCategoryForAdd, setTargetCategoryForAdd] = useState<string>("Stabilizer");
  const [targetSubcategoryForAdd, setTargetSubcategoryForAdd] =
    useState<string>("Servo Stabilizer");
  const [orderQuery, setOrderQuery] = useState("");
  const [selectedOrderStatusFilter, setSelectedOrderStatusFilter] = useState("All");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<
    "ALL" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | "UNPAID"
  >("ALL");
  const [orderSortBy, setOrderSortBy] = useState<"NEWEST" | "OLDEST" | "HIGHEST" | "LOWEST">(
    "NEWEST",
  );

  // Inquiries Search & Filter State
  const [inquirySearchQuery, setInquirySearchQuery] = useState("");
  const [selectedInquiryCategory, setSelectedInquiryCategory] = useState("All");
  const [selectedInquiryDistrict, setSelectedInquiryDistrict] = useState("All");
  const [inquiryTab, setInquiryTab] = useState<"messages" | "subscribers">("messages");
  const [selectedInquiryForView, setSelectedInquiryForView] = useState<ContactMessageRow | null>(
    null,
  );

  // Customer Search & Filter State
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [customerStatusFilter, setCustomerStatusFilter] = useState<"All" | "VIP" | "Active">("All");

  const filteredCustomers = useMemo(() => {
    return effectiveCustomers.filter((c) => {
      if (customerStatusFilter !== "All" && c.status !== customerStatusFilter) return false;
      if (!customerSearchQuery) return true;
      const q = customerSearchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q))
      );
    });
  }, [effectiveCustomers, customerStatusFilter, customerSearchQuery]);

  // Persistent Store Settings
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("omsun_store_settings");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      companyName: "OMSUN Solar & Renewable Energy Pvt. Ltd.",
      panVatNumber: "601982340",
      supportPhone: "+977-9800000000",
      supportEmail: "sales@omsunnepal.com",
      hubAddress: "OMSUN Hub, Tripureshwor, Kathmandu 44600, Nepal",
      fonepayMerchantId: "FP-OMSUN-KTM-01",
      valleyDeliveryFee: 0,
      outsideValleyDeliveryFee: 1500,
      notificationEmail: "sales@omsunnepal.com",
    };
  });

  const handleSaveStoreSettings = (newSettings: typeof storeSettings) => {
    setStoreSettings(newSettings);
    try {
      localStorage.setItem("omsun_store_settings", JSON.stringify(newSettings));
    } catch {}
    toast.success("Store configuration and operational parameters saved!");
  };

  // Modals & Drawers State
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<AdminOrder | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState<Product | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedBannerForEdit, setSelectedBannerForEdit] = useState<AdminBanner | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTeamMemberForEdit, setSelectedTeamMemberForEdit] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  // Calculated Telemetry
  const totalRevenue =
    apiStats?.totalRevenue ??
    effectiveOrders
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalProductsCount = apiStats?.productCount ?? effectiveProducts.length;
  const lowStockCount =
    apiStats?.lowStockItems ?? effectiveProducts.filter((p) => p.stock <= 10).length;
  const pendingOrdersCount =
    apiStats?.pendingOrders ?? effectiveOrders.filter((o) => o.orderStatus === "Pending").length;

  // Orders Action Required Metrics
  const pendingVerificationCount = effectiveOrders.filter(
    (o) =>
      o.paymentStatus === "Under Review" ||
      (!!o.paymentReceipt && o.paymentStatus !== "Paid" && o.paymentStatus !== "Failed"),
  ).length;
  const warehousePrepCount = effectiveOrders.filter((o) => o.orderStatus === "Processing").length;
  const outForDeliveryCount = effectiveOrders.filter(
    (o) => o.orderStatus === "Shipped" || o.deliveryStatus === "OUT_FOR_DELIVERY",
  ).length;
  const rejectedSlipsCount = effectiveOrders.filter(
    (o) => o.paymentStatus === "Failed" || !!o.rejectionReason,
  ).length;

  const filteredAndSortedOrders = useMemo(() => {
    return effectiveOrders
      .filter((o) => {
        if (selectedOrderStatusFilter !== "All" && o.orderStatus !== selectedOrderStatusFilter) {
          return false;
        }
        if (orderPaymentFilter === "PENDING_VERIFICATION") {
          const isPending =
            o.paymentStatus === "Under Review" ||
            (!!o.paymentReceipt && o.paymentStatus !== "Paid" && o.paymentStatus !== "Failed");
          if (!isPending) return false;
        } else if (orderPaymentFilter === "VERIFIED") {
          if (o.paymentStatus !== "Paid") return false;
        } else if (orderPaymentFilter === "REJECTED") {
          if (o.paymentStatus !== "Failed" && !o.rejectionReason) return false;
        } else if (orderPaymentFilter === "UNPAID") {
          if (o.paymentStatus !== "Unpaid") return false;
        }

        if (orderQuery.trim()) {
          const q = orderQuery.toLowerCase();
          const matchesId = o.id.toLowerCase().includes(q);
          const matchesName = o.customerName.toLowerCase().includes(q);
          const matchesPhone = o.customerPhone.toLowerCase().includes(q);
          const matchesRef = o.transactionRef ? o.transactionRef.toLowerCase().includes(q) : false;
          if (!matchesId && !matchesName && !matchesPhone && !matchesRef) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (orderSortBy === "NEWEST")
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (orderSortBy === "OLDEST")
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (orderSortBy === "HIGHEST") return b.totalAmount - a.totalAmount;
        if (orderSortBy === "LOWEST") return a.totalAmount - b.totalAmount;
        return 0;
      });
  }, [effectiveOrders, selectedOrderStatusFilter, orderPaymentFilter, orderQuery, orderSortBy]);

  // Sales trend from API or fallback
  const salesTrendData = apiStats?.monthlyTrend?.length
    ? apiStats.monthlyTrend.map((r) => ({
        month: r.month.slice(5),
        revenue: r.revenue,
        orders: r.orders,
      }))
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
  const pieColors = [
    "#38B46A",
    "#2F80ED",
    "#F4B400",
    "#12342B",
    "#D97706",
    "#7C3AED",
    "#059669",
    "#2563EB",
  ];
  const categoryDistributionData = apiStats?.categoryDistribution?.length
    ? apiStats.categoryDistribution.map((r, i) => ({
        name: r.name,
        value: r.value,
        color: pieColors[i % pieColors.length],
      }))
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
          images: prod.images || (prod.image ? [prod.image] : []),
          stock: prod.stock,
          rating: prod.rating,
          badges: prod.badges,
          specs: prod.specs,
          model: prod.model || null,
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
          images: prod.images || (prod.image ? [prod.image] : []),
          stock: prod.stock,
          rating: prod.rating,
          badges: prod.badges,
          specs: prod.specs,
          features: prod.features || [],
          model: prod.model || null,
        });
      }
      setProductsList((prev) => {
        const idx = prev.findIndex((p) => p.id === prod.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = prod;
          return next;
        }
        return [prod, ...prev];
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success(`Product "${prod.name}" saved to database`);
    } catch (err: any) {
      toast.error(err?.message || `Failed to save product "${prod.name}"`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    try {
      await api.deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Product "${name}" deleted from catalog`);
    } catch (err: any) {
      toast.error(
        err?.message || `Cannot delete product "${name}". It may be referenced in existing orders.`,
      );
    }
  };

  const handleDuplicateProduct = async (prod: Product) => {
    const newId = `sku-${Date.now().toString(36).toLowerCase()}`;
    const duplicateName = `${prod.name} (Copy)`;
    try {
      await api.createProduct({
        id: newId,
        name: duplicateName,
        category: prod.category,
        subcategory: prod.subcategory || null,
        brand: prod.brand,
        tagline: prod.tagline || null,
        description: (prod as any).description || prod.tagline || null,
        price: prod.price,
        mrp: prod.compareAt ?? null,
        image: prod.image || null,
        images: prod.images || (prod.image ? [prod.image] : []),
        stock: prod.stock || 10,
        rating: prod.rating || 4.8,
        badges: prod.badges || ["In Stock"],
        specs: prod.specs || [],
        features: [],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Duplicated "${prod.name}" as "${duplicateName}"`);
    } catch (err: any) {
      toast.error(err?.message || `Failed to duplicate "${prod.name}"`);
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      await api.updateStock(productId, newStock);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setProductsList((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)),
      );
      toast.success(`Stock level updated to ${newStock} units`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update stock");
    }
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const ref = orderId.replace("OMS-", "");
    try {
      await api.updateOrderStatus(ref, newStatus.toLowerCase());
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setOrdersList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)),
      );
      if (selectedOrderForDrawer && selectedOrderForDrawer.id === orderId) {
        setSelectedOrderForDrawer((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
      }
      toast.success(`Order #${orderId} status changed to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.message || `Failed to update status for #${orderId}`);
    }
  };

  const handleVerifyPayment = async (
    orderId: string,
    approve: boolean,
    rejectionReason?: string,
    notes?: string,
  ) => {
    const ref = orderId.replace("OMS-", "");
    try {
      await api.adminVerifyPayment(ref, { approve, rejectionReason, notes });
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(
        approve
          ? `Order #${orderId} payment verified & confirmed!`
          : `Order #${orderId} payment rejected. Customer notified.`,
      );
      if (selectedOrderForDrawer && selectedOrderForDrawer.id === orderId) {
        setSelectedOrderForDrawer((prev) =>
          prev
            ? {
                ...prev,
                paymentStatus: approve ? "Paid" : "Failed",
                orderStatus: approve ? "Processing" : prev.orderStatus,
                rejectionReason: approve ? null : (rejectionReason ?? null),
                adminNotes: notes ?? prev.adminNotes,
                paymentVerifiedAt: approve ? new Date().toISOString() : null,
              }
            : null,
        );
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to verify payment");
      throw err;
    }
  };

  const handleUpdateDelivery = async (orderId: string, deliveryData: any) => {
    const ref = orderId.replace("OMS-", "");
    try {
      await api.adminUpdateDelivery(ref, deliveryData);
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success(`Delivery logistics dispatched for #${orderId}`);
      if (selectedOrderForDrawer && selectedOrderForDrawer.id === orderId) {
        setSelectedOrderForDrawer((prev) =>
          prev
            ? {
                ...prev,
                ...deliveryData,
              }
            : null,
        );
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update delivery information");
      throw err;
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const ref = orderId.replace("OMS-", "");
    try {
      await api.deleteAdminOrder(ref);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setOrdersList((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrderForDrawer && selectedOrderForDrawer.id === orderId) {
        setSelectedOrderForDrawer(null);
      }
      toast.success(`Order #${orderId} deleted and items restocked`);
    } catch (err: any) {
      toast.error(err?.message || `Failed to delete order #${orderId}`);
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

  // Team Member Handlers
  const handleSaveTeamMember = async (member: Partial<TeamMember>) => {
    try {
      if (member.id && effectiveTeam.some((m) => m.id === member.id)) {
        await api.updateTeamMember(member.id, member);
        toast.success(`Team member "${member.name}" updated!`);
      } else {
        await api.createTeamMember(member);
        toast.success(`Team member "${member.name}" created!`);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
    } catch (err: any) {
      toast.error(err?.message || "Failed to save team member");
      throw err;
    }
  };

  const handleDeleteTeamMember = async (id: string, name: string) => {
    try {
      await api.deleteTeamMember(id);
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setMemberToDelete(null);
      toast.success(`Team member "${name}" removed`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete team member");
    }
  };

  const handleToggleTeamMemberVisibility = async (
    id: string,
    currentStatus: boolean,
    name: string,
  ) => {
    try {
      await api.updateTeamMember(id, { isActive: !currentStatus });
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success(
        !currentStatus
          ? `"${name}" is now live on the homepage`
          : `"${name}" hidden from homepage`,
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update visibility");
    }
  };

  const handleReorderTeamMember = async (id: string, newOrder: number) => {
    try {
      await api.updateTeamMember(id, { displayOrder: newOrder });
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Display order updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update order");
    }
  };

  // Dynamic Header Action Button
  const handleHeaderQuickAction = () => {
    switch (activeSection) {
      case "products":
        setSelectedProductForEdit(null);
        setIsProductModalOpen(true);
        break;
      case "partners":
        setIsPartnerModalOpen(true);
        break;
      case "team":
        setSelectedTeamMemberForEdit(null);
        setIsTeamModalOpen(true);
        break;
      case "inquiries":
        exportInquiriesCsv(effectiveContactMessages);
        break;
      case "orders":
        exportOrdersCsv(filteredAndSortedOrders);
        break;
      case "customers":
        exportCustomersCsv(filteredCustomers);
        break;
      case "reports":
        exportFinancialSummaryCsv(salesTrendData);
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
          inquiriesCount={effectiveContactMessages.length}
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
            inquiriesCount={effectiveContactMessages.length}
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
                <div className="rounded-2xl bg-white dark:bg-[#0c1813] p-3.5 sm:p-4.5 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-[#38B46A]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                      Gross Revenue
                    </span>
                    <div className="flex size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center text-[#38B46A]">
                      <DollarSign className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    {formatNPR(totalRevenue)}
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 inline-block" /> Live
                    database sales
                  </div>
                </div>

                {/* 2. Total Orders */}
                <div
                  onClick={() => setActiveSection("orders")}
                  className="rounded-2xl bg-white dark:bg-[#0c1813] p-3.5 sm:p-4.5 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-sky-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                      Total Orders
                    </span>
                    <div className="flex size-8 rounded-xl bg-sky-500/10 border border-sky-500/20 items-center justify-center text-sky-600 dark:text-sky-400">
                      <ShoppingBag className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    {effectiveOrders.length} Orders
                  </div>
                  <div className="mt-1 text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
                    {pendingOrdersCount} Pending Dispatch
                  </div>
                </div>

                {/* 3. Hardware Catalog */}
                <div
                  onClick={() => setActiveSection("products")}
                  className="rounded-2xl bg-white dark:bg-[#0c1813] p-3.5 sm:p-4.5 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-indigo-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                      Catalog SKUs
                    </span>
                    <div className="flex size-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Box className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    {totalProductsCount} SKUs
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    5 Core Categories
                  </div>
                </div>

                {/* 4. Low Stock Alert */}
                <div
                  onClick={() => setActiveSection("inventory")}
                  className="rounded-2xl bg-white dark:bg-[#0c1813] p-3.5 sm:p-4.5 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-amber-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                      Low Stock Alert
                    </span>
                    <div className="flex size-8 rounded-xl bg-amber-500/10 border border-amber-500/20 items-center justify-center text-amber-600 dark:text-amber-400">
                      <Boxes className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
                    {lowStockCount} Items
                  </div>
                  <div className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    Threshold ≤ 10 units
                  </div>
                </div>

                {/* 5. Registered Clients */}
                <div
                  onClick={() => setActiveSection("customers")}
                  className="rounded-2xl bg-white dark:bg-[#0c1813] p-3.5 sm:p-4.5 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-emerald-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                      Client Accounts
                    </span>
                    <div className="flex size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center text-[#38B46A]">
                      <Users className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    {effectiveCustomers.length} Accounts
                  </div>
                  <div className="mt-1 text-[11px] text-[#38B46A] font-semibold">
                    {effectiveCustomers.filter((c) => c.status === "VIP").length} VIP Profiles
                  </div>
                </div>

                {/* 6. Inquiries & Leads */}
                <div
                  onClick={() => setActiveSection("inquiries")}
                  className="rounded-2xl bg-white dark:bg-[#0c1813] p-3.5 sm:p-4.5 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-sky-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                      Inquiries & Leads
                    </span>
                    <div className="flex size-8 rounded-xl bg-sky-500/10 border border-sky-500/20 items-center justify-center text-sky-600 dark:text-sky-400">
                      <MessageSquare className="size-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 font-display text-xl sm:text-2xl font-black text-[#173226] dark:text-white font-mono tracking-tight">
                    {effectiveContactMessages.length} Leads
                  </div>
                  <div className="mt-1 text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
                    {effectiveSubscribers.length} Newsletter Subs
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
                        {lowStockCount} Hardware Items Operating Below Reorder Threshold (≤ 10
                        Units)
                      </div>
                      <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                        Critical stock alerts in Kathmandu hub. Generate vendor purchase order to
                        replenish inventory.
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
              {/* Product Header & Multi-Filter Bar */}
              <div className="bg-white dark:bg-[#0c241c] p-4 sm:p-5 rounded-3xl border border-[#E2EDE7] dark:border-white/10 shadow-sm space-y-3.5">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                      <Input
                        placeholder="Search title, SKU, model, specs..."
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        className="pl-9 rounded-xl text-xs bg-slate-50/50 dark:bg-white/5"
                      />
                    </div>

                    {/* Category Filter */}
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => {
                        setSelectedCategoryFilter(e.target.value);
                        setSelectedSubcategoryFilter("All");
                      }}
                      className="h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c241c] text-xs font-bold text-[#173226] dark:text-slate-200 shadow-xs cursor-pointer"
                    >
                      <option value="All">All Categories ({effectiveProducts.length})</option>
                      {CATEGORIES.map((c) => {
                        const count = effectiveProducts.filter((p) => p.category === c).length;
                        return (
                          <option key={c} value={c}>
                            {c} ({count})
                          </option>
                        );
                      })}
                    </select>

                    {/* Subcategory Filter */}
                    <select
                      value={selectedSubcategoryFilter}
                      onChange={(e) => setSelectedSubcategoryFilter(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c241c] text-xs font-bold text-[#173226] dark:text-slate-200 shadow-xs cursor-pointer"
                    >
                      <option value="All">All Subcategories</option>
                      {(selectedCategoryFilter === "All"
                        ? PRODUCT_TAXONOMY.flatMap((t) => t.subcategories)
                        : PRODUCT_TAXONOMY.find((t) => t.name === selectedCategoryFilter)
                            ?.subcategories || []
                      ).map((sub) => {
                        const count = effectiveProducts.filter((p) => p.subcategory === sub).length;
                        return (
                          <option key={sub} value={sub}>
                            {sub} ({count})
                          </option>
                        );
                      })}
                    </select>

                    {/* Brand Filter */}
                    <select
                      value={selectedBrandFilter}
                      onChange={(e) => setSelectedBrandFilter(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c241c] text-xs font-bold text-[#173226] dark:text-slate-200 shadow-xs cursor-pointer"
                    >
                      <option value="All">All Brands</option>
                      {BRANDS.map((b) => {
                        const count = effectiveProducts.filter((p) => p.brand === b).length;
                        return (
                          <option key={b} value={b}>
                            {b} ({count})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Export & Add Product Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      onClick={() =>
                        exportProductsCsv(
                          effectiveProducts.filter(
                            (p) =>
                              (selectedCategoryFilter === "All" ||
                                p.category === selectedCategoryFilter) &&
                              (selectedSubcategoryFilter === "All" ||
                                p.subcategory === selectedSubcategoryFilter) &&
                              (selectedBrandFilter === "All" || p.brand === selectedBrandFilter) &&
                              (!productQuery ||
                                p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
                                p.id.toLowerCase().includes(productQuery.toLowerCase()) ||
                                p.brand.toLowerCase().includes(productQuery.toLowerCase())),
                          ),
                        )
                      }
                      className="h-9 rounded-xl border-slate-200 dark:border-white/10 font-bold text-xs gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <Download className="size-3.5" /> Export Catalog
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedProductForEdit(null);
                        setTargetCategoryForAdd(
                          selectedCategoryFilter !== "All" ? selectedCategoryFilter : "Stabilizer",
                        );
                        setTargetSubcategoryForAdd(
                          selectedSubcategoryFilter !== "All"
                            ? selectedSubcategoryFilter
                            : "Servo Stabilizer",
                        );
                        setIsProductModalOpen(true);
                      }}
                      className="h-9 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform"
                    >
                      <Plus className="size-4" /> Add Hardware SKU
                    </Button>
                  </div>
                </div>

                {/* Filter Status & Active Pills */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-400 font-semibold text-[11px]">
                      Showing{" "}
                      <strong className="text-[#173226] dark:text-white font-mono">
                        {
                          effectiveProducts.filter(
                            (p) =>
                              (selectedCategoryFilter === "All" ||
                                p.category === selectedCategoryFilter) &&
                              (selectedSubcategoryFilter === "All" ||
                                p.subcategory === selectedSubcategoryFilter) &&
                              (selectedBrandFilter === "All" || p.brand === selectedBrandFilter) &&
                              (!productQuery ||
                                `${p.name} ${p.category} ${p.subcategory || ""} ${p.brand} ${p.id}`
                                  .toLowerCase()
                                  .includes(productQuery.toLowerCase())),
                          ).length
                        }
                      </strong>{" "}
                      of {effectiveProducts.length} items
                    </span>

                    {selectedCategoryFilter !== "All" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#38B46A] dark:bg-emerald-950/40 border border-[#38B46A]/30 text-[10px] font-bold">
                        Category: {selectedCategoryFilter}
                        <button
                          onClick={() => {
                            setSelectedCategoryFilter("All");
                            setSelectedSubcategoryFilter("All");
                          }}
                          className="hover:text-red-500 font-extrabold cursor-pointer ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {selectedSubcategoryFilter !== "All" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-[#2F80ED] dark:bg-sky-950/40 border border-[#2F80ED]/30 text-[10px] font-bold">
                        Subcategory: {selectedSubcategoryFilter}
                        <button
                          onClick={() => setSelectedSubcategoryFilter("All")}
                          className="hover:text-red-500 font-extrabold cursor-pointer ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {selectedBrandFilter !== "All" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 border border-purple-300 text-[10px] font-bold">
                        Brand: {selectedBrandFilter}
                        <button
                          onClick={() => setSelectedBrandFilter("All")}
                          className="hover:text-red-500 font-extrabold cursor-pointer ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>

                  {(selectedCategoryFilter !== "All" ||
                    selectedSubcategoryFilter !== "All" ||
                    selectedBrandFilter !== "All" ||
                    productQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategoryFilter("All");
                        setSelectedSubcategoryFilter("All");
                        setSelectedBrandFilter("All");
                        setProductQuery("");
                      }}
                      className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Products Card Stack (< sm) */}
              <div className="block sm:hidden space-y-3">
                {effectiveProducts
                  .filter(
                    (p) =>
                      (selectedCategoryFilter === "All" || p.category === selectedCategoryFilter) &&
                      (selectedSubcategoryFilter === "All" ||
                        p.subcategory === selectedSubcategoryFilter) &&
                      (selectedBrandFilter === "All" || p.brand === selectedBrandFilter) &&
                      (!productQuery ||
                        `${p.name} ${p.category} ${p.subcategory || ""} ${p.brand} ${p.id}`
                          .toLowerCase()
                          .includes(productQuery.toLowerCase())),
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
                          className="size-12 rounded-xl object-contain bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 p-1"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold text-[#173226] dark:text-white truncate">
                            {prod.name}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded whitespace-nowrap inline-flex items-center shrink-0 ${
                                prod.brand === "Greenn Volt" || prod.brand === "Green Volt"
                                  ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300"
                                  : prod.brand === "Power-One"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                    : prod.brand === "Hikvision" || prod.brand === "Techno Vision"
                                      ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              }`}
                            >
                              {prod.brand}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold truncate">
                              {prod.category} {prod.subcategory ? `• ${prod.subcategory}` : ""}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>SKU: {prod.id}</span>
                            {prod.model && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                Model: {prod.model}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10 text-xs">
                        <div className="font-mono font-extrabold text-[#38B46A]">
                          {prod.price === 0 ? "Quote Only" : formatNPR(prod.price)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleProductStatus(prod.id, prod.name)}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 ${
                              disabledProductIds.has(prod.id)
                                ? "bg-slate-100 text-slate-500 border-slate-300"
                                : "bg-emerald-50 text-emerald-700 border-emerald-300"
                            }`}
                          >
                            {disabledProductIds.has(prod.id) ? (
                              <>
                                <EyeOff className="size-2.5" /> Disabled
                              </>
                            ) : (
                              <>
                                <Eye className="size-2.5" /> Active
                              </>
                            )}
                          </button>
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
                        <th className="p-4 whitespace-nowrap">Product Details</th>
                        <th className="p-4 whitespace-nowrap">Category & Subcategory</th>
                        <th className="p-4 whitespace-nowrap">Brand</th>
                        <th className="p-4 whitespace-nowrap">Selling Price</th>
                        <th className="p-4 whitespace-nowrap">Stock Status</th>
                        <th className="p-4 whitespace-nowrap">Rating</th>
                        <th className="p-4 whitespace-nowrap">Status</th>
                        <th className="p-4 whitespace-nowrap">Order</th>
                        <th className="p-4 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                      {effectiveProducts
                        .filter(
                          (p) =>
                            (selectedCategoryFilter === "All" ||
                              p.category === selectedCategoryFilter) &&
                            (selectedSubcategoryFilter === "All" ||
                              p.subcategory === selectedSubcategoryFilter) &&
                            (selectedBrandFilter === "All" || p.brand === selectedBrandFilter) &&
                            (!productQuery ||
                              `${p.name} ${p.category} ${p.subcategory || ""} ${p.brand} ${p.id} ${p.model || ""}`
                                .toLowerCase()
                                .includes(productQuery.toLowerCase())),
                        )
                        .map((prod) => (
                          <tr
                            key={prod.id}
                            className={`hover:bg-[#F2FBF4]/80 dark:hover:bg-white/5 transition-colors ${
                              disabledProductIds.has(prod.id) ? "opacity-60 bg-slate-50/50" : ""
                            }`}
                          >
                            <td className="p-4 font-bold text-[#173226] dark:text-white flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt=""
                                className="size-11 rounded-xl object-contain bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs p-1"
                              />
                              <div>
                                <div className="text-xs font-extrabold">{prod.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono font-normal flex items-center gap-2">
                                  <span>SKU: {prod.id}</span>
                                  {prod.model && (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                      Model: {prod.model}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-slate-700 dark:text-slate-300">
                                {prod.category}
                              </div>
                              {prod.subcategory && (
                                <div className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-md inline-block mt-0.5">
                                  {prod.subcategory}
                                </div>
                              )}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap inline-flex items-center shrink-0 ${
                                  prod.brand === "Greenn Volt" || prod.brand === "Green Volt"
                                    ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200"
                                    : prod.brand === "Power-One"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                                      : prod.brand === "Hikvision" || prod.brand === "Techno Vision"
                                        ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200"
                                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                                }`}
                              >
                                {prod.brand}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-extrabold text-[#38B46A] text-sm">
                              {prod.price === 0 ? (
                                <span className="text-amber-600 dark:text-amber-400 font-bold text-xs bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40">
                                  Quote Only
                                </span>
                              ) : (
                                formatNPR(prod.price)
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
                            <td className="p-4 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleToggleProductStatus(prod.id, prod.name)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-all hover:scale-105 ${
                                  disabledProductIds.has(prod.id)
                                    ? "bg-slate-100 text-slate-500 border-slate-300 dark:bg-white/10 dark:text-slate-400"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                                }`}
                                title={disabledProductIds.has(prod.id) ? "Click to Enable product" : "Click to Disable product"}
                              >
                                {disabledProductIds.has(prod.id) ? (
                                  <>
                                    <EyeOff className="size-3 text-slate-400" />
                                    <span>Disabled</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="size-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>Active</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveProductOrder(prod.id, "up")}
                                  className="p-1 rounded bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="size-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveProductOrder(prod.id, "down")}
                                  className="p-1 rounded bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="size-3" />
                                </button>
                              </div>
                            </td>
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
                    OMSUN Hardware Portfolio Categories & Subcategories
                  </h3>
                  <p className="text-xs text-slate-500">
                    5 core energy & power hardware verticals with live product distribution
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedProductForEdit(null);
                    setTargetCategoryForAdd("Stabilizer");
                    setTargetSubcategoryForAdd("Servo Stabilizer");
                    setIsProductModalOpen(true);
                  }}
                  className="h-9 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white text-xs font-extrabold gap-1 cursor-pointer hover:scale-105 transition-transform"
                >
                  <Plus className="size-4" /> Add Hardware SKU
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5">
                {OMSUN_CATEGORIES.map((cat, idx) => {
                  const liveCount = effectiveProducts.filter((p) => p.category === cat.name).length;
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
                      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-white to-[#F2FBF4]/40 dark:from-[#0c241c] dark:to-[#071A12] p-5 sm:p-6 border border-[#E2EDE7] dark:border-white/10 shadow-xs transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl hover:shadow-[#38B46A]/12 space-y-3.5 flex flex-col justify-between ${borderTopColor}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                            SKU Prefix: {cat.skuPrefix}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeStyle}`}
                          >
                            {liveCount} SKUs Live
                          </span>
                        </div>

                        <h4 className="font-display font-extrabold text-base text-[#173226] dark:text-white group-hover:text-[#38B46A] transition-colors">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {cat.description}
                        </p>

                        {/* Subcategories list tags (clickable to filter) */}
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                              Subcategories (Click to filter):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.subcategories.map((sub) => {
                                const subCount = effectiveProducts.filter(
                                  (p) => p.category === cat.name && p.subcategory === sub,
                                ).length;
                                return (
                                  <button
                                    key={sub}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCategoryFilter(cat.name);
                                      setSelectedSubcategoryFilter(sub);
                                      setActiveSection("products");
                                    }}
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-[#38B46A] hover:text-white dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 cursor-pointer transition-colors flex items-center gap-1"
                                    title={`View ${sub} (${subCount} items)`}
                                  >
                                    <span>{sub}</span>
                                    <span className="font-mono text-[9px] opacity-70">
                                      ({subCount})
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProductForEdit(null);
                            setTargetCategoryForAdd(cat.name);
                            setTargetSubcategoryForAdd(cat.subcategories?.[0] || "");
                            setIsProductModalOpen(true);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-[#38B46A] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="size-3.5" /> Add SKU
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategoryFilter(cat.name);
                            setSelectedSubcategoryFilter("All");
                            setActiveSection("products");
                          }}
                          className="text-[#38B46A] hover:underline font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                        >
                          View All ({liveCount}) &rarr;
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
                    Manage real-time hardware orders, manual Fonepay verification, carrier dispatch
                    & delivery.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Button
                    onClick={() => exportOrdersCsv(filteredAndSortedOrders)}
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-bold text-xs gap-1.5 h-9 cursor-pointer"
                  >
                    <Download className="size-3.5" /> Export Orders
                  </Button>
                  <Button
                    onClick={handleRefreshOrders}
                    variant="outline"
                    className="rounded-xl border-[#38B46A]/40 text-[#38B46A] hover:bg-[#ECFDF3] font-bold text-xs gap-1.5 h-9 cursor-pointer"
                  >
                    <RefreshCw className="size-3.5" /> Sync Orders
                  </Button>
                </div>
              </div>

              {/* Action Required Command Center */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setOrderPaymentFilter((prev) =>
                      prev === "PENDING_VERIFICATION" ? "ALL" : "PENDING_VERIFICATION",
                    );
                    setSelectedOrderStatusFilter("All");
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    orderPaymentFilter === "PENDING_VERIFICATION"
                      ? "bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/30 shadow-xs"
                      : "bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 hover:border-amber-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Pending Slips
                    </span>
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                      <Clock className="size-4" />
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-black text-amber-600">
                    {pendingVerificationCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    Awaiting payment approval
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrderStatusFilter((prev) =>
                      prev === "Processing" ? "All" : "Processing",
                    );
                    setOrderPaymentFilter("ALL");
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedOrderStatusFilter === "Processing"
                      ? "bg-blue-500/10 border-blue-500/50 ring-2 ring-blue-500/30 shadow-xs"
                      : "bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 hover:border-blue-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Warehouse Prep
                    </span>
                    <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                      <Package className="size-4" />
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-black text-blue-600">{warehousePrepCount}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    Verified, ready to pack
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrderStatusFilter((prev) =>
                      prev === "Shipped" ? "All" : "Shipped",
                    );
                    setOrderPaymentFilter("ALL");
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedOrderStatusFilter === "Shipped"
                      ? "bg-purple-500/10 border-purple-500/50 ring-2 ring-purple-500/30 shadow-xs"
                      : "bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 hover:border-purple-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      In Transit
                    </span>
                    <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                      <Truck className="size-4" />
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-black text-purple-600">
                    {outForDeliveryCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    Dispatched with carrier
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrderPaymentFilter((prev) => (prev === "REJECTED" ? "ALL" : "REJECTED"));
                    setSelectedOrderStatusFilter("All");
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    orderPaymentFilter === "REJECTED"
                      ? "bg-rose-500/10 border-rose-500/50 ring-2 ring-rose-500/30 shadow-xs"
                      : "bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 hover:border-rose-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Slips Rejected
                    </span>
                    <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                      <AlertTriangle className="size-4" />
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-black text-rose-600">{rejectedSlipsCount}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    Waiting for customer re-upload
                  </div>
                </button>
              </div>

              {/* Filter Tabs, Payment Filters & Search */}
              <div className="bg-white dark:bg-[#0c241c] p-4 sm:p-5 rounded-3xl border border-[#E2EDE7] dark:border-white/10 shadow-sm space-y-3.5">
                {/* Order Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {(
                    ["All", "Pending", "Processing", "Shipped", "Completed", "Cancelled"] as const
                  ).map((st) => {
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

                {/* Sub-bar: Payment Filter Pills, Sort Dropdown & Search Input */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/10">
                  {/* Payment Filters */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
                    <span className="text-slate-400 text-[11px] font-bold shrink-0 flex items-center gap-1 mr-1">
                      <SlidersHorizontal className="size-3" /> Payment:
                    </span>
                    {(
                      [
                        { id: "ALL", label: "All" },
                        {
                          id: "PENDING_VERIFICATION",
                          label: `Needs Review (${pendingVerificationCount})`,
                        },
                        { id: "VERIFIED", label: "Verified" },
                        { id: "REJECTED", label: `Rejected (${rejectedSlipsCount})` },
                        { id: "UNPAID", label: "Unpaid" },
                      ] as const
                    ).map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setOrderPaymentFilter(filter.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer shrink-0 ${
                          orderPaymentFilter === filter.id
                            ? filter.id === "PENDING_VERIFICATION"
                              ? "bg-amber-500 text-white shadow-xs"
                              : filter.id === "REJECTED"
                                ? "bg-rose-500 text-white shadow-xs"
                                : filter.id === "VERIFIED"
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-[#173226] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort & Search */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <ArrowUpDown className="size-3.5 text-slate-400" />
                      <select
                        value={orderSortBy}
                        onChange={(e) => setOrderSortBy(e.target.value as any)}
                        className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#38B46A]"
                      >
                        <option value="NEWEST">Newest First</option>
                        <option value="OLDEST">Oldest First</option>
                        <option value="HIGHEST">Amount: High to Low</option>
                        <option value="LOWEST">Amount: Low to High</option>
                      </select>
                    </div>

                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                      <Input
                        placeholder="Search Ref, customer, or phone..."
                        value={orderQuery}
                        onChange={(e) => setOrderQuery(e.target.value)}
                        className="pl-9 rounded-xl text-xs h-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Active Notice if filtering */}
              {(selectedOrderStatusFilter !== "All" ||
                orderPaymentFilter !== "ALL" ||
                orderQuery.trim()) && (
                <div className="flex items-center justify-between px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  <div className="flex items-center gap-2">
                    <Filter className="size-3.5 text-emerald-600" />
                    <span>
                      Showing {filteredAndSortedOrders.length} of {effectiveOrders.length} orders
                      {selectedOrderStatusFilter !== "All" &&
                        ` • Status: ${selectedOrderStatusFilter}`}
                      {orderPaymentFilter !== "ALL" && ` • Payment: ${orderPaymentFilter}`}
                      {orderQuery.trim() && ` • Search: "${orderQuery}"`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrderStatusFilter("All");
                      setOrderPaymentFilter("ALL");
                      setOrderQuery("");
                    }}
                    className="font-bold underline text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Empty State */}
              {filteredAndSortedOrders.length === 0 && (
                <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 space-y-3">
                  <div className="size-12 rounded-full bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                    <ShoppingBag className="size-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#173226] dark:text-white">
                    No orders match your criteria
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try clearing search queries or switching payment/lifecycle status filters above.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedOrderStatusFilter("All");
                      setOrderPaymentFilter("ALL");
                      setOrderQuery("");
                    }}
                    variant="outline"
                    className="rounded-xl text-xs font-bold"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* Mobile Orders Card Stack (< sm) */}
              <div className="block sm:hidden space-y-3">
                {filteredAndSortedOrders.map((ord) => (
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

                    {/* Payment Status Pill */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium mr-1.5">
                          {ord.paymentMethod}
                        </span>
                        {ord.paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-300">
                            ✓ Verified
                          </span>
                        ) : ord.paymentStatus === "Failed" || !!ord.rejectionReason ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-300">
                            ✕ Rejected
                          </span>
                        ) : ord.paymentReceipt ? (
                          <button
                            onClick={() => setSelectedOrderForDrawer(ord)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-300 animate-pulse"
                          >
                            <ShieldCheck className="size-3 text-amber-600" /> Review Slip
                          </button>
                        ) : ord.paymentMethod === "Fonepay QR" ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200">
                            Awaiting Slip
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {ord.paymentStatus}
                          </span>
                        )}
                      </div>

                      <span className="font-mono font-extrabold text-[#38B46A] text-sm">
                        {formatNPR(ord.totalAmount)}
                      </span>
                    </div>

                    {/* Quick Lifecycle Action Buttons */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {ord.paymentReceipt && ord.paymentStatus !== "Paid" && (
                        <Button
                          onClick={() => setSelectedOrderForDrawer(ord)}
                          className="h-8 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold gap-1"
                        >
                          <ShieldCheck className="size-3.5" /> Verify Slip
                        </Button>
                      )}

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
              {filteredAndSortedOrders.length > 0 && (
                <div className="hidden sm:block rounded-3xl bg-white dark:bg-[#0c241c] border border-[#E2EDE7] dark:border-white/10 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E2EDE7] dark:border-white/10 bg-[#F2FBF4] dark:bg-white/5 font-extrabold uppercase text-slate-500">
                          <th className="p-4">Order Ref</th>
                          <th className="p-4">Customer Contact</th>
                          <th className="p-4">Destination</th>
                          <th className="p-4">Total Amount</th>
                          <th className="p-4">Payment & Receipt</th>
                          <th className="p-4">Order Status</th>
                          <th className="p-4 text-right">Quick Lifecycle Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                        {filteredAndSortedOrders.map((ord) => (
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
                              {ord.customerEmail && (
                                <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                  {ord.customerEmail}
                                </div>
                              )}
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
                                {ord.paymentStatus === "Paid" ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-300">
                                    ✓ Verified
                                  </span>
                                ) : ord.paymentStatus === "Failed" || !!ord.rejectionReason ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-300">
                                    ✕ Slip Rejected
                                  </span>
                                ) : ord.paymentReceipt ? (
                                  <button
                                    onClick={() => setSelectedOrderForDrawer(ord)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-300 dark:border-amber-800 hover:scale-105 transition-transform cursor-pointer animate-pulse"
                                    title="View customer payment receipt screenshot"
                                  >
                                    <ShieldCheck className="size-3 text-amber-600" /> Review Slip
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
                                {ord.transactionRef && (
                                  <div className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                                    Ref: {ord.transactionRef}
                                  </div>
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
                                {/* Verify Slip Quick Button if slip attached and pending */}
                                {ord.paymentReceipt && ord.paymentStatus !== "Paid" && (
                                  <Button
                                    onClick={() => setSelectedOrderForDrawer(ord)}
                                    className="h-8 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs transition-all hover:scale-105 gap-1"
                                    title="Open drawer to verify payment slip"
                                  >
                                    <ShieldCheck className="size-3.5" /> Verify
                                  </Button>
                                )}

                                {/* Direct State Shift Buttons */}
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
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION: INQUIRIES & PROJECT LEADS */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "inquiries" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header with Title, Tabs & Export Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#0c1813] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                      Customer Inquiries & Solar EPC Leads
                    </h3>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#ECFDF3] text-[#38B46A] border border-[#38B46A]/30">
                      <span className="size-2 rounded-full bg-[#38B46A] animate-pulse" />
                      {effectiveContactMessages.length} Inquiries Received
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Commercial solar EPC quotes, contractor requests, warranty claims, and marketing
                    audience.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      if (inquiryTab === "messages") {
                        exportInquiriesCsv(effectiveContactMessages);
                      } else {
                        exportSubscribersCsv(effectiveSubscribers);
                      }
                    }}
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-white/10 font-bold text-xs gap-1.5 h-9 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <Download className="size-3.5" /> Export{" "}
                    {inquiryTab === "messages" ? "Leads (CSV)" : "Subscribers (CSV)"}
                  </Button>
                  <Button
                    onClick={() => {
                      refetchInquiries();
                      toast.success("Inquiries synced with database");
                    }}
                    variant="outline"
                    className="rounded-xl border-[#38B46A]/40 text-[#38B46A] hover:bg-[#ECFDF3] font-bold text-xs gap-1.5 h-9 cursor-pointer"
                  >
                    <RefreshCw className="size-3.5" /> Refresh
                  </Button>
                </div>
              </div>

              {/* Sub-navigation Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInquiryTab("messages")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    inquiryTab === "messages"
                      ? "bg-[#12342B] text-white shadow-md border border-[#38B46A]/40"
                      : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50"
                  }`}
                >
                  <MessageSquare className="size-3.5" />
                  <span>Customer Messages & Solar Quotes</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${inquiryTab === "messages" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"}`}
                  >
                    {effectiveContactMessages.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryTab("subscribers")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    inquiryTab === "subscribers"
                      ? "bg-[#12342B] text-white shadow-md border border-[#38B46A]/40"
                      : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50"
                  }`}
                >
                  <Mail className="size-3.5" />
                  <span>Newsletter Audience</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${inquiryTab === "subscribers" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"}`}
                  >
                    {effectiveSubscribers.length}
                  </span>
                </button>
              </div>

              {/* TAB 1: CUSTOMER MESSAGES */}
              {inquiryTab === "messages" && (
                <div className="space-y-4">
                  {/* Search and Category Filter Toolbar */}
                  <div className="bg-white dark:bg-[#0c1813] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                      <Input
                        placeholder="Search by customer, email, phone, company, or district..."
                        value={inquirySearchQuery}
                        onChange={(e) => setInquirySearchQuery(e.target.value)}
                        className="pl-9 rounded-xl text-xs h-9"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedInquiryCategory}
                        onChange={(e) => setSelectedInquiryCategory(e.target.value)}
                        className="h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1813] text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="All">All Inquiry Categories</option>
                        <option value="Solar EPC Solutions">Solar EPC Solutions</option>
                        <option value="Wholesale / Distributor Supply">
                          Wholesale / Distribution
                        </option>
                        <option value="Residential Rooftop Solar">Residential Solar</option>
                        <option value="Lithium Battery & Inverter Storage">
                          Battery & Storage
                        </option>
                        <option value="Warranty & Support">Warranty & Support</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Messages Table */}
                  <div className="rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 font-extrabold uppercase text-slate-500 tracking-wider">
                            <th className="p-3.5">Date</th>
                            <th className="p-3.5">Customer & Organization</th>
                            <th className="p-3.5">Category & Capacity</th>
                            <th className="p-3.5">Contact Details</th>
                            <th className="p-3.5">Inquiry Summary</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                          {effectiveContactMessages.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-400">
                                No contact inquiries found.
                              </td>
                            </tr>
                          ) : (
                            effectiveContactMessages
                              .filter((m) => {
                                if (
                                  selectedInquiryCategory !== "All" &&
                                  m.inquiryType !== selectedInquiryCategory
                                )
                                  return false;
                                if (!inquirySearchQuery) return true;
                                const q = inquirySearchQuery.toLowerCase();
                                return (
                                  m.name.toLowerCase().includes(q) ||
                                  m.email.toLowerCase().includes(q) ||
                                  (m.phone && m.phone.toLowerCase().includes(q)) ||
                                  (m.company && m.company.toLowerCase().includes(q)) ||
                                  (m.district && m.district.toLowerCase().includes(q)) ||
                                  m.message.toLowerCase().includes(q)
                                );
                              })
                              .map((msg) => (
                                <tr
                                  key={msg.id}
                                  className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors"
                                >
                                  <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </td>
                                  <td className="p-3.5">
                                    <div className="font-bold text-[#173226] dark:text-white flex items-center gap-2">
                                      <span>{msg.name}</span>
                                      {msg.company && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                          {msg.company}
                                        </span>
                                      )}
                                    </div>
                                    {msg.district && (
                                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                        District: {msg.district}
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-3.5 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300">
                                      {msg.inquiryType || "General"}
                                    </span>
                                    {msg.systemSize && (
                                      <div className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
                                        Capacity: {msg.systemSize}
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-3.5">
                                    <div className="font-mono text-slate-700 dark:text-slate-200">
                                      {msg.email}
                                    </div>
                                    {msg.phone && (
                                      <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                                        {msg.phone}
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-3.5 max-w-xs">
                                    <div className="truncate text-slate-600 dark:text-slate-300">
                                      {msg.message}
                                    </div>
                                  </td>
                                  <td className="p-3.5 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setSelectedInquiryForView(msg)}
                                        className="h-8 px-2.5 rounded-lg text-xs font-bold text-[#12342B] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                                      >
                                        View Details
                                      </Button>
                                      <a
                                        href={`mailto:${msg.email}?subject=OMSUN Nepal Follow-up: ${encodeURIComponent(msg.inquiryType || "Solar Inquiry")}`}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#38B46A] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                        title="Send Email"
                                      >
                                        <Mail className="size-4" />
                                      </a>
                                      {msg.phone && (
                                        <a
                                          href={`tel:${msg.phone}`}
                                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#38B46A] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                          title="Call Customer"
                                        >
                                          <Phone className="size-4" />
                                        </a>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NEWSLETTER SUBSCRIBERS */}
              {inquiryTab === "subscribers" && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#0c1813] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Total Verified Subscribers:{" "}
                      <span className="font-bold text-[#173226] dark:text-white">
                        {effectiveSubscribers.length}
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        const emailList = effectiveSubscribers.map((s) => s.email).join(", ");
                        navigator.clipboard.writeText(emailList);
                        toast.success("All subscriber emails copied to clipboard!");
                      }}
                      className="rounded-xl bg-[#12342B] text-white text-xs font-bold h-8 px-3 gap-1.5 cursor-pointer"
                    >
                      <Copy className="size-3.5" /> Copy All Emails
                    </Button>
                  </div>

                  <div className="rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 font-extrabold uppercase text-slate-500 tracking-wider">
                          <th className="p-3.5">ID</th>
                          <th className="p-3.5">Subscriber Email</th>
                          <th className="p-3.5">Subscribed Date</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                        {effectiveSubscribers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                              No subscribers found.
                            </td>
                          </tr>
                        ) : (
                          effectiveSubscribers.map((sub, idx) => (
                            <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5">
                              <td className="p-3.5 font-mono text-slate-400">#{idx + 1}</td>
                              <td className="p-3.5 font-bold font-mono text-slate-800 dark:text-slate-100">
                                {sub.email}
                              </td>
                              <td className="p-3.5 font-mono text-slate-500">
                                {new Date(sub.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="p-3.5">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                  Active
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    navigator.clipboard.writeText(sub.email);
                                    toast.success(`Copied ${sub.email}`);
                                  }}
                                  className="h-7 px-2 text-slate-500 hover:text-[#38B46A] cursor-pointer"
                                >
                                  <Copy className="size-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 6: CLIENT ACCOUNTS & CONTRACTORS */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "customers" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header with Search, Filter & Export */}
              <div className="bg-white dark:bg-[#0c1813] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                      Registered Client Accounts & Contractors
                    </h3>
                    <p className="text-xs text-slate-500">
                      Commercial solar installers, industrial clients, and residential customers
                      across Nepal.
                    </p>
                  </div>
                  <Button
                    onClick={() => exportCustomersCsv(filteredCustomers)}
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-white/10 font-bold text-xs gap-1.5 h-9 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 shrink-0"
                  >
                    <Download className="size-3.5" /> Export Clients (CSV)
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/10">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                    <Input
                      placeholder="Search clients by name, email, phone number, or city..."
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      className="pl-9 rounded-xl text-xs h-9"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(["All", "VIP", "Active"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setCustomerStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          customerStatusFilter === st
                            ? "bg-[#12342B] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {st} Profiles
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customers Table */}
              <div className="rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 font-extrabold uppercase text-slate-500 tracking-wider">
                      <th className="p-4">Client Profile</th>
                      <th className="p-4">Contact Information</th>
                      <th className="p-4">Location / Hub</th>
                      <th className="p-4">Orders Count</th>
                      <th className="p-4">Lifetime Spend (NPR)</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                    {filteredCustomers.map((cust) => (
                      <tr
                        key={cust.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors"
                      >
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
                          <div className="text-[10px] font-mono text-slate-400">
                            {cust.phone || "No phone recorded"}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-600 dark:text-slate-300">
                          {cust.city || "Kathmandu Valley"}
                        </td>
                        <td className="p-4 font-bold">{cust.totalOrders} Orders</td>
                        <td className="p-4 font-mono font-extrabold text-[#38B46A]">
                          {formatNPR(cust.totalSpent)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                              cust.status === "VIP"
                                ? "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                            }`}
                          >
                            {cust.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setOrderQuery(cust.email || cust.name);
                              setActiveSection("orders");
                            }}
                            className="h-8 rounded-lg text-xs font-bold border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                          >
                            View Orders
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
          {/* SECTION 9: REPORTS & FINANCIAL ANALYTICS */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "reports" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                    Financial Reports & Commercial Performance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gross sales turnover, average order values, and inventory turns across Nepal
                  </p>
                </div>
                <Button
                  onClick={() => exportFinancialSummaryCsv(salesTrendData)}
                  className="h-9 rounded-xl bg-[#12342B] text-white text-xs font-extrabold gap-1.5 cursor-pointer hover:bg-[#1a4a3e] shadow-xs"
                >
                  <Download className="size-4" /> Export Report (CSV)
                </Button>
              </div>

              {/* Financial KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Gross Sales Volume
                    </span>
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-[#38B46A] dark:bg-emerald-950/40">
                      <DollarSign className="size-4" />
                    </span>
                  </div>
                  <div className="text-xl font-display font-black text-[#173226] dark:text-white">
                    {formatNPR(totalRevenue)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Across {effectiveOrders.filter((o) => o.paymentStatus === "Paid").length}{" "}
                    settled transactions
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Average Order Value
                    </span>
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                      <ShoppingBag className="size-4" />
                    </span>
                  </div>
                  <div className="text-xl font-display font-black text-[#173226] dark:text-white">
                    {formatNPR(
                      effectiveOrders.length > 0
                        ? Math.round(totalRevenue / effectiveOrders.length)
                        : 0,
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Calculated across all customer orders
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Order Fulfillment Rate
                    </span>
                    <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40">
                      <PackageCheck className="size-4" />
                    </span>
                  </div>
                  <div className="text-xl font-display font-black text-[#173226] dark:text-white">
                    {effectiveOrders.length > 0
                      ? `${Math.round((effectiveOrders.filter((o) => o.orderStatus === "Delivered").length / effectiveOrders.length) * 100)}%`
                      : "100%"}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {effectiveOrders.filter((o) => o.orderStatus === "Delivered").length} of{" "}
                    {effectiveOrders.length} orders delivered
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1813] border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Active Catalog SKUs
                    </span>
                    <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40">
                      <Boxes className="size-4" />
                    </span>
                  </div>
                  <div className="text-xl font-display font-black text-[#173226] dark:text-white">
                    {effectiveProducts.length} Items
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {lowStockCount} requiring stock replenishment
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                {/* Monthly Revenue Performance Bar Chart */}
                <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#0c1813] p-4.5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-extrabold text-base text-[#173226] dark:text-white">
                        Monthly Revenue Trend (NPR)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Monthly aggregated turnover over the past 8 reporting periods
                      </p>
                    </div>
                  </div>
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
                        <Bar dataKey="revenue" fill="#38B46A" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Revenue Distribution Donut Chart */}
                <div className="rounded-3xl bg-white dark:bg-[#0c1813] p-4.5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
                  <div>
                    <h4 className="font-display font-extrabold text-base text-[#173226] dark:text-white">
                      Sales by Category
                    </h4>
                    <p className="text-xs text-slate-500">Share of turnover by equipment type</p>
                  </div>
                  <div className="h-56 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistributionData}
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryDistributionData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#12342B",
                            borderRadius: "12px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                          formatter={(val: any) => [`${val}%`, "Share"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-white/10">
                    {categoryDistributionData.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {cat.name}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {cat.value}%
                        </span>
                      </div>
                    ))}
                  </div>
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
          {/* SECTION 11: TEAM MEMBERS */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "team" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white flex items-center gap-2">
                    <UserCheck className="size-5 text-[#38B46A]" />
                    Executive & Core Leadership Team
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage executive profiles, designations, headshots, and display ordering on the homepage.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56 sm:flex-initial">
                    <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search member or role..."
                      value={teamSearchQuery}
                      onChange={(e) => setTeamSearchQuery(e.target.value)}
                      className="pl-8 h-9 text-xs w-full rounded-xl border-slate-200 dark:border-white/10"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedTeamMemberForEdit(null);
                      setIsTeamModalOpen(true);
                    }}
                    className="h-9 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white text-xs font-extrabold gap-1.5 cursor-pointer hover:scale-105 transition-transform shrink-0"
                  >
                    <Plus className="size-4" /> Add Member
                  </Button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <UserCheck className="size-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Team Members</span>
                    <span className="text-xl font-extrabold text-[#173226] dark:text-white">{effectiveTeam.length}</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Eye className="size-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Active On Homepage</span>
                    <span className="text-xl font-extrabold text-[#173226] dark:text-white">
                      {effectiveTeam.filter((m) => m.isActive !== false).length}
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">C-Suite & Officers</span>
                    <span className="text-xl font-extrabold text-[#173226] dark:text-white">
                      {effectiveTeam.filter((m) => /ceo|cto|cfo|chief|director/i.test(m.position)).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {effectiveTeam
                  .filter((m) => {
                    if (!teamSearchQuery.trim()) return true;
                    const q = teamSearchQuery.toLowerCase();
                    return m.name.toLowerCase().includes(q) || m.position.toLowerCase().includes(q);
                  })
                  .map((member, index, filteredArr) => {
                    const isFirst = index === 0;
                    const isLast = index === filteredArr.length - 1;

                    return (
                      <div
                        key={member.id}
                        className="group relative rounded-3xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-5 hover:border-[#38B46A]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                      >
                        {/* Top: Image & Status */}
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="relative">
                              <div className="size-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/10 border-2 border-slate-200/60 dark:border-white/10 shadow-sm flex items-center justify-center">
                                {member.image ? (
                                  <img
                                    src={member.image}
                                    alt={member.name}
                                    className="size-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <span className="text-lg font-black text-slate-400">
                                    {member.name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white dark:border-[#0c1813] ${
                                  member.isActive !== false ? "bg-emerald-500" : "bg-slate-400"
                                }`}
                                title={member.isActive !== false ? "Active on Homepage" : "Hidden"}
                              />
                            </div>

                            <div className="flex flex-col items-end gap-1.5">
                              <span
                                className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border ${
                                  member.isActive !== false
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                                    : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400"
                                }`}
                              >
                                {member.isActive !== false ? "Live on Site" : "Hidden"}
                              </span>

                              {/* Order Controls */}
                              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/10 rounded-lg p-0.5">
                                <span className="text-[10px] font-mono font-bold px-1.5 text-slate-500 dark:text-slate-400">
                                  #{member.displayOrder ?? index + 1}
                                </span>
                                <button
                                  type="button"
                                  title="Move Up"
                                  disabled={isFirst}
                                  onClick={() => handleReorderTeamMember(member.id, (member.displayOrder ?? index + 1) - 1)}
                                  className="size-5 rounded flex items-center justify-center hover:bg-white dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                >
                                  <ArrowUp className="size-3" />
                                </button>
                                <button
                                  type="button"
                                  title="Move Down"
                                  disabled={isLast}
                                  onClick={() => handleReorderTeamMember(member.id, (member.displayOrder ?? index + 1) + 1)}
                                  className="size-5 rounded flex items-center justify-center hover:bg-white dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                >
                                  <ArrowDown className="size-3" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-1.5 mb-4">
                            <h4 className="font-display font-extrabold text-base text-[#173226] dark:text-white leading-tight">
                              {member.name}
                            </h4>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-[#38B46A] dark:text-emerald-400 text-xs font-bold">
                              {member.position}
                            </div>
                            {member.bio && (
                              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed pt-1">
                                {member.bio}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleTeamMemberVisibility(member.id, member.isActive !== false, member.name)}
                            className="h-8 px-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#173226] dark:hover:text-white cursor-pointer"
                          >
                            {member.isActive !== false ? (
                              <>
                                <EyeOff className="size-3.5 mr-1 text-slate-400" /> Hide
                              </>
                            ) : (
                              <>
                                <Eye className="size-3.5 mr-1 text-[#38B46A]" /> Show
                              </>
                            )}
                          </Button>

                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedTeamMemberForEdit(member);
                                setIsTeamModalOpen(true);
                              }}
                              className="h-8 px-2.5 text-xs font-bold rounded-xl border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                            >
                              <Edit className="size-3 mr-1 text-blue-500" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setMemberToDelete(member)}
                              className="h-8 px-2 text-xs font-bold rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {effectiveTeam.length === 0 && (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 space-y-3">
                  <UserCheck className="size-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">No team members listed</h4>
                  <p className="text-xs text-slate-500">
                    Add OMSUN corporate leadership, executive heads, or engineering leaders to appear on the homepage.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedTeamMemberForEdit(null);
                      setIsTeamModalOpen(true);
                    }}
                    className="h-9 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white text-xs font-extrabold gap-1 cursor-pointer"
                  >
                    <Plus className="size-4" /> Add First Member
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* SECTION 12: SETTINGS */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeSection === "settings" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#173226] dark:text-white">
                    Store Configuration & Operational Parameters
                  </h3>
                  <p className="text-xs text-slate-500">
                    Business legal entity, Nepal Inland Revenue tax credentials, and delivery
                    tariffs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      toast.info(
                        `Test notification dispatched to ${storeSettings.notificationEmail || "sales@omsunnepal.com"}`,
                      );
                      setNotificationsList((prev) => [
                        {
                          id: `test-${Date.now()}`,
                          title: "Test System Notification",
                          message:
                            "Notification channel verified operational for Kathmandu dispatch.",
                          timestamp: "Just now",
                          read: false,
                          type: "system",
                        },
                        ...prev,
                      ]);
                    }}
                    className="h-9 rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <Sparkles className="size-3.5 text-amber-500" /> Test Notification Channel
                  </Button>
                  <Button
                    onClick={() => handleSaveStoreSettings(storeSettings)}
                    className="h-9 px-4 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs cursor-pointer shadow-xs"
                  >
                    Save Store Settings
                  </Button>
                </div>
              </div>

              {/* Settings Form Cards */}
              <div className="space-y-5">
                {/* Legal & Tax Registration */}
                <div className="rounded-3xl bg-white dark:bg-[#0c1813] p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-white/10">
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#38B46A] dark:bg-emerald-950/40">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-[#173226] dark:text-white">
                        Legal Entity & Tax Credentials
                      </h4>
                      <p className="text-xs text-slate-400">
                        Official registration on Nepal Inland Revenue Department (IRD) records
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Company Registered Name
                      </label>
                      <Input
                        value={storeSettings.companyName}
                        onChange={(e) =>
                          setStoreSettings((prev: any) => ({
                            ...prev,
                            companyName: e.target.value,
                          }))
                        }
                        className="rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Nepal PAN / VAT Number
                      </label>
                      <Input
                        value={storeSettings.panVatNumber}
                        onChange={(e) =>
                          setStoreSettings((prev: any) => ({
                            ...prev,
                            panVatNumber: e.target.value,
                          }))
                        }
                        className="rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Operating Base Currency
                      </label>
                      <Input
                        value="NPR (Nepalese Rupee — रु)"
                        disabled
                        className="rounded-xl font-bold text-[#38B46A] bg-slate-50 dark:bg-white/5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Inland Revenue VAT Assessment Rate
                      </label>
                      <Input
                        value="13% (Standard Nepal VAT)"
                        disabled
                        className="rounded-xl font-mono text-xs bg-slate-50 dark:bg-white/5"
                      />
                    </div>
                  </div>
                </div>

                {/* Operations & Hub Contacts */}
                <div className="rounded-3xl bg-white dark:bg-[#0c1813] p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-white/10">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                      <Phone className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-[#173226] dark:text-white">
                        Customer Hotline & Fulfillment Center
                      </h4>
                      <p className="text-xs text-slate-400">
                        Public support channels shown on receipts, invoices, and delivery manifests
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Support Hotline / Mobile
                      </label>
                      <Input
                        value={storeSettings.supportPhone}
                        onChange={(e) =>
                          setStoreSettings((prev: any) => ({
                            ...prev,
                            supportPhone: e.target.value,
                          }))
                        }
                        className="rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Inquiry / Sales Email
                      </label>
                      <Input
                        value={storeSettings.supportEmail}
                        onChange={(e) =>
                          setStoreSettings((prev: any) => ({
                            ...prev,
                            supportEmail: e.target.value,
                          }))
                        }
                        className="rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Central Distribution Warehouse Address
                      </label>
                      <Input
                        value={storeSettings.hubAddress}
                        onChange={(e) =>
                          setStoreSettings((prev: any) => ({ ...prev, hubAddress: e.target.value }))
                        }
                        className="rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Logistics & Payment Configuration */}
                <div className="rounded-3xl bg-white dark:bg-[#0c1813] p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-white/10">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40">
                      <Truck className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-[#173226] dark:text-white">
                        Delivery Logistics & Payment Gateway
                      </h4>
                      <p className="text-xs text-slate-400">
                        Default shipping tariffs applied at checkout and Fonepay integration ID
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Kathmandu Valley Delivery Fee (NPR)
                      </label>
                      <Input
                        type="number"
                        value={storeSettings.valleyDeliveryFee}
                        onChange={(e) =>
                          setStoreSettings((prev: any) => ({
                            ...prev,
                            valleyDeliveryFee: Number(e.target.value),
                          }))
                        }
                        className="rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Outside Valley Freight Tariff (NPR)
                      </label>
                      <Input
                        type="number"
                        value={storeSettings.outsideValleyDeliveryFee}
                        onChange={(e) =>
                          setStoreSettings((prev: any) => ({
                            ...prev,
                            outsideValleyDeliveryFee: Number(e.target.value),
                          }))
                        }
                        className="rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#173226] dark:text-slate-200">
                        Fonepay Merchant ID
                      </label>
                      <Input
                        value={storeSettings.fonepayMerchantId}
                        onChange={(e) =>
                          setStoreSettings((prev: any) => ({
                            ...prev,
                            fonepayMerchantId: e.target.value,
                          }))
                        }
                        className="rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="font-bold text-[#173226] dark:text-slate-200">
                      Automated Order & Inbound Quote Alert Email
                    </label>
                    <Input
                      value={storeSettings.notificationEmail}
                      onChange={(e) =>
                        setStoreSettings((prev: any) => ({
                          ...prev,
                          notificationEmail: e.target.value,
                        }))
                      }
                      placeholder="alerts@omsunnepal.com"
                      className="rounded-xl text-xs"
                    />
                    <p className="text-[11px] text-slate-400">
                      Receives instant notification upon customer checkout, payment slip upload, or
                      solar sizing request.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => handleSaveStoreSettings(storeSettings)}
                    className="h-10 px-6 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs cursor-pointer shadow-xs hover:scale-105 transition-transform"
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
        onVerifyPayment={handleVerifyPayment}
        onUpdateDelivery={handleUpdateDelivery}
        onDeleteOrder={handleDeleteOrder}
      />

      {/* Product Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={selectedProductForEdit}
        initialCategory={targetCategoryForAdd}
        initialSubcategory={targetSubcategoryForAdd}
        onSaveProduct={handleSaveProduct}
      />

      {/* Stock Edit Modal */}
      <StockEditModal
        product={selectedStockProduct}
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onUpdateStock={handleUpdateStock}
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
          } catch (err: any) {
            setBannersList((prev) =>
              prev.some((b) => b.id === ban.id)
                ? prev.map((b) => (b.id === ban.id ? ban : b))
                : [ban, ...prev],
            );
            toast.warning(`Notice: ${err?.message || "Banner updated in session cache"}`);
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
          } catch (err: any) {
            setPartnersList((prev) => [prt, ...prev]);
            toast.warning(`Notice: ${err?.message || "Partner updated in session cache"}`);
          }
        }}
      />

      {/* Inquiry Detail Dialog */}
      <Dialog
        open={!!selectedInquiryForView}
        onOpenChange={(open) => {
          if (!open) setSelectedInquiryForView(null);
        }}
      >
        <DialogContent className="max-w-xl rounded-3xl p-6 bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                {selectedInquiryForView?.inquiryType || "Solar Inquiry"}
              </span>
              <span className="text-xs text-slate-400">
                {selectedInquiryForView?.createdAt
                  ? new Date(selectedInquiryForView.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : ""}
              </span>
            </div>
            <DialogTitle className="text-xl font-display font-black text-[#173226] dark:text-white">
              {selectedInquiryForView?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Customer inquiry and commercial project requirements received via OMSUN portal.
            </DialogDescription>
          </DialogHeader>

          {selectedInquiryForView && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedInquiryForView.email}`}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {selectedInquiryForView.email}
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Phone Number
                  </span>
                  {selectedInquiryForView.phone ? (
                    <a
                      href={`tel:${selectedInquiryForView.phone}`}
                      className="font-medium text-[#38B46A] hover:underline"
                    >
                      {selectedInquiryForView.phone}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Not provided</span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    District / Location
                  </span>
                  <span className="font-bold text-[#173226] dark:text-white">
                    {selectedInquiryForView.district || "Kathmandu Valley"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    System Size / Scope
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">
                    {selectedInquiryForView.systemSize || "Not specified"}
                  </span>
                </div>
                {selectedInquiryForView.company && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Company / Organization
                    </span>
                    <span className="font-bold text-[#173226] dark:text-white">
                      {selectedInquiryForView.company}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Customer Message / Specifications
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-xs leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                  {selectedInquiryForView.message}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                {selectedInquiryForView.phone && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      window.location.href = `tel:${selectedInquiryForView.phone}`;
                    }}
                    className="rounded-xl text-xs font-bold gap-1.5 cursor-pointer"
                  >
                    <Phone className="size-3.5 text-[#38B46A]" /> Call Client
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => {
                    window.location.href = `mailto:${selectedInquiryForView.email}?subject=Re:%20OMSUN%20Inquiry%20#${selectedInquiryForView.id}%20-%20${encodeURIComponent(selectedInquiryForView.inquiryType || "Solar Solution")}`;
                  }}
                  className="rounded-xl bg-[#12342B] hover:bg-[#1a4a3e] text-white text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <Mail className="size-3.5" /> Reply by Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Team Member Form / Edit Modal */}
      <TeamMemberModal
        isOpen={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false);
          setSelectedTeamMemberForEdit(null);
        }}
        memberToEdit={selectedTeamMemberForEdit}
        onSaveMember={handleSaveTeamMember}
      />

      {/* Delete Team Member Dialog */}
      <Dialog
        open={!!memberToDelete}
        onOpenChange={(open) => {
          if (!open) setMemberToDelete(null);
        }}
      >
        <DialogContent className="max-w-md w-[94vw] sm:w-full rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0c1813] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-display font-bold text-rose-600 flex items-center gap-2">
              <Trash2 className="size-5" />
              Remove Team Member?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 pt-1">
              Are you sure you want to remove{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                "{memberToDelete?.name}"
              </span>{" "}
              ({memberToDelete?.position}) from OMSUN leadership? This will remove them from the website and admin database.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMemberToDelete(null)}
              className="rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (memberToDelete) {
                  handleDeleteTeamMember(memberToDelete.id, memberToDelete.name);
                }
              }}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
            >
              Confirm Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
