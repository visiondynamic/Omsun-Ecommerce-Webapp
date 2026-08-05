import panel from "@/assets/p-panel.jpg";
import inverter from "@/assets/p-inverter.jpg";
import battery from "@/assets/p-battery.jpg";
import cable from "@/assets/p-cable.jpg";
import light from "@/assets/p-light.jpg";
import panelboard from "@/assets/p-panelboard.jpg";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  brand: string;
  price: number;
  compareAt?: number;
  image: string;
  badges: string[];
  stock: number;
  rating: number;
  efficient?: boolean;
  specs: { label: string; value: string }[];
};

export const CATEGORIES = [
  "Solar Panels",
  "Inverters",
  "Energy Storage",
  "Cables & Wiring",
  "Lighting",
  "Panels & Switchgear",
];

export const BRANDS = ["OMSUN", "Voltura", "HimalVolt", "SunCore"];

export const products: Product[] = [
  {
    id: "monocrystalline-550w",
    name: "OMSUN Mono 550W Panel",
    tagline: "N-type monocrystalline module built for Himalayan sun",
    category: "Solar Panels",
    brand: "OMSUN",
    price: 21500,
    compareAt: 24900,
    image: panel,
    badges: ["Best Seller"],
    stock: 48,
    rating: 4.9,
    efficient: true,
    specs: [
      { label: "Peak power", value: "550 Wp" },
      { label: "Cell type", value: "N-type mono PERC" },
      { label: "Efficiency", value: "22.4%" },
      { label: "Warranty", value: "25 years linear output" },
      { label: "Dimensions", value: "2278 × 1134 × 35 mm" },
    ],
  },
  {
    id: "hybrid-inverter-8kw",
    name: "Voltura Hybrid Inverter 8kW",
    tagline: "Grid-tied and off-grid in one silent chassis",
    category: "Inverters",
    brand: "Voltura",
    price: 189000,
    image: inverter,
    badges: ["Featured"],
    stock: 12,
    rating: 4.8,
    efficient: true,
    specs: [
      { label: "Rated power", value: "8 kW" },
      { label: "MPPT trackers", value: "2" },
      { label: "Peak efficiency", value: "98.2%" },
      { label: "Warranty", value: "10 years" },
      { label: "Monitoring", value: "Wi-Fi + app" },
    ],
  },
  {
    id: "lifepo4-10kwh",
    name: "HimalVolt 10kWh Storage",
    tagline: "LiFePO₄ wall battery with 6000-cycle life",
    category: "Energy Storage",
    brand: "HimalVolt",
    price: 425000,
    compareAt: 470000,
    image: battery,
    badges: ["New"],
    stock: 6,
    rating: 4.7,
    efficient: true,
    specs: [
      { label: "Capacity", value: "10.24 kWh" },
      { label: "Chemistry", value: "LiFePO₄" },
      { label: "Cycles", value: "6000 @ 80% DoD" },
      { label: "Warranty", value: "10 years" },
      { label: "Protection", value: "IP65" },
    ],
  },
  {
    id: "copper-cable-6mm",
    name: "OMSUN Pure Copper Cable 6mm²",
    tagline: "Flame-retardant DC solar cable, 100m drum",
    category: "Cables & Wiring",
    brand: "OMSUN",
    price: 12800,
    image: cable,
    badges: [],
    stock: 120,
    rating: 4.6,
    specs: [
      { label: "Conductor", value: "99.99% electrolytic copper" },
      { label: "Cross-section", value: "6 mm²" },
      { label: "Rating", value: "1500 V DC" },
      { label: "Length", value: "100 m" },
      { label: "Standard", value: "IEC 62930" },
    ],
  },
  {
    id: "led-panel-40w",
    name: "SunCore Edge LED Panel 40W",
    tagline: "Flicker-free 600×600 luminaire, 130 lm/W",
    category: "Lighting",
    brand: "SunCore",
    price: 3450,
    compareAt: 3990,
    image: light,
    badges: ["Best Seller"],
    stock: 0,
    rating: 4.5,
    efficient: true,
    specs: [
      { label: "Power", value: "40 W" },
      { label: "Efficacy", value: "130 lm/W" },
      { label: "CRI", value: ">85" },
      { label: "CCT", value: "4000K neutral" },
      { label: "Warranty", value: "3 years" },
    ],
  },
  {
    id: "distribution-board-12way",
    name: "OMSUN 12-Way Distribution Board",
    tagline: "IP54 industrial enclosure with surge protection",
    category: "Panels & Switchgear",
    brand: "OMSUN",
    price: 28400,
    image: panelboard,
    badges: ["Featured"],
    stock: 21,
    rating: 4.8,
    specs: [
      { label: "Ways", value: "12" },
      { label: "Rating", value: "63 A, 415 V" },
      { label: "Protection", value: "IP54 powder-coated" },
      { label: "Includes", value: "Type 2 SPD" },
      { label: "Warranty", value: "5 years" },
    ],
  },
];

export const formatNPR = (value: number) => `Rs ${value.toLocaleString("en-IN")}`;

export const getProduct = (id: string) => products.find((p) => p.id === id);
