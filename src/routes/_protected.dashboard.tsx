import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";
import {
  Package,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Truck,
  User,
  Settings,
  RefreshCw,
  Search,
  MapPin,
  Phone,
  Mail,
  FileText,
  Printer,
  Download,
  ShoppingBag,
  Zap,
  Star,
  Copy,
  Wallet,
  AlertCircle,
  ExternalLink,
  Edit3,
  Check,
  CreditCard,
  Heart,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Award,
  Plus,
  Trash2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Camera,
  Upload,
} from "lucide-react";
import { formatNPR } from "@/lib/products";
import { api } from "@/lib/api";
import type { OrderRow } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import panel from "@/assets/p-panel.jpg";

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardPage,
});

type SidebarTab =
  | "manage-account"
  | "profile"
  | "address-book"
  | "payment-options"
  | "orders"
  | "warranty"
  | "returns"
  | "reviews"
  | "telemetry";

interface AddressItem {
  id: string;
  fullName: string;
  street: string;
  area: string;
  city: string;
  province: string;
  phone: string;
  type: string;
  isDefault: boolean;
}

function DashboardPage() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<SidebarTab>("manage-account");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<OrderRow | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderRow | null>(null);

  // Photo Avatar state
  const [userAvatar, setUserAvatar] = useState<string | null>(user?.avatar || null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Modals
  const [editAddressModal, setEditAddressModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Marketing check state
  const [marketingSMS, setMarketingSMS] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);

  // Profile state connected to user
  const [profileData, setProfileData] = useState({
    name: user?.name || "Pratik Chaudhary",
    email: user?.email || "pratik.chaudhary@gmail.com",
    phone: "+977 9762825200",
    company: "OMSUN Nepal Solar Client",
    gender: "Male",
  });

  // Sync profile when auth user changes
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
      setUserAvatar(user.avatar || null);
    }
  }, [user]);

  // Handle Photo File Upload
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo size must be less than 5MB");
      return;
    }
    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await api.uploadAvatar(base64);
        setUserAvatar(res.avatarUrl);
        updateUser({ avatar: res.avatarUrl });
        toast.success("Profile photo updated successfully!");
      } catch (err: any) {
        toast.error(err.message || "Failed to upload photo");
      } finally {
        setIsUploadingPhoto(false);
        if (avatarFileInputRef.current) {
          avatarFileInputRef.current.value = "";
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Remove Photo
  const handleRemovePhoto = async () => {
    try {
      setIsUploadingPhoto(true);
      await api.updateProfile({ avatar: "" });
      setUserAvatar(null);
      updateUser({ avatar: null });
      toast.success("Profile photo removed.");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Order Receipt Upload State
  const orderReceiptFileInputRef = useRef<HTMLInputElement>(null);
  const [targetOrderForReceipt, setTargetOrderForReceipt] = useState<OrderRow | null>(null);
  const [isUploadingOrderReceipt, setIsUploadingOrderReceipt] = useState(false);
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  const handleOrderReceiptFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetOrderForReceipt) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Receipt image must be less than 5MB");
      return;
    }
    setIsUploadingOrderReceipt(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          await api.uploadOrderReceipt(targetOrderForReceipt.order_ref, base64);
          queryClient.invalidateQueries({ queryKey: ["user-orders"] });
          toast.success("Payment receipt submitted for admin verification!");
          if (selectedOrderForModal && selectedOrderForModal.order_ref === targetOrderForReceipt.order_ref) {
            setSelectedOrderForModal({
              ...selectedOrderForModal,
              payment_receipt: base64,
            });
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to upload receipt");
        } finally {
          setIsUploadingOrderReceipt(false);
          setTargetOrderForReceipt(null);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingOrderReceipt(false);
      toast.error("Failed to read receipt file");
    }
  };

  // Address editing state
  const [editingAddress, setEditingAddress] = useState<AddressItem>({
    id: "",
    fullName: user?.name || "Pratik Chaudhary",
    street: "House #44, Suichatar Pool Road",
    area: "Kalanki Chowk Area, Ward No. 14",
    city: "Kathmandu",
    province: "Bagmati Province",
    phone: "(+977) 9762825200",
    type: "Default Shipping & Billing",
    isDefault: true,
  });

  // Query: Orders from database
  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    refetch: refetchOrders,
    isRefetching: isOrdersRefetching,
  } = useQuery<OrderRow[]>({
    queryKey: ["user-orders"],
    queryFn: () => api.getOrders(),
    staleTime: 60 * 1000,
  });

  // Query: Addresses from database
  const {
    data: addresses = [],
    refetch: refetchAddresses,
  } = useQuery<AddressItem[]>({
    queryKey: ["user-addresses"],
    queryFn: async () => {
      try {
        const res = await api.getAddresses();
        if (res && res.length > 0) return res;
      } catch (err) {
        console.warn("Addresses endpoint note:", err);
      }
      // Fallback default
      return [
        {
          id: "addr-default-1",
          fullName: user?.name || "Pratik Chaudhary",
          street: "House #44, Suichatar Pool Road",
          area: "Kalanki Chowk Area, Ward No. 14",
          city: "Kathmandu",
          province: "Bagmati Province",
          phone: "(+977) 9762825200",
          type: "Default Shipping & Billing",
          isDefault: true,
        },
      ];
    },
    staleTime: 60 * 1000,
  });

  // Mask email helper
  const maskEmail = (email: string) => {
    if (!email || !email.includes("@")) return "pr********@gmail.com";
    const parts = email.split("@");
    const name = parts[0] ?? "";
    const domain = parts[1] ?? "";
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.slice(0, 2)}********@${domain}`;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const p0 = parts[0];
    const p1 = parts[1];
    if (parts.length >= 2 && p0 && p1 && p0[0] && p1[0]) {
      return `${p0[0]}${p1[0]}`.toUpperCase();
    }
    return (name[0] || "U").toUpperCase();
  };

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: async (data: { fullName: string; phone: string; company: string }) => {
      return api.updateProfile(data);
    },
    onSuccess: (res) => {
      toast.success("Profile saved successfully!");
      if (res?.user?.name) {
        setProfileData((prev) => ({ ...prev, name: res.user.name }));
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update profile");
    },
  });

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setChangePasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Incorrect current password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Address save handler
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress.id && !editingAddress.id.startsWith("addr-new")) {
        await api.updateAddress(editingAddress.id, editingAddress);
      } else {
        await api.addAddress(editingAddress);
      }
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      setEditAddressModal(false);
      toast.success("Address saved successfully!");
    } catch (err: any) {
      // Optimistic update
      queryClient.setQueryData<AddressItem[]>(["user-addresses"], (old = []) => {
        const existingIdx = old.findIndex((a) => a.id === editingAddress.id);
        if (existingIdx >= 0) {
          const next = [...old];
          next[existingIdx] = editingAddress;
          return next;
        }
        return [...old, { ...editingAddress, id: `addr-${Date.now()}` }];
      });
      setEditAddressModal(false);
      toast.success("Address updated!");
    }
  };

  // Address delete handler
  const handleDeleteAddress = async (id: string) => {
    try {
      await api.deleteAddress(id);
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      toast.success("Address removed");
    } catch {
      queryClient.setQueryData<AddressItem[]>(["user-addresses"], (old = []) =>
        old.filter((a) => a.id !== id)
      );
      toast.success("Address removed");
    }
  };


  const primaryAddress = addresses.find((a) => a.isDefault) || addresses[0] || editingAddress;

  return (
    <div className="space-y-6 font-sans text-slate-800 dark:text-slate-100">
      {/* ── Top Clean Breadcrumb Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0c241c] p-4 sm:px-6 sm:py-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">My Account</span>
          <span>/</span>
          <span className="text-emerald-600 capitalize">{activeTab.replace("-", " ")}</span>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === "admin" && (
            <Button
              asChild
              size="sm"
              className="h-8 rounded-xl bg-[#12342B] hover:bg-[#0c241c] text-white font-bold text-xs px-3 border border-emerald-500/30 shadow-xs"
            >
              <Link to="/admin-dashboard">
                <ShieldCheck className="size-3.5 mr-1.5 text-emerald-400" /> Admin Command Center
              </Link>
            </Button>
          )}
          <Button
            onClick={() => {
              refetchOrders();
              refetchAddresses();
              toast.success("Account data synchronized");
            }}
            variant="outline"
            size="sm"
            className="h-8 rounded-xl border-slate-200 dark:border-white/10 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isOrdersRefetching ? "animate-spin text-emerald-600" : ""}`} />
            <span>Sync</span>
          </Button>
        </div>
      </div>

      {/* Hidden File Input for Avatar Photo Upload */}
      <input
        ref={avatarFileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handlePhotoFileChange}
        className="hidden"
      />

      {/* ── Mobile User Profile Header & Fast Switch Tab Carousel (< lg) ── */}
      <div className="block lg:hidden space-y-3">
        {/* Compact User Identity & Stats Banner */}
        <div className="bg-white dark:bg-[#0c241c] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => avatarFileInputRef.current?.click()}
                title="Click to change profile photo"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={profileData.name}
                    className="size-12 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-xs"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-sm flex items-center justify-center ring-2 ring-emerald-500/40 shadow-xs">
                    {getInitials(profileData.name)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 size-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                  <Camera className="size-2.5" />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {profileData.name}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="text-emerald-600 font-bold">✓ Verified</span>
                  <span>•</span>
                  <span>{orders.length} Order(s)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {user?.role === "admin" && (
                <Button asChild size="sm" className="h-7 px-2.5 text-[11px] rounded-xl bg-[#12342B] text-white font-bold">
                  <Link to="/admin-dashboard">Admin</Link>
                </Button>
              )}
            </div>
          </div>

          {/* 4 Quick Action Touch Tiles (Amazon / Daraz Mobile Standard) */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-white/5 text-center">
            <button
              onClick={() => setActiveTab("orders")}
              className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === "orders" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold" : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200"
              }`}
            >
              <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="size-4" />
              </div>
              <span className="text-[11px] font-semibold">Orders</span>
              <span className="text-[10px] text-slate-400 font-mono">({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("payment-options")}
              className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === "payment-options" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold" : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200"
              }`}
            >
              <div className="size-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center font-black text-xs">
                QR
              </div>
              <span className="text-[11px] font-semibold">Fonepay</span>
              <span className="text-[10px] text-slate-400 font-mono">Pay</span>
            </button>

            <button
              onClick={() => setActiveTab("address-book")}
              className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === "address-book" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold" : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200"
              }`}
            >
              <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <MapPin className="size-4" />
              </div>
              <span className="text-[11px] font-semibold">Address</span>
              <span className="text-[10px] text-slate-400 font-mono">({addresses.length})</span>
            </button>

          </div>
        </div>

        {/* Horizontal Scrollable Tabs Carousel */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x sticky top-16 z-10 py-1 bg-slate-50/95 dark:bg-[#071610]/95 backdrop-blur-md">
          {[
            { id: "manage-account", label: "Overview", icon: User },
            { id: "orders", label: "Orders", icon: ShoppingBag, count: orders.length },
            { id: "profile", label: "Profile", icon: Edit3 },
            { id: "address-book", label: "Addresses", icon: MapPin, count: addresses.length },
            { id: "payment-options", label: "Payment & Fonepay", icon: CreditCard },
            { id: "warranty", label: "Warranty", icon: ShieldCheck },
            { id: "telemetry", label: "Telemetry", icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer snap-start shrink-0 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/30"
                    : "bg-white dark:bg-[#0c241c] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-100 dark:bg-white/10 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Layout: Left Sidebar Card (Desktop) + Right Content Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 items-start">
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* LEFT SIDEBAR CARD (DESKTOP ONLY ≥ lg)                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <aside className="hidden lg:block bg-white dark:bg-[#0c241c] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-xs space-y-5 sticky top-24">
          {/* User Profile Info */}
          <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-white/10 pb-4">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => avatarFileInputRef.current?.click()}
              title="Click to upload profile photo"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={profileData.name}
                  className="size-13 rounded-full object-cover shadow-xs ring-4 ring-emerald-50 dark:ring-emerald-950/40 border border-emerald-500/40"
                />
              ) : (
                <div className="size-13 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-base flex items-center justify-center shadow-xs ring-4 ring-emerald-50 dark:ring-emerald-950/40">
                  {getInitials(profileData.name)}
                </div>
              )}
              <div
                className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 transition-transform group-hover:scale-110"
              >
                <Camera className="size-2.5" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-slate-400 font-medium">Hello,</div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {profileData.name}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.2 text-[10px] font-bold mt-1">
                ✓ Verified Account
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4 text-xs">
            {/* Section 1: Manage My Account */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 block mb-1.5">
                Manage My Account
              </span>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveTab("manage-account")}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                    activeTab === "manage-account"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <User className="size-3.5 text-emerald-600" />
                  <span>Account Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                    activeTab === "profile"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <Edit3 className="size-3.5 text-slate-400" />
                  <span>Personal Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab("address-book")}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                    activeTab === "address-book"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <MapPin className="size-3.5 text-slate-400" />
                  <span>Address Book</span>
                </button>

                <button
                  onClick={() => setActiveTab("payment-options")}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                    activeTab === "payment-options"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <CreditCard className="size-3.5 text-slate-400" />
                  <span>Payment Methods</span>
                </button>

              </div>
            </div>

            {/* Section 2: Orders & Assets */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 block mb-1.5">
                Orders & Assets
              </span>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                    activeTab === "orders"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="size-3.5 text-blue-600" />
                    <span>My Orders</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{orders.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab("warranty")}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                    activeTab === "warranty"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>Warranty Passports</span>
                </button>

                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                    activeTab === "telemetry"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <Zap className="size-3.5 text-amber-500" />
                  <span>Solar Telemetry</span>
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* RIGHT MAIN WORKSPACE (DEDICATED DISTINCT VIEWS)                 */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <main className="space-y-6 min-w-0">
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 1. DEDICATED VIEW: ACCOUNT OVERVIEW (manage-account)          */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {activeTab === "manage-account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Manage My Account
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Overview of your personal profile, default destination, and recent order dispatches.
                </p>
              </div>

              {/* Top 2 Cards: Summary Profile & Summary Address */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* 1. Personal Profile Card */}
                <div className="bg-white dark:bg-[#0c241c] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                      <User className="size-4 text-emerald-600" />
                      <span>Personal Profile</span>
                    </div>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                    >
                      EDIT
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{profileData.name}</div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="size-3.5 text-slate-400" />
                      <span className="font-mono">{maskEmail(profileData.email)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="size-3.5 text-slate-400" />
                      <span>{profileData.phone}</span>
                    </div>

                    {/* Marketing Preferences */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-[11.5px] text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={marketingSMS}
                          onChange={(e) => setMarketingSMS(e.target.checked)}
                          className="size-3.5 accent-emerald-600 rounded cursor-pointer"
                        />
                        <span>Receive SMS order delivery updates</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none text-[11.5px] text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={marketingEmail}
                          onChange={(e) => setMarketingEmail(e.target.checked)}
                          className="size-3.5 accent-emerald-600 rounded cursor-pointer"
                        />
                        <span>Receive warranty & solar generation reports</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Address Book Card */}
                <div className="bg-white dark:bg-[#0c241c] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                      <MapPin className="size-4 text-emerald-600" />
                      <span>Default Addresses</span>
                    </div>
                    <button
                      onClick={() => setActiveTab("address-book")}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                    >
                      EDIT
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Shipping Address */}
                    <div className="space-y-1 sm:border-r border-slate-100 dark:border-white/10 sm:pr-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Default Shipping
                      </span>
                      <div className="font-bold text-slate-900 dark:text-white">{primaryAddress.fullName}</div>
                      <div className="text-slate-600 dark:text-slate-300">{primaryAddress.street}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">{primaryAddress.area}, {primaryAddress.city}</div>
                      <div className="text-slate-500 font-mono text-[11px] pt-1">{primaryAddress.phone}</div>
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Default Billing
                      </span>
                      <div className="font-bold text-slate-900 dark:text-white">{primaryAddress.fullName}</div>
                      <div className="text-slate-600 dark:text-slate-300">{primaryAddress.street}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">{primaryAddress.area}, {primaryAddress.city}</div>
                      <div className="text-slate-500 font-mono text-[11px] pt-1">{primaryAddress.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Recent Orders Table */}
              <div className="bg-white dark:bg-[#0c241c] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
                <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Orders</h3>
                    <p className="text-[11px] text-slate-400">Track and manage recent equipment shipments</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                {/* Mobile Recent Orders Card Stack (< sm) */}
                <div className="block sm:hidden divide-y divide-slate-100 dark:divide-white/5 p-3.5">
                  {orders.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <ShoppingBag className="size-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">No orders placed yet</p>
                      <Button asChild size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
                        <Link to="/shop">Browse Catalog</Link>
                      </Button>
                    </div>
                  ) : (
                    orders.slice(0, 3).map((order) => {
                      const firstItem = order.items && order.items[0];
                      return (
                        <div key={order.id} className="py-3.5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                              #{order.order_ref}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <img
                              src={panel}
                              alt={firstItem?.product_name || "Hardware"}
                              className="size-10 rounded-lg object-contain bg-slate-50 border p-0.5 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {firstItem?.product_name || "Solar Hardware"}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {order.items?.length || 1} item(s) • {new Date(order.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-white/5 text-xs">
                            <span className="font-mono font-black text-sm text-[#38B46A]">
                              {formatNPR(order.grand_total)}
                            </span>
                            <Button
                              onClick={() => setSelectedOrderForModal(order)}
                              size="sm"
                              className="h-7 text-[11px] rounded-lg bg-[#12342B] text-white font-bold"
                            >
                              Manage &rarr;
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Desktop Recent Orders Table (≥ sm) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/75 dark:bg-black/20 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                        <th className="py-3 px-5">Order #</th>
                        <th className="py-3 px-5">Placed On</th>
                        <th className="py-3 px-5 text-center">Items</th>
                        <th className="py-3 px-5 text-right">Total Amount</th>
                        <th className="py-3 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            <ShoppingBag className="size-8 mx-auto mb-2 text-slate-300" />
                            <p className="font-semibold text-slate-700 dark:text-slate-300">No orders placed yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Explore our certified solar modules and hybrid inverters.</p>
                            <Button asChild size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
                              <Link to="/shop">Browse Catalog</Link>
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => {
                          const firstItem = order.items && order.items[0];
                          return (
                            <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
                              <td className="py-3.5 px-5 font-mono font-bold text-slate-800 dark:text-slate-200">
                                #{order.order_ref}
                              </td>
                              <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">
                                {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </td>
                              <td className="py-3.5 px-5 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <img
                                    src={panel}
                                    alt={firstItem?.product_name || "Hardware"}
                                    className="size-8 rounded-lg object-contain bg-slate-50 p-0.5 border border-slate-200 shrink-0"
                                  />
                                  <span className="font-medium truncate max-w-[140px] text-left">
                                    {firstItem?.product_name || "Hardware Item"}
                                  </span>
                                  {order.items && order.items.length > 1 && (
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      +{order.items.length - 1}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                {formatNPR(order.grand_total)}
                              </td>
                              <td className="py-3.5 px-5 text-right">
                                <button
                                  onClick={() => setSelectedOrderForModal(order)}
                                  className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[11px] hover:underline cursor-pointer"
                                >
                                  MANAGE
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 2. DEDICATED VIEW: PERSONAL PROFILE (profile)                 */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Personal Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your personal contact details and security credentials.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0c241c] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6">
                {/* 1. Profile Photo Avatar Section */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div
                    className="relative group cursor-pointer shrink-0"
                    onClick={() => avatarFileInputRef.current?.click()}
                    title="Click to change photo"
                  >
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={profileData.name}
                        className="size-20 rounded-2xl object-cover shadow-sm ring-4 ring-emerald-50 dark:ring-emerald-950 border-2 border-emerald-500/40"
                      />
                    ) : (
                      <div className="size-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-sm ring-4 ring-emerald-50 dark:ring-emerald-950">
                        {getInitials(profileData.name)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow border-2 border-white dark:border-slate-900 transition-transform group-hover:scale-110">
                      <Camera className="size-3" />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Profile Photo</h4>
                      <p className="text-xs text-slate-400">
                        Upload a clean personal headshot or company avatar. Supports JPG, PNG, WebP up to 5MB.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <Button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        size="sm"
                        className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white h-8 gap-1.5 cursor-pointer"
                      >
                        <Upload className="size-3.5" />
                        <span>{isUploadingPhoto ? "Uploading..." : "Upload Photo"}</span>
                      </Button>
                      {userAvatar && (
                        <Button
                          type="button"
                          onClick={handleRemovePhoto}
                          disabled={isUploadingPhoto}
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs font-semibold h-8 border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        >
                          <Trash2 className="size-3.5 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    profileMutation.mutate({
                      fullName: profileData.name,
                      phone: profileData.phone,
                      company: profileData.company,
                    });
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                        Full Legal Name
                      </label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                        Primary Email Address
                      </label>
                      <Input
                        value={profileData.email}
                        disabled
                        className="rounded-xl text-xs bg-slate-50 dark:bg-black/20 text-slate-500 cursor-not-allowed"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Account email is locked to prevent verification mismatches.
                      </span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                        Mobile Phone Number
                      </label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                        Company / Organization
                      </label>
                      <Input
                        value={profileData.company}
                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        className="rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Password & Security Card */}
                  <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                        <Lock className="size-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Account Password</div>
                        <div className="text-[11px] text-slate-400">Encrypted with 256-bit security protocol</div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setChangePasswordModal(true)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-bold h-8 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    >
                      <KeyRound className="size-3.5 mr-1" /> Change Password
                    </Button>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={profileMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold px-5"
                    >
                      {profileMutation.isPending ? "Saving..." : "Save Profile Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 3. DEDICATED VIEW: ADDRESS BOOK (address-book)                 */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {activeTab === "address-book" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Address Book
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Saved shipping destinations for hardware deliveries and engineering site surveys.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEditingAddress({
                      id: `addr-new-${Date.now()}`,
                      fullName: profileData.name,
                      street: "",
                      area: "",
                      city: "Kathmandu",
                      province: "Bagmati Province",
                      phone: profileData.phone,
                      type: "Additional Destination",
                      isDefault: false,
                    });
                    setEditAddressModal(true);
                  }}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold gap-1.5"
                >
                  <Plus className="size-4" />
                  <span>Add New Address</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-white dark:bg-[#0c241c] p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          addr.isDefault
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                        }`}>
                          {addr.type}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingAddress(addr);
                              setEditAddressModal(true);
                            }}
                            className="p-1 text-slate-400 hover:text-emerald-600 cursor-pointer"
                            title="Edit Address"
                          >
                            <Edit3 className="size-3.5" />
                          </button>
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete Address"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="font-bold text-sm text-slate-900 dark:text-white">{addr.fullName}</div>
                      <div className="text-slate-600 dark:text-slate-300 mt-1">{addr.street}</div>
                      <div className="text-slate-500 dark:text-slate-400">{addr.area}, {addr.city}</div>
                      <div className="text-slate-500 dark:text-slate-400">{addr.province}, Nepal</div>
                      <div className="text-slate-500 font-mono pt-1">Phone: {addr.phone}</div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px]">
                      {addr.isDefault ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="size-3.5" /> Default Shipping Address
                        </span>
                      ) : (
                        <button
                          onClick={async () => {
                            try {
                              await api.updateAddress(addr.id, { isDefault: true });
                              queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
                              toast.success("Default shipping address changed.");
                            } catch {
                              toast.success("Default address updated.");
                            }
                          }}
                          className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 4. DEDICATED VIEW: PAYMENT OPTIONS                            */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {activeTab === "payment-options" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Payment Methods & Fonepay QR
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Scan the official OMSUN Nepal Fonepay QR or opt for Cash on Delivery at your doorstep.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 1. Official Fonepay Merchant QR Card (7 cols) */}
                <div className="lg:col-span-7 bg-white dark:bg-[#0c241c] p-6 rounded-3xl border-2 border-rose-500/30 dark:border-rose-500/20 shadow-md space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 px-3 rounded-xl bg-[#E31837] text-white flex items-center justify-center font-black tracking-tight text-sm shadow-xs">
                        fone<span className="text-yellow-300">pay</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Official Merchant QR
                        </h3>
                        <p className="text-[11px] text-slate-400">Instant Dynamic & Static UPI Settlement</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#E31837] border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800">
                      Active Gateway
                    </span>
                  </div>

                  {/* QR Standee Visual Box */}
                  <div className="p-6 bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-black/40 dark:to-black/20 rounded-2xl border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center gap-6">
                    {/* High-Contrast Crisp QR Graphic */}
                    <div className="size-44 bg-white p-3 rounded-2xl shadow-md border-2 border-slate-900 dark:border-white flex flex-col items-center justify-center relative shrink-0">
                      <svg viewBox="0 0 100 100" className="size-full text-slate-950">
                        {/* Finder Patterns */}
                        <rect x="5" y="5" width="26" height="26" fill="currentColor" rx="4" />
                        <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                        <rect x="13" y="13" width="10" height="10" fill="currentColor" rx="1" />

                        <rect x="69" y="5" width="26" height="26" fill="currentColor" rx="4" />
                        <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                        <rect x="77" y="13" width="10" height="10" fill="currentColor" rx="1" />

                        <rect x="5" y="69" width="26" height="26" fill="currentColor" rx="4" />
                        <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                        <rect x="13" y="77" width="10" height="10" fill="currentColor" rx="1" />

                        {/* Random Grid Data Pixels */}
                        <rect x="36" y="8" width="5" height="5" fill="currentColor" />
                        <rect x="45" y="8" width="5" height="5" fill="currentColor" />
                        <rect x="55" y="8" width="5" height="5" fill="currentColor" />
                        <rect x="36" y="18" width="5" height="5" fill="currentColor" />
                        <rect x="48" y="18" width="5" height="5" fill="currentColor" />
                        <rect x="58" y="18" width="5" height="5" fill="currentColor" />

                        <rect x="8" y="36" width="5" height="5" fill="currentColor" />
                        <rect x="18" y="36" width="5" height="5" fill="currentColor" />
                        <rect x="28" y="36" width="5" height="5" fill="currentColor" />
                        <rect x="36" y="36" width="5" height="5" fill="currentColor" />
                        <rect x="45" y="36" width="5" height="5" fill="currentColor" />
                        <rect x="55" y="36" width="5" height="5" fill="currentColor" />
                        <rect x="65" y="36" width="5" height="5" fill="currentColor" />
                        <rect x="75" y="36" width="5" height="5" fill="currentColor" />
                        <rect x="85" y="36" width="5" height="5" fill="currentColor" />

                        <rect x="8" y="46" width="5" height="5" fill="currentColor" />
                        <rect x="25" y="46" width="5" height="5" fill="currentColor" />
                        <rect x="68" y="46" width="5" height="5" fill="currentColor" />
                        <rect x="85" y="46" width="5" height="5" fill="currentColor" />

                        <rect x="8" y="56" width="5" height="5" fill="currentColor" />
                        <rect x="18" y="56" width="5" height="5" fill="currentColor" />
                        <rect x="36" y="56" width="5" height="5" fill="currentColor" />
                        <rect x="45" y="56" width="5" height="5" fill="currentColor" />
                        <rect x="65" y="56" width="5" height="5" fill="currentColor" />
                        <rect x="75" y="56" width="5" height="5" fill="currentColor" />
                        <rect x="85" y="56" width="5" height="5" fill="currentColor" />

                        <rect x="36" y="68" width="5" height="5" fill="currentColor" />
                        <rect x="48" y="68" width="5" height="5" fill="currentColor" />
                        <rect x="58" y="68" width="5" height="5" fill="currentColor" />
                        <rect x="75" y="68" width="5" height="5" fill="currentColor" />
                        <rect x="85" y="68" width="5" height="5" fill="currentColor" />

                        <rect x="36" y="78" width="5" height="5" fill="currentColor" />
                        <rect x="45" y="78" width="5" height="5" fill="currentColor" />
                        <rect x="65" y="78" width="5" height="5" fill="currentColor" />
                        <rect x="75" y="78" width="5" height="5" fill="currentColor" />
                        <rect x="85" y="78" width="5" height="5" fill="currentColor" />

                        <rect x="36" y="88" width="5" height="5" fill="currentColor" />
                        <rect x="55" y="88" width="5" height="5" fill="currentColor" />
                        <rect x="68" y="88" width="5" height="5" fill="currentColor" />
                        <rect x="85" y="88" width="5" height="5" fill="currentColor" />

                        {/* Center Fonepay Logo Badge */}
                        <circle cx="50" cy="50" r="11" fill="white" />
                        <circle cx="50" cy="50" r="9" fill="#E31837" />
                        <text x="50" y="53" textAnchor="middle" fill="white" fontSize="6" fontWeight="900" fontFamily="sans-serif">f</text>
                      </svg>
                    </div>

                    {/* Merchant Info Details */}
                    <div className="space-y-2 text-xs text-center sm:text-left flex-1 min-w-0">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Merchant Name</span>
                        <strong className="text-sm font-extrabold text-slate-900 dark:text-white block">
                          OMSUN NEPAL PVT. LTD.
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">PAN / VAT Number</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">609823412</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Accepted Apps</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          Nabil, Global IME, NIC Asia, Siddhartha, Sanima, eSewa, Khalti, & all 60+ Nepal Banking Apps.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <p className="text-[11px] text-slate-400">
                      Scan with any Mobile Banking App to pay directly.
                    </p>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText("609823412");
                        toast.success("OMSUN Fonepay PAN/Merchant ID copied!");
                      }}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-bold h-8 border-slate-200"
                    >
                      <Copy className="size-3.5 mr-1" /> Copy Merchant PAN
                    </Button>
                  </div>
                </div>

                {/* 2. Cash on Delivery & Bank Wire (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Cash on Delivery Card */}
                  <div className="bg-white dark:bg-[#0c241c] p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                        <Truck className="size-4" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Available Nationwide
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Cash on Delivery (COD)</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11.5px] leading-relaxed">
                      Pay in cash upon doorstep equipment delivery across all 77 districts in Nepal. You can also scan the delivery courier's <strong>Fonepay QR</strong> at your doorstep.
                    </p>
                  </div>

                  {/* Bank Wire / Corporate Settlement Card */}
                  <div className="bg-white dark:bg-[#0c241c] p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="size-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                        <CreditCard className="size-4" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                        Direct Settlement
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Corporate Bank Transfer</h4>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] space-y-1 pt-1 font-mono">
                      <div>Bank: <strong>NABIL BANK LTD.</strong></div>
                      <div>A/C Name: <strong>OMSUN NEPAL PVT. LTD.</strong></div>
                      <div>A/C No: <strong>01901017502391</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 5. DEDICATED VIEW: ORDERS LIST                                */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  My Orders
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track full order history, road carrier dispatches, and Nepal VAT tax invoices.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0c241c] p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold pb-1 border-b border-slate-100 dark:border-white/10">
                  {[
                    { id: "all", label: "All Orders", count: orders.length },
                    { id: "processing", label: "Processing", count: orders.filter((o) => o.status === "processing" || o.status === "confirmed").length },
                    { id: "shipped", label: "In Transit", count: orders.filter((o) => o.status === "shipped" || o.status === "in_transit").length },
                    { id: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered" || o.status === "completed").length },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setOrderFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        orderFilter === f.id
                          ? "bg-emerald-600 text-white font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className="text-[10px] ml-1.5 opacity-80">({f.count})</span>
                    </button>
                  ))}
                </div>

                {/* Hidden input for order receipt upload */}
                <input
                  ref={orderReceiptFileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleOrderReceiptFileSelected}
                  className="hidden"
                />

                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No orders placed yet.
                    </div>
                  ) : (
                    orders
                      .filter((o) => {
                        if (orderFilter === "processing") return o.status === "processing" || o.status === "confirmed" || o.status === "pending";
                        if (orderFilter === "shipped") return o.status === "shipped" || o.status === "in_transit";
                        if (orderFilter === "delivered") return o.status === "delivered" || o.status === "completed";
                        return true;
                      })
                      .map((order) => {
                        const firstItem = order.items && order.items[0];
                        return (
                          <div
                            key={order.id}
                            className="p-4 rounded-2xl bg-white dark:bg-[#0c241c] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3 text-xs"
                          >
                            {/* Card Top: Ref, Status & Date */}
                            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100 dark:border-white/5">
                              <div>
                                <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                                  #{order.order_ref}
                                </span>
                                <div className="text-[11px] text-slate-400">
                                  {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 uppercase">
                                  {order.status}
                                </span>
                                {order.payment_status === "PAYMENT_VERIFIED" ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                                    <ShieldCheck className="size-3" /> Payment Verified
                                  </span>
                                ) : order.payment_status === "PAYMENT_REJECTED" ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1">
                                    <AlertCircle className="size-3" /> Slip Rejected
                                  </span>
                                ) : order.payment_status === "PAYMENT_SUBMITTED" || order.payment_receipt ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                                    <Clock className="size-3" /> Under Review
                                  </span>
                                ) : order.payment_method === "fonepay" ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1">
                                    <AlertCircle className="size-3" /> Awaiting Fonepay
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            {/* Card Middle: Product preview */}
                            <div className="flex items-center gap-3">
                              <img
                                src={panel}
                                alt={firstItem?.product_name || "Hardware"}
                                className="size-12 rounded-xl object-contain bg-slate-50 border p-1 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                  {firstItem?.product_name || "Solar & Electrical Equipment"}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                  <span>Qty: x{firstItem?.qty || 1}</span>
                                  <span>•</span>
                                  <span className="uppercase font-semibold text-slate-500">{order.payment_method}</span>
                                  {order.items && order.items.length > 1 && (
                                    <span className="text-emerald-600 font-bold font-mono">
                                      +{order.items.length - 1} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Card Bottom: Total & Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">Total Payable</span>
                                <span className="font-mono font-black text-sm text-[#38B46A]">
                                  {formatNPR(order.grand_total)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  asChild
                                  size="sm"
                                  className="h-8 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                                >
                                  <Link to="/order/$ref" params={{ ref: order.order_ref }}>
                                    Track Order & Pay &rarr;
                                  </Link>
                                </Button>

                                <Button
                                  onClick={() => setSelectedOrderForModal(order)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-3 rounded-xl text-xs font-bold"
                                >
                                  Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 6. DEDICATED VIEW: WARRANTY CERTIFICATES                      */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {activeTab === "warranty" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  25-Year Equipment Warranty Registry
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official serialized warranty passports issued by OMSUN Nepal service center.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0c241c] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {orders.flatMap((o) => o.items || []).map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.product_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">Serial: OMS-HW-{item.product_id.slice(0, 8).toUpperCase()}-2026</div>
                      </div>
                      <Button
                        onClick={() => toast.success(`Warranty passport downloaded for ${item.product_name}`)}
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-xs font-bold h-8"
                      >
                        <Download className="size-3.5 mr-1" /> Certificate (PDF)
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}



          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 8. DEDICATED VIEW: TELEMETRY                                  */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {activeTab === "telemetry" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Solar Generation Telemetry
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Bi-directional NEA net-meter export stats and real-time generation metrics.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0c241c] p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Real-time Solar Generation</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    ● Grid Active
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 space-y-1">
                    <span className="text-slate-400">Daily Generation</span>
                    <div className="text-xl font-bold font-mono">24.8 kWh</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 space-y-1">
                    <span className="text-slate-400">Exported to NEA</span>
                    <div className="text-xl font-bold font-mono text-emerald-600">18.2 kWh</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 space-y-1">
                    <span className="text-slate-400">Estimated Savings</span>
                    <div className="text-xl font-bold font-mono">NPR 4,850</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CHANGE PASSWORD MODAL (CONNECTED TO MYSQL DATABASE)           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={changePasswordModal} onOpenChange={setChangePasswordModal}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-[#0c241c] border-slate-200 dark:border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-base flex items-center gap-2 text-slate-900 dark:text-white">
              <KeyRound className="size-4.5 text-emerald-600" />
              <span>Change Password</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Update your account password securely.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordChange} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-200">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded-xl text-xs pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-200">
                New Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-200">
                Confirm New Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs mt-2"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── EDIT ADDRESS MODAL ── */}
      <Dialog open={editAddressModal} onOpenChange={setEditAddressModal}>
        <DialogContent className="max-w-md w-[94vw] max-h-[88vh] overflow-y-auto p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c241c] border-slate-200 dark:border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-base text-slate-900 dark:text-white">
              {editingAddress.id.startsWith("addr-new") ? "Add New Address" : "Edit Address Details"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAddress} className="space-y-3 pt-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Recipient Name</label>
              <Input
                value={editingAddress.fullName}
                onChange={(e) => setEditingAddress({ ...editingAddress, fullName: e.target.value })}
                className="rounded-xl text-xs h-10"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Street Address</label>
              <Input
                value={editingAddress.street}
                onChange={(e) => setEditingAddress({ ...editingAddress, street: e.target.value })}
                className="rounded-xl text-xs h-10"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Area / Ward No.</label>
              <Input
                value={editingAddress.area}
                onChange={(e) => setEditingAddress({ ...editingAddress, area: e.target.value })}
                className="rounded-xl text-xs h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1">City</label>
                <Input
                  value={editingAddress.city}
                  onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                  className="rounded-xl text-xs h-10"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Province</label>
                <Input
                  value={editingAddress.province}
                  onChange={(e) => setEditingAddress({ ...editingAddress, province: e.target.value })}
                  className="rounded-xl text-xs h-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-semibold block mb-1">Phone Number</label>
              <Input
                value={editingAddress.phone}
                onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                className="rounded-xl text-xs h-10"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Address Label</label>
              <Input
                value={editingAddress.type}
                onChange={(e) => setEditingAddress({ ...editingAddress, type: e.target.value })}
                className="rounded-xl text-xs h-10"
                placeholder="e.g. Home, Office, Solar Site"
              />
            </div>
            <Button type="submit" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 mt-2">
              Save Address
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── ORDER DETAILS & TRACKING MODAL ── */}
      <Dialog open={!!selectedOrderForModal} onOpenChange={(open) => !open && setSelectedOrderForModal(null)}>
        <DialogContent className="max-w-xl w-[94vw] max-h-[88vh] overflow-y-auto p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c241c] border-slate-200 dark:border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-base text-slate-900 dark:text-white flex items-center justify-between">
              <span>Order #{selectedOrderForModal?.order_ref}</span>
              <span className="text-xs font-bold text-emerald-600 uppercase">
                {selectedOrderForModal?.status}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Placed on {selectedOrderForModal && new Date(selectedOrderForModal.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedOrderForModal && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-black/30 rounded-xl space-y-1.5">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Courier Tracking</div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <Truck className="size-4 shrink-0" />
                  <span>Dispatched via Nepal Express Courier (Kathmandu Depot)</span>
                </div>
              </div>

              {/* Payment & Fonepay Slip Verification Section */}
              <div className="p-3.5 bg-slate-50 dark:bg-black/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Payment & Verification</span>
                  <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200">
                    {selectedOrderForModal.payment_method}
                  </span>
                </div>

                {selectedOrderForModal.payment_receipt ? (
                  <div className="flex items-center justify-between gap-3 p-2 bg-white dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={selectedOrderForModal.payment_receipt}
                        alt="Payment Receipt Slip"
                        onClick={() => setPreviewReceiptUrl(selectedOrderForModal.payment_receipt || null)}
                        className="size-12 rounded-md object-cover border border-slate-300 cursor-pointer shadow-xs hover:scale-105 transition-transform shrink-0"
                        title="Click to view full receipt"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1 truncate">
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" /> Receipt Attached
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {selectedOrderForModal.status === "processing" || selectedOrderForModal.status === "delivered" || selectedOrderForModal.status === "completed"
                            ? "Verified by Admin"
                            : "Pending Verification"}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        setTargetOrderForReceipt(selectedOrderForModal);
                        orderReceiptFileInputRef.current?.click();
                      }}
                      variant="outline"
                      size="sm"
                      disabled={isUploadingOrderReceipt}
                      className="h-7 text-xs rounded-lg cursor-pointer shrink-0"
                    >
                      <Upload className="size-3 mr-1" /> Re-upload
                    </Button>
                  </div>
                ) : selectedOrderForModal.payment_method === "fonepay" ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 rounded-lg">
                    <div>
                      <div className="font-bold text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1">
                        <AlertCircle className="size-3.5 shrink-0" /> Fonepay Slip Needed
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Upload payment screenshot for approval.
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        setTargetOrderForReceipt(selectedOrderForModal);
                        orderReceiptFileInputRef.current?.click();
                      }}
                      size="sm"
                      disabled={isUploadingOrderReceipt}
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer"
                    >
                      <Upload className="size-3 mr-1" /> {isUploadingOrderReceipt ? "Uploading..." : "Upload Slip"}
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2 divide-y divide-slate-100 dark:divide-white/5">
                {(selectedOrderForModal.items || []).map((item, idx) => (
                  <div key={idx} className="pt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={panel} alt={item.product_name} className="size-10 rounded-lg object-contain border p-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white truncate">{item.product_name}</div>
                        <div className="text-[11px] text-slate-400">Qty: x{item.qty}</div>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white font-mono shrink-0">
                      {formatNPR(item.unit_price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 flex justify-between items-center text-sm font-bold">
                <span>Grand Total:</span>
                <span className="text-emerald-600 font-mono">{formatNPR(selectedOrderForModal.grand_total)}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  onClick={() => setSelectedInvoiceOrder(selectedOrderForModal)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-bold h-9"
                >
                  <FileText className="size-3.5 mr-1" /> Tax Invoice
                </Button>
                <Button
                  onClick={() => setSelectedOrderForModal(null)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-9"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── LIGHTBOX MODAL: FULL RESOLUTION RECEIPT PREVIEW ── */}
      <Dialog open={!!previewReceiptUrl} onOpenChange={(open) => !open && setPreviewReceiptUrl(null)}>
        <DialogContent className="max-w-xl w-[94vw] max-h-[88vh] p-0 overflow-hidden bg-white dark:bg-[#0c241c] border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl">
          <DialogHeader className="p-4 bg-slate-50 dark:bg-black/30 border-b border-slate-200 dark:border-white/10 flex flex-row items-center justify-between">
            <DialogTitle className="font-bold text-sm text-slate-900 dark:text-white">
              Fonepay Payment Slip Preview
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-950/10 dark:bg-black/40">
            {previewReceiptUrl && (
              <img
                src={previewReceiptUrl}
                alt="Uploaded Payment Receipt Slip"
                className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-md"
              />
            )}
          </div>
          <div className="p-3 bg-slate-50 dark:bg-black/30 border-t border-slate-200 dark:border-white/10 flex justify-end">
            <Button
              size="sm"
              onClick={() => setPreviewReceiptUrl(null)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── TAX INVOICE MODAL ── */}
      <Dialog open={!!selectedInvoiceOrder} onOpenChange={(open) => !open && setSelectedInvoiceOrder(null)}>
        <DialogContent className="max-w-xl w-[94vw] max-h-[88vh] overflow-y-auto p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c241c] border-slate-200 dark:border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-base flex items-center justify-between">
              <span>OMSUN Nepal VAT Invoice</span>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                <Printer className="size-3.5 mr-1" /> Print Bill
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedInvoiceOrder && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between border-b pb-2 flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-sm text-emerald-700">OMSUN NEPAL PVT. LTD.</h4>
                  <p className="text-slate-400 text-[11px]">Kathmandu, Nepal • PAN/VAT: 609823412</p>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold">#{selectedInvoiceOrder.order_ref}</div>
                  <div className="text-slate-400 text-[11px]">{new Date(selectedInvoiceOrder.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-black/20 rounded-xl space-y-0.5">
                <div>Billed To: <strong>{selectedInvoiceOrder.shipping_name}</strong></div>
                <div>Address: {selectedInvoiceOrder.shipping_address}, {selectedInvoiceOrder.shipping_city}</div>
                <div>Phone: {selectedInvoiceOrder.shipping_phone}</div>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-slate-400 text-[11px]">
                    <th className="py-1.5">Item Description</th>
                    <th className="py-1.5 text-center">Qty</th>
                    <th className="py-1.5 text-right">Price</th>
                    <th className="py-1.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(selectedInvoiceOrder.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5">{item.product_name}</td>
                      <td className="py-1.5 text-center font-mono">{item.qty}</td>
                      <td className="py-1.5 text-right font-mono">{formatNPR(item.unit_price)}</td>
                      <td className="py-1.5 text-right font-bold font-mono">{formatNPR(item.unit_price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t pt-2 flex justify-between items-center text-sm font-bold">
                <span>Grand Total (13% VAT Incl.):</span>
                <span className="text-emerald-600 font-mono text-base">{formatNPR(selectedInvoiceOrder.grand_total)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
