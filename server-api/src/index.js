import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query, pool } from "./db.js";
import { setup } from "./setup-db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const candidateUploads = [
  path.resolve(__dirname, "../uploads"),
  path.resolve(__dirname, "../../public/uploads"),
  path.resolve(__dirname, "../public/uploads"),
  path.resolve(process.cwd(), "public/uploads"),
  path.resolve(process.cwd(), "uploads"),
];
let uploadsDir = candidateUploads.find((p) => fs.existsSync(p)) || candidateUploads[0];
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch {
  uploadsDir = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

// Auto-ensure images column and column types in products table
async function ensureProductImagesColumn() {
  try {
    await query("ALTER TABLE products ADD COLUMN IF NOT EXISTS images LONGTEXT NULL AFTER image");
  } catch {
    try {
      await query("ALTER TABLE products ADD COLUMN images LONGTEXT NULL");
    } catch {}
  }
  try {
    await query("ALTER TABLE products MODIFY COLUMN image TEXT NULL");
  } catch {}
  try {
    await query("ALTER TABLE products MODIFY COLUMN images LONGTEXT NULL");
  } catch {}
}

// Helper for safe JSON parsing
function safeParseJson(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

// Auto-bootstrap MySQL schema & catalog sync on start
async function autoInitDatabase() {
  try {
    console.log("[omsun-api] Synchronizing official catalog and schema with database...");
    await setup();
    await ensureProductImagesColumn();
    console.log("[omsun-api] Automatic catalog sync completed!");
  } catch (err) {
    console.log("[omsun-api] Auto database init check note:", err.message);
  }
}
autoInitDatabase();

const app = express();
const PORT = process.env.PORT || 4000;

const JWT_SECRET = process.env.JWT_SECRET || "omsun-dev-secret-change-in-production";

app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static uploaded media and public assets with unrestricted CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsDir),
);
const candidatePublic = [
  path.resolve(__dirname, "../../public"),
  path.resolve(__dirname, "../public"),
  path.resolve(process.cwd(), "public"),
];
const publicDir = candidatePublic.find((p) => fs.existsSync(p)) || candidatePublic[0];
try {
  if (fs.existsSync(publicDir)) {
    app.use("/products", express.static(path.join(publicDir, "products")));
    app.use(express.static(publicDir));
  }
} catch {}

/* ─── Sliding-Window In-Memory Rate Limiter ─── */
const ipRateLimitStore = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of ipRateLimitStore.entries()) {
    if (now > entry.resetTime) ipRateLimitStore.delete(key);
  }
}, 60000);

function rateLimiter({
  windowMs = 60000,
  max = 30,
  message = "Too many requests. Please try again later.",
} = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global";
    const key = `${req.baseUrl || ""}${req.path}:${ip}`;
    const now = Date.now();
    const entry = ipRateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + windowMs;
    } else {
      entry.count++;
    }
    ipRateLimitStore.set(key, entry);

    if (entry.count > max) {
      return res.status(429).json({ error: message });
    }
    next();
  };
}

const authLimiter = rateLimiter({
  windowMs: 60000,
  max: 15,
  message: "Too many authentication requests. Please try again in 1 minute.",
});
const orderLimiter = rateLimiter({
  windowMs: 300000,
  max: 20,
  message: "Order submission limit reached. Please wait 5 minutes.",
});
const uploadLimiter = rateLimiter({
  windowMs: 600000,
  max: 30,
  message: "Upload limit exceeded. Please wait a few minutes.",
});
const contactLimiter = rateLimiter({
  windowMs: 300000,
  max: 10,
  message: "Too many contact submissions. Please wait 5 minutes.",
});
const newsletterLimiter = rateLimiter({
  windowMs: 300000,
  max: 10,
  message: "Too many subscription requests. Please wait 5 minutes.",
});

/* ─── Hardened JWT-like token helpers with 7-day expiration & constant-time check ─── */
function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7-day expiration
  };
  const token = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(token).digest("base64url");
  return `${token}.${sig}`;
}

function verifyToken(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [tokenPart, sig] = parts;
    const expected = crypto.createHmac("sha256", JWT_SECRET).update(tokenPart).digest("base64url");

    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(tokenPart, "base64url").toString("utf-8"));
    if (
      payload.exp &&
      typeof payload.exp === "number" &&
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null; // Expired token
    }
    return payload;
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Not authenticated" });
  const user = verifyToken(header.slice(7));
  if (!user) return res.status(401).json({ error: "Invalid or expired token" });
  req.user = user;
  next();
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Admin access required" });
  next();
}

function optionalAuthMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    const user = verifyToken(header.slice(7));
    if (user) req.user = user;
  }
  next();
}

/* ═══════════════════════════════════════════════════════════════════ */
/* HEALTH                                                             */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/health", async (_req, res) => {
  try {
    await query("SELECT 1");
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    console.error("[db] health check failed:", err.message);
    res.status(500).json({ ok: false, error: "Database unreachable" });
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* AUTH                                                               */
/* ═══════════════════════════════════════════════════════════════════ */
app.post("/api/auth/register", authLimiter, async (req, res, next) => {
  const { fullName, email, password, phone, company } = req.body ?? {};
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "fullName, email and password are required" });
  }
  try {
    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO users (full_name, email, password_hash, phone, company) VALUES (?, ?, ?, ?, ?)",
      [fullName, email, hash, phone || null, company || null],
    );
    const user = { id: result.insertId, full_name: fullName, email, role: "customer" };
    const token = createToken({ id: user.id, email, role: "customer" });
    res
      .status(201)
      .json({
        ok: true,
        token,
        user: { id: String(user.id), name: fullName, email, role: "customer" },
      });
  } catch (err) {
    next(err);
  }
});

app.post("/api/auth/login", authLimiter, async (req, res, next) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  try {
    const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = createToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      ok: true,
      token,
      user: {
        id: String(user.id),
        name: user.full_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar_url || null,
      },
    });
  } catch (err) {
    next(err);
  }
});

/* Auto-ensure avatar column */
async function ensureUserAvatarColumn() {
  try {
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url MEDIUMTEXT NULL");
  } catch {
    try {
      await query("ALTER TABLE users ADD COLUMN avatar_url MEDIUMTEXT NULL");
    } catch {
      // column already exists
    }
  }
}
ensureUserAvatarColumn();

app.get("/api/auth/me", authMiddleware, async (req, res, next) => {
  try {
    await ensureUserAvatarColumn();
    const rows = await query(
      "SELECT id, full_name, email, phone, company, role, avatar_url FROM users WHERE id = ?",
      [req.user.id],
    );
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    const u = rows[0];
    res.json({
      id: String(u.id),
      name: u.full_name,
      email: u.email,
      phone: u.phone,
      company: u.company,
      role: u.role,
      avatar: u.avatar_url || null,
    });
  } catch (err) {
    next(err);
  }
});

/* Update profile */
app.put("/api/auth/profile", authMiddleware, async (req, res, next) => {
  const { fullName, phone, company, avatar } = req.body ?? {};
  try {
    await ensureUserAvatarColumn();
    await query(
      "UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), company = COALESCE(?, company), avatar_url = COALESCE(?, avatar_url) WHERE id = ?",
      [
        fullName || null,
        phone || null,
        company || null,
        avatar !== undefined ? avatar : null,
        req.user.id,
      ],
    );
    const rows = await query(
      "SELECT id, full_name, email, phone, company, role, avatar_url FROM users WHERE id = ?",
      [req.user.id],
    );
    const u = rows[0];
    res.json({
      ok: true,
      user: {
        id: String(u.id),
        name: u.full_name,
        email: u.email,
        phone: u.phone,
        company: u.company,
        role: u.role,
        avatar: u.avatar_url || null,
      },
    });
  } catch (err) {
    next(err);
  }
});

