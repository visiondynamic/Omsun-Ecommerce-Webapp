import panel from "@/assets/p-panel.jpg";
import inverter from "@/assets/p-inverter.jpg";
import battery from "@/assets/p-battery.jpg";
import cable from "@/assets/p-cable.jpg";
import light from "@/assets/p-light.jpg";
import panelboard from "@/assets/p-panelboard.jpg";

// Enhanced Stabilizer Product Showcase Images
import omsunMter1kvaImg from "@/assets/products/omsun-mter-1kva.webp";
import omsunMter2kvaImg from "@/assets/products/omsun-mter-2kva.webp";
import omsunMter3kvaImg from "@/assets/products/omsun-mter-3kva.webp";
import omsunMter5kvaImg from "@/assets/products/omsun-mter-5kva.webp";
import omsunMter10kvaImg from "@/assets/products/omsun-mter-10kva.webp";
import omsunMser8kvaImg from "@/assets/products/omsun-mser-8kva.webp";
import omsunMser10kvaImg from "@/assets/products/omsun-mser-10kva.webp";
import omsunMser15kvaImg from "@/assets/products/omsun-mser-15kva.webp";
import omsunMser10kva3PhaseImg from "@/assets/products/omsun-mser-10kva-3phase.webp";
import omsunMser15kva3PhaseImg from "@/assets/products/omsun-mser-15kva-3phase.webp";
import greenVolt1kvaImg from "@/assets/products/green-volt-1kva.webp";
import greenVolt2kvaImg from "@/assets/products/green-volt-2kva.webp";
import greenVolt4kva110vImg from "@/assets/products/green-volt-4kva-110v.webp";
import greenVolt4kva90vImg from "@/assets/products/green-volt-4kva-90v.webp";
import greenVolt42kva90vImg from "@/assets/products/green-volt-4-2kva-90v.webp";
import greenVolt5kva110vImg from "@/assets/products/green-volt-5kva-110v.webp";
import greenVolt5kva90vImg from "@/assets/products/green-volt-5kva-90v.webp";

export {
  omsunMter1kvaImg,
  omsunMter2kvaImg,
  omsunMter3kvaImg,
  omsunMter5kvaImg,
  omsunMter10kvaImg,
  omsunMser8kvaImg,
  omsunMser10kvaImg,
  omsunMser15kvaImg,
  omsunMser10kva3PhaseImg,
  omsunMser15kva3PhaseImg,
  greenVolt1kvaImg,
  greenVolt2kvaImg,
  greenVolt4kva110vImg,
  greenVolt4kva90vImg,
  greenVolt42kva90vImg,
  greenVolt5kva110vImg,
  greenVolt5kva90vImg,
};

import { smartenFallbackProducts } from "@/lib/smartenData";
import { powerOneFallbackProducts } from "@/lib/powerOneData";
import { technoVisionProducts } from "@/lib/technoVisionData";

export type Product = {
  id: string;
  name: string;
  slug?: string | undefined;
  tagline: string;
  category: string;
  subcategory?: string | undefined;
  series?: string | undefined;
  model?: string | undefined;
  capacity?: string | undefined;
  brand: string;
  price: number;
  compareAt?: number | undefined;
  image: string;
  images?: string[] | undefined;
  badges: string[];
  stock: number;
  rating: number;
  efficient?: boolean | undefined;
  specs: { label: string; value: string }[];
  specifications?: Record<string, string> | undefined;
  features?: string[] | undefined;
  applications?: string[] | undefined;
  warranty?: string | undefined;
  brochureUrl?: string | undefined;
  datasheetUrl?: string | undefined;
  sourceUrl?: string | undefined;
  description?: string | undefined;
};

export interface CategoryStructure {
  name: string;
  slug: string;
  skuPrefix: string;
  description: string;
  subcategories: string[];
}

export const PRODUCT_TAXONOMY: CategoryStructure[] = [
  {
    name: "Home UPS",
    slug: "home-ups",
    skuPrefix: "HUP",
    description: "Pure sine wave home inverters, low-voltage 90V charging systems, and integrated Lithium-Ion UPS units by Smarten.",
    subcategories: [
      "Pure Sine Wave Inverter",
      "Home Inverter",
      "Lithium Integrated UPS",
      "Bravo Series",
      "Nova Series",
      "EverOn Series",
    ],
  },
  {
    name: "Solar PCU",
    slug: "solar-pcu",
    skuPrefix: "PCU",
    description: "High-yield MPPT and PWM solar hybrid power conditioning units with intelligent solar-battery-grid priority routing.",
    subcategories: [
      "MPPT Solar PCU",
      "PWM Solar PCU",
      "Superb Series",
      "Saver Series",
      "Shine Series",
      "Boom Series",
    ],
  },
  {
    name: "Solar Charge Controllers",
    slug: "solar-charge-controllers",
    skuPrefix: "SCC",
    description: "Ultra-fast MPPT and PWM solar charge controllers and automated PV changers to upgrade any existing inverter to solar.",
    subcategories: [
      "MPPT Solar Charge Controller",
      "PWM Solar Charge Controller",
      "DC Solar Controller",
      "PV Changer",
      "Prime Series",
      "Savior Series",
      "Tejas Series",
    ],
  },
  {
    name: "Tubular Batteries",
    slug: "tubular-batteries",
    skuPrefix: "TUB",
    description: "Heavy-duty C10 solar and C20 inverter tall tubular batteries with 100-bar spine casting for maximum cycle life (strictly non-SMF).",
    subcategories: [
      "Tall Tubular Battery",
      "Solar Tubular Battery",
      "Bravo Series",
      "Saver Series",
      "Boom Series",
    ],
  },
  {
    name: "Solar Panels",
    slug: "solar-panels",
    skuPrefix: "PNL",
    description: "High-efficiency N-Type TOPCon bifacial, half-cut mono PERC, and heavy polycrystalline solar photovoltaic modules.",
    subcategories: [
      "Monocrystalline",
      "Polycrystalline",
      "Bifacial TOPCon",
    ],
  },
  {
    name: "Stabilizer",
    slug: "stabilizer",
    skuPrefix: "STB",
    description: "Precision servo, 3-phase, relay-based AVR & industrial oil-cooled voltage stabilizers engineered for Nepal's electrical grid stability.",
    subcategories: [
      "Servo Stabilizer",
      "Three Phase Servo Stabilizer",
      "Relay Based Stabilizer / AVR",
      "Oil Cooled Servo Stabilizer",
    ],
  },
  {
    name: "UPS",
    slug: "ups",
    skuPrefix: "UPS",
    description: "Low-frequency online UPS with isolation transformers and Power-One 3-phase double-conversion enterprise power systems.",
    subcategories: [
      "Online LF UPS",
      "Industrial Online UPS",
      "Online UPS",
      "Modular UPS",
    ],
  },
  {
    name: "Power-One UPS",
    slug: "power-one-ups",
    skuPrefix: "PO-UPS",
    description: "Enterprise 3-phase and single-phase double-conversion online UPS systems with galvanic isolation by Power-One.",
    subcategories: ["PMP Series", "PTM Series"],
  },
  {
    name: "Power-One Solar",
    slug: "power-one-solar",
    skuPrefix: "PO-SLR",
    description: "Grid-tie inverters (1kW to 250kW), multi-megawatt hybrid systems, rugged off-grid inverters, and solar pump solutions by Power-One.",
    subcategories: [
      "On-Grid Inverters",
      "Hybrid Inverters",
      "Off-Grid Inverters",
      "Solar Power Solutions",
      "Solar Pump / Controllers",
    ],
  },
  {
    name: "Security",
    slug: "security",
    skuPrefix: "SEC",
    description: "High-definition IP bullet cameras, PIR Turbo HD surveillance, and smart remote camera monitoring systems.",
    subcategories: ["IP Camera", "Turbo HD Camera", "CCTV", "Solar Security"],
  },
];

