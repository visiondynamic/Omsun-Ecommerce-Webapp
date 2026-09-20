import { products as catalogProducts, Product as CatalogProduct, formatNPR } from "./products";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";
export type PaymentStatus = "Paid" | "Unpaid" | "Refunded" | "Partial";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AdminOrder {
  id: string;
  orderRef?: string | undefined;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity?: string | undefined;
  items: OrderItem[];
  subtotal?: number | undefined;
  shippingFee?: number | undefined;
  totalAmount: number;
  discountAmount?: number;
  paymentMethod: "Fonepay QR" | "Cash on Delivery" | "Bank Transfer" | "eSewa" | "Khalti" | string;
  paymentStatus: PaymentStatus | "Pending Verification" | "PAYMENT_SUBMITTED" | "PAYMENT_VERIFIED" | "PAYMENT_REJECTED" | string;
  paymentReceipt?: string | null | undefined;
  transactionRef?: string | null | undefined;
  rejectionReason?: string | null | undefined;
  verifiedBy?: string | null | undefined;
  adminNotes?: string | null | undefined;
  notes?: string | null | undefined;
  orderStatus: OrderStatus | string;
  deliveryStatus?: string | undefined;
  deliveryCarrier?: string | null | undefined;
  deliveryPerson?: string | null | undefined;
  deliveryPhone?: string | null | undefined;
  trackingNumber?: string | null | undefined;
  deliveryNotes?: string | null | undefined;
  estimatedDelivery?: string | null | undefined;
  createdAt: string;
  paymentSubmittedAt?: string | null | undefined;
  paymentVerifiedAt?: string | null | undefined;
  timeline: { title: string; timestamp: string; note?: string | undefined }[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: "Active" | "VIP" | "Inactive";
  registeredDate: string;
}


export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  tagBadge: string;
  displayOrder: number;
  status: "Active" | "Draft";
}

export interface AdminPartner {
  id: string;
  name: string;
  category: string;
  partnerSince: string;
  status: "Active Authorized" | "Pending Review";
  logoUrl?: string;
  notes: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "order" | "inventory" | "system" | "survey";
  read: boolean;
}

export interface CategoryInfo {
  name: string;
  skuPrefix: string;
  itemCount: number;
  status: "Active" | "Disabled";
  description: string;
  subcategories?: string[];
}