/* Upload Profile Avatar Photo */
app.post("/api/auth/avatar", authMiddleware, async (req, res, next) => {
  const { imageBase64 } = req.body ?? {};
  if (!imageBase64) {
    return res.status(400).json({ error: "Image data is required" });
  }
  try {
    await ensureUserAvatarColumn();
    let avatarUrl = imageBase64;
    if (imageBase64.startsWith("data:image/")) {
      const match = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        const ext = match[1] === "jpeg" ? "jpg" : match[1];
        const data = Buffer.from(match[2], "base64");
        const filename = `avatar-${req.user.id}-${Date.now()}.${ext}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, data);
        avatarUrl = `/uploads/${filename}`;
      }
    }
    await query("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, req.user.id]);
    res.json({ ok: true, avatarUrl, message: "Profile photo updated successfully" });
  } catch (err) {
    next(err);
  }
});

/* Change password */
app.post("/api/auth/change-password", authMiddleware, async (req, res, next) => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "currentPassword and newPassword are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }
  try {
    const rows = await query("SELECT id, password_hash FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    const user = rows[0];
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      return res.status(400).json({ error: "Incorrect current password" });
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password_hash = ? WHERE id = ?", [newHash, req.user.id]);
    res.json({ ok: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
});

/* Addresses table auto-ensure */
async function ensureAddressesTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        full_name VARCHAR(120) NOT NULL,
        street TEXT NOT NULL,
        area VARCHAR(150) NULL,
        city VARCHAR(120) NOT NULL,
        province VARCHAR(120) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        address_type VARCHAR(60) NOT NULL DEFAULT 'Shipping',
        is_default BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
  } catch (err) {
    console.error("[db] error ensuring addresses table:", err.message);
  }
}
ensureAddressesTable();

/* User Addresses */
app.get("/api/user/addresses", authMiddleware, async (req, res, next) => {
  try {
    await ensureAddressesTable();
    const rows = await query(
      "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC",
      [req.user.id],
    );
    res.json(
      rows.map((r) => ({
        id: String(r.id),
        fullName: r.full_name,
        street: r.street,
        area: r.area || "",
        city: r.city,
        province: r.province,
        phone: r.phone,
        type: r.address_type,
        isDefault: Boolean(r.is_default),
      })),
    );
  } catch (err) {
    next(err);
  }
});

app.post("/api/user/addresses", authMiddleware, async (req, res, next) => {
  const { fullName, street, area, city, province, phone, type, isDefault } = req.body ?? {};
  if (!fullName || !street || !city || !phone) {
    return res.status(400).json({ error: "fullName, street, city, and phone are required" });
  }
  try {
    await ensureAddressesTable();
    if (isDefault) {
      await query("UPDATE addresses SET is_default = FALSE WHERE user_id = ?", [req.user.id]);
    }
    const result = await query(
      "INSERT INTO addresses (user_id, full_name, street, area, city, province, phone, address_type, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.user.id,
        fullName,
        street,
        area || null,
        city,
        province || "Bagmati Province",
        phone,
        type || "Shipping",
        isDefault ? 1 : 0,
      ],
    );
    res.status(201).json({
      id: String(result.insertId),
      fullName,
      street,
      area: area || "",
      city,
      province: province || "Bagmati Province",
      phone,
      type: type || "Shipping",
      isDefault: Boolean(isDefault),
    });
  } catch (err) {
    next(err);
  }
});

app.put("/api/user/addresses/:id", authMiddleware, async (req, res, next) => {
  const { fullName, street, area, city, province, phone, type, isDefault } = req.body ?? {};
  try {
    await ensureAddressesTable();
    if (isDefault) {
      await query("UPDATE addresses SET is_default = FALSE WHERE user_id = ?", [req.user.id]);
    }
    await query(
      "UPDATE addresses SET full_name = COALESCE(?, full_name), street = COALESCE(?, street), area = COALESCE(?, area), city = COALESCE(?, city), province = COALESCE(?, province), phone = COALESCE(?, phone), address_type = COALESCE(?, address_type), is_default = COALESCE(?, is_default) WHERE id = ? AND user_id = ?",
      [
        fullName,
        street,
        area,
        city,
        province,
        phone,
        type,
        isDefault !== undefined ? (isDefault ? 1 : 0) : null,
        req.params.id,
        req.user.id,
      ],
    );
    res.json({ ok: true, message: "Address updated" });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/user/addresses/:id", authMiddleware, async (req, res, next) => {
  try {
    await ensureAddressesTable();
    await query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ ok: true, message: "Address deleted" });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* PRODUCTS (public)                                                  */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/products", async (_req, res, next) => {
  try {
    const rows = await query(
      "SELECT id, name, category, subcategory, series, model, capacity, brand, tagline, description, price, mrp, image, images, stock, rating, badges, warranty, brochure_url, source_url FROM products ORDER BY name",
    );
    const products = rows.map((r) => ({
      ...r,
      price: Number(r.price),
      mrp: r.mrp ? Number(r.mrp) : null,
      rating: Number(r.rating) || 0,
      images: safeParseJson(r.images, r.image ? [r.image] : []),
      badges: typeof r.badges === "string" ? JSON.parse(r.badges) : r.badges || [],
    }));
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const rows = await query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const p = rows[0];
    res.json({
      ...p,
      price: Number(p.price),
      mrp: p.mrp ? Number(p.mrp) : null,
      rating: Number(p.rating) || 0,
      images: safeParseJson(p.images, p.image ? [p.image] : []),
      badges: typeof p.badges === "string" ? JSON.parse(p.badges) : p.badges || [],
      features: typeof p.features === "string" ? JSON.parse(p.features) : p.features || [],
      specs: typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs || [],
      applications: typeof p.applications === "string" ? JSON.parse(p.applications) : p.applications || [],
      specifications: typeof p.specifications === "string" ? JSON.parse(p.specifications) : p.specifications || {},
    });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* ORDERS & MANUAL PAYMENT WORKFLOW                                    */
/* ═══════════════════════════════════════════════════════════════════ */

const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "sales@omsunnepal.com";

// FormSubmit notification helper with timeout & non-blocking safety
async function sendNotificationEmail({ to, subject, data }) {
  if (!to) return { ok: false, error: "No recipient provided" };
  try {
    const payload = {
      _subject: subject,
      _template: "table",
      _captcha: "false",
      ...data,
    };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, json };
  } catch (err) {
    console.warn(`[FormSubmit Notice] Notification to ${to} deferred: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

// Ensure database schema supports full order and payment lifecycle
async function ensureFullOrderSchema() {
  const alterStatements = [
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_email VARCHAR(190) NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(60) NOT NULL DEFAULT 'UNPAID'",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_receipt MEDIUMTEXT NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_ref VARCHAR(100) NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_submitted_at TIMESTAMP NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS verified_by VARCHAR(120) NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(60) NOT NULL DEFAULT 'PENDING'",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_carrier VARCHAR(120) NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_person VARCHAR(120) NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_phone VARCHAR(30) NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100) NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT NULL",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery DATE NULL",
    "ALTER TABLE orders MODIFY COLUMN status VARCHAR(60) NOT NULL DEFAULT 'ORDER_PLACED'",
    "ALTER TABLE orders MODIFY COLUMN payment_method VARCHAR(60) NOT NULL DEFAULT 'fonepay'",
    "ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image VARCHAR(500) NULL",
  ];

  for (const stmt of alterStatements) {
    try {
      await query(stmt);
    } catch {
      if (stmt.includes("IF NOT EXISTS")) {
        try {
          await query(stmt.replace("IF NOT EXISTS ", ""));
        } catch {}
      }
    }
  }

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id INT UNSIGNED NOT NULL,
        order_ref VARCHAR(32) NOT NULL,
        status_type VARCHAR(40) NOT NULL,
        old_value VARCHAR(80) NULL,
        new_value VARCHAR(80) NOT NULL,
        changed_by VARCHAR(120) NULL,
        notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_history_order (order_id),
        INDEX idx_history_ref (order_ref)
      ) ENGINE=InnoDB
    `);
  } catch {}

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS payment_logs (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_ref VARCHAR(32) NOT NULL,
        action VARCHAR(60) NOT NULL,
        payload JSON NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'success',
        notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_payment_logs_ref (order_ref)
      ) ENGINE=InnoDB
    `);
  } catch {}

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL,
        phone VARCHAR(30) NULL,
        company VARCHAR(120) NULL,
        inquiry_type VARCHAR(60) NULL,
        system_size VARCHAR(60) NULL,
        district VARCHAR(120) NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);
  } catch {}

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(190) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);
  } catch {}
}
ensureFullOrderSchema();

