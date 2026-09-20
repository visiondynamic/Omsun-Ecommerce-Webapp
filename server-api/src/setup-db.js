import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setup() {
  const host = process.env.MYSQLHOST || process.env.DB_HOST || "localhost";
  const user = process.env.MYSQLUSER || process.env.DB_USER || "root";
  const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "";
  const database = process.env.MYSQLDATABASE || process.env.DB_NAME || "omsun";
  const port = process.env.MYSQLPORT ? Number(process.env.MYSQLPORT) : Number(process.env.DB_PORT || 3306);

  console.log(`Connecting to MySQL on ${host}:${port} as ${user}...`);

  // Ensure target database exists first if not using a managed URI
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
  console.log("✓ Database tables verified/created successfully!");

  // Ensure subcategory, images, and extended product columns exist
  const extendedCols = [
    { name: "subcategory", type: "VARCHAR(120) NULL" },
    { name: "images", type: "LONGTEXT NULL" },
    { name: "series", type: "VARCHAR(120) NULL" },
    { name: "model", type: "VARCHAR(120) NULL" },
    { name: "capacity", type: "VARCHAR(120) NULL" },
    { name: "warranty", type: "VARCHAR(120) NULL" },
    { name: "brochure_url", type: "VARCHAR(500) NULL" },
    { name: "source_url", type: "VARCHAR(500) NULL" },
    { name: "applications", type: "JSON NULL" },
    { name: "specifications", type: "JSON NULL" },
  ];

  for (const col of extendedCols) {
    try {
      const [cols] = await conn.query(`SHOW COLUMNS FROM products LIKE '${col.name}'`);
      if (cols.length === 0) {
        console.log(`Adding '${col.name}' column to products table...`);
        await conn.query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
      }
    } catch (err) {
      console.log(`Note on ${col.name} column check:`, err.message);
    }
  }

  // 1. Sync & Seed official products catalog from catalog-data.json
  console.log("Synchronizing official products catalog into database...");
  const catalogPath = path.resolve(__dirname, "./catalog-data.json");
  const products = fs.existsSync(catalogPath)
    ? JSON.parse(fs.readFileSync(catalogPath, "utf-8"))
    : [];

  for (const p of products) {
    const galleryImages = p.images 
      ? (typeof p.images === "string" ? p.images : JSON.stringify(p.images))
      : JSON.stringify(p.image ? [p.image] : []);

    const featuresStr = p.features
      ? (typeof p.features === "string" ? p.features : JSON.stringify(p.features))
      : "[]";
    const specsStr = p.specs
      ? (typeof p.specs === "string" ? p.specs : JSON.stringify(p.specs))
      : "[]";
    const badgesStr = p.badges
      ? (typeof p.badges === "string" ? p.badges : JSON.stringify(p.badges))
      : "[]";
    const appStr = p.applications
      ? (typeof p.applications === "string" ? p.applications : JSON.stringify(p.applications))
      : "[]";
    const specificationsStr = p.specifications
      ? (typeof p.specifications === "string" ? p.specifications : JSON.stringify(p.specifications))
      : "{}";

    await conn.query(
      `INSERT INTO products (
         id, name, category, subcategory, brand, tagline, description, price, mrp, 
         image, images, features, specs, stock, rating, badges, 
         series, model, capacity, warranty, brochure_url, source_url, applications, specifications
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
         badges = VALUES(badges),
         series = VALUES(series),
         model = VALUES(model),
         capacity = VALUES(capacity),
         warranty = VALUES(warranty),
         brochure_url = VALUES(brochure_url),
         source_url = VALUES(source_url),
         applications = VALUES(applications),
         specifications = VALUES(specifications)`,
      [
        p.id,
        p.name,
        p.category,
        p.subcategory || null,
        p.brand,
        p.tagline || null,
        p.description || null,
        Number(p.price) || 0,
        p.mrp != null ? Number(p.mrp) : null,
        p.image || null,
        galleryImages,
        featuresStr,
        specsStr,
        Number(p.stock) || 0,
        Number(p.rating) || 4.8,
        badgesStr,
        p.series || null,
        p.model || null,
        p.capacity || null,
        p.warranty || null,
        p.brochure_url || null,
        p.source_url || null,
        appStr,
        specificationsStr,
      ],
    );
  }

  // Purge obsolete products not in the active catalog
  const activeProductIds = products.map((p) => p.id);
  if (activeProductIds.length > 0) {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("DELETE FROM products WHERE id NOT IN (?) AND id NOT LIKE 'sku-%' AND id NOT LIKE 'prod-%' AND id NOT LIKE 'custom-%'", [activeProductIds]);
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

  // 4. Seed Executive Team Members (Ashish Baral - CEO, Sudhir Bhattarai - CTO, Mukhul Ghimire - CFO)
  const initialTeam = [
    {
      id: "team-ashish-baral",
      name: "Ashish Baral",
      position: "CEO",
      bio: "Visionary executive leading OMSUN Nepal's strategic expansion, energy infrastructure partnerships, and corporate governance across Nepal.",
      image: "/images/team/ashish-baral.jpg",
      display_order: 1,
      is_active: 1,
    },
    {
      id: "team-sudhir-bhattarai",
      name: "Sudhir Bhattarai",
      position: "CTO",
      bio: "Technology and engineering strategist overseeing power electronics architectures, solar EPC technical compliance, and smart grid automation.",
      image: "/images/team/sudhir-bhattarai.jpg",
      display_order: 2,
      is_active: 1,
    },
    {
      id: "team-mukhul-ghimire",
      name: "Mukhul Ghimire",
      position: "CFO",
      bio: "Chief Financial Officer managing fiscal integrity, commercial risk assessment, vendor capitalization, and project financing for utility installations.",
      image: "/images/team/mukhul-ghimire.jpg",
      display_order: 3,
      is_active: 1,
    },
  ];

  for (const m of initialTeam) {
    await conn.query(
      `INSERT INTO team_members (id, name, position, bio, image, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         position = VALUES(position),
         bio = VALUES(bio),
         display_order = VALUES(display_order)`,
      [m.id, m.name, m.position, m.bio, m.image, m.display_order, m.is_active]
    );
  }
  console.log("✓ Seeded executive team members (Ashish Baral - CEO, Sudhir Bhattarai - CTO, Mukhul Ghimire - CFO).");

  await conn.end();
  console.log("🎉 Database setup & seeding complete! You are ready to go.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  setup().catch((err) => {
    console.error("Database setup failed:", err);
    process.exit(1);
  });
}