// 5 Core OMSUN Product Categories with Subcategories
export const OMSUN_CATEGORIES: CategoryInfo[] = [
  {
    name: "Stabilizer",
    skuPrefix: "STB",
    itemCount: 22,
    status: "Active",
    description: "Servo Stabilizer, Three Phase Servo, Relay Based AVR & Oil Cooled Servo Voltage Regulators.",
    subcategories: [
      "Servo Stabilizer",
      "Three Phase Servo Stabilizer",
      "Relay Based Stabilizer / AVR",
      "Oil Cooled Servo Stabilizer",
    ],
  },
  {
    name: "UPS",
    skuPrefix: "UPS",
    itemCount: 10,
    status: "Active",
    description: "Low-Frequency Online UPS with isolation transformer and Power-One 3-phase enterprise double conversion systems.",
    subcategories: [
      "Online LF UPS",
      "Industrial Online UPS",
      "Online UPS",
      "Modular UPS",
    ],
  },
  {
    name: "Security",
    skuPrefix: "SEC",
    itemCount: 15,
    status: "Active",
    description: "4K Solar PTZ Cameras, Commercial CCTV Surveillance Kits & Multi-Channel NVR Network Systems.",
    subcategories: ["CCTV", "Solar Security"],
  },
  {
    name: "Solar",
    skuPrefix: "SLR",
    itemCount: 34,
    status: "Active",
    description: "Tier-1 N-Type TOPCon Solar PV Modules, Hybrid Smart Inverters & Turnkey Grid-Tied Renewable Systems.",
    subcategories: ["Hybrid Solar", "Solar Panels", "Solar Inverters"],
  },
  {
    name: "Battery",
    skuPrefix: "BAT",
    itemCount: 20,
    status: "Active",
    description: "Modular LiFePO₄ Energy Storage, Tall Tubular Deep-Cycle Batteries & Backup Storage Arrays.",
    subcategories: ["LiFePO4 Storage", "Tubular Battery"],
  },
];

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "OMS-2026-8941",
    customerName: "Sabin Shrestha",
    customerEmail: "sabin.shrestha@techhimalaya.np",
    customerPhone: "+977 9851012345",
    shippingAddress: "Durbar Marg, Ward 1, Kathmandu, Nepal",
    items: [
      {
        productId: "hybrid-inverter-8kw",
        name: "Voltura Hybrid Inverter 8kW",
        price: 189000,
        quantity: 1,
        image: catalogProducts[1]?.image || "",
      },
      {
        productId: "lifepo4-10kwh",
        name: "HimalVolt 10kWh Storage",
        price: 425000,
        quantity: 1,
        image: catalogProducts[2]?.image || "",
      },
    ],
    totalAmount: 614000,
    discountAmount: 0,
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    createdAt: "2026-08-14T08:30:00Z",
    timeline: [
      { title: "Order Placed", timestamp: "2026-08-14 08:30 AM", note: "Web checkout via Bank Transfer" },
      { title: "Payment Verified", timestamp: "2026-08-14 09:15 AM", note: "Nabil Bank wire reference #981240" },
      { title: "Dispatch Queued", timestamp: "2026-08-14 10:00 AM", note: "Warehouse Katmandu hub assigned" },
    ],
  },
  {
    id: "OMS-2026-8940",
    customerName: "Dr. Anjana Karki",
    customerEmail: "anjana.karki@pokharahospital.org",
    customerPhone: "+977 9841256789",
    shippingAddress: "Lakeside Road, Ward 6, Pokhara, Kaski",
    items: [
      {
        productId: "monocrystalline-550w",
        name: "OMSUN Mono 550W Panel",
        price: 21500,
        quantity: 20,
        image: catalogProducts[0]?.image || "",
      },
    ],
    totalAmount: 49500,
    discountAmount: 0,
    paymentMethod: "eSewa",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    createdAt: "2026-08-13T14:20:00Z",
    timeline: [
      { title: "Order Placed", timestamp: "2026-08-13 02:20 PM", note: "eSewa Merchant Txn #ES9910" },
      { title: "Dispatched", timestamp: "2026-08-13 04:00 PM", note: "Cargo via Pokhara Express Courier" },
      { title: "Delivered", timestamp: "2026-08-14 11:30 AM", note: "Signed by Hospital Facilities Lead" },
    ],
  },
  {
    id: "OMS-2026-8939",
    customerName: "Pemba Sherpa",
    customerEmail: "pemba@namchelodge.com",
    customerPhone: "+977 9803478901",
    shippingAddress: "Main Bazaar, Namche Bazaar, Solukhumbu",
    items: [
      {
        productId: "copper-cable-6mm",
        name: "OMSUN Pure Copper Cable 6mm²",
        price: 12800,
        quantity: 4,
        image: catalogProducts[3]?.image || "",
      },
      {
        productId: "distribution-board-12way",
        name: "OMSUN 12-Way Distribution Board",
        price: 28400,
        quantity: 2,
        image: catalogProducts[5]?.image || "",
      },
    ],
    totalAmount: 11000,
    discountAmount: 0,
    paymentMethod: "Khalti",
    paymentStatus: "Paid",
    orderStatus: "Pending",
    createdAt: "2026-08-14T11:10:00Z",
    timeline: [
      { title: "Order Placed", timestamp: "2026-08-14 11:10 AM", note: "Awaiting Lukla Helicopter Freight Allocation" },
    ],
  },
  {
    id: "OMS-2026-8938",
    customerName: "Rajesh Maharjan",
    customerEmail: "rajesh.m@gmail.com",
    customerPhone: "+977 9818901234",
    shippingAddress: "Patan Dhoka, Lalitpur, Nepal",
    items: [
      {
        productId: "led-panel-40w",
        name: "SunCore Edge LED Panel 40W",
        price: 3450,
        quantity: 10,
        image: catalogProducts[4]?.image || "",
      },
    ],
    totalAmount: 34500,
    discountAmount: 0,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    orderStatus: "Pending",
    createdAt: "2026-08-14T09:45:00Z",
    timeline: [
      { title: "Order Placed", timestamp: "2026-08-14 09:45 AM", note: "COD verification call pending" },
    ],
  },
  {
    id: "OMS-2026-8937",
    customerName: "Bishal Thapa",
    customerEmail: "b.thapa@butwalenergies.com",
    customerPhone: "+977 9857023456",
    shippingAddress: "Traffic Chowk, Butwal, Rupandehi",
    items: [
      {
        productId: "monocrystalline-550w",
        name: "OMSUN Mono 550W Panel",
        price: 21500,
        quantity: 50,
        image: catalogProducts[0]?.image || "",
      },
    ],
    totalAmount: 1075000,
    discountAmount: 0,
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    createdAt: "2026-08-11T16:00:00Z",
    timeline: [
      { title: "Order Placed", timestamp: "2026-08-11 04:00 PM" },
      { title: "Dispatched", timestamp: "2026-08-12 09:00 AM" },
      { title: "Delivered & Commissioned", timestamp: "2026-08-13 03:30 PM" },
    ],
  },
];