export const CATEGORIES = PRODUCT_TAXONOMY.map((c) => c.name);

export const BRANDS = [
  "Smarten",
  "OMSUN",
  "Power-One",
  "Greenn Volt",
  "SineWave",
  "Voltura",
  "Hikvision",
  "Techno Vision",
];

// Fallback mock data used when API is unavailable (SSR, offline, etc.)
const fallbackImageMap: Record<string, string> = {
  Stabilizer: omsunMter3kvaImg,
  UPS: inverter,
  Solar: panel,
  Battery: battery,
  Security: light,
  "Cables & Wiring": cable,
  Lighting: light,
  "Panels & Switchgear": panelboard,
};

const baseFallbackProducts: Product[] = [
  // ══════════════════════════════════════════════════════════════════════════════
  // GROUP 1: OMSUN Servo Motor Voltage Stabilizer (Single Phase)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "omsun-mter-1kva",
    name: "OMSUN MTER-1KVA Servo Voltage Stabilizer",
    tagline: "1 kVA / 1000VA precision single phase servo motor automatic voltage regulator",
    category: "Stabilizer",
    subcategory: "Servo Stabilizer",
    brand: "OMSUN",
    price: 15800,
    compareAt: 17500,
    image: omsunMter1kvaImg,
    badges: ["Servo Motor", "13% VAT Incl.", "1 Year Warranty"],
    stock: 25,
    rating: 4.8,
    efficient: true,
    specs: [
      { label: "Model", value: "MTER-1KVA (MTER 1000)" },
      { label: "Capacity", value: "1 kVA / 1000 VA" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Gross Weight", value: "5.66 kg" },
      { label: "Net Weight", value: "5.20 kg" },
      { label: "Dimensions (L×W×H)", value: "40 × 31 × 39.5 cm" },
      { label: "Input Range", value: "140V – 260V AC" },
      { label: "Output Voltage", value: "220V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-mter-2kva",
    name: "OMSUN MTER-2KVA Servo Voltage Stabilizer",
    tagline: "2 kVA / 2000VA high accuracy servo motor voltage regulator for refrigerators & labs",
    category: "Stabilizer",
    subcategory: "Servo Stabilizer",
    brand: "OMSUN",
    price: 20500,
    compareAt: 23000,
    image: omsunMter2kvaImg,
    badges: ["Servo Motor", "Best Seller", "1 Year Warranty"],
    stock: 20,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Model", value: "MTER-2KVA (MTER 2000)" },
      { label: "Capacity", value: "2 kVA / 2000 VA" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Gross Weight", value: "6.65 kg" },
      { label: "Net Weight", value: "6.10 kg" },
      { label: "Dimensions (L×W×H)", value: "42.5 × 33.5 × 21 cm" },
      { label: "Input Range", value: "140V – 260V AC" },
      { label: "Output Voltage", value: "220V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-mter-3kva",
    name: "OMSUN MTER-3KVA Servo Voltage Stabilizer",
    tagline: "3 kVA / 3000VA motorized servo voltage regulator for home & commercial gear",
    category: "Stabilizer",
    subcategory: "Servo Stabilizer",
    brand: "OMSUN",
    price: 33600,
    compareAt: 37000,
    image: omsunMter3kvaImg,
    badges: ["Servo Motor", "13% VAT Incl.", "1 Year Warranty"],
    stock: 18,
    rating: 4.8,
    efficient: true,
    specs: [
      { label: "Model", value: "MTER-3KVA (MTER 3000)" },
      { label: "Capacity", value: "3 kVA / 3000 VA" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Gross Weight", value: "9.50 kg" },
      { label: "Net Weight", value: "8.80 kg" },
      { label: "Dimensions (L×W×H)", value: "62 × 37 × 27 cm" },
      { label: "Input Range", value: "140V – 260V AC" },
      { label: "Output Voltage", value: "220V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-mter-5kva",
    name: "OMSUN MTER-5KVA Servo Voltage Stabilizer",
    tagline: "5 kVA / 5000VA heavy duty servo stabilizer for whole home and office mains",
    category: "Stabilizer",
    subcategory: "Servo Stabilizer",
    brand: "OMSUN",
    price: 39500,
    compareAt: 44000,
    image: omsunMter5kvaImg,
    badges: ["Mains Stabilizer", "Top Rated", "1 Year Warranty"],
    stock: 16,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Model", value: "MTER-5KVA (MTER 5000)" },
      { label: "Capacity", value: "5 kVA / 5000 VA" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Gross Weight", value: "14.00 kg" },
      { label: "Net Weight", value: "13.00 kg" },
      { label: "Dimensions (L×W×H)", value: "40 × 38 × 24 cm" },
      { label: "Input Range", value: "140V – 260V AC" },
      { label: "Output Voltage", value: "220V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-mter-10kva",
    name: "OMSUN MTER-10KVA Servo Voltage Stabilizer",
    tagline: "10 kVA high power commercial servo motor AVR with digital voltmeter",
    category: "Stabilizer",
    subcategory: "Servo Stabilizer",
    brand: "OMSUN",
    price: 81000,
    compareAt: 90000,
    image: omsunMter10kvaImg,
    badges: ["10 kVA High Power", "13% VAT Incl.", "1 Year Warranty"],
    stock: 12,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Model", value: "MTER-10KVA (MTER 10000)" },
      { label: "Capacity", value: "10 kVA / 10,000 VA" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Gross Weight", value: "21.20 kg" },
      { label: "Net Weight", value: "19.10 kg" },
      { label: "Dimensions (L×W×H)", value: "50 × 43.5 × 33 cm" },
      { label: "Input Range", value: "140V – 260V AC" },
      { label: "Output Voltage", value: "220V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-mser-8kva",
    name: "OMSUN MSER-8KVA Servo Voltage Stabilizer",
    tagline: "8 kVA / 8000VA premium servo stabilizer with ultra-fast correction speed",
    category: "Stabilizer",
    subcategory: "Servo Stabilizer",
    brand: "OMSUN",
    price: 60000,
    compareAt: 66000,
    image: omsunMser8kvaImg,
    badges: ["MSER Series", "13% VAT Incl.", "1 Year Warranty"],
    stock: 14,
    rating: 4.8,
    efficient: true,
    specs: [
      { label: "Model", value: "MSER-8KVA (MSER 8000)" },
      { label: "Capacity", value: "8 kVA / 8000 VA" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Gross Weight", value: "14.50 kg" },
      { label: "Net Weight", value: "13.50 kg" },
      { label: "Dimensions (L×W×H)", value: "40 × 38 × 24 cm" },
      { label: "Input Range", value: "140V – 260V AC" },
      { label: "Output Voltage", value: "220V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-mser-10kva",
    name: "OMSUN MSER-10KVA Servo Voltage Stabilizer",
    tagline: "10 kVA premium industrial servo stabilizer with digital control",
    category: "Stabilizer",
    subcategory: "Servo Stabilizer",
    brand: "OMSUN",
    price: 73500,
    compareAt: 82000,
    image: omsunMser10kvaImg,
    badges: ["MSER Series", "Commercial Grade", "1 Year Warranty"],
    stock: 10,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Model", value: "MSER-10KVA (MSER 10000)" },
      { label: "Capacity", value: "10 kVA / 10,000 VA" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Gross Weight", value: "18.30 kg" },
      { label: "Net Weight", value: "17.10 kg" },
      { label: "Dimensions (L×W×H)", value: "40 × 37.5 × 30.5 cm" },
      { label: "Input Range", value: "140V – 260V AC" },
      { label: "Output Voltage", value: "220V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-mser-15kva",
    name: "OMSUN MSER-15KVA Servo Voltage Stabilizer",
    tagline: "15 kVA high capacity single phase servo voltage stabilizer",
    category: "Stabilizer",
    subcategory: "Servo Stabilizer",
    brand: "OMSUN",
    price: 112500,
    compareAt: 125000,
    image: omsunMser15kvaImg,
    badges: ["15 kVA Single Phase", "Industrial", "1 Year Warranty"],
    stock: 8,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Model", value: "MSER-15KVA (MSER 15000)" },
      { label: "Capacity", value: "15 kVA / 15,000 VA" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Phase", value: "Single Phase (1:1)" },
      { label: "Input Range", value: "140V – 260V AC" },
      { label: "Output Voltage", value: "220V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // GROUP 2: OMSUN Three Phase Servo Motor Voltage Stabilizer
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "omsun-mser-10kva-3phase",
    name: "OMSUN MSER-10KVA Three Phase Servo Stabilizer",
    tagline: "10 kVA balanced 3-phase servo motor voltage stabilizer for factories & lifts",
    category: "Stabilizer",
    subcategory: "Three Phase Servo Stabilizer",
    brand: "OMSUN",
    price: 114000,
    compareAt: 128000,
    image: omsunMser10kva3PhaseImg,
    badges: ["3-Phase", "Individual Phase Control", "1 Year Warranty"],
    stock: 8,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Model", value: "MSER-10000/3Phase" },
      { label: "Capacity", value: "10 kVA (3-Phase)" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Gross Weight", value: "39.20 kg" },
      { label: "Net Weight", value: "28.10 kg" },
      { label: "Dimensions (L×W×H)", value: "63 × 31.5 × 55.5 cm" },
      { label: "Phase", value: "Three Phase 4-Wire (3:3)" },
      { label: "Input Range", value: "280V – 450V AC" },
      { label: "Output Voltage", value: "400V AC ±1% / 230V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-mser-15kva-3phase",
    name: "OMSUN MSER-15KVA Three Phase Servo Stabilizer",
    tagline: "15 kVA heavy duty 3-phase servo stabilizer with 3-phase digital meters",
    category: "Stabilizer",
    subcategory: "Three Phase Servo Stabilizer",
    brand: "OMSUN",
    price: 132000,
    compareAt: 148000,
    image: omsunMser15kva3PhaseImg,
    badges: ["3-Phase 15kVA", "Industrial Grade", "1 Year Warranty"],
    stock: 6,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Model", value: "MSER-15000/3Phase" },
      { label: "Capacity", value: "15 kVA (3-Phase)" },
      { label: "H.S. Code", value: "85044000" },
      { label: "Gross Weight", value: "43.70 kg" },
      { label: "Net Weight", value: "32.60 kg" },
      { label: "Dimensions (L×W×H)", value: "63 × 31.5 × 55.5 cm" },
      { label: "Phase", value: "Three Phase 4-Wire (3:3)" },
      { label: "Input Range", value: "280V – 450V AC" },
      { label: "Output Voltage", value: "400V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ══════════════════════════════════════════════════════════════════════════════
  // GROUP 3: Greenn Volt Single Phase Relay Based Stabiliser / AVR
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "green-volt-1kva",
    name: "Greenn Volt 1KVA Relay Based Stabiliser / AVR",
    tagline: "1 kVA ultra-compact automatic voltage regulator with zero-cross relay switching",
    description:
      "GREENNV VOLT is a trusted brand in digital voltage stabilizers for air conditioners, refrigerators, and home & office equipment. Its stabilizers are designed to help protect appliances from voltage fluctuations commonly experienced in Nepal.",
    category: "Stabilizer",
    subcategory: "Relay Based Stabilizer / AVR",
    brand: "Greenn Volt",
    price: 9900,
    compareAt: 11200,
    image: greenVolt1kvaImg,
    badges: ["Greenn Volt", "Budget AVR", "1 Year Warranty"],
    stock: 30,
    rating: 4.7,
    efficient: true,
    specs: [
      { label: "Brand", value: "Greenn Volt" },
      { label: "Capacity", value: "1 kVA / 1000 VA" },
      { label: "Phase", value: "Single Phase" },
      { label: "Applications", value: "Home & Office" },
      { label: "Origin", value: "Made in India" },
      { label: "Technology", value: "Microcontroller Relay Switching" },
      { label: "Zero-Crossing Tech", value: "Supported" },
      { label: "Smart Protection", value: "Overload, Short Circuit & High/Low Cut-off" },
      { label: "Input Voltage Range", value: "140V – 280V AC" },
      { label: "Output Voltage", value: "220V AC ±5%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "green-volt-2kva",
    name: "Greenn Volt 2KVA Relay Based Stabiliser / AVR",
    tagline: "2 kVA fast response relay automatic voltage stabilizer for home appliances",
    description:
      "GREENNV VOLT is a trusted brand in digital voltage stabilizers for air conditioners, refrigerators, and home & office equipment. Its stabilizers are designed to help protect appliances from voltage fluctuations commonly experienced in Nepal.",
    category: "Stabilizer",
    subcategory: "Relay Based Stabilizer / AVR",
    brand: "Greenn Volt",
    price: 12200,
    compareAt: 13800,
    image: greenVolt2kvaImg,
    badges: ["Greenn Volt", "Fast Switching", "1 Year Warranty"],
    stock: 25,
    rating: 4.8,
    efficient: true,
    specs: [
      { label: "Brand", value: "Greenn Volt" },
      { label: "Capacity", value: "2 kVA / 2000 VA" },
      { label: "Phase", value: "Single Phase" },
      { label: "Applications", value: "Home & Office" },
      { label: "Origin", value: "Made in India" },
      { label: "Zero-Crossing Tech", value: "Supported" },
      { label: "Smart Protection", value: "Overload, Short Circuit & High/Low Cut-off" },
      { label: "Input Voltage Range", value: "140V – 280V AC" },
      { label: "Output Voltage", value: "220V AC ±5%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "green-volt-4kva-110v",
    name: "Greenn Volt 4KVA Relay Stabiliser (110V–280V)",
    tagline: "4 kVA wide input range (110V-280V) stabilizer for air conditioners & pumps",
    description:
      "GREENNV VOLT is a trusted brand in digital voltage stabilizers for air conditioners, refrigerators, and home & office equipment. Its stabilizers are designed to help protect appliances from voltage fluctuations commonly experienced in Nepal.",
    category: "Stabilizer",
    subcategory: "Relay Based Stabilizer / AVR",
    brand: "Greenn Volt",
    price: 15000,
    compareAt: 17000,
    image: greenVolt4kva110vImg,
    badges: ["Wide Range 110V-280V", "Greenn Volt", "1 Year Warranty"],
    stock: 20,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Brand", value: "Greenn Volt" },
      { label: "Capacity", value: "4 kVA / 4000 VA" },
      { label: "Phase", value: "Single Phase" },
      { label: "Applications", value: "Home & Office" },
      { label: "Origin", value: "Made in India" },
      { label: "Input Voltage Range", value: "110V – 280V AC (Wide Range)" },
      { label: "Output Voltage", value: "220V AC ±5%" },
      { label: "Application", value: "Up to 1.5 Ton AC, Water Pumps, Mains" },
      { label: "Smart Protection", value: "Overload, Short Circuit & High/Low Cut-off" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "green-volt-4kva-90v",
    name: "Greenn Volt 4KVA Ultra Wide Range Stabiliser (90V–280V)",
    tagline: "4 kVA ultra wide input range (90V-280V) stabilizer for extreme low voltage",
    description:
      "GREENNV VOLT is a trusted brand in digital voltage stabilizers for air conditioners, refrigerators, and home & office equipment. Its stabilizers are designed to help protect appliances from voltage fluctuations commonly experienced in Nepal.",
    category: "Stabilizer",
    subcategory: "Relay Based Stabilizer / AVR",
    brand: "Greenn Volt",
    price: 19800,
    compareAt: 22000,
    image: greenVolt4kva90vImg,
    badges: ["Ultra Wide 90V-280V", "Extreme Low Voltage", "1 Year Warranty"],
    stock: 18,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Brand", value: "Greenn Volt" },
      { label: "Capacity", value: "4 kVA / 4000 VA" },
      { label: "Phase", value: "Single Phase" },
      { label: "Applications", value: "Home & Office" },
      { label: "Origin", value: "Made in India" },
      { label: "Input Voltage Range", value: "90V – 280V AC (Ultra Wide Range)" },
      { label: "Output Voltage", value: "220V AC ±5%" },
      { label: "Smart Protection", value: "Overload, Short Circuit & High/Low Cut-off" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "green-volt-4-2kva-90v",
    name: "Greenn Volt 4.2KVA Ultra Wide Range Stabiliser (90V–280V)",
    tagline: "4.2 kVA high-power low-voltage AVR with multi-relay step regulation",
    description:
      "GREENNV VOLT is a trusted brand in digital voltage stabilizers for air conditioners, refrigerators, and home & office equipment. Its stabilizers are designed to help protect appliances from voltage fluctuations commonly experienced in Nepal.",
    category: "Stabilizer",
    subcategory: "Relay Based Stabilizer / AVR",
    brand: "Greenn Volt",
    price: 20000,
    compareAt: 22500,
    image: greenVolt42kva90vImg,
    badges: ["4.2 kVA 90V-280V", "Heavy Inductive Load", "1 Year Warranty"],
    stock: 15,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Brand", value: "Greenn Volt" },
      { label: "Capacity", value: "4.2 kVA / 4200 VA" },
      { label: "Phase", value: "Single Phase" },
      { label: "Applications", value: "Home & Office" },
      { label: "Origin", value: "Made in India" },
      { label: "Input Voltage Range", value: "90V – 280V AC" },
      { label: "Output Voltage", value: "220V AC ±5%" },
      { label: "Smart Protection", value: "Overload, Short Circuit & High/Low Cut-off" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "green-volt-5kva-110v",
    name: "Greenn Volt 5KVA Relay Stabiliser (110V–280V)",
    tagline: "5 kVA mains automatic voltage stabilizer for homes, clinics & 2.0 Ton ACs",
    description:
      "GREENNV VOLT is a trusted brand in digital voltage stabilizers for air conditioners, refrigerators, and home & office equipment. Its stabilizers are designed to help protect appliances from voltage fluctuations commonly experienced in Nepal.",
    category: "Stabilizer",
    subcategory: "Relay Based Stabilizer / AVR",
    brand: "Greenn Volt",
    price: 16500,
    compareAt: 18500,
    image: greenVolt5kva110vImg,
    badges: ["5 kVA Whole Home", "110V-280V", "1 Year Warranty"],
    stock: 22,
    rating: 4.8,
    efficient: true,
    specs: [
      { label: "Brand", value: "Greenn Volt" },
      { label: "Capacity", value: "5 kVA / 5000 VA" },
      { label: "Phase", value: "Single Phase" },
      { label: "Applications", value: "Home & Office" },
      { label: "Origin", value: "Made in India" },
      { label: "Input Voltage Range", value: "110V – 280V AC" },
      { label: "Output Voltage", value: "220V AC ±5%" },
      { label: "Application", value: "Whole Home Mains, 2.0 Ton AC" },
      { label: "Smart Protection", value: "Overload, Short Circuit & High/Low Cut-off" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "green-volt-5kva-90v",
    name: "Greenn Volt 5KVA Ultra Wide Range Stabiliser (90V–280V)",
    tagline: "5 kVA extreme low voltage 90V-280V mains stabilizer with copper transformer",
    description:
      "GREENNV VOLT is a trusted brand in digital voltage stabilizers for air conditioners, refrigerators, and home & office equipment. Its stabilizers are designed to help protect appliances from voltage fluctuations commonly experienced in Nepal.",
    category: "Stabilizer",
    subcategory: "Relay Based Stabilizer / AVR",
    brand: "Greenn Volt",
    price: 21000,
    compareAt: 23500,
    image: greenVolt5kva90vImg,
    badges: ["5 kVA 90V-280V", "Top Seller", "1 Year Warranty"],
    stock: 18,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Brand", value: "Greenn Volt" },
      { label: "Capacity", value: "5 kVA / 5000 VA" },
      { label: "Phase", value: "Single Phase" },
      { label: "Applications", value: "Home & Office" },
      { label: "Origin", value: "Made in India" },
      { label: "Input Voltage Range", value: "90V – 280V AC (Extreme Low)" },
      { label: "Output Voltage", value: "220V AC ±5%" },
      { label: "Smart Protection", value: "Overload, Short Circuit & High/Low Cut-off" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // GROUP 4: OMSUN Oil Cooled Servo Voltage Stabilizer (Input 300VAC–470VAC)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "omsun-oil-cooled-30kva",
    name: "OMSUN 30 KVA Oil Cooled Servo Voltage Stabilizer",
    tagline: "30 kVA industrial oil cooled servo stabilizer (Input 300VAC–470VAC)",
    category: "Stabilizer",
    subcategory: "Oil Cooled Servo Stabilizer",
    brand: "OMSUN",
    price: 325000,
    compareAt: 360000,
    image: omsunMser15kva3PhaseImg,
    badges: ["Oil Cooled", "Input 300V-470V", "1 Year Warranty"],
    stock: 5,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Model", value: "OMSUN Oil Cooled 30 KVA" },
      { label: "Capacity", value: "30 kVA (3-Phase)" },
      { label: "Cooling Type", value: "Transformer Oil Immersed (ONAN)" },
      { label: "Input Voltage Range", value: "300V – 470V AC (3-Phase 4-Wire)" },
      { label: "Output Voltage", value: "400V AC ±1% (3-Phase Balanced)" },
      { label: "Efficiency", value: "> 98.5%" },
      { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" },
    ],
  },
  {
    id: "omsun-oil-cooled-40kva",
    name: "OMSUN 40 kVA Three-Phase Oil-Cooled Servo Voltage Stabilizer",
    tagline: "40 kVA three-phase oil-cooled servo voltage stabilizer (Input 160V–460V AC)",
    description:
      "The OMSUN 40 kVA Three-Phase Oil-Cooled Servo Voltage Stabilizer is designed to regulate unstable electrical voltage and provide a controlled output supply for industrial and commercial equipment. Its servo-controlled voltage correction system helps reduce the effects of low-voltage, high-voltage and voltage fluctuations on connected equipment.",
    category: "Stabilizer",
    subcategory: "Oil Cooled Servo Stabilizer",
    brand: "OMSUN",
    price: 425000,
    compareAt: 475000,
    image: "/uploads/omsun-40kva-oil-cooled-servo.jpg",
    images: ["/uploads/omsun-40kva-oil-cooled-servo.jpg"],
    badges: ["40 kVA Oil Cooled", "160V–460V Wide Range", "3 Phase", "1 Year Warranty"],
    stock: 5,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Brand", value: "OMSUN" },
      { label: "Capacity / Rating", value: "40 kVA" },
      { label: "Phase", value: "3 Phase" },
      { label: "Input Voltage", value: "160V – 460V AC" },
      { label: "Output Voltage", value: "380V AC ±1%" },
      { label: "Cooling Type", value: "Oil Cooled" },
      { label: "Lead / Current", value: "140 AMP" },
      { label: "Technology", value: "Servo-controlled automatic voltage regulation" },
      { label: "Applications", value: "Industrial Machinery, CNC, Printing & Medical" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-oil-cooled-40kva-260v",
    name: "OMSUN 40 kVA Three-Phase Oil-Cooled Servo Voltage Stabilizer (260V–480V)",
    tagline: "40 kVA three-phase oil-cooled servo stabilizer (Input 260V–480V AC, 100 AMP)",
    description:
      "The OMSUN 40 kVA Three-Phase Oil-Cooled Servo Voltage Stabilizer is designed to automatically regulate fluctuating electrical voltage and provide a stable output supply for industrial and commercial electrical systems. With an input voltage range of 260V–480V AC and regulated output of 380V AC ±1%, the stabilizer automatically responds to voltage fluctuations to support reliable operation of connected equipment. Its 40 kVA, three-phase, 100 AMP, oil-cooled configuration is suitable for demanding electrical environments.",
    category: "Stabilizer",
    subcategory: "Oil Cooled Servo Stabilizer",
    brand: "OMSUN",
    price: 395000,
    compareAt: 445000,
    image: "/uploads/omsun-40kva-oil-cooled-servo-blue.jpeg",
    images: ["/uploads/omsun-40kva-oil-cooled-servo-blue.jpeg"],
    badges: ["40 kVA Oil Cooled", "260V–480V AC", "100 AMP", "1 Year Warranty"],
    stock: 5,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Brand", value: "OMSUN" },
      { label: "Product Type", value: "Servo Voltage Stabilizer" },
      { label: "Capacity / Rating", value: "40 kVA" },
      { label: "Phase", value: "3 Phase" },
      { label: "Input Voltage", value: "260V – 480V AC" },
      { label: "Output Voltage", value: "380V AC ±1%" },
      { label: "Lead / Current", value: "100 AMP" },
      { label: "Cooling Type", value: "Oil Cooled" },
      { label: "Technology", value: "Servo-controlled automatic voltage regulation" },
      {
        label: "Applications",
        value: "Factory, CNC Machines, Printing, Medical & Commercial Loads",
      },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-oil-cooled-50kva",
    name: "OMSUN 50 KVA Oil Cooled Servo Voltage Stabilizer",
    tagline: "50 kVA heavy industrial oil cooled stabilizer with electrolytic copper windings",
    category: "Stabilizer",
    subcategory: "Oil Cooled Servo Stabilizer",
    brand: "OMSUN",
    price: 525000,
    compareAt: 575000,
    image: omsunMser15kva3PhaseImg,
    badges: ["50 kVA Oil Cooled", "Heavy Industry", "1 Year Warranty"],
    stock: 4,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Model", value: "OMSUN Oil Cooled 50 KVA" },
      { label: "Capacity", value: "50 kVA (3-Phase)" },
      { label: "Cooling", value: "High Grade Transformer Oil Tank" },
      { label: "Input Voltage", value: "300V – 470V AC" },
      { label: "Output Voltage", value: "400V AC ±1%" },
      { label: "Efficiency", value: "> 98.5%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-oil-cooled-60kva",
    name: "OMSUN 60 KVA Oil Cooled Servo Voltage Stabilizer",
    tagline: "60 kVA 3-phase oil immersed automatic voltage stabilizer",
    category: "Stabilizer",
    subcategory: "Oil Cooled Servo Stabilizer",
    brand: "OMSUN",
    price: 570000,
    compareAt: 625000,
    image: omsunMser15kva3PhaseImg,
    badges: ["60 kVA 3-Phase", "Oil Immersed", "1 Year Warranty"],
    stock: 3,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Model", value: "OMSUN Oil Cooled 60 KVA" },
      { label: "Capacity", value: "60 kVA (3-Phase)" },
      { label: "Cooling", value: "Oil Cooled (Natural Convection)" },
      { label: "Input Voltage", value: "300V – 470V AC" },
      { label: "Output Voltage", value: "400V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-oil-cooled-100kva",
    name: "OMSUN 100 KVA Oil Cooled Servo Voltage Stabilizer",
    tagline: "100 kVA high-power industrial oil cooled servo stabilizer",
    category: "Stabilizer",
    subcategory: "Oil Cooled Servo Stabilizer",
    brand: "OMSUN",
    price: 910000,
    compareAt: 995000,
    image: omsunMser15kva3PhaseImg,
    badges: ["100 kVA Industrial", "Heavy Plant Grade", "1 Year Warranty"],
    stock: 3,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Model", value: "OMSUN Oil Cooled 100 KVA" },
      { label: "Capacity", value: "100 kVA (3-Phase)" },
      { label: "Cooling", value: "Heavy Radiator Oil Tank" },
      { label: "Input Voltage", value: "300V – 470V AC" },
      { label: "Output Voltage", value: "400V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-oil-cooled-150kva",
    name: "OMSUN 150 KVA Oil Cooled Servo Voltage Stabilizer",
    tagline: "150 kVA enterprise utility-grade oil cooled servo voltage stabilizer",
    category: "Stabilizer",
    subcategory: "Oil Cooled Servo Stabilizer",
    brand: "OMSUN",
    price: 1290000,
    compareAt: 1420000,
    image: panelboard,
    badges: ["150 kVA Megawatt Grade", "Tier-1 Industry", "1 Year Warranty"],
    stock: 2,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Model", value: "OMSUN Oil Cooled 150 KVA" },
      { label: "Capacity", value: "150 kVA (3-Phase)" },
      { label: "Cooling", value: "Full Oil Immersed with Radiator Wings" },
      { label: "Input Voltage", value: "300V – 470V AC" },
      { label: "Output Voltage", value: "400V AC ±1%" },
      { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // GROUP 5: OMSUN Online LF UPS — Battery Volt System 120/144/192/240 VDC
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "omsun-online-lf-5kva-96vdc",
    name: "OMSUN Online LF UPS 5KVA / 96VDC",
    tagline: "5 kVA low-frequency online UPS with built-in isolation transformer (96VDC)",
    category: "UPS",
    subcategory: "Online LF UPS",
    brand: "OMSUN",
    price: 155000,
    compareAt: 172000,
    image: inverter,
    badges: ["Low Frequency (LF)", "96VDC Bus", "1 Year Warranty"],
    stock: 10,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Capacity", value: "5 kVA / 4000W" },
      { label: "Battery System", value: "96 VDC (8 Batteries)" },
      { label: "Topology", value: "Low Frequency Online Double Conversion" },
      { label: "Transformer", value: "Built-in Heavy Copper Isolation Transformer" },
      { label: "Output Voltage", value: "220V / 230V AC Pure Sine Wave" },
      { label: "Transfer Time", value: "0 ms (Zero Interruption)" },
      { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" },
    ],
  },
  {
    id: "omsun-online-lf-10kva-1-1",
    name: "OMSUN Online LF UPS 10KVA (1:1)",
    tagline: "10 kVA single-phase 1:1 online LF UPS (120/144/192/240 VDC)",
    category: "UPS",
    subcategory: "Online LF UPS",
    brand: "OMSUN",
    price: 275000,
    compareAt: 305000,
    image: inverter,
    badges: ["10 kVA (1:1)", "Isolation Transformer", "1 Year Warranty"],
    stock: 8,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Capacity", value: "10 kVA / 8000W" },
      { label: "Phase Configuration", value: "Single Phase In / Single Phase Out (1:1)" },
      { label: "Battery System", value: "120 / 144 / 192 / 240 VDC System" },
      { label: "Topology", value: "True Online Double Conversion LF" },
      { label: "Isolation", value: "Heavy Galvanic Isolation Transformer" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-online-lf-10kva-3-1",
    name: "OMSUN Online LF UPS 10KVA (3:1)",
    tagline: "10 kVA 3-phase input / single-phase output online LF UPS",
    category: "UPS",
    subcategory: "Online LF UPS",
    brand: "OMSUN",
    price: 300000,
    compareAt: 335000,
    image: inverter,
    badges: ["10 kVA (3:1)", "3-Phase In / 1-Phase Out", "1 Year Warranty"],
    stock: 7,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Capacity", value: "10 kVA / 8000W" },
      { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
      { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
      { label: "Galvanic Isolation", value: "Built-in Copper Transformer" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-online-lf-15kva-3-1",
    name: "OMSUN Online LF UPS 15KVA (3:1)",
    tagline: "15 kVA 3:1 online LF UPS with galvanic isolation transformer",
    category: "UPS",
    subcategory: "Online LF UPS",
    brand: "OMSUN",
    price: 380000,
    compareAt: 420000,
    image: inverter,
    badges: ["15 kVA (3:1)", "Enterprise Power", "1 Year Warranty"],
    stock: 6,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Capacity", value: "15 kVA / 12,000W" },
      { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
      { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
      { label: "Overload Capability", value: "125% for 10 min, 150% for 1 min" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "omsun-online-lf-20kva-3-1",
    name: "OMSUN Online LF UPS 20KVA (3:1)",
    tagline: "20 kVA 3-phase in / 1-phase out heavy duty industrial online UPS",
    category: "UPS",
    subcategory: "Online LF UPS",
    brand: "OMSUN",
    price: 460000,
    compareAt: 510000,
    image: inverter,
    badges: ["20 kVA (3:1)", "Heavy Industrial", "1 Year Warranty"],
    stock: 5,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Capacity", value: "20 kVA / 16,000W" },
      { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
      { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
      { label: "Efficiency", value: "> 94% Online Mode" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // GROUP 6: Power One On Line UPS — Battery Volt System 120/144/192/240 VDC
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "power-one-online-10kva-3-1",
    name: "Power One Online UPS 10KVA (3:1)",
    tagline: "10 kVA 3:1 high efficiency online double conversion UPS (120-240VDC)",
    category: "UPS",
    subcategory: "Industrial Online UPS",
    brand: "Power-One",
    price: 400000,
    compareAt: 445000,
    image: "https://poweroneups.com/img/product/pmp1.png",
    badges: ["Power-One", "3:1 Phase", "1 Year Warranty"],
    stock: 8,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Brand", value: "Power-One" },
      { label: "Capacity", value: "10 kVA / 9000W" },
      { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
      { label: "Battery System", value: "120 / 144 / 192 / 240 VDC System" },
      { label: "Inverter Topology", value: "3-Level IGBT Double Conversion" },
      { label: "Isolation", value: "Built-in Galvanic Isolation Transformer" },
      { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" },
    ],
  },
  {
    id: "power-one-online-20kva-3-1",
    name: "Power One Online UPS 20KVA (3:1)",
    tagline: "20 kVA 3-phase in / 1-phase out industrial online UPS",
    category: "UPS",
    subcategory: "Industrial Online UPS",
    brand: "Power-One",
    price: 750000,
    compareAt: 825000,
    image: "https://poweroneups.com/img/product/pmp1.png",
    badges: ["Power-One", "20 kVA (3:1)", "1 Year Warranty"],
    stock: 6,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Brand", value: "Power-One" },
      { label: "Capacity", value: "20 kVA / 18,000W" },
      { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
      { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
      { label: "Efficiency", value: "Up to 95% Online / 98% ECO Mode" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "power-one-online-20kva-3-3",
    name: "Power One Online UPS 20KVA (3:3)",
    tagline: "20 kVA 3-phase in / 3-phase out true industrial double conversion UPS",
    category: "UPS",
    subcategory: "Industrial Online UPS",
    brand: "Power-One",
    price: 800000,
    compareAt: 880000,
    image: "https://poweroneups.com/img/product/pmp1.png",
    badges: ["Power-One", "20 kVA 3-Phase (3:3)", "1 Year Warranty"],
    stock: 5,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Brand", value: "Power-One" },
      { label: "Capacity", value: "20 kVA / 18,000W (3-Phase)" },
      { label: "Phase Configuration", value: "3-Phase In / 3-Phase Out (3:3)" },
      { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
      { label: "Input PF", value: "> 0.99 with Active PFC" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
  {
    id: "power-one-online-30kva-3-1",
    name: "Power One Online UPS 30KVA (3:1)",
    tagline: "30 kVA high-power 3:1 online UPS with advanced DSP telemetry",
    category: "UPS",
    subcategory: "Industrial Online UPS",
    brand: "Power-One",
    price: 1000000,
    compareAt: 1100000,
    image: "https://poweroneups.com/img/product/pmp1.png",
    badges: ["Power-One", "30 kVA (3:1)", "1 Year Warranty"],
    stock: 4,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Brand", value: "Power-One" },
      { label: "Capacity", value: "30 kVA / 27,000W" },
      { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
      { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
      { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" },
    ],
  },
  {
    id: "power-one-online-30kva-3-3",
    name: "Power One Online UPS 30KVA (3:3)",
    tagline: "30 kVA 3-phase in / 3-phase out commercial & industrial online UPS",
    category: "UPS",
    subcategory: "Industrial Online UPS",
    brand: "Power-One",
    price: 960000,
    compareAt: 1060000,
    image: "https://poweroneups.com/img/product/pmp1.png",
    badges: ["Power-One", "30 kVA 3-Phase (3:3)", "1 Year Warranty"],
    stock: 4,
    rating: 5.0,
    efficient: true,
    specs: [
      { label: "Brand", value: "Power-One" },
      { label: "Capacity", value: "30 kVA / 27,000W (3-Phase)" },
      { label: "Phase Configuration", value: "3-Phase In / 3-Phase Out (3:3)" },
      { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
      { label: "Output Voltage", value: "380V / 400V / 415V AC (3-Phase)" },
      { label: "Warranty", value: "1 Year Full Warranty" },
    ],
  },
];

export const fallbackProducts: Product[] = [
  ...technoVisionProducts,
  ...baseFallbackProducts,
  ...smartenFallbackProducts,
  ...powerOneFallbackProducts,
];

export { technoVisionProducts };

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_API_URL"]) ||
  "http://localhost:4000";

export function resolveDbImage(
  image: string | null | undefined,
  _category?: string,
  _id?: string,
): string {
  if (!image || typeof image !== "string" || image.trim().length === 0) {
    return "";
  }

  const trimmed = image.trim();

  // 1. Base64 data URI or blob URL (e.g. instant preview in admin)
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // 2. Direct upload from Admin Panel (e.g. /uploads/filename.jpg)
  if (trimmed.startsWith("/uploads/")) {
    return `${API_BASE}${trimmed}`;
  }
  if (trimmed.startsWith("uploads/")) {
    return `${API_BASE}/${trimmed}`;
  }

  // 3. Absolute URL or relative asset path
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  return trimmed;
}

export function mapApiProductToProduct(apiProduct: {
  id: string;
  name: string;
  slug?: string | null;
  category: string;
  subcategory?: string | null;
  series?: string | null;
  model?: string | null;
  capacity?: string | null;
  brand: string;
  tagline: string | null;
  price: number;
  mrp: number | null;
  image: string | null;
  images?: string[] | string | null;
  stock: number;
  rating: number;
  badges: string[] | string;
  specs?: { label: string; value: string }[] | string | null;
  specifications?: Record<string, any> | string | null;
  features?: string[] | { label: string; value: string }[] | string | null;
  applications?: string[] | string | null;
  warranty?: string | null;
  brochure_url?: string | null;
  brochureUrl?: string | null;
  datasheet_url?: string | null;
  datasheetUrl?: string | null;
  source_url?: string | null;
  sourceUrl?: string | null;
  description?: string | null;
}): Product {
  const resolvedImage = resolveDbImage(apiProduct.image, apiProduct.category, apiProduct.id);
  
  let rawImages = apiProduct.images;
  if (typeof rawImages === "string") {
    try {
      rawImages = JSON.parse(rawImages);
    } catch {
      rawImages = [];
    }
  }

  let resolvedImages: string[] = resolvedImage ? [resolvedImage] : [];
  if (rawImages && Array.isArray(rawImages) && rawImages.length > 0) {
    const mapped = rawImages
      .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
      .map((img) => resolveDbImage(img, apiProduct.category, apiProduct.id))
      .filter((img) => img.length > 0);
    if (mapped.length > 0) {
      if (resolvedImage && !mapped.includes(resolvedImage)) {
        resolvedImages = [resolvedImage, ...mapped];
      } else {
        resolvedImages = mapped;
      }
    }
  }

  const parseJsonField = <T>(val: any, fallback: T): T => {
    if (!val) return fallback;
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return fallback; }
    }
    return val as T;
  };

  const parsedSpecs = parseJsonField(apiProduct.specs, []);
  const parsedSpecsObj = parseJsonField(apiProduct.specifications, {});
  const parsedFeatures = parseJsonField(apiProduct.features, []);
  const parsedApps = parseJsonField(apiProduct.applications, []);
  const parsedBadges = parseJsonField(apiProduct.badges, []);

  const base: Product = {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug || undefined,
    tagline: apiProduct.tagline || "",
    category: apiProduct.category,
    subcategory: apiProduct.subcategory || undefined,
    series: apiProduct.series || undefined,
    model: apiProduct.model || undefined,
    capacity: apiProduct.capacity || undefined,
    brand: apiProduct.brand,
    price: apiProduct.price,
    compareAt: undefined,
    image: resolvedImage,
    images: resolvedImages,
    badges: parsedBadges,
    stock: apiProduct.stock,
    rating: apiProduct.rating,
    efficient: apiProduct.rating >= 4.5,
    specs: Array.isArray(parsedSpecs) ? parsedSpecs : [],
    specifications:
      typeof parsedSpecsObj === "object" && parsedSpecsObj !== null && !Array.isArray(parsedSpecsObj)
        ? (parsedSpecsObj as Record<string, string>)
        : undefined,
    features: Array.isArray(parsedFeatures) ? parsedFeatures : undefined,
    applications: Array.isArray(parsedApps) ? parsedApps : undefined,
    warranty: apiProduct.warranty || undefined,
    brochureUrl: apiProduct.brochureUrl || apiProduct.brochure_url || undefined,
    datasheetUrl: apiProduct.datasheetUrl || apiProduct.datasheet_url || undefined,
    sourceUrl: apiProduct.sourceUrl || apiProduct.source_url || undefined,
    description: apiProduct.description || undefined,
  };
  if (apiProduct.mrp != null) {
    base.compareAt = apiProduct.mrp;
  }
  return base;
}

export const formatNPR = (value: number) => `Rs ${value.toLocaleString("en-IN")}`;

export const getProduct = (id: string) => fallbackProducts.find((p) => p.id === id);

// Alias used by components that import `products` directly (SSR-safe fallback)
export const products = fallbackProducts;