// Generate sequential order reference: OMS-2026-000001
async function generateOrderRef() {
  const currentYear = new Date().getFullYear();
  const prefix = `OMS-${currentYear}-`;
  try {
    const rows = await query(
      "SELECT order_ref FROM orders WHERE order_ref LIKE ? ORDER BY id DESC LIMIT 1",
      [`${prefix}%`],
    );
    let nextNum = 1;
    if (rows.length > 0 && rows[0].order_ref) {
      const match = rows[0].order_ref.match(/-(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    } else {
      const countRows = await query("SELECT COUNT(*) as cnt FROM orders");
      nextNum = (countRows[0]?.cnt || 0) + 1;
    }
    const orderRef = `${prefix}${String(nextNum).padStart(6, "0")}`;
    const exists = await query("SELECT id FROM orders WHERE order_ref = ?", [orderRef]);
    if (exists.length > 0) {
      return `${prefix}${String(nextNum + Math.floor(Math.random() * 1000) + 1).padStart(6, "0")}`;
    }
    return orderRef;
  } catch {
    return `${prefix}${Date.now().toString(36).toUpperCase()}`;
  }
}

async function logOrderStatusChange({
  orderId,
  orderRef,
  statusType,
  oldValue,
  newValue,
  changedBy,
  notes,
}) {
  try {
    await query(
      "INSERT INTO order_status_history (order_id, order_ref, status_type, old_value, new_value, changed_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        orderId,
        orderRef,
        statusType,
        oldValue || null,
        newValue,
        changedBy || "System",
        notes || null,
      ],
    );
  } catch (err) {
    console.error("Order status log error:", err.message);
  }
}

/* 1. CREATE ORDER IMMEDIATELY (Before Payment) */
app.post("/api/orders", orderLimiter, optionalAuthMiddleware, async (req, res, next) => {
  const body = req.body ?? {};
  const { items, paymentMethod, paymentReceipt } = body;
  const shipping = body.shipping || {
    name: body.customerName || body.name,
    phone: body.customerPhone || body.phone,
    address: body.shippingAddress || body.address,
    city: body.shippingCity || body.city || "Kathmandu",
    email: body.shippingEmail || body.customerEmail || body.email,
    notes: body.deliveryNotes || body.notes,
  };
  if (!items?.length || !shipping?.name || !shipping?.phone || !shipping?.address) {
    return res
      .status(400)
      .json({ error: "Items, recipient name, phone, and delivery address are required" });
  }

  try {
    await ensureFullOrderSchema();
    let subtotal = 0;
    const orderItems = [];

    // Strictly validate each product directly against database catalog
    for (const item of items) {
      const prodId = item.productId;
      if (!prodId) {
        return res.status(400).json({ error: "Each order item must specify a valid productId" });
      }

      const rows = await query("SELECT id, name, price, stock, image FROM products WHERE id = ?", [
        prodId,
      ]);
      if (rows.length === 0) {
        return res.status(400).json({ error: `Product not found in catalog: "${prodId}"` });
      }

      const prod = rows[0];
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      if (prod.stock < qty) {
        return res.status(400).json({
          error: `Insufficient stock for "${prod.name}". Requested: ${qty}, In stock: ${prod.stock}`,
        });
      }

      const unitPrice = Number(prod.price);
      const prodImage = prod.image || "/p-panelboard.jpg";
      subtotal += unitPrice * qty;
      orderItems.push({
        productId: prod.id,
        name: prod.name,
        qty,
        unitPrice,
        image: prodImage,
      });
    }

    // Standardized payment method
    let method = (paymentMethod || "fonepay").toLowerCase();
    if (method.includes("fonepay")) method = "fonepay";
    else if (method.includes("bank")) method = "bank";
    else if (method.includes("esewa")) method = "esewa";
    else if (method.includes("khalti")) method = "khalti";
    else method = "cod";

    // Standard shipping rule: Free delivery above 50,000 NPR, else 1,500 NPR
    const shippingFee = subtotal > 50000 ? 0 : 1500;
    const discountAmount = 0;

    const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);
    const orderRef = await generateOrderRef();
    const userId = req.user?.id || null;
    const shippingEmail = shipping.email || req.user?.email || null;

    // Optional receipt if uploaded during checkout
    let savedReceiptUrl = null;
    if (paymentReceipt && paymentReceipt.startsWith("data:image/")) {
      const match = paymentReceipt.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        const ext = match[1] === "jpeg" ? "jpg" : match[1];
        const data = Buffer.from(match[2], "base64");
        const filename = `receipt-${orderRef}-${Date.now()}.${ext}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, data);
        savedReceiptUrl = `/uploads/${filename}`;
      }
    }

    const initialPaymentStatus = savedReceiptUrl ? "PAYMENT_SUBMITTED" : "UNPAID";
    const initialOrderStatus = savedReceiptUrl ? "PAYMENT_SUBMITTED" : "ORDER_PLACED";

    // Execute atomic transaction for inventory reservation and order record creation
    const conn = await pool.getConnection();
    let orderId;
    try {
      await conn.beginTransaction();

      // 1. Reserve inventory atomically
      for (const item of orderItems) {
        await conn.query("UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?", [
          item.qty,
          item.productId,
        ]);
      }


      // 3. Insert master order record
      const [orderResult] = await conn.query(
        `INSERT INTO orders (
          order_ref, user_id, shipping_name, shipping_phone, shipping_email,
          shipping_address, shipping_city, subtotal, shipping_fee, discount_amount,
          grand_total, payment_method, payment_status, payment_receipt, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderRef,
          userId,
          shipping.name,
          shipping.phone,
          shippingEmail,
          shipping.address,
          shipping.city || "Kathmandu",
          subtotal,
          shippingFee,
          discountAmount,
          grandTotal,
          method,
          initialPaymentStatus,
          savedReceiptUrl,
          initialOrderStatus,
          shipping.notes || null,
        ],
      );
      orderId = orderResult.insertId;

      // 4. Insert all order items
      for (const item of orderItems) {
        await conn.query(
          "INSERT INTO order_items (order_id, product_id, product_name, product_image, qty, unit_price) VALUES (?, ?, ?, ?, ?, ?)",
          [orderId, item.productId, item.name, item.image, item.qty, item.unitPrice],
        );
      }

      await conn.commit();
    } catch (txErr) {
      await conn.rollback();
      throw txErr;
    } finally {
      conn.release();
    }

    // Log creation in audit history
    await logOrderStatusChange({
      orderId,
      orderRef,
      statusType: "order_lifecycle",
      oldValue: null,
      newValue: initialOrderStatus,
      changedBy: shipping.name,
      notes: `Order created via ${method.toUpperCase()} checkout`,
    });

    // Send Admin Email via FormSubmit (Non-blocking)
    sendNotificationEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `New Omsun Order Received — ${orderRef}`,
      data: {
        "Order Reference": orderRef,
        "Customer Name": shipping.name,
        "Phone Number": shipping.phone,
        Email: shippingEmail || "N/A",
        "Delivery Address": `${shipping.address}, ${shipping.city}`,
        "Ordered Hardware": orderItems.map((i) => `${i.name} (Qty: ${i.qty})`).join(" | "),
        Subtotal: `NPR ${subtotal.toLocaleString()}`,
        "Delivery Logistics": `NPR ${shippingFee.toLocaleString()}`,
        Discount: `NPR ${discountAmount.toLocaleString()}`,
        "Final Amount Payable": `NPR ${grandTotal.toLocaleString()}`,
        "Payment Method": method.toUpperCase(),
        "Payment Status": initialPaymentStatus,
        "Order Date": new Date().toLocaleString(),
      },
    }).catch(() => {});

    res.status(201).json({
      ok: true,
      orderId,
      orderRef,
      grandTotal,
      subtotal,
      shippingFee,
      discountAmount,
      paymentMethod: method,
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      receiptUrl: savedReceiptUrl,
    });
  } catch (err) {
    next(err);
  }
});