export const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: "CUST-001",
    name: "Sabin Shrestha",
    email: "sabin.shrestha@techhimalaya.np",
    phone: "+977 9851012345",
    city: "Kathmandu",
    totalOrders: 3,
    totalSpent: 1245000,
    status: "VIP",
    registeredDate: "2025-11-12",
  },
  {
    id: "CUST-002",
    name: "Dr. Anjana Karki",
    email: "anjana.karki@pokharahospital.org",
    phone: "+977 9841256789",
    city: "Pokhara",
    totalOrders: 2,
    totalSpent: 890000,
    status: "VIP",
    registeredDate: "2026-01-05",
  },
  {
    id: "CUST-003",
    name: "Pemba Sherpa",
    email: "pemba@namchelodge.com",
    phone: "+977 9803478901",
    city: "Namche Bazaar",
    totalOrders: 4,
    totalSpent: 450000,
    status: "Active",
    registeredDate: "2026-02-18",
  },
  {
    id: "CUST-004",
    name: "Rajesh Maharjan",
    email: "rajesh.m@gmail.com",
    phone: "+977 9818901234",
    city: "Lalitpur",
    totalOrders: 1,
    totalSpent: 34500,
    status: "Active",
    registeredDate: "2026-06-20",
  },
  {
    id: "CUST-005",
    name: "Bishal Thapa",
    email: "b.thapa@butwalenergies.com",
    phone: "+977 9857023456",
    city: "Butwal",
    totalOrders: 5,
    totalSpent: 3200000,
    status: "VIP",
    registeredDate: "2025-08-30",
  },
];


export const INITIAL_BANNERS: AdminBanner[] = [
  {
    id: "BAN-01",
    title: "Empowering Nepal with Clean Solar Energy",
    subtitle: "High-efficiency N-type solar modules, hybrid inverters & LiFePO₄ storage engineered for extreme Himalayan weather.",
    ctaText: "Explore Solar Catalog",
    ctaLink: "/shop",
    image: catalogProducts[0]?.image || "",
    tagBadge: "NEA Net-Metering Certified",
    displayOrder: 1,
    status: "Active",
  },
  {
    id: "BAN-02",
    title: "Next-Gen LiFePO₄ Battery Systems",
    subtitle: "6000-cycle continuous power backup for commercial facilities, hospitals, and remote eco-lodges.",
    ctaText: "View Energy Storage",
    ctaLink: "/shop?category=Energy+Storage",
    image: catalogProducts[2]?.image || "",
    tagBadge: "10-Year Warranty",
    displayOrder: 2,
    status: "Active",
  },
];

export const INITIAL_PARTNERS: AdminPartner[] = [
  {
    id: "PRT-01",
    name: "Dyna Batteries",
    category: "Heavy Duty Tubular & Automotive Batteries",
    partnerSince: "2018",
    status: "Active Authorized",
    notes: "Exclusive Distribution Rights for Central Nepal Region.",
  },
  {
    id: "PRT-02",
    name: "Excite Batteries",
    category: "Deep Cycle Solar Gel & Lead Acid Batteries",
    partnerSince: "2019",
    status: "Active Authorized",
    notes: "Official Technical Service & Warranty Hub Partner.",
  },
  {
    id: "PRT-03",
    name: "Luminous Batteries",
    category: "Tubular Solar Batteries & Sine Wave Inverters",
    partnerSince: "2020",
    status: "Active Authorized",
    notes: "Preferred Partner for Residential Load-Shedding Backups.",
  },
  {
    id: "PRT-04",
    name: "Smarten Power Systems",
    category: "MPPT Solar PCU & Intelligent Hybrid Inverters",
    partnerSince: "2021",
    status: "Active Authorized",
    notes: "Direct Factory Technical & Interconnection Certification.",
  },
];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "NOTIF-01",
    title: "Low Stock Alert: SunCore Edge LED Panel 40W",
    message: "Stock has reached 0 units. Reorder recommended.",
    timestamp: "10 mins ago",
    type: "inventory",
    read: false,
  },
  {
    id: "NOTIF-02",
    title: "New High-Value Order #OMS-2026-8941",
    message: "Sabin Shrestha placed an order worth Rs 6,14,000 via Bank Transfer.",
    timestamp: "1 hour ago",
    type: "order",
    read: false,
  },
  {
    id: "NOTIF-03",
    title: "NEA Net-Metering Interconnection Pass",
    message: "Pokhara Hospital 15kW UPS inspection successfully passed.",
    timestamp: "3 hours ago",
    type: "system",
    read: true,
  },
];
