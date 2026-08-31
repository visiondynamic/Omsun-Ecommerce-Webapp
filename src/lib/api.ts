const API_BASE = import.meta.env["VITE_API_URL"] || "http://localhost:4000";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("omsun_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("omsun_token", token);
      else localStorage.removeItem("omsun_token");
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data as T;
  }

  /* ── Auth ── */
  async register(body: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    company?: string;
  }) {
    const data = await this.request<{
      ok: boolean;
      token: string;
      user: { id: string; name: string; email: string; role: string; avatar?: string | null };
    }>("/api/auth/register", { method: "POST", body: JSON.stringify(body) });
    this.setToken(data.token);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{
      ok: boolean;
      token: string;
      user: { id: string; name: string; email: string; role: string; avatar?: string | null };
    }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request<{
      id: string;
      name: string;
      email: string;
      phone: string;
      company: string;
      role: string;
      avatar?: string | null;
    }>("/api/auth/me");
  }

  async updateProfile(body: { fullName?: string; phone?: string; company?: string; avatar?: string | null }) {
    return this.request<{
      ok: boolean;
      user: { id: string; name: string; email: string; phone: string; company: string; role: string; avatar?: string | null };
    }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async uploadAvatar(imageBase64: string) {
    return this.request<{ ok: boolean; avatarUrl: string; message: string }>("/api/auth/avatar", {
      method: "POST",
      body: JSON.stringify({ imageBase64 }),
    });
  }

  async changePassword(body: { currentPassword: string; newPassword: string }) {
    return this.request<{ ok: boolean; message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async getAddresses() {
    return this.request<
      {
        id: string;
        fullName: string;
        street: string;
        area: string;
        city: string;
        province: string;
        phone: string;
        type: string;
        isDefault: boolean;
      }[]
    >("/api/user/addresses");
  }

  async addAddress(body: {
    fullName: string;
    street: string;
    area?: string;
    city: string;
    province?: string;
    phone: string;
    type?: string;
    isDefault?: boolean;
  }) {
    return this.request<{
      id: string;
      fullName: string;
      street: string;
      area: string;
      city: string;
      province: string;
      phone: string;
      type: string;
      isDefault: boolean;
    }>("/api/user/addresses", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async updateAddress(
    id: string,
    body: {
      fullName?: string;
      street?: string;
      area?: string;
      city?: string;
      province?: string;
      phone?: string;
      type?: string;
      isDefault?: boolean;
    }
  ) {
    return this.request<{ ok: boolean; message: string }>(`/api/user/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async deleteAddress(id: string) {
    return this.request<{ ok: boolean; message: string }>(`/api/user/addresses/${id}`, {
      method: "DELETE",
    });
  }

  logout() {
    this.setToken(null);
  }

  /* ── Products ── */
  async getProducts() {
    return this.request<ProductRow[]>("/api/products");
  }

  async getProduct(id: string) {
    return this.request<ProductRow>(`/api/products/${id}`);
  }

  /* ── Orders ── */
  async createOrder(body: {
    items: { productId: string; quantity: number }[];
    shipping: { name: string; phone: string; address: string; city: string; notes?: string };
    paymentMethod: string;
    paymentReceipt?: string | null;
  }) {
    return this.request<{ ok: boolean; orderRef: string; grandTotal: number; receiptUrl?: string }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async uploadOrderReceipt(orderRef: string, receiptBase64: string) {
    return this.request<{ ok: boolean; receiptUrl: string; message: string }>(`/api/orders/${orderRef}/receipt`, {
      method: "POST",
      body: JSON.stringify({ receiptBase64 }),
    });
  }

  async getOrders() {
    return this.request<OrderRow[]>("/api/orders");
  }

  /* ── Contact ── */
  async submitContact(body: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    inquiryType?: string;
    systemSize?: string;
    district?: string;
    message: string;
  }) {
    return this.request<{ ok: boolean }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /* ── Newsletter ── */
  async subscribeNewsletter(email: string) {
    return this.request<{ ok: boolean }>("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  /* ── Admin Media Upload ── */
  async uploadImage(fileOrBase64: File | string, fileName?: string): Promise<{ ok: boolean; url: string; fileName: string }> {
    let base64String: string;
    let name = fileName || "image.png";

    if (typeof fileOrBase64 === "string") {
      base64String = fileOrBase64;
    } else {
      name = fileOrBase64.name;
      base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBase64);
      });
    }

    return this.request<{ ok: boolean; url: string; fileName: string }>("/api/upload", {
      method: "POST",
      body: JSON.stringify({ imageBase64: base64String, fileName: name }),
    });
  }

  /* ── Admin ── */
  async getAdminProducts() {
    return this.request<ProductRow[]>("/api/admin/products");
  }

  async createProduct(product: ProductRow) {
    return this.request<{ ok: boolean; id: string }>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<ProductRow>) {
    return this.request<{ ok: boolean }>(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ ok: boolean }>(`/api/admin/products/${id}`, { method: "DELETE" });
  }

  async getAdminOrders() {
    return this.request<AdminOrderRow[]>("/api/admin/orders");
  }

  async updateOrderStatus(ref: string, status: string) {
    return this.request<{ ok: boolean }>(`/api/admin/orders/${ref}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async verifyAdminOrderPayment(ref: string, approve: boolean) {
    return this.request<{ ok: boolean; status: string; message?: string }>(`/api/admin/orders/${ref}/verify-payment`, {
      method: "PUT",
      body: JSON.stringify({ approve }),
    });
  }

  async deleteAdminOrder(ref: string) {
    return this.request<{ ok: boolean; message?: string }>(`/api/admin/orders/${ref}`, {
      method: "DELETE",
    });
  }

  async getAdminCustomers() {
    return this.request<AdminCustomerRow[]>("/api/admin/customers");
  }

  async getAdminCoupons() {
    return this.request<AdminCouponRow[]>("/api/admin/coupons");
  }

  async createCoupon(coupon: {
    code: string;
    discountType: string;
    discountValue: number;
    minSpend: number;
    usageLimit: number;
    expiryDate: string;
  }) {
    return this.request<{ ok: boolean; id: string }>("/api/admin/coupons", {
      method: "POST",
      body: JSON.stringify(coupon),
    });
  }

  async updateCoupon(
    id: string,
    coupon: Partial<{
      code: string;
      discountType: string;
      discountValue: number;
      minSpend: number;
      usageLimit: number;
      expiryDate: string;
      status: string;
    }>,
  ) {
    return this.request<{ ok: boolean }>(`/api/admin/coupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(coupon),
    });
  }

  async deleteCoupon(id: string) {
    return this.request<{ ok: boolean }>(`/api/admin/coupons/${id}`, { method: "DELETE" });
  }

  /* ── Partners ── */
  async getAdminPartners() {
    return this.request<AdminPartnerRow[]>("/api/admin/partners");
  }

  async createPartner(partner: {
    name: string;
    category: string;
    partnerSince: string;
    status: string;
    notes: string;
  }) {
    return this.request<{ ok: boolean; id: string }>("/api/admin/partners", {
      method: "POST",
      body: JSON.stringify(partner),
    });
  }

  async updatePartner(
    id: string,
    partner: Partial<{
      name: string;
      category: string;
      partnerSince: string;
      status: string;
      notes: string;
    }>,
  ) {
    return this.request<{ ok: boolean }>(`/api/admin/partners/${id}`, {
      method: "PUT",
      body: JSON.stringify(partner),
    });
  }

  async deletePartner(id: string) {
    return this.request<{ ok: boolean }>(`/api/admin/partners/${id}`, { method: "DELETE" });
  }

  /* ── Banners ── */
  async getAdminBanners() {
    return this.request<AdminBannerRow[]>("/api/admin/banners");
  }

  async createBanner(banner: {
    title: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    image?: string;
    tagBadge?: string;
    displayOrder?: number;
    status?: string;
  }) {
    return this.request<{ ok: boolean; id: string }>("/api/admin/banners", {
      method: "POST",
      body: JSON.stringify(banner),
    });
  }

  async updateBanner(
    id: string,
    banner: Partial<{
      title: string;
      subtitle: string;
      ctaText: string;
      ctaLink: string;
      image: string;
      tagBadge: string;
      displayOrder: number;
      status: string;
    }>,
  ) {
    return this.request<{ ok: boolean }>(`/api/admin/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(banner),
    });
  }

  async deleteBanner(id: string) {
    return this.request<{ ok: boolean }>(`/api/admin/banners/${id}`, { method: "DELETE" });
  }

  /* ── Stats ── */
  async getAdminStats() {
    return this.request<AdminStatsRow>("/api/admin/stats");
  }

  /* ── Stock Update ── */
  async updateStock(id: string, stock: number) {
    return this.request<{ ok: boolean }>(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({ stock }),
    });
  }
}

/* ── Types matching API responses ── */
export interface ProductRow {
  id: string;
  name: string;
  category: string;
  subcategory?: string | null;
  brand: string;
  tagline: string | null;
  description: string | null;
  price: number;
  mrp: number | null;
  image: string | null;
  features: string[] | { label: string; value: string }[];
  specs: { label: string; value: string }[];
  stock: number;
  rating: number;
  badges: string[];
}

export interface OrderRow {
  id: number;
  order_ref: string;
  user_id: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  subtotal: number;
  shipping_fee: number;
  grand_total: number;
  payment_method: string;
  payment_receipt?: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  items: {
    id: number;
    order_id: number;
    product_id: string;
    product_name: string;
    qty: number;
    unit_price: number;
  }[];
}

export interface AdminOrderRow {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes?: string | null;
  paymentReceipt?: string | null;
  items: { productId: string; name: string; price: number; quantity: number; image: string }[];
  totalAmount: number;
  discountAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  timeline: { title: string; timestamp: string; note?: string }[];
}

export interface AdminCustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  registeredDate: string;
}

export interface AdminCouponRow {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minSpend: number;
  usageCount: number;
  usageLimit: number;
  expiryDate: string;
  status: string;
}

export interface AdminPartnerRow {
  id: string;
  name: string;
  category: string;
  partnerSince: string;
  status: string;
  logoUrl: string;
  notes: string;
}

export interface AdminBannerRow {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  tagBadge: string;
  displayOrder: number;
  status: string;
}

export interface AdminStatsRow {
  productCount: number;
  orderCount: number;
  customerCount: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
  categoryDistribution: { name: string; value: number }[];
  monthlyTrend: { month: string; revenue: number; orders: number }[];
}

export const api = new ApiClient();