/* 2. GET ORDER DETAILS (For Tracking & Fonepay Payment Page) */
app.get("/api/orders/:ref", optionalAuthMiddleware, async (req, res, next) => {
  try {
    await ensureFullOrderSchema();
    const rawRef = req.params.ref;
    const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;

    const rows = await query("SELECT * FROM orders WHERE order_ref = ? OR order_ref = ? LIMIT 1", [
      rawRef,
      refWithPrefix,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const o = rows[0];
    const items = await query("SELECT * FROM order_items WHERE order_id = ?", [o.id]);
    const history = await query(
      "SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC",
      [o.id],
    );

    res.json({
      id: o.id,
      orderRef: o.order_ref,
      userId: o.user_id,
      customerName: o.shipping_name,
      customerPhone: o.shipping_phone,
      customerEmail: o.shipping_email || "",
      shippingAddress: o.shipping_address,
      shippingCity: o.shipping_city,
      subtotal: Number(o.subtotal),
      shippingFee: Number(o.shipping_fee),
      discountAmount: Number(o.discount_amount || 0),
      grandTotal: Number(o.grand_total),
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status || "UNPAID",
      paymentReceipt: o.payment_receipt || null,
      transactionRef: o.transaction_ref || null,
      rejectionReason: o.rejection_reason || null,
      paymentSubmittedAt: o.payment_submitted_at,
      paymentVerifiedAt: o.payment_verified_at,
      status: o.status || "ORDER_PLACED",
      deliveryStatus: o.delivery_status || "PENDING",
      deliveryCarrier: o.delivery_carrier || null,
      deliveryPerson: o.delivery_person || null,
      deliveryPhone: o.delivery_phone || null,
      trackingNumber: o.tracking_number || null,
      deliveryNotes: o.delivery_notes || null,
      estimatedDelivery: o.estimated_delivery || null,
      notes: o.notes,
      createdAt: o.created_at,
      items: items.map((i) => ({
        id: i.id,
        productId: i.product_id,
        name: i.product_name,
        image: i.product_image || "/p-panelboard.jpg",
        qty: i.qty,
        unitPrice: Number(i.unit_price),
      })),
      history: history.map((h) => ({
        id: h.id,
        statusType: h.status_type,
        oldValue: h.old_value,
        newValue: h.new_value,
        changedBy: h.changed_by,
        notes: h.notes,
        createdAt: h.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

/* 3. UPLOAD PAYMENT RECEIPT & SUBMIT PROOF */
app.post(
  "/api/orders/:ref/receipt",
  uploadLimiter,
  optionalAuthMiddleware,
  async (req, res, next) => {
    const { receiptBase64, transactionRef } = req.body ?? {};
    if (!receiptBase64) {
      return res.status(400).json({ error: "Payment receipt image is required" });
    }

    try {
      await ensureFullOrderSchema();
      const rawRef = req.params.ref;
      const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;

      const orderRows = await query(
        "SELECT id, order_ref, shipping_name, shipping_phone, shipping_email, grand_total, payment_status FROM orders WHERE order_ref = ? OR order_ref = ?",
        [rawRef, refWithPrefix],
      );

      if (orderRows.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      const order = orderRows[0];
      let savedReceiptUrl = null;

      if (receiptBase64.startsWith("data:image/")) {
        const match = receiptBase64.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!match) {
          return res
            .status(400)
            .json({ error: "Invalid image format. Must be a valid Base64 data URL." });
        }

        const rawExt = match[1].toLowerCase();
        let ext = "jpg";
        if (rawExt === "png") ext = "png";
        else if (rawExt === "webp") ext = "webp";
        else if (rawExt === "jpeg" || rawExt === "jpg") ext = "jpg";
        else {
          return res.status(400).json({ error: "Only PNG, JPG, and WebP images are allowed" });
        }

        const buffer = Buffer.from(match[2], "base64");
        if (buffer.length > 6 * 1024 * 1024) {
          return res.status(400).json({ error: "Receipt image size exceeds the 5MB limit" });
        }

        const cleanRef = order.order_ref.replace(/[^A-Za-z0-9_-]/g, "");
        const filename = `receipt-${cleanRef}-${Date.now()}.${ext}`;
        const filePath = path.join(uploadsDir, filename);
        await fs.promises.writeFile(filePath, buffer);
        savedReceiptUrl = `/uploads/${filename}`;
      }

      const cleanTxRef = transactionRef ? String(transactionRef).trim() : null;

      // Update order state: reset rejection reason, set payment to submitted
      await query(
        `UPDATE orders SET
        payment_receipt = ?,
        transaction_ref = COALESCE(?, transaction_ref),
        payment_status = 'PAYMENT_SUBMITTED',
        status = 'PAYMENT_SUBMITTED',
        payment_submitted_at = CURRENT_TIMESTAMP,
        rejection_reason = NULL
      WHERE id = ?`,
        [savedReceiptUrl, cleanTxRef, order.id],
      );

      // Audit log
      await logOrderStatusChange({
        orderId: order.id,
        orderRef: order.order_ref,
        statusType: "payment_proof",
        oldValue: order.payment_status,
        newValue: "PAYMENT_SUBMITTED",
        changedBy: order.shipping_name,
        notes: cleanTxRef
          ? `Proof submitted with Ref #${cleanTxRef}`
          : "Payment screenshot proof submitted",
      });

      // Send Admin Email Alert via FormSubmit (Non-blocking)
      sendNotificationEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `Omsun — Payment Proof Submitted — ${order.order_ref}`,
        data: {
          "Order Reference": order.order_ref,
          "Customer Name": order.shipping_name,
          "Customer Phone": order.shipping_phone,
          "Customer Email": order.shipping_email || "N/A",
          "Total Order Amount": `NPR ${Number(order.grand_total).toLocaleString()}`,
          "Transaction / Reference ID": cleanTxRef || "Not provided on receipt",
          "Payment Proof Status": "Awaiting Admin Verification",
          "Uploaded Receipt Slip": savedReceiptUrl,
          "Submission Timestamp": new Date().toLocaleString(),
        },
      }).catch(() => {});

      res.json({
        ok: true,
        receiptUrl: savedReceiptUrl,
        transactionRef: cleanTxRef,
        paymentStatus: "PAYMENT_SUBMITTED",
        message:
          "Payment proof has been submitted successfully. Our team will verify your receipt shortly.",
      });
    } catch (err) {
      next(err);
    }
  },
);

/* 4. CUSTOMER ORDERS LIST (Batch Fetched — Zero N+1 Queries) */
app.get("/api/orders", authMiddleware, async (req, res, next) => {
  try {
    await ensureFullOrderSchema();
    const rows = await query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [
      req.user.id,
    ]);

    if (rows.length === 0) return res.json([]);

    // Single batch query for items
    const orderIds = rows.map((o) => o.id);
    const placeholders = orderIds.map(() => "?").join(",");
    const allItems = await query(
      `SELECT * FROM order_items WHERE order_id IN (${placeholders})`,
      orderIds,
    );

    const itemsByOrderId = {};
    for (const item of allItems) {
      if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
      itemsByOrderId[item.order_id].push(item);
    }

    const orders = rows.map((o) => {
      const items = itemsByOrderId[o.id] || [];
      return {
        id: o.id,
        order_ref: o.order_ref,
        orderRef: o.order_ref,
        user_id: o.user_id,
        shipping_name: o.shipping_name,
        shipping_phone: o.shipping_phone,
        shipping_email: o.shipping_email,
        shipping_address: o.shipping_address,
        shipping_city: o.shipping_city,
        subtotal: Number(o.subtotal),
        shipping_fee: Number(o.shipping_fee),
        discount_amount: Number(o.discount_amount || 0),
        grand_total: Number(o.grand_total),
        payment_method: o.payment_method,
        payment_status: o.payment_status || "UNPAID",
        payment_receipt: o.payment_receipt || null,
        transaction_ref: o.transaction_ref || null,
        rejection_reason: o.rejection_reason || null,
        status: o.status,
        delivery_status: o.delivery_status || "PENDING",
        tracking_number: o.tracking_number || null,
        delivery_person: o.delivery_person || null,
        delivery_phone: o.delivery_phone || null,
        notes: o.notes,
        created_at: o.created_at,
        items: items.map((i) => ({
          id: i.id,
          order_id: i.order_id,
          product_id: i.product_id,
          product_name: i.product_name,
          product_image: i.product_image || "/p-panelboard.jpg",
          qty: i.qty,
          unit_price: Number(i.unit_price),
        })),
      };
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/* 5. ADMIN — ALL ORDERS WITH FULL TELEMETRY (Batch Fetched — Zero N+1 Queries) */
app.get("/api/admin/orders", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    await ensureFullOrderSchema();
    const rows = await query(`
      SELECT o.*, u.full_name AS user_name, u.email AS user_email, u.phone AS user_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    if (rows.length === 0) return res.json([]);

    // Single batch query for items
    const orderIds = rows.map((o) => o.id);
    const placeholders = orderIds.map(() => "?").join(",");
    const allItems = await query(
      `SELECT * FROM order_items WHERE order_id IN (${placeholders})`,
      orderIds,
    );

    const itemsByOrderId = {};
    for (const item of allItems) {
      if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
      itemsByOrderId[item.order_id].push(item);
    }

    const paymentMethodDisplay = {
      fonepay: "Fonepay QR",
      cod: "Cash on Delivery",
      bank: "Bank Transfer",
      esewa: "eSewa",
      khalti: "Khalti",
    };

    const orders = rows.map((o) => {
      const items = itemsByOrderId[o.id] || [];
      const method = paymentMethodDisplay[o.payment_method] || o.payment_method || "Fonepay QR";

      return {
        id: o.order_ref,
        orderRef: o.order_ref,
        customerName: o.shipping_name || o.user_name || "Customer",
        customerEmail: o.shipping_email || o.user_email || "Customer Direct",
        customerPhone: o.shipping_phone || o.user_phone || "+977-9800000000",
        shippingAddress: `${o.shipping_address}, ${o.shipping_city}`,
        shippingCity: o.shipping_city,
        notes: o.notes,
        paymentReceipt: o.payment_receipt || null,
        transactionRef: o.transaction_ref || null,
        rejectionReason: o.rejection_reason || null,
        paymentStatus: o.payment_status || "UNPAID",
        orderStatus: o.status || "ORDER_PLACED",
        verifiedBy: o.verified_by || null,
        adminNotes: o.admin_notes || null,
        deliveryStatus: o.delivery_status || "PENDING",
        deliveryCarrier: o.delivery_carrier || null,
        deliveryPerson: o.delivery_person || null,
        deliveryPhone: o.delivery_phone || null,
        trackingNumber: o.tracking_number || null,
        deliveryNotes: o.delivery_notes || null,
        estimatedDelivery: o.estimated_delivery || null,
        items: items.map((i) => ({
          productId: i.product_id,
          name: i.product_name,
          price: Number(i.unit_price),
          quantity: i.qty,
          image: i.product_image || "/p-panelboard.jpg",
        })),
        subtotal: Number(o.subtotal),
        shippingFee: Number(o.shipping_fee),
        discountAmount: Number(o.discount_amount || 0),
        totalAmount: Number(o.grand_total),
        paymentMethod: method,
        createdAt: o.created_at,
        paymentSubmittedAt: o.payment_submitted_at,
        paymentVerifiedAt: o.payment_verified_at,
        timeline: [
          { title: "Order Placed", timestamp: new Date(o.created_at).toLocaleString() },
          ...(o.payment_receipt
            ? [
                {
                  title: "Payment Proof Submitted",
                  timestamp: o.payment_submitted_at
                    ? new Date(o.payment_submitted_at).toLocaleString()
                    : "Submitted",
                },
              ]
            : []),
          ...(o.payment_status === "PAYMENT_VERIFIED"
            ? [
                {
                  title: "Payment Verified & Approved",
                  timestamp: o.payment_verified_at
                    ? new Date(o.payment_verified_at).toLocaleString()
                    : "Verified",
                },
              ]
            : []),
          ...(o.payment_status === "PAYMENT_REJECTED"
            ? [
                {
                  title: `Payment Proof Rejected: ${o.rejection_reason || ""}`,
                  timestamp: "Action Required",
                },
              ]
            : []),
          ...(o.status === "PROCESSING" || o.status === "processing"
            ? [{ title: "Processing & Equipment Allocation", timestamp: "In Progress" }]
            : []),
          ...(o.status === "PACKED" || o.status === "packed"
            ? [{ title: "Packed & Prepared for Logistics", timestamp: "Ready" }]
            : []),
          ...(o.delivery_status === "OUT_FOR_DELIVERY" || o.status === "shipped"
            ? [
                {
                  title: `Out for Delivery via ${o.delivery_carrier || "Fleet Courier"}`,
                  timestamp: "In Transit",
                },
              ]
            : []),
          ...(o.status === "DELIVERED" || o.status === "delivered" || o.status === "completed"
            ? [{ title: "Successfully Delivered to Customer", timestamp: "Delivered" }]
            : []),
          ...(o.status === "CANCELLED" || o.status === "cancelled"
            ? [{ title: "Order Cancelled / Terminated", timestamp: "Closed" }]
            : []),
        ],
      };
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/* 6. ADMIN — VERIFY OR REJECT PAYMENT PROOF */
app.put(
  "/api/admin/orders/:ref/verify-payment",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    const { approve, rejectionReason, notes } = req.body ?? {};

    try {
      await ensureFullOrderSchema();
      const rawRef = req.params.ref;
      const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;

      const orderRows = await query(
        "SELECT * FROM orders WHERE order_ref = ? OR order_ref = ? LIMIT 1",
        [rawRef, refWithPrefix],
      );

      if (orderRows.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      const order = orderRows[0];
      const adminIdentifier = req.user.email || "Admin";

      if (approve) {
        // Approve Payment
        await query(
          `UPDATE orders SET
          payment_status = 'PAYMENT_VERIFIED',
          status = 'PROCESSING',
          payment_verified_at = CURRENT_TIMESTAMP,
          verified_by = ?,
          admin_notes = ?,
          rejection_reason = NULL
        WHERE id = ?`,
          [adminIdentifier, notes || null, order.id],
        );

        await logOrderStatusChange({
          orderId: order.id,
          orderRef: order.order_ref,
          statusType: "payment_verification",
          oldValue: order.payment_status,
          newValue: "PAYMENT_VERIFIED",
          changedBy: adminIdentifier,
          notes: notes || "Payment slip confirmed & verified by admin",
        });

        // Send Customer Email via FormSubmit (Non-blocking)
        const customerEmail = order.shipping_email;
        if (customerEmail) {
          sendNotificationEmail({
            to: customerEmail,
            subject: `Payment Verified — Order ${order.order_ref} Confirmed`,
            data: {
              "Order Reference": order.order_ref,
              "Payment Status": "Payment Verified & Approved",
              "Order Status": "Processing / Preparing Hardware",
              "Amount Paid": `NPR ${Number(order.grand_total).toLocaleString()}`,
              "Payment Method": String(order.payment_method).toUpperCase(),
              "Next Steps":
                "Our Kathmandu central warehouse is preparing your hardware for secure dispatch.",
            },
          }).catch(() => {});
        }

        res.json({
          ok: true,
          status: "PROCESSING",
          paymentStatus: "PAYMENT_VERIFIED",
          orderStatus: "PROCESSING",
          message: "Payment successfully verified and order is now processing",
        });
      } else {
        // Reject Payment with Reason
        const reason =
          rejectionReason ||
          "Payment screenshot could not be verified. Please upload a clearer payment receipt.";
        await query(
          `UPDATE orders SET
          payment_status = 'PAYMENT_REJECTED',
          rejection_reason = ?,
          verified_by = ?,
          admin_notes = ?
        WHERE id = ?`,
          [reason, adminIdentifier, notes || null, order.id],
        );
        // Restock inventory safely
        await adjustInventoryForOrder(order.id, "RESTOCK");

        await logOrderStatusChange({
          orderId: order.id,
          orderRef: order.order_ref,
          statusType: "payment_rejection",
          oldValue: order.payment_status,
          newValue: "PAYMENT_REJECTED",
          changedBy: adminIdentifier,
          notes: `Rejected: ${reason}`,
        });

        // Send Customer Rejection Email via FormSubmit (Non-blocking)
        const customerEmail = order.shipping_email;
        if (customerEmail) {
          sendNotificationEmail({
            to: customerEmail,
            subject: `Payment Verification Update — Order ${order.order_ref}`,
            data: {
              "Order Reference": order.order_ref,
              "Payment Status": "Payment Slip Rejected",
              Reason: reason,
              "Action Required":
                "Please visit your order page and upload a clearer payment screenshot or correct transaction reference.",
            },
          }).catch(() => {});
        }

        res.json({
          ok: true,
          paymentStatus: "PAYMENT_REJECTED",
          rejectionReason: reason,
          message: "Payment rejected and customer notified",
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

/* 7. ADMIN — UPDATE DELIVERY INFORMATION */
app.put(
  "/api/admin/orders/:ref/delivery",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    const body = req.body ?? {};
    const deliveryStatus = body.deliveryStatus || body.status;
    const deliveryCarrier = body.deliveryCarrier || body.carrier;
    const deliveryPerson = body.deliveryPerson || body.person;
    const deliveryPhone = body.deliveryPhone || body.phone;
    const trackingNumber = body.trackingNumber || body.tracking;
    const deliveryNotes = body.deliveryNotes || body.notes;
    const estimatedDelivery = body.estimatedDelivery || body.eta;

    try {
      await ensureFullOrderSchema();
      const rawRef = req.params.ref;
      const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;

      const orderRows = await query(
        "SELECT id, order_ref, shipping_email, shipping_name FROM orders WHERE order_ref = ? OR order_ref = ? LIMIT 1",
        [rawRef, refWithPrefix],
      );

      if (orderRows.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      const order = orderRows[0];
      const newDeliveryStatus = deliveryStatus ? String(deliveryStatus).toUpperCase() : "PENDING";

      // Synchronize order status if delivery reaches out_for_delivery or delivered
      let newOrderStatusClause = "";
      const params = [
        newDeliveryStatus,
        deliveryCarrier || null,
        deliveryPerson || null,
        deliveryPhone || null,
        trackingNumber || null,
        deliveryNotes || null,
        estimatedDelivery || null,
      ];

      if (newDeliveryStatus === "OUT_FOR_DELIVERY") {
        newOrderStatusClause = ", status = 'OUT_FOR_DELIVERY'";
      } else if (newDeliveryStatus === "DELIVERED") {
        newOrderStatusClause = ", status = 'DELIVERED'";
      }

      params.push(order.id);

      await query(
        `UPDATE orders SET
        delivery_status = ?,
        delivery_carrier = ?,
        delivery_person = ?,
        delivery_phone = ?,
        tracking_number = ?,
        delivery_notes = ?,
        estimated_delivery = ?
        ${newOrderStatusClause}
      WHERE id = ?`,
        params,
      );

      await logOrderStatusChange({
        orderId: order.id,
        orderRef: order.order_ref,
        statusType: "delivery_update",
        oldValue: null,
        newValue: newDeliveryStatus,
        changedBy: req.user.email || "Admin",
        notes: trackingNumber
          ? `Tracking #${trackingNumber} via ${deliveryCarrier || "Courier"}`
          : "Delivery telemetry updated",
      });

      // Notify customer if dispatched
      if (newDeliveryStatus === "OUT_FOR_DELIVERY" && order.shipping_email) {
        sendNotificationEmail({
          to: order.shipping_email,
          subject: `Your OMSUN Order is Out for Delivery! — ${order.order_ref}`,
          data: {
            "Order Reference": order.order_ref,
            Carrier: deliveryCarrier || "OMSUN Express Logistics",
            "Courier Agent": deliveryPerson || "Assigned Driver",
            "Courier Phone": deliveryPhone || "N/A",
            "Tracking Number": trackingNumber || "N/A",
            Status: "On the way to your delivery address",
          },
        }).catch(() => {});
      }

      res.json({ ok: true, message: "Delivery details updated successfully" });
    } catch (err) {
      next(err);
    }
  },
);

/* 8. ADMIN — UPDATE GENERAL ORDER STATUS */
app.put(
  "/api/admin/orders/:ref/status",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    let { status, notes } = req.body ?? {};
    if (!status) return res.status(400).json({ error: "status is required" });

    try {
      await ensureFullOrderSchema();
      const rawRef = req.params.ref;
      const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;

      const orderRows = await query(
        "SELECT id, order_ref, status, shipping_email, shipping_name FROM orders WHERE order_ref = ? OR order_ref = ? LIMIT 1",
        [rawRef, refWithPrefix],
      );

      if (orderRows.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      const order = orderRows[0];
      const upperStatus = String(status).toUpperCase();

      await query(
        "UPDATE orders SET status = ?, admin_notes = COALESCE(?, admin_notes) WHERE id = ?",
        [upperStatus, notes || null, order.id],
      );

      await logOrderStatusChange({
        orderId: order.id,
        orderRef: order.order_ref,
        statusType: "order_lifecycle",
        oldValue: order.status,
        newValue: upperStatus,
        changedBy: req.user.email || "Admin",
        notes: notes || `Lifecycle updated to ${upperStatus}`,
      });

      // If cancelled, release reserved stock
      if (upperStatus === "CANCELLED") {
        const items = await query("SELECT product_id, qty FROM order_items WHERE order_id = ?", [
          order.id,
        ]);
        for (const item of items) {
          await query("UPDATE products SET stock = stock + ? WHERE id = ?", [
            item.qty,
            item.product_id,
          ]);
        }
      }

      // Send customer notification for major status updates
      if (
        order.shipping_email &&
        ["PROCESSING", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].includes(upperStatus)
      ) {
        sendNotificationEmail({
          to: order.shipping_email,
          subject: `Order Status Update: ${upperStatus} — ${order.order_ref}`,
          data: {
            "Order Reference": order.order_ref,
            "New Status": upperStatus,
            Notes: notes || "Your order has progressed to the next fulfillment phase.",
            Timestamp: new Date().toLocaleString(),
          },
        }).catch(() => {});
      }

      res.json({ ok: true, status: upperStatus });
    } catch (err) {
      next(err);
    }
  },
);

/* 9. ADMIN — DELETE ORDER */
app.delete("/api/admin/orders/:ref", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await ensureFullOrderSchema();
    const rawRef = req.params.ref;
    const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;
    const rows = await query(
      "SELECT id, order_ref, status, payment_status FROM orders WHERE order_ref = ? OR order_ref = ?",
      [rawRef, refWithPrefix],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    const order = rows[0];

    // Safely restore reserved inventory if order was active
    if (order.status !== "CANCELLED" && order.payment_status !== "PAYMENT_REJECTED") {
      const items = await query("SELECT product_id, qty FROM order_items WHERE order_id = ?", [
        order.id,
      ]);
      for (const item of items) {
        await query("UPDATE products SET stock = stock + ? WHERE id = ?", [
          item.qty,
          item.product_id,
        ]);
      }
    }

    await query("DELETE FROM order_status_history WHERE order_id = ?", [order.id]);
    await query("DELETE FROM order_items WHERE order_id = ?", [order.id]);
    await query("DELETE FROM orders WHERE id = ?", [order.id]);
    res.json({ ok: true, message: `Order ${rawRef} deleted successfully and inventory restored` });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* MEDIA UPLOAD (Direct image upload for admin panel)                  */
/* ═══════════════════════════════════════════════════════════════════ */
app.post("/api/upload", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { imageBase64, fileName, mimeType } = req.body ?? {};
    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 payload is required" });
    }

    // Strip data URL prefix if present (e.g. data:image/png;base64,...)
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let detectedExt = ".png";

    if (matches && matches.length === 3) {
      const type = matches[1];
      detectedExt =
        type.includes("jpeg") || type.includes("jpg")
          ? ".jpg"
          : type.includes("webp")
            ? ".webp"
            : type.includes("svg")
              ? ".svg"
              : ".png";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    }

    const ext = (fileName && path.extname(fileName)) || detectedExt;
    const cleanExt = ext.replace(/[^a-zA-Z0-9.]/g, "") || ".png";
    const safeName = `omsun-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${cleanExt.startsWith(".") ? cleanExt : `.${cleanExt}`}`;
    const targetPath = path.join(uploadsDir, safeName);

    await fs.promises.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({ ok: true, url: publicUrl, fileName: safeName });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* ADMIN — Products CRUD                                               */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/products", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const rows = await query("SELECT * FROM products ORDER BY created_at DESC, name ASC");
    const products = rows.map((r) => ({
      ...r,
      price: Number(r.price),
      mrp: r.mrp ? Number(r.mrp) : null,
      rating: Number(r.rating) || 0,
      stock: Number(r.stock) || 0,
      images: safeParseJson(r.images, r.image ? [r.image] : []),
      badges: safeParseJson(r.badges, []),
      features: safeParseJson(r.features, []),
      specs: safeParseJson(r.specs, []),
    }));
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.post("/api/admin/products", authMiddleware, adminMiddleware, async (req, res, next) => {
  const {
    id,
    name,
    category,
    subcategory,
    brand,
    tagline,
    description,
    price,
    mrp,
    image,
    images,
    features,
    specs,
    stock,
    rating,
    badges,
  } = req.body ?? {};

  if (!name || price == null) {
    return res.status(400).json({ error: "Product name and price are required" });
  }

  try {
    const prodId = id || `sku-${Date.now().toString(36)}`;
    const galleryList = Array.isArray(images)
      ? images
      : typeof images === "string"
        ? safeParseJson(images, [])
        : image
          ? [image]
          : [];
    const finalImages =
      galleryList.length > 0
        ? image && !galleryList.includes(image)
          ? [image, ...galleryList]
          : galleryList
        : image
          ? [image]
          : [];

    await query(
      `INSERT INTO products (id, name, category, subcategory, brand, tagline, description, price, mrp, image, images, features, specs, stock, rating, badges)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prodId,
        name,
        category || "UPS",
        subcategory || null,
        brand || "OMSUN",
        tagline || null,
        description || null,
        Number(price) || 0,
        mrp != null ? Number(mrp) : null,
        image || null,
        JSON.stringify(finalImages),
        JSON.stringify(features || []),
        JSON.stringify(specs || []),
        Number(stock) || 0,
        Number(rating) || 4.8,
        JSON.stringify(badges || []),
      ],
    );
    res.status(201).json({ ok: true, id: prodId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Product with this ID already exists" });
    }
    next(err);
  }
});

app.put("/api/admin/products/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  const {
    name,
    category,
    subcategory,
    brand,
    tagline,
    description,
    price,
    mrp,
    image,
    images,
    features,
    specs,
    stock,
    rating,
    badges,
  } = req.body ?? {};

  try {
    const existing = await query("SELECT id, image, images FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    let serializedImages = undefined;
    if (images !== undefined) {
      const parsedImages = Array.isArray(images)
        ? images
        : typeof images === "string"
          ? safeParseJson(images, [])
          : [];
      const primaryImg = image !== undefined ? image : existing[0].image;
      const finalGallery =
        parsedImages.length > 0
          ? primaryImg && !parsedImages.includes(primaryImg)
            ? [primaryImg, ...parsedImages]
            : parsedImages
          : primaryImg
            ? [primaryImg]
            : [];
      serializedImages = JSON.stringify(finalGallery);
    }

    await query(
      `UPDATE products SET 
         name = COALESCE(?, name),
         category = COALESCE(?, category),
         subcategory = ?,
         brand = COALESCE(?, brand),
         tagline = ?,
         description = ?,
         price = COALESCE(?, price),
         mrp = ?,
         image = COALESCE(?, image),
         images = COALESCE(?, images),
         features = COALESCE(?, features),
         specs = COALESCE(?, specs),
         stock = COALESCE(?, stock),
         rating = COALESCE(?, rating),
         badges = COALESCE(?, badges)
       WHERE id = ?`,
      [
        name !== undefined ? name : null,
        category !== undefined ? category : null,
        subcategory !== undefined ? subcategory : null,
        brand !== undefined ? brand : null,
        tagline !== undefined ? tagline : null,
        description !== undefined ? description : null,
        price != null ? Number(price) : null,
        mrp != null ? Number(mrp) : null,
        image !== undefined ? image : null,
        serializedImages !== undefined ? serializedImages : null,
        features !== undefined ? (features ? JSON.stringify(features) : JSON.stringify([])) : null,
        specs !== undefined ? (specs ? JSON.stringify(specs) : JSON.stringify([])) : null,
        stock != null ? Number(stock) : null,
        rating != null ? Number(rating) : null,
        badges !== undefined ? (badges ? JSON.stringify(badges) : JSON.stringify([])) : null,
        req.params.id,
      ],
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("[omsun-api] PUT /api/admin/products/:id error:", err);
    next(err);
  }
});

app.delete("/api/admin/products/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const existing = await query("SELECT id FROM products WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const orderItems = await query(
      "SELECT COUNT(*) AS count FROM order_items WHERE product_id = ?",
      [req.params.id],
    );
    if (orderItems[0]?.count > 0) {
      return res.status(400).json({
        error:
          "Cannot delete product linked to existing customer orders. Please set stock to 0 instead to deactivate it.",
      });
    }
    await query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ ok: true, message: `Product ${req.params.id} deleted` });
  } catch (err) {
    next(err);
  }
});

app.patch(
  "/api/admin/products/:id/stock",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    const { stock } = req.body ?? {};
    if (stock == null) return res.status(400).json({ error: "stock is required" });
    try {
      await query("UPDATE products SET stock = ? WHERE id = ?", [Number(stock), req.params.id]);
      res.json({ ok: true, stock: Number(stock) });
    } catch (err) {
      next(err);
    }
  },
);

/* ═══════════════════════════════════════════════════════════════════ */
/* ADMIN — Customers                                                  */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/customers", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const rows = await query(`
      SELECT u.id, u.full_name, u.email, u.phone, u.company, u.role, u.created_at,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.grand_total), 0) AS total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    const customers = rows.map((r) => ({
      id: `CUST-${String(r.id).padStart(3, "0")}`,
      name: r.full_name,
      email: r.email,
      phone: r.phone || "",
      city: r.company || "",
      totalOrders: r.total_orders,
      totalSpent: Number(r.total_spent),
      status: Number(r.total_spent) > 500000 ? "VIP" : "Active",
      registeredDate: new Date(r.created_at).toISOString().split("T")[0],
    }));
    res.json(customers);
  } catch (err) {
    next(err);
  }
});



/* ═══════════════════════════════════════════════════════════════════ */
/* ADMIN — Partners CRUD                                               */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/partners", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const rows = await query("SELECT * FROM partners ORDER BY created_at DESC");
    const partners = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      partnerSince: r.partner_since,
      status: r.status === "active" ? "Active Authorized" : "Pending Review",
      logoUrl: r.logo_url || "",
      notes: r.notes || "",
    }));
    res.json(partners);
  } catch (err) {
    next(err);
  }
});

app.post("/api/admin/partners", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { id, name, category, partnerSince, status, logoUrl, notes } = req.body ?? {};
  if (!name || !category) {
    return res.status(400).json({ error: "name and category are required" });
  }
  try {
    const partnerId = id || `PRT-${Date.now().toString(36).toUpperCase()}`;
    await query(
      "INSERT INTO partners (id, name, category, partner_since, status, logo_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        partnerId,
        name,
        category,
        partnerSince || "",
        status?.includes("active") ? "active" : "pending",
        logoUrl || null,
        notes || null,
      ],
    );
    res.status(201).json({ ok: true, id: partnerId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Partner ID already exists" });
    }
    next(err);
  }
});

app.put("/api/admin/partners/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { name, category, partnerSince, status, logoUrl, notes } = req.body ?? {};
  try {
    const existing = await query("SELECT id FROM partners WHERE id = ?", [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: "Partner not found" });
    await query(
      "UPDATE partners SET name=COALESCE(?,name), category=COALESCE(?,category), partner_since=COALESCE(?,partner_since), status=COALESCE(?,status), logo_url=COALESCE(?,logo_url), notes=COALESCE(?,notes) WHERE id=?",
      [
        name,
        category,
        partnerSince,
        status?.includes("active") ? "active" : "pending",
        logoUrl,
        notes,
        req.params.id,
      ],
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/admin/partners/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await query("DELETE FROM partners WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* ADMIN — Banners CRUD                                                */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/banners", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const rows = await query("SELECT * FROM banners ORDER BY display_order ASC");
    const banners = rows.map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle || "",
      ctaText: r.cta_text || "",
      ctaLink: r.cta_link || "",
      image: r.image || "",
      tagBadge: r.tag_badge || "",
      displayOrder: r.display_order,
      status: r.status === "active" ? "Active" : "Draft",
    }));
    res.json(banners);
  } catch (err) {
    next(err);
  }
});

app.post("/api/admin/banners", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { id, title, subtitle, ctaText, ctaLink, image, tagBadge, displayOrder, status } =
    req.body ?? {};
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }
  try {
    const bannerId = id || `BAN-${Date.now().toString(36).toUpperCase()}`;
    await query(
      "INSERT INTO banners (id, title, subtitle, cta_text, cta_link, image, tag_badge, display_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        bannerId,
        title,
        subtitle || null,
        ctaText || null,
        ctaLink || null,
        image || null,
        tagBadge || null,
        displayOrder || 0,
        status?.toLowerCase() === "active" ? "active" : "draft",
      ],
    );
    res.status(201).json({ ok: true, id: bannerId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Banner ID already exists" });
    }
    next(err);
  }
});

