import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export async function setup() {
  const host = process.env.MYSQLHOST || process.env.DB_HOST || "localhost";
  const user = process.env.MYSQLUSER || process.env.DB_USER || "root";
  const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "";
  const database = process.env.MYSQLDATABASE || process.env.DB_NAME || "omsun";
  const port = process.env.MYSQLPORT ? Number(process.env.MYSQLPORT) : Number(process.env.DB_PORT || 3306);

  console.log(`Connecting to MySQL on ${host}:${port} as ${user}...`);

  // Ensure target database exists first
  if (!process.env.MYSQL_URL && !process.env.DATABASE_URL) {
    try {
      const initConn = await mysql.createConnection({ host, user, password, port });
      await initConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await initConn.end();
    } catch (e) {
      console.log("Note on database existence check:", e.message);
    }
  }

  const conn = process.env.MYSQL_URL || process.env.DATABASE_URL
    ? await mysql.createConnection({ uri: process.env.MYSQL_URL || process.env.DATABASE_URL, multipleStatements: true })
    : await mysql.createConnection({
        host,
        user,
        password,
        port,
        database,
        multipleStatements: true,
      });

  console.log("Reading schema.sql...");
  const schemaPath = path.resolve(__dirname, "../schema.sql");
  let schemaSql = fs.readFileSync(schemaPath, "utf-8");

  // Remove hardcoded CREATE DATABASE/USE statements so it targets the active DB
  schemaSql = schemaSql.replace(/CREATE DATABASE IF NOT EXISTS omsun[^;]*;/gi, "");
  schemaSql = schemaSql.replace(/USE omsun;/gi, "");

  console.log(`Executing schema to create tables in '${database}'...`);
  await conn.query(schemaSql);
  console.log("✓ Database tables created successfully!");

  // Ensure subcategory column exists in products table
  try {
    const [cols] = await conn.query("SHOW COLUMNS FROM products LIKE 'subcategory'");
    if (cols.length === 0) {
      console.log("Adding 'subcategory' column to products table...");
      await conn.query("ALTER TABLE products ADD COLUMN subcategory VARCHAR(120) NULL AFTER category");
    }
  } catch (err) {
    console.log("Note on subcategory column check:", err.message);
  }

  // 1. Sync & Seed official products catalog from OMSUN Nepal & SineWave International Price List (Effective Shrawan 1, 2083 B.S.)
  console.log("Synchronizing official 32 products catalog into database...");
  const products = [
    // ══════════════════════════════════════════════════════════════════════════════
    // GROUP 1: OMSUN Servo Motor Voltage Stabilizer (Single Phase)
    // ══════════════════════════════════════════════════════════════════════════════
    {
      id: "omsun-mter-1kva",
      name: "OMSUN MTER-1KVA Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Servo Stabilizer",
      brand: "OMSUN",
      tagline: "1 kVA / 1000VA precision single phase servo motor automatic voltage regulator",
      description: "OMSUN MTER-1000 provides high-precision ±1% output voltage stabilization for sensitive home electronics, medical appliances, and office equipment with rapid servo motor correction and pure copper toroidal transformer.",
      price: 15800,
      mrp: 17500,
      image: "/products/omsun-mter-1kva.webp",
      features: JSON.stringify(["Precision Servo Motor", "13% VAT Included", "Pure Copper Coil", "Overload & Surge Protection"]),
      specs: JSON.stringify([
        { label: "Model", value: "MTER-1KVA (MTER 1000)" },
        { label: "Capacity", value: "1 kVA / 1000 VA" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Gross Weight", value: "5.66 kg" },
        { label: "Net Weight", value: "5.20 kg" },
        { label: "Dimensions (L×W×H)", value: "40 × 31 × 39.5 cm" },
        { label: "Input Range", value: "140V – 260V AC" },
        { label: "Output Voltage", value: "220V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 25,
      rating: 4.8,
      badges: JSON.stringify(["Servo Motor", "13% VAT Incl.", "1 Year Warranty"])
    },
    {
      id: "omsun-mter-2kva",
      name: "OMSUN MTER-2KVA Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Servo Stabilizer",
      brand: "OMSUN",
      tagline: "2 kVA / 2000VA high accuracy servo motor voltage regulator for refrigerators & labs",
      description: "Engineered for smooth stepless voltage regulation with zero waveform distortion, heavy duty digital telemetry display, and automatic high/low cutoff protection.",
      price: 20500,
      mrp: 23000,
      image: "/products/omsun-mter-2kva.webp",
      features: JSON.stringify(["Servo Motor Control", "Digital Voltmeter", "Zero Waveform Distortion", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "MTER-2KVA (MTER 2000)" },
        { label: "Capacity", value: "2 kVA / 2000 VA" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Gross Weight", value: "6.65 kg" },
        { label: "Net Weight", value: "6.10 kg" },
        { label: "Dimensions (L×W×H)", value: "42.5 × 33.5 × 21 cm" },
        { label: "Input Range", value: "140V – 260V AC" },
        { label: "Output Voltage", value: "220V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 20,
      rating: 4.9,
      badges: JSON.stringify(["Servo Motor", "Best Seller", "1 Year Warranty"])
    },
    {
      id: "omsun-mter-3kva",
      name: "OMSUN MTER-3KVA Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Servo Stabilizer",
      brand: "OMSUN",
      tagline: "3 kVA / 3000VA motorized servo voltage regulator for home & commercial gear",
      description: "Delivers stable 220V power to residential air conditioners, laser printers, deep freezers, and diagnostic instrumentation across Nepal's power fluctuations.",
      price: 33600,
      mrp: 37000,
      image: "/products/omsun-mter-3kva.webp",
      features: JSON.stringify(["High Accuracy ±1%", "Copper Wound Toroid", "Digital Dual Readout", "13% VAT Included"]),
      specs: JSON.stringify([
        { label: "Model", value: "MTER-3KVA (MTER 3000)" },
        { label: "Capacity", value: "3 kVA / 3000 VA" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Gross Weight", value: "9.50 kg" },
        { label: "Net Weight", value: "8.80 kg" },
        { label: "Dimensions (L×W×H)", value: "62 × 37 × 27 cm" },
        { label: "Input Range", value: "140V – 260V AC" },
        { label: "Output Voltage", value: "220V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 18,
      rating: 4.8,
      badges: JSON.stringify(["Servo Motor", "13% VAT Incl.", "1 Year Warranty"])
    },
    {
      id: "omsun-mter-5kva",
      name: "OMSUN MTER-5KVA Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Servo Stabilizer",
      brand: "OMSUN",
      tagline: "5 kVA / 5000VA heavy duty servo stabilizer for whole home and office mains",
      description: "Continuous duty single phase servo stabilizer designed to safeguard entire apartments, clinics, and commercial workstations from severe low and fluctuating voltage.",
      price: 39500,
      mrp: 44000,
      image: "/products/omsun-mter-5kva.webp",
      features: JSON.stringify(["Whole House Mains", "Toroidal Copper Core", "Time Delay Safety", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "MTER-5KVA (MTER 5000)" },
        { label: "Capacity", value: "5 kVA / 5000 VA" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Gross Weight", value: "14.00 kg" },
        { label: "Net Weight", value: "13.00 kg" },
        { label: "Dimensions (L×W×H)", value: "40 × 38 × 24 cm" },
        { label: "Input Range", value: "140V – 260V AC" },
        { label: "Output Voltage", value: "220V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 16,
      rating: 5.0,
      badges: JSON.stringify(["Mains Stabilizer", "Top Rated", "1 Year Warranty"])
    },
    {
      id: "omsun-mter-10kva",
      name: "OMSUN MTER-10KVA Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Servo Stabilizer",
      brand: "OMSUN",
      tagline: "10 kVA high power commercial servo motor AVR with digital voltmeter",
      description: "High-capacity 10 kVA stabilizer with motorized carbon brush assembly, instant voltage correction, thermal protection, and digital monitoring for commercial premises.",
      price: 81000,
      mrp: 90000,
      image: "/products/omsun-mter-10kva.webp",
      features: JSON.stringify(["10 kVA Heavy Power", "Microprocessor Control", "Industrial Carbon Brushes", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "MTER-10KVA (MTER 10000)" },
        { label: "Capacity", value: "10 kVA / 10,000 VA" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Gross Weight", value: "21.20 kg" },
        { label: "Net Weight", value: "19.10 kg" },
        { label: "Dimensions (L×W×H)", value: "50 × 43.5 × 33 cm" },
        { label: "Input Range", value: "140V – 260V AC" },
        { label: "Output Voltage", value: "220V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 12,
      rating: 4.9,
      badges: JSON.stringify(["10 kVA High Power", "13% VAT Incl.", "1 Year Warranty"])
    },
    {
      id: "omsun-mser-8kva",
      name: "OMSUN MSER-8KVA Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Servo Stabilizer",
      brand: "OMSUN",
      tagline: "8 kVA / 8000VA premium servo stabilizer with ultra-fast correction speed",
      description: "Heavy duty MSER series stabilizer with advanced electronic sensing and pure copper winding for commercial and industrial single phase loads.",
      price: 60000,
      mrp: 66000,
      image: "/products/omsun-mser-8kva.webp",
      features: JSON.stringify(["MSER Series", "Rapid Response Time", "High Efficiency >98%", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "MSER-8KVA (MSER 8000)" },
        { label: "Capacity", value: "8 kVA / 8000 VA" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Gross Weight", value: "14.50 kg" },
        { label: "Net Weight", value: "13.50 kg" },
        { label: "Dimensions (L×W×H)", value: "40 × 38 × 24 cm" },
        { label: "Input Range", value: "140V – 260V AC" },
        { label: "Output Voltage", value: "220V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 14,
      rating: 4.8,
      badges: JSON.stringify(["MSER Series", "13% VAT Incl.", "1 Year Warranty"])
    },
    {
      id: "omsun-mser-10kva",
      name: "OMSUN MSER-10KVA Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Servo Stabilizer",
      brand: "OMSUN",
      tagline: "10 kVA premium industrial servo stabilizer with digital control",
      description: "Heavy duty 10kVA single phase MSER series stabilizer featuring advanced microprocessor control and precision servo motor response for commercial facilities.",
      price: 73500,
      mrp: 82000,
      image: "/products/omsun-mser-10kva.webp",
      features: JSON.stringify(["MSER Commercial Series", "Precision ±1% Output", "Heavy Enclosure", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "MSER-10KVA (MSER 10000)" },
        { label: "Capacity", value: "10 kVA / 10,000 VA" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Gross Weight", value: "18.30 kg" },
        { label: "Net Weight", value: "17.10 kg" },
        { label: "Dimensions (L×W×H)", value: "40 × 37.5 × 30.5 cm" },
        { label: "Input Range", value: "140V – 260V AC" },
        { label: "Output Voltage", value: "220V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 10,
      rating: 4.9,
      badges: JSON.stringify(["MSER Series", "Commercial Grade", "1 Year Warranty"])
    },
    {
      id: "omsun-mser-15kva",
      name: "OMSUN MSER-15KVA Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Servo Stabilizer",
      brand: "OMSUN",
      tagline: "15 kVA high capacity single phase servo voltage stabilizer",
      description: "Engineered for large bungalows, elevators, and heavy industrial single-phase machinery requiring uninterrupted ±1% voltage stabilization.",
      price: 112500,
      mrp: 125000,
      image: "/products/omsun-mser-15kva.webp",
      features: JSON.stringify(["15 kVA Single Phase", "Industrial Heavy Copper", "LCD Display", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "MSER-15KVA (MSER 15000)" },
        { label: "Capacity", value: "15 kVA / 15,000 VA" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Phase", value: "Single Phase (1:1)" },
        { label: "Input Range", value: "140V – 260V AC" },
        { label: "Output Voltage", value: "220V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 8,
      rating: 5.0,
      badges: JSON.stringify(["15 kVA Single Phase", "Industrial", "1 Year Warranty"])
    },

    // ══════════════════════════════════════════════════════════════════════════════
    // GROUP 2: OMSUN Three Phase Servo Motor Voltage Stabilizer
    // ══════════════════════════════════════════════════════════════════════════════
    {
      id: "omsun-mser-10kva-3phase",
      name: "OMSUN MSER-10KVA Three Phase Servo Stabilizer",
      category: "Stabilizer",
      subcategory: "Three Phase Servo Stabilizer",
      brand: "OMSUN",
      tagline: "10 kVA balanced 3-phase servo motor voltage stabilizer for factories & lifts",
      description: "Features 3 independent servo control channels for R, Y, B phases with individual voltage sensing, LCD telemetry, and heavy duty cabinet with castor wheels.",
      price: 114000,
      mrp: 128000,
      image: "/products/omsun-mser-10kva-3phase.webp",
      features: JSON.stringify(["3-Phase Independent Control", "Castor Wheels Enclosure", "3x LED Voltmeters", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "MSER-10000/3Phase" },
        { label: "Capacity", value: "10 kVA (3-Phase)" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Gross Weight", value: "39.20 kg" },
        { label: "Net Weight", value: "28.10 kg" },
        { label: "Dimensions (L×W×H)", value: "63 × 31.5 × 55.5 cm" },
        { label: "Phase", value: "Three Phase 4-Wire (3:3)" },
        { label: "Input Range", value: "280V – 450V AC (Phase to Phase)" },
        { label: "Output Voltage", value: "400V AC ±1% / 230V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 8,
      rating: 4.9,
      badges: JSON.stringify(["3-Phase", "Individual Phase Control", "1 Year Warranty"])
    },
    {
      id: "omsun-mser-15kva-3phase",
      name: "OMSUN MSER-15KVA Three Phase Servo Stabilizer",
      category: "Stabilizer",
      subcategory: "Three Phase Servo Stabilizer",
      brand: "OMSUN",
      tagline: "15 kVA heavy duty 3-phase servo stabilizer with 3-phase digital meters",
      description: "Industrial 15 kVA 3-phase stabilizer engineered to eliminate phase imbalances, voltage sags, and surges across CNC, elevators, and hospital equipment.",
      price: 132000,
      mrp: 148000,
      image: "/products/omsun-mser-15kva-3phase.webp",
      features: JSON.stringify(["15 kVA 3-Phase", "Phase Imbalance Correction", "Industrial Heavy Duty", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "MSER-15000/3Phase" },
        { label: "Capacity", value: "15 kVA (3-Phase)" },
        { label: "H.S. Code", value: "85044000" },
        { label: "Gross Weight", value: "43.70 kg" },
        { label: "Net Weight", value: "32.60 kg" },
        { label: "Dimensions (L×W×H)", value: "63 × 31.5 × 55.5 cm" },
        { label: "Phase", value: "Three Phase 4-Wire (3:3)" },
        { label: "Input Range", value: "280V – 450V AC" },
        { label: "Output Voltage", value: "400V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 6,
      rating: 5.0,
      badges: JSON.stringify(["3-Phase 15kVA", "Industrial Grade", "1 Year Warranty"])
    },

    // ══════════════════════════════════════════════════════════════════════════════
    // GROUP 3: Green Volt Single Phase Relay Based Stabiliser / AVR
    // ══════════════════════════════════════════════════════════════════════════════
    {
      id: "green-volt-1kva",
      name: "Green Volt 1KVA Relay Based Stabiliser / AVR",
      category: "Stabilizer",
      subcategory: "Relay Based Stabilizer / AVR",
      brand: "Green Volt",
      tagline: "1 kVA ultra-compact automatic voltage regulator with zero-cross relay switching",
      description: "Ideal for TVs, music systems, computers, and home electronics. Fast micro-relay switching with high/low voltage cutoff and surge suppression.",
      price: 9900,
      mrp: 11200,
      image: "/products/green-volt-1kva.webp",
      features: JSON.stringify(["Green Volt AVR", "High Speed Relay", "Digital Display", "13% VAT Included"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Green Volt" },
        { label: "Capacity", value: "1 kVA / 1000 VA" },
        { label: "Technology", value: "Microcontroller Relay Switching" },
        { label: "Input Voltage Range", value: "140V – 280V AC" },
        { label: "Output Voltage", value: "220V AC ±5%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 30,
      rating: 4.7,
      badges: JSON.stringify(["Green Volt", "Budget AVR", "1 Year Warranty"])
    },
    {
      id: "green-volt-2kva",
      name: "Green Volt 2KVA Relay Based Stabiliser / AVR",
      category: "Stabilizer",
      subcategory: "Relay Based Stabilizer / AVR",
      brand: "Green Volt",
      tagline: "2 kVA fast response relay automatic voltage stabilizer for home appliances",
      description: "Provides dependable power regulation for inverter refrigerators, home entertainment setups, deep freezers, and office electronics.",
      price: 12200,
      mrp: 13800,
      image: "/products/green-volt-2kva.webp",
      features: JSON.stringify(["Fast Step Switching", "Dual Voltmeter Readout", "Surge Protection", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Green Volt" },
        { label: "Capacity", value: "2 kVA / 2000 VA" },
        { label: "Input Voltage Range", value: "140V – 280V AC" },
        { label: "Output Voltage", value: "220V AC ±5%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 25,
      rating: 4.8,
      badges: JSON.stringify(["Green Volt", "Fast Switching", "1 Year Warranty"])
    },
    {
      id: "green-volt-4kva-110v",
      name: "Green Volt 4KVA Relay Stabiliser (110V–280V)",
      category: "Stabilizer",
      subcategory: "Relay Based Stabilizer / AVR",
      brand: "Green Volt",
      tagline: "4 kVA wide input range (110V-280V) stabilizer for air conditioners & pumps",
      description: "Specially built for low voltage grid areas down to 110V with robust copper transformer, intelligent digital display, and smart delay timers.",
      price: 15000,
      mrp: 17000,
      image: "/products/green-volt-4kva-110v.webp",
      features: JSON.stringify(["Wide Input 110V-280V", "Up to 1.5 Ton AC", "Safety Delay Timer", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Green Volt" },
        { label: "Capacity", value: "4 kVA / 4000 VA" },
        { label: "Input Voltage Range", value: "110V – 280V AC (Wide Range)" },
        { label: "Output Voltage", value: "220V AC ±5%" },
        { label: "Application", value: "Up to 1.5 Ton AC, Water Pumps, Mains" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 20,
      rating: 4.9,
      badges: JSON.stringify(["Wide Range 110V-280V", "Green Volt", "1 Year Warranty"])
    },
    {
      id: "green-volt-4kva-90v",
      name: "Green Volt 4KVA Ultra Wide Range Stabiliser (90V–280V)",
      category: "Stabilizer",
      subcategory: "Relay Based Stabilizer / AVR",
      brand: "Green Volt",
      tagline: "4 kVA ultra wide input range (90V-280V) stabilizer for extreme low voltage",
      description: "Engineered for rural and industrial zones with severe voltage drop, stabilizing from as low as 90VAC with heavy duty multi-tap transformer.",
      price: 19800,
      mrp: 22000,
      image: "/products/green-volt-4kva-90v.webp",
      features: JSON.stringify(["Ultra Low 90V Operating", "Multi-Tap Heavy Transformer", "Digital Telemetry", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Green Volt" },
        { label: "Capacity", value: "4 kVA / 4000 VA" },
        { label: "Input Voltage Range", value: "90V – 280V AC (Ultra Wide Range)" },
        { label: "Output Voltage", value: "220V AC ±5%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 18,
      rating: 4.9,
      badges: JSON.stringify(["Ultra Wide 90V-280V", "Extreme Low Voltage", "1 Year Warranty"])
    },
    {
      id: "green-volt-4-2kva-90v",
      name: "Green Volt 4.2KVA Ultra Wide Range Stabiliser (90V–280V)",
      category: "Stabilizer",
      subcategory: "Relay Based Stabilizer / AVR",
      brand: "Green Volt",
      tagline: "4.2 kVA high-power low-voltage AVR with multi-relay step regulation",
      description: "Enhanced 4.2 kVA model handling heavy inductive compressor loads even when utility grid voltage drops down to 90V.",
      price: 20000,
      mrp: 22500,
      image: "/products/green-volt-4-2kva-90v.webp",
      features: JSON.stringify(["4.2 kVA High Output", "90V-280V Voltage Range", "Heavy Inductive Load", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Green Volt" },
        { label: "Capacity", value: "4.2 kVA / 4200 VA" },
        { label: "Input Voltage Range", value: "90V – 280V AC" },
        { label: "Output Voltage", value: "220V AC ±5%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 15,
      rating: 4.9,
      badges: JSON.stringify(["4.2 kVA 90V-280V", "Heavy Inductive Load", "1 Year Warranty"])
    },
    {
      id: "green-volt-5kva-110v",
      name: "Green Volt 5KVA Relay Stabiliser (110V–280V)",
      category: "Stabilizer",
      subcategory: "Relay Based Stabilizer / AVR",
      brand: "Green Volt",
      tagline: "5 kVA mains automatic voltage stabilizer for homes, clinics & 2.0 Ton ACs",
      description: "Delivers robust whole-home mains stabilization with 110V–280V wide operating window, dual LED readout, and safety time delay mechanism.",
      price: 16500,
      mrp: 18500,
      image: "/products/green-volt-5kva-110v.webp",
      features: JSON.stringify(["5 kVA Mains Power", "110V-280V Wide Range", "2.0 Ton AC Compatible", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Green Volt" },
        { label: "Capacity", value: "5 kVA / 5000 VA" },
        { label: "Input Voltage Range", value: "110V – 280V AC" },
        { label: "Output Voltage", value: "220V AC ±5%" },
        { label: "Application", value: "Whole Home Mains, 2.0 Ton AC" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 22,
      rating: 4.8,
      badges: JSON.stringify(["5 kVA Whole Home", "110V-280V", "1 Year Warranty"])
    },
    {
      id: "green-volt-5kva-90v",
      name: "Green Volt 5KVA Ultra Wide Range Stabiliser (90V–280V)",
      category: "Stabilizer",
      subcategory: "Relay Based Stabilizer / AVR",
      brand: "Green Volt",
      tagline: "5 kVA extreme low voltage 90V-280V mains stabilizer with copper transformer",
      description: "Ultimate 5 kVA protection for whole houses and commercial spaces in severe low-voltage areas, starting from 90V with pure copper winding.",
      price: 21000,
      mrp: 23500,
      image: "/products/green-volt-5kva-90v.webp",
      features: JSON.stringify(["Top Seller 5kVA", "90V Extreme Low Input", "Copper Wound Core", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Green Volt" },
        { label: "Capacity", value: "5 kVA / 5000 VA" },
        { label: "Input Voltage Range", value: "90V – 280V AC (Extreme Low)" },
        { label: "Output Voltage", value: "220V AC ±5%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 18,
      rating: 5.0,
      badges: JSON.stringify(["5 kVA 90V-280V", "Top Seller", "1 Year Warranty"])
    },

    // ══════════════════════════════════════════════════════════════════════════════
    // GROUP 4: OMSUN Oil Cooled Servo Voltage Stabilizer (Input 300VAC–470VAC)
    // ══════════════════════════════════════════════════════════════════════════════
    {
      id: "omsun-oil-cooled-30kva",
      name: "OMSUN 30 KVA Oil Cooled Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Oil Cooled Servo Stabilizer",
      brand: "OMSUN",
      tagline: "30 kVA industrial oil cooled servo stabilizer (Input 300VAC–470VAC)",
      description: "Heavy industrial transformer oil-immersed servo stabilizer engineered for continuous 24/7 manufacturing plants, CNC machinery, and packaging lines.",
      price: 325000,
      mrp: 360000,
      image: "/products/omsun-mser-15kva-3phase.webp",
      features: JSON.stringify(["Oil Cooled ONAN", "Input 300V-470V AC", "98.5% Efficiency", "1 Year Full Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "OMSUN Oil Cooled 30 KVA" },
        { label: "Capacity", value: "30 kVA (3-Phase)" },
        { label: "Cooling Type", value: "Transformer Oil Immersed (ONAN)" },
        { label: "Input Voltage Range", value: "300V – 470V AC (3-Phase 4-Wire)" },
        { label: "Output Voltage", value: "400V AC ±1% (3-Phase Balanced)" },
        { label: "Efficiency", value: "> 98.5%" },
        { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" }
      ]),
      stock: 5,
      rating: 5.0,
      badges: JSON.stringify(["Oil Cooled", "Input 300V-470V", "1 Year Warranty"])
    },
    {
      id: "omsun-oil-cooled-50kva",
      name: "OMSUN 50 KVA Oil Cooled Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Oil Cooled Servo Stabilizer",
      brand: "OMSUN",
      tagline: "50 kVA heavy industrial oil cooled stabilizer with electrolytic copper windings",
      description: "Designed for hospitals, stone crushers, flour mills, and textile printing with superior heat dissipation and high overload withstand capability.",
      price: 525000,
      mrp: 575000,
      image: "/products/omsun-mser-15kva-3phase.webp",
      features: JSON.stringify(["50 kVA 3-Phase", "Electrolytic Copper", "Heavy Oil Tank", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "OMSUN Oil Cooled 50 KVA" },
        { label: "Capacity", value: "50 kVA (3-Phase)" },
        { label: "Cooling", value: "High Grade Transformer Oil Tank" },
        { label: "Input Voltage", value: "300V – 470V AC" },
        { label: "Output Voltage", value: "400V AC ±1%" },
        { label: "Efficiency", value: "> 98.5%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 4,
      rating: 5.0,
      badges: JSON.stringify(["50 kVA Oil Cooled", "Heavy Industry", "1 Year Warranty"])
    },
    {
      id: "omsun-oil-cooled-60kva",
      name: "OMSUN 60 KVA Oil Cooled Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Oil Cooled Servo Stabilizer",
      brand: "OMSUN",
      tagline: "60 kVA 3-phase oil immersed automatic voltage stabilizer",
      description: "High-performance industrial stabilizer with motorized carbon roller drive, low temperature rise, and digital telemetry control panel.",
      price: 570000,
      mrp: 625000,
      image: "/products/omsun-mser-15kva-3phase.webp",
      features: JSON.stringify(["60 kVA Industrial", "Motorized Roller Drive", "Low Temp Rise", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "OMSUN Oil Cooled 60 KVA" },
        { label: "Capacity", value: "60 kVA (3-Phase)" },
        { label: "Cooling", value: "Oil Cooled (Natural Convection)" },
        { label: "Input Voltage", value: "300V – 470V AC" },
        { label: "Output Voltage", value: "400V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 3,
      rating: 4.9,
      badges: JSON.stringify(["60 kVA 3-Phase", "Oil Immersed", "1 Year Warranty"])
    },
    {
      id: "omsun-oil-cooled-100kva",
      name: "OMSUN 100 KVA Oil Cooled Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Oil Cooled Servo Stabilizer",
      brand: "OMSUN",
      tagline: "100 kVA high-power industrial oil cooled servo stabilizer",
      description: "Heavy duty industrial plant power stabilizer with massive copper coils, radiator fins, oil level gauge, and temperature telemetry.",
      price: 910000,
      mrp: 995000,
      image: "/products/omsun-mser-15kva-3phase.webp",
      features: JSON.stringify(["100 kVA Plant Grade", "Radiator Fin Tank", "Digital Telemetry", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "OMSUN Oil Cooled 100 KVA" },
        { label: "Capacity", value: "100 kVA (3-Phase)" },
        { label: "Cooling", value: "Heavy Radiator Oil Tank" },
        { label: "Input Voltage", value: "300V – 470V AC" },
        { label: "Output Voltage", value: "400V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 3,
      rating: 5.0,
      badges: JSON.stringify(["100 kVA Industrial", "Heavy Plant Grade", "1 Year Warranty"])
    },
    {
      id: "omsun-oil-cooled-150kva",
      name: "OMSUN 150 KVA Oil Cooled Servo Voltage Stabilizer",
      category: "Stabilizer",
      subcategory: "Oil Cooled Servo Stabilizer",
      brand: "OMSUN",
      tagline: "150 kVA enterprise utility-grade oil cooled servo voltage stabilizer",
      description: "Top-tier industrial AVR engineered for entire commercial complexes, cement plants, hospitals, and heavy manufacturing across Nepal.",
      price: 129000,
      mrp: 1420000,
      price: 1290000,
      mrp: 1420000,
      image: "/p-panelboard.jpg",
      features: JSON.stringify(["150 kVA Megawatt Grade", "Utility Plant Grade", "13% VAT Included", "1 Year Full Warranty"]),
      specs: JSON.stringify([
        { label: "Model", value: "OMSUN Oil Cooled 150 KVA" },
        { label: "Capacity", value: "150 kVA (3-Phase)" },
        { label: "Cooling", value: "Full Oil Immersed with Radiator Wings" },
        { label: "Input Voltage", value: "300V – 470V AC" },
        { label: "Output Voltage", value: "400V AC ±1%" },
        { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" }
      ]),
      stock: 2,
      rating: 5.0,
      badges: JSON.stringify(["150 kVA Megawatt Grade", "Tier-1 Industry", "1 Year Warranty"])
    },

    // ══════════════════════════════════════════════════════════════════════════════
    // GROUP 5: OMSUN Online LF UPS — Battery Volt System 120/144/192/240 VDC
    // ══════════════════════════════════════════════════════════════════════════════
    {
      id: "omsun-online-lf-5kva-96vdc",
      name: "OMSUN Online LF UPS 5KVA / 96VDC",
      category: "UPS",
      subcategory: "Online LF UPS",
      brand: "OMSUN",
      tagline: "5 kVA low-frequency online UPS with built-in isolation transformer (96VDC)",
      description: "True double-conversion low-frequency UPS featuring heavy copper isolation transformer, 96V DC battery bus, and pure sine wave zero switch time.",
      price: 155000,
      mrp: 172000,
      image: "/p-inverter.jpg",
      features: JSON.stringify(["Low Frequency (LF)", "96VDC Bus", "Built-in Isolation Transformer", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Capacity", value: "5 kVA / 4000W" },
        { label: "Battery System", value: "96 VDC (8 Batteries)" },
        { label: "Topology", value: "Low Frequency Online Double Conversion" },
        { label: "Transformer", value: "Built-in Heavy Copper Isolation Transformer" },
        { label: "Output Voltage", value: "220V / 230V AC Pure Sine Wave" },
        { label: "Transfer Time", value: "0 ms (Zero Interruption)" },
        { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" }
      ]),
      stock: 10,
      rating: 4.9,
      badges: JSON.stringify(["Low Frequency (LF)", "96VDC Bus", "1 Year Warranty"])
    },
    {
      id: "omsun-online-lf-10kva-1-1",
      name: "OMSUN Online LF UPS 10KVA (1:1)",
      category: "UPS",
      subcategory: "Online LF UPS",
      brand: "OMSUN",
      tagline: "10 kVA single-phase 1:1 online LF UPS (120/144/192/240 VDC)",
      description: "Heavy duty 1-Phase In / 1-Phase Out online LF UPS for enterprise servers, medical CT/X-Ray equipment, and broadcast studios.",
      price: 275000,
      mrp: 305000,
      image: "/p-inverter.jpg",
      features: JSON.stringify(["10 kVA (1:1)", "Isolation Transformer", "Flexible DC Bus", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Capacity", value: "10 kVA / 8000W" },
        { label: "Phase Configuration", value: "Single Phase In / Single Phase Out (1:1)" },
        { label: "Battery System", value: "120 / 144 / 192 / 240 VDC System" },
        { label: "Topology", value: "True Online Double Conversion LF" },
        { label: "Isolation", value: "Heavy Galvanic Isolation Transformer" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 8,
      rating: 5.0,
      badges: JSON.stringify(["10 kVA (1:1)", "Isolation Transformer", "1 Year Warranty"])
    },
    {
      id: "omsun-online-lf-10kva-3-1",
      name: "OMSUN Online LF UPS 10KVA (3:1)",
      category: "UPS",
      subcategory: "Online LF UPS",
      brand: "OMSUN",
      tagline: "10 kVA 3-phase input / single-phase output online LF UPS",
      description: "Takes 3-phase mains grid input and delivers rock-solid single-phase 220V isolated pure power for critical enterprise and diagnostic hardware.",
      price: 300000,
      mrp: 335000,
      image: "/p-inverter.jpg",
      features: JSON.stringify(["10 kVA (3:1)", "3-Phase In / 1-Phase Out", "Galvanic Isolation", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Capacity", value: "10 kVA / 8000W" },
        { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
        { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
        { label: "Galvanic Isolation", value: "Built-in Copper Transformer" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 7,
      rating: 4.9,
      badges: JSON.stringify(["10 kVA (3:1)", "3-Phase In / 1-Phase Out", "1 Year Warranty"])
    },
    {
      id: "omsun-online-lf-15kva-3-1",
      name: "OMSUN Online LF UPS 15KVA (3:1)",
      category: "UPS",
      subcategory: "Online LF UPS",
      brand: "OMSUN",
      tagline: "15 kVA 3:1 online LF UPS with galvanic isolation transformer",
      description: "Engineered for high-reliability data centers, banking branches, and automation lines with flexible 120-240V DC battery banks.",
      price: 380000,
      mrp: 420000,
      image: "/p-inverter.jpg",
      features: JSON.stringify(["15 kVA (3:1)", "Enterprise Power", "150% Overload Capacity", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Capacity", value: "15 kVA / 12,000W" },
        { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
        { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
        { label: "Overload Capability", value: "125% for 10 min, 150% for 1 min" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 6,
      rating: 5.0,
      badges: JSON.stringify(["15 kVA (3:1)", "Enterprise Power", "1 Year Warranty"])
    },
    {
      id: "omsun-online-lf-20kva-3-1",
      name: "OMSUN Online LF UPS 20KVA (3:1)",
      category: "UPS",
      subcategory: "Online LF UPS",
      brand: "OMSUN",
      tagline: "20 kVA 3-phase in / 1-phase out heavy duty industrial online UPS",
      description: "High-capacity 20 kVA LF system with smart battery management, LCD telemetry, and robust galvanic isolation for heavy facilities.",
      price: 460000,
      mrp: 510000,
      image: "/p-inverter.jpg",
      features: JSON.stringify(["20 kVA Heavy LF", "Industrial Isolation", "> 94% Efficiency", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Capacity", value: "20 kVA / 16,000W" },
        { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
        { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
        { label: "Efficiency", value: "> 94% Online Mode" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 5,
      rating: 5.0,
      badges: JSON.stringify(["20 kVA (3:1)", "Heavy Industrial", "1 Year Warranty"])
    },

    // ══════════════════════════════════════════════════════════════════════════════
    // GROUP 6: Power One On Line UPS — Battery Volt System 120/144/192/240 VDC
    // ══════════════════════════════════════════════════════════════════════════════
    {
      id: "power-one-online-10kva-3-1",
      name: "Power One Online UPS 10KVA (3:1)",
      category: "UPS",
      subcategory: "Industrial Online UPS",
      brand: "Power-One",
      tagline: "10 kVA 3:1 high efficiency online double conversion UPS (120-240VDC)",
      description: "Official Power-One industrial double conversion online UPS with 3-Level IGBT topology, DSP control, and heavy galvanic isolation transformer.",
      price: 400000,
      mrp: 445000,
      image: "https://poweroneups.com/img/product/pmp1.png",
      features: JSON.stringify(["Power-One Official", "3:1 Phase", "Galvanic Isolation", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Power-One" },
        { label: "Capacity", value: "10 kVA / 9000W" },
        { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
        { label: "Battery System", value: "120 / 144 / 192 / 240 VDC System" },
        { label: "Inverter Topology", value: "3-Level IGBT Double Conversion" },
        { label: "Isolation", value: "Built-in Galvanic Isolation Transformer" },
        { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" }
      ]),
      stock: 8,
      rating: 5.0,
      badges: JSON.stringify(["Power-One", "3:1 Phase", "1 Year Warranty"])
    },
    {
      id: "power-one-online-20kva-3-1",
      name: "Power One Online UPS 20KVA (3:1)",
      category: "UPS",
      subcategory: "Industrial Online UPS",
      brand: "Power-One",
      tagline: "20 kVA 3-phase in / 1-phase out industrial online UPS",
      description: "High-reliability Power-One 20 kVA system built for enterprise server farms, MRI/CT medical imaging, and continuous industrial automation.",
      price: 750000,
      mrp: 825000,
      image: "https://poweroneups.com/img/product/pmp1.png",
      features: JSON.stringify(["20 kVA (3:1)", "Up to 98% ECO Mode", "Active PFC > 0.99", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Power-One" },
        { label: "Capacity", value: "20 kVA / 18,000W" },
        { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
        { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
        { label: "Efficiency", value: "Up to 95% Online / 98% ECO Mode" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 6,
      rating: 5.0,
      badges: JSON.stringify(["Power-One", "20 kVA (3:1)", "1 Year Warranty"])
    },
    {
      id: "power-one-online-20kva-3-3",
      name: "Power One Online UPS 20KVA (3:3)",
      category: "UPS",
      subcategory: "Industrial Online UPS",
      brand: "Power-One",
      tagline: "20 kVA 3-phase in / 3-phase out true industrial double conversion UPS",
      description: "Pure 3-Phase balanced online UPS for factory machinery, data centers, and multi-story commercial facilities with full phase isolation.",
      price: 800000,
      mrp: 880000,
      image: "https://poweroneups.com/img/product/pmp1.png",
      features: JSON.stringify(["20 kVA Full 3-Phase", "3-Phase In / 3-Phase Out", "Active PFC", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Power-One" },
        { label: "Capacity", value: "20 kVA / 18,000W (3-Phase)" },
        { label: "Phase Configuration", value: "3-Phase In / 3-Phase Out (3:3)" },
        { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
        { label: "Input PF", value: "> 0.99 with Active PFC" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 5,
      rating: 5.0,
      badges: JSON.stringify(["Power-One", "20 kVA 3-Phase (3:3)", "1 Year Warranty"])
    },
    {
      id: "power-one-online-30kva-3-1",
      name: "Power One Online UPS 30KVA (3:1)",
      category: "UPS",
      subcategory: "Industrial Online UPS",
      brand: "Power-One",
      tagline: "30 kVA high-power 3:1 online UPS with advanced DSP telemetry",
      description: "30 kVA industrial online power protection handling high-inrush currents, severe harmonic environments, and flexible DC battery configurations.",
      price: 1000000,
      mrp: 1100000,
      image: "https://poweroneups.com/img/product/pmp1.png",
      features: JSON.stringify(["30 kVA Heavy Power", "3:1 Phase", "DSP Microcontroller", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Power-One" },
        { label: "Capacity", value: "30 kVA / 27,000W" },
        { label: "Phase Configuration", value: "3-Phase In / 1-Phase Out (3:1)" },
        { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
        { label: "Warranty", value: "1 Year Full Warranty (13% VAT Incl.)" }
      ]),
      stock: 4,
      rating: 5.0,
      badges: JSON.stringify(["Power-One", "30 kVA (3:1)", "1 Year Warranty"])
    },
    {
      id: "power-one-online-30kva-3-3",
      name: "Power One Online UPS 30KVA (3:3)",
      category: "UPS",
      subcategory: "Industrial Online UPS",
      brand: "Power-One",
      tagline: "30 kVA 3-phase in / 3-phase out commercial & industrial online UPS",
      description: "30 kVA full 3-phase enterprise power backbone delivering unmatched efficiency, zero millisecond switchover, and complete isolation.",
      price: 960000,
      mrp: 1060000,
      image: "https://poweroneups.com/img/product/pmp1.png",
      features: JSON.stringify(["30 kVA Full 3-Phase", "3:3 Architecture", "Enterprise Backbone", "1 Year Warranty"]),
      specs: JSON.stringify([
        { label: "Brand", value: "Power-One" },
        { label: "Capacity", value: "30 kVA / 27,000W (3-Phase)" },
        { label: "Phase Configuration", value: "3-Phase In / 3-Phase Out (3:3)" },
        { label: "Battery System", value: "120 / 144 / 192 / 240 VDC" },
        { label: "Output Voltage", value: "380V / 400V / 415V AC (3-Phase)" },
        { label: "Warranty", value: "1 Year Full Warranty" }
      ]),
      stock: 4,
      rating: 5.0,
      badges: JSON.stringify(["Power-One", "30 kVA 3-Phase (3:3)", "1 Year Warranty"])
    }
  ];

  for (const p of products) {
    const galleryImages = p.images 
      ? (typeof p.images === 'string' ? p.images : JSON.stringify(p.images))
      : JSON.stringify(p.image ? [p.image] : []);

    await conn.query(
      `INSERT INTO products (id, name, category, subcategory, brand, tagline, description, price, mrp, image, images, features, specs, stock, rating, badges)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         name = VALUES(name), 
         category = VALUES(category), 
         subcategory = VALUES(subcategory), 
         brand = VALUES(brand), 
         tagline = VALUES(tagline), 
         description = VALUES(description), 
         price = VALUES(price), 
         mrp = VALUES(mrp), 
         image = VALUES(image), 
         images = VALUES(images),
         features = VALUES(features), 
         specs = VALUES(specs), 
         stock = VALUES(stock), 
         rating = VALUES(rating), 
         badges = VALUES(badges)`,
      [
        p.id,
        p.name,
        p.category,
        p.subcategory || null,
        p.brand,
        p.tagline,
        p.description,
        p.price,
        p.mrp,
        p.image,
        galleryImages,
        p.features,
        p.specs,
        p.stock,
        p.rating,
        p.badges,
      ],
    );
  }

  // Purge obsolete products not in the active catalog
  const activeProductIds = products.map((p) => p.id);
  if (activeProductIds.length > 0) {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("DELETE FROM products WHERE id NOT IN (?)", [activeProductIds]);
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
  }
  console.log(`✓ Synchronized all ${products.length} official products and purged obsolete items!`);

  // 2. Seed default admin & demo customer accounts
  const adminHash = await bcrypt.hash("admin123", 10);
  const custHash = await bcrypt.hash("password123", 10);

  await conn.query(
    `INSERT INTO users (full_name, email, password_hash, role, phone, company)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role)`,
    ["OMSUN Admin", "admin@omsunnepal.com", adminHash, "admin", "+977-9800000000", "OMSUN Nepal Pvt. Ltd."]
  );
  await conn.query(
    `INSERT INTO users (full_name, email, password_hash, role, phone, company)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role)`,
    ["OMSUN Admin", "admin@omsun.com.np", adminHash, "admin", "+977-9800000000", "OMSUN Nepal Pvt. Ltd."]
  );
  await conn.query(
    `INSERT INTO users (full_name, email, password_hash, role, phone, company)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role)`,
    ["OMSUN Customer", "customer@omsun.com.np", custHash, "customer", "+977-9841234567", "Sunrise Solar"]
  );
  console.log("✓ Seeded admin (admin@omsunnepal.com / admin@omsun.com.np) & customer accounts.");

  // 3. Seed welcome coupons
  const [existingCoupons] = await conn.query("SELECT COUNT(*) as count FROM coupons");
  if (existingCoupons[0].count === 0) {
    await conn.query(
      `INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, status)
       VALUES ('c_solar10', 'OMSUN10', 'percentage', 10, 10000, 'active'),
              ('c_welcome5k', 'WELCOME5K', 'fixed', 5000, 50000, 'active')`
    );
    console.log("✓ Seeded default coupons (OMSUN10, WELCOME5K)");
  }

  await conn.end();
  console.log("🎉 Database setup & seeding complete! You are ready to go.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  setup().catch((err) => {
    console.error("Database setup failed:", err);
    process.exit(1);
  });
}