app.put("/api/admin/banners/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { title, subtitle, ctaText, ctaLink, image, tagBadge, displayOrder, status } =
    req.body ?? {};
  try {
    const existing = await query("SELECT id FROM banners WHERE id = ?", [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: "Banner not found" });
    await query(
      "UPDATE banners SET title=COALESCE(?,title), subtitle=COALESCE(?,subtitle), cta_text=COALESCE(?,cta_text), cta_link=COALESCE(?,cta_link), image=COALESCE(?,image), tag_badge=COALESCE(?,tag_badge), display_order=COALESCE(?,display_order), status=COALESCE(?,status) WHERE id=?",
      [
        title,
        subtitle,
        ctaText,
        ctaLink,
        image,
        tagBadge,
        displayOrder,
        status?.toLowerCase(),
        req.params.id,
      ],
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/admin/banners/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await query("DELETE FROM banners WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* TEAM MEMBERS (Public & Admin)                                       */
/* ═══════════════════════════════════════════════════════════════════ */

// Public endpoint for homepage
app.get("/api/team", async (_req, res, next) => {
  try {
    const rows = await query(
      "SELECT id, name, position, bio, image, display_order, is_active, created_at, updated_at FROM team_members WHERE is_active = 1 ORDER BY display_order ASC, created_at ASC",
    );
    const members = rows.map((r) => ({
      id: r.id,
      name: r.name,
      position: r.position,
      bio: r.bio,
      image: r.image,
      displayOrder: Number(r.display_order),
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    res.json(members);
  } catch (err) {
    next(err);
  }
});

// Admin list of all members (active and inactive)
app.get("/api/admin/team", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const rows = await query(
      "SELECT id, name, position, bio, image, display_order, is_active, created_at, updated_at FROM team_members ORDER BY display_order ASC, created_at ASC",
    );
    const members = rows.map((r) => ({
      id: r.id,
      name: r.name,
      position: r.position,
      bio: r.bio,
      image: r.image,
      displayOrder: Number(r.display_order),
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
    res.json(members);
  } catch (err) {
    next(err);
  }
});

// Admin create team member
app.post("/api/admin/team", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { id, name, position, bio, image, displayOrder, isActive } = req.body ?? {};
  if (!name || !position) {
    return res.status(400).json({ error: "Name and position/designation are required" });
  }

  try {
    const memberId =
      id || `team-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const imgUrl = image || "/images/team/ashish-baral.jpg";
    const orderNum = displayOrder != null ? Number(displayOrder) : 0;
    const activeVal = isActive === false ? 0 : 1;

    await query(
      `INSERT INTO team_members (id, name, position, bio, image, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [memberId, name.trim(), position.trim(), bio ? bio.trim() : null, imgUrl, orderNum, activeVal],
    );

    res.status(201).json({ ok: true, id: memberId });
  } catch (err) {
    next(err);
  }
});

// Admin update team member
app.put("/api/admin/team/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { name, position, bio, image, displayOrder, isActive } = req.body ?? {};
  try {
    const existing = await query("SELECT id FROM team_members WHERE id = ?", [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: "Team member not found" });

    await query(
      `UPDATE team_members SET
         name = COALESCE(?, name),
         position = COALESCE(?, position),
         bio = COALESCE(?, bio),
         image = COALESCE(?, image),
         display_order = COALESCE(?, display_order),
         is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        name != null ? name.trim() : null,
        position != null ? position.trim() : null,
        bio !== undefined ? (bio ? bio.trim() : null) : null,
        image != null ? image : null,
        displayOrder != null ? Number(displayOrder) : null,
        isActive != null ? (isActive ? 1 : 0) : null,
        req.params.id,
      ],
    );

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Admin delete team member
app.delete("/api/admin/team/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const existing = await query("SELECT id FROM team_members WHERE id = ?", [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: "Team member not found" });

    await query("DELETE FROM team_members WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* ADMIN — Stats / Analytics                                           */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const [productCount] = await query("SELECT COUNT(*) AS cnt FROM products");
    const [orderCount] = await query("SELECT COUNT(*) AS cnt FROM orders");
    const [customerCount] = await query(
      "SELECT COUNT(*) AS cnt FROM users WHERE role = 'customer'",
    );
    const [revenueSum] = await query(
      "SELECT COALESCE(SUM(grand_total), 0) AS total FROM orders WHERE status != 'cancelled'",
    );
    const [pendingOrders] = await query(
      "SELECT COUNT(*) AS cnt FROM orders WHERE status = 'pending'",
    );
    const [lowStock] = await query("SELECT COUNT(*) AS cnt FROM products WHERE stock <= 10");
    const categoryRows = await query(
      "SELECT category, COUNT(*) AS cnt FROM products GROUP BY category ORDER BY cnt DESC",
    );
    const monthlyRows = await query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(grand_total) AS revenue, COUNT(*) AS orders
      FROM orders WHERE status != 'cancelled'
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);
    res.json({
      productCount: productCount.cnt,
      orderCount: orderCount.cnt,
      customerCount: customerCount.cnt,
      totalRevenue: Number(revenueSum.total),
      pendingOrders: pendingOrders.cnt,
      lowStockItems: lowStock.cnt,
      categoryDistribution: categoryRows.map((r) => ({ name: r.category, value: r.cnt })),
      monthlyTrend: monthlyRows.map((r) => ({
        month: r.month,
        revenue: Number(r.revenue),
        orders: r.orders,
      })),
    });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* ADMIN — Inquiries & Subscribers                                     */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/inquiries", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const contactMessages = await query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100",
    );
    const subscribers = await query(
      "SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 100",
    );
    res.json({
      ok: true,
      contactMessages: contactMessages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone || "",
        company: m.company || "",
        inquiryType: m.inquiry_type || "General",
        systemSize: m.system_size || "",
        district: m.district || "",
        message: m.message,
        createdAt: m.created_at,
      })),
      subscribers: subscribers.map((s) => ({
        id: s.id,
        email: s.email,
        createdAt: s.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/admin/sync-catalog", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await setup();
    const rows = await query("SELECT COUNT(*) as count FROM products");
    res.json({ ok: true, count: rows[0].count });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* PUBLIC — Contact & Newsletter                                       */
/* ═══════════════════════════════════════════════════════════════════ */
app.post("/api/contact", contactLimiter, async (req, res, next) => {
  const { name, email, phone, company, inquiryType, systemSize, district, message } =
    req.body ?? {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  try {
    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, company, inquiry_type, system_size, district, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(name).slice(0, 120),
        String(email).slice(0, 190),
        phone ? String(phone).slice(0, 30) : null,
        company ? String(company).slice(0, 120) : null,
        inquiryType ? String(inquiryType).slice(0, 60) : null,
        systemSize ? String(systemSize).slice(0, 60) : null,
        district ? String(district).slice(0, 120) : null,
        String(message).slice(0, 5000),
      ],
    );

    // Non-blocking FormSubmit email notification to admin
    sendNotificationEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `New Omsun Contact Inquiry — ${name} (${inquiryType || "General"})`,
      data: {
        "Sender Name": name,
        "Email Address": email,
        "Phone Number": phone || "N/A",
        "Company / Organization": company || "N/A",
        "Inquiry Category": inquiryType || "General",
        "Estimated Solar System Size": systemSize || "N/A",
        "District / Location": district || "N/A",
        "Message Content": message,
        "Received At": new Date().toLocaleString(),
      },
    }).catch(() => {});

    res
      .status(201)
      .json({
        ok: true,
        id: result.insertId,
        message: "Thank you for reaching out. We will get back to you shortly.",
      });
  } catch (err) {
    next(err);
  }
});

app.post("/api/newsletter", newsletterLimiter, async (req, res, next) => {
  const { email } = req.body ?? {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email address is required" });
  }

  try {
    await query(
      "INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE created_at = created_at",
      [String(email).toLowerCase().slice(0, 190)],
    );
    res.json({ ok: true, message: "Thank you for subscribing to OMSUN Nepal updates!" });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* 404 & ERROR                                                        */
/* ═══════════════════════════════════════════════════════════════════ */
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, _req, res, _next) => {
  console.error("[api] unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[omsun-api] listening on port ${PORT}`);
});
