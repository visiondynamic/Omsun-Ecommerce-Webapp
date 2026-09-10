import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "./db.js";
import { setup } from "./setup-db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Auto-ensure images column in products table
async function ensureProductImagesColumn() {
  try {
    await query("ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSON NULL AFTER image");
  } catch {
    try {
      await query("ALTER TABLE products ADD COLUMN images JSON NULL");
    } catch {}
  }
}

// Auto-bootstrap MySQL schema & catalog seed on fresh databases (e.g. Railway)
async function autoInitDatabase() {
  try {
    const tables = await query("SHOW TABLES LIKE 'products'");
    if (tables.length === 0) {
      console.log("[omsun-api] Database tables missing. Running automatic setup & seeding...");
      await setup();
      console.log("[omsun-api] Automatic setup & seeding completed!");
    } else {
      const rows = await query("SELECT COUNT(*) as count FROM products");
      if (rows[0].count !== 32) {
        console.log("[omsun-api] Upgrading catalog to official 32 products...");
        await setup();
        console.log("[omsun-api] Official 32 products synchronized!");
      }
    }
    await ensureProductImagesColumn();
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
  express.static(uploadsDir)
);
const publicDir = path.resolve(__dirname, "../../public");
app.use("/products", express.static(path.join(publicDir, "products")));
app.use(express.static(publicDir));

/* ─── Simple JWT-like token helpers (no jsonwebtoken dependency) ─── */
function createToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(token).digest("base64url");
  return `${token}.${sig}`;
}

function verifyToken(token) {
  try {
    const [tokenPart, sig] = token.split(".");
    if (!tokenPart || !sig) return null;
    const expected = crypto.createHmac("sha256", JWT_SECRET).update(tokenPart).digest("base64url");
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(tokenPart, "base64url").toString());
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Not authenticated" });
  const user = verifyToken(header.slice(7));
  if (!user) return res.status(401).json({ error: "Invalid token" });
  req.user = user;
  next();
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Admin access required" });
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
/* MEDIA & FILE UPLOADS                                               */
/* ═══════════════════════════════════════════════════════════════════ */
app.post("/api/upload", async (req, res, next) => {
  try {
    const { imageBase64, fileName } = req.body ?? {};
    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    // Extract mime type and clean base64 data
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = "png";

    if (matches && matches.length === 3) {
      const mime = matches[1].toLowerCase();
      if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
      else if (mime.includes("webp")) ext = "webp";
      else if (mime.includes("svg")) ext = "svg";
      else if (mime.includes("gif")) ext = "gif";
      else if (mime.includes("png")) ext = "png";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(imageBase64, "base64");
    }

    // Sanitize filename
    const origBase = (fileName || "product-image")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase()
      .slice(0, 40);
    const uniqueName = `${origBase || "upload"}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;
    console.log(`[omsun-api] File uploaded successfully: ${publicUrl} (${buffer.length} bytes)`);
    res.status(201).json({ ok: true, url: publicUrl, fileName: uniqueName });
  } catch (err) {
    console.error("[omsun-api] Upload error:", err);
    next(err);
  }
});

app.post("/api/auth/avatar", authMiddleware, async (req, res, next) => {
  try {
    const { imageBase64 } = req.body ?? {};
    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = "png";
    if (matches && matches.length === 3) {
      const mime = matches[1].toLowerCase();
      if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
      else if (mime.includes("webp")) ext = "webp";
      else if (mime.includes("png")) ext = "png";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(imageBase64, "base64");
    }

    const uniqueName = `avatar-${req.user.id}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);
    await fs.promises.writeFile(filePath, buffer);

    const avatarUrl = `/uploads/${uniqueName}`;
    await query("UPDATE users SET avatar = ? WHERE id = ?", [avatarUrl, req.user.id]);

    res.json({ ok: true, avatarUrl, message: "Avatar updated successfully" });
  } catch (err) {
    next(err);
  }
});

app.post("/api/orders/:ref/receipt", authMiddleware, async (req, res, next) => {
  try {
    const { receiptBase64 } = req.body ?? {};
    if (!receiptBase64) {
      return res.status(400).json({ error: "receiptBase64 is required" });
    }

    const matches = receiptBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = "jpg";
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(receiptBase64, "base64");
    }

    const uniqueName = `receipt-${req.params.ref}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);
    await fs.promises.writeFile(filePath, buffer);

    const receiptUrl = `/uploads/${uniqueName}`;
    await query("UPDATE orders SET payment_receipt = ? WHERE order_ref = ?", [receiptUrl, req.params.ref]);

    res.json({ ok: true, receiptUrl, message: "Payment receipt uploaded" });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* AUTH                                                               */
/* ═══════════════════════════════════════════════════════════════════ */
app.post("/api/auth/register", async (req, res, next) => {
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
    res.status(201).json({ ok: true, token, user: { id: String(user.id), name: fullName, email, role: "customer" } });
  } catch (err) {
    next(err);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
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
      user: { id: String(user.id), name: user.full_name, email: user.email, role: user.role, avatar: user.avatar_url || null },
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
    const rows = await query("SELECT id, full_name, email, phone, company, role, avatar_url FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    const u = rows[0];
    res.json({ id: String(u.id), name: u.full_name, email: u.email, phone: u.phone, company: u.company, role: u.role, avatar: u.avatar_url || null });
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
      [fullName || null, phone || null, company || null, avatar !== undefined ? avatar : null, req.user.id]
    );
    const rows = await query("SELECT id, full_name, email, phone, company, role, avatar_url FROM users WHERE id = ?", [req.user.id]);
    const u = rows[0];
    res.json({ ok: true, user: { id: String(u.id), name: u.full_name, email: u.email, phone: u.phone, company: u.company, role: u.role, avatar: u.avatar_url || null } });
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
    const rows = await query("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC", [req.user.id]);
    res.json(rows.map(r => ({
      id: String(r.id),
      fullName: r.full_name,
      street: r.street,
      area: r.area || "",
      city: r.city,
      province: r.province,
      phone: r.phone,
      type: r.address_type,
      isDefault: Boolean(r.is_default),
    })));
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
      [req.user.id, fullName, street, area || null, city, province || "Bagmati Province", phone, type || "Shipping", isDefault ? 1 : 0]
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
      [fullName, street, area, city, province, phone, type, isDefault !== undefined ? (isDefault ? 1 : 0) : null, req.params.id, req.user.id]
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
      "SELECT id, name, category, subcategory, brand, tagline, price, mrp, image, images, stock, rating, badges FROM products ORDER BY name",
    );
    const products = rows.map((r) => ({
      ...r,
      price: Number(r.price),
      mrp: r.mrp ? Number(r.mrp) : null,
      rating: Number(r.rating) || 0,
      images: typeof r.images === "string" ? JSON.parse(r.images) : r.images || [],
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
      images: typeof p.images === "string" ? JSON.parse(p.images) : p.images || [],
      badges: typeof p.badges === "string" ? JSON.parse(p.badges) : p.badges || [],
      features: typeof p.features === "string" ? JSON.parse(p.features) : p.features || [],
      specs: typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs || [],
    });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* ORDERS                                                             */
/* ═══════════════════════════════════════════════════════════════════ */
async function ensureOrdersPaymentReceiptColumn() {
  try {
    await query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_receipt MEDIUMTEXT NULL");
  } catch {
    try {
      await query("ALTER TABLE orders ADD COLUMN payment_receipt MEDIUMTEXT NULL");
    } catch {}
  }
}
ensureOrdersPaymentReceiptColumn();

app.post("/api/orders", authMiddleware, async (req, res, next) => {
  const { items, shipping, paymentMethod, paymentReceipt } = req.body ?? {};
  if (!items?.length || !shipping) {
    return res.status(400).json({ error: "items and shipping details are required" });
  }
  try {
    await ensureOrdersPaymentReceiptColumn();
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const prodId = item.productId || `prod-${Date.now()}`;
      const rows = await query("SELECT id, name, price, stock FROM products WHERE id = ?", [prodId]);
      let prodName = item.name || "Solar & Electrical Equipment";
      let unitPrice = Number(item.price) || 0;

      if (rows.length > 0) {
        const prod = rows[0];
        prodName = prod.name;
        unitPrice = Number(prod.price);
        await query("UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?", [item.quantity || 1, prod.id]);
      } else {
        // Auto-create product record if not existing in DB to satisfy foreign key
        await query(
          "INSERT INTO products (id, name, category, brand, price, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [prodId, prodName, "Solar Panels", "OMSUN", unitPrice, 50, 4.8],
        );
      }
      const qty = Number(item.quantity) || 1;
      subtotal += unitPrice * qty;
      orderItems.push({ productId: prodId, name: prodName, qty, unitPrice });
    }

    let method = (paymentMethod || "fonepay").toLowerCase();
    if (method.includes("fonepay")) method = "fonepay";
    else if (method.includes("bank")) method = "bank";
    else if (method.includes("esewa")) method = "esewa";
    else if (method.includes("khalti")) method = "khalti";
    else method = "cod";

    // Handle receipt saving if provided
    let savedReceiptUrl = null;
    if (paymentReceipt) {
      if (paymentReceipt.startsWith("data:image/")) {
        const match = paymentReceipt.match(/^data:image\/(\w+);base64,(.+)$/);
        if (match) {
          const ext = match[1] === "jpeg" ? "jpg" : match[1];
          const data = Buffer.from(match[2], "base64");
          const filename = `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, data);
          savedReceiptUrl = `/uploads/${filename}`;
        } else {
          savedReceiptUrl = paymentReceipt;
        }
      } else {
        savedReceiptUrl = paymentReceipt;
      }
    }

    const shippingFee = subtotal > 50000 ? 0 : 1500;
    const grandTotal = subtotal + shippingFee;
    const orderRef = `OMS-${Date.now().toString(36).toUpperCase()}`;

    const result = await query(
      "INSERT INTO orders (order_ref, user_id, shipping_name, shipping_phone, shipping_address, shipping_city, subtotal, shipping_fee, grand_total, payment_method, status, notes, payment_receipt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)",
      [orderRef, req.user.id, shipping.name, shipping.phone, shipping.address, shipping.city || "Kathmandu", subtotal, shippingFee, grandTotal, method, shipping.notes || null, savedReceiptUrl],
    );

    for (const item of orderItems) {
      await query(
        "INSERT INTO order_items (order_id, product_id, product_name, qty, unit_price) VALUES (?, ?, ?, ?, ?)",
        [result.insertId, item.productId, item.name, item.qty, item.unitPrice],
      );
    }

    res.status(201).json({ ok: true, orderRef, grandTotal, receiptUrl: savedReceiptUrl });
  } catch (err) {
    next(err);
  }
});

/* Upload or Update Payment Receipt for Order */
app.post("/api/orders/:ref/receipt", authMiddleware, async (req, res, next) => {
  const { receiptBase64 } = req.body ?? {};
  if (!receiptBase64) {
    return res.status(400).json({ error: "Receipt image is required" });
  }
  try {
    await ensureOrdersPaymentReceiptColumn();
    let savedReceiptUrl = receiptBase64;
    if (receiptBase64.startsWith("data:image/")) {
      const match = receiptBase64.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        const ext = match[1] === "jpeg" ? "jpg" : match[1];
        const data = Buffer.from(match[2], "base64");
        const filename = `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, data);
        savedReceiptUrl = `/uploads/${filename}`;
      }
    }
    const rawRef = req.params.ref;
    const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;
    await query(
      "UPDATE orders SET payment_receipt = ? WHERE (order_ref = ? OR order_ref = ?) AND (user_id = ? OR ? = 'admin')",
      [savedReceiptUrl, rawRef, refWithPrefix, req.user.id, req.user.role]
    );
    res.json({ ok: true, receiptUrl: savedReceiptUrl, message: "Payment receipt attached successfully" });
  } catch (err) {
    next(err);
  }
});

app.get("/api/orders", authMiddleware, async (req, res, next) => {
  try {
    await ensureOrdersPaymentReceiptColumn();
    const rows = await query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id],
    );
    const orders = await Promise.all(
      rows.map(async (o) => {
        const items = await query("SELECT * FROM order_items WHERE order_id = ?", [o.id]);
        return {
          id: o.id,
          order_ref: o.order_ref,
          user_id: o.user_id,
          shipping_name: o.shipping_name,
          shipping_phone: o.shipping_phone,
          shipping_address: o.shipping_address,
          shipping_city: o.shipping_city,
          subtotal: Number(o.subtotal),
          shipping_fee: Number(o.shipping_fee),
          grand_total: Number(o.grand_total),
          payment_method: o.payment_method,
          payment_receipt: o.payment_receipt || null,
          status: o.status,
          notes: o.notes,
          created_at: o.created_at,
          items: items.map((i) => ({
            id: i.id,
            order_id: i.order_id,
            product_id: i.product_id,
            product_name: i.product_name,
            qty: i.qty,
            unit_price: Number(i.unit_price),
          })),
        };
      }),
    );
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* CONTACT & NEWSLETTER                                               */
/* ═══════════════════════════════════════════════════════════════════ */
app.post("/api/contact", async (req, res, next) => {
  const { name, email, phone, company, inquiryType, systemSize, district, message } = req.body ?? {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }
  try {
    await query(
      "INSERT INTO contact_messages (name, email, phone, company, inquiry_type, system_size, district, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, phone || null, company || null, inquiryType || null, systemSize || null, district || null, message],
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.post("/api/newsletter", async (req, res, next) => {
  const { email } = req.body ?? {};
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }
  try {
    await query("INSERT INTO newsletter_subscribers (email) VALUES (?)", [email]);
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already subscribed" });
    }
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* ADMIN — Products CRUD                                              */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/products", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const rows = await query("SELECT * FROM products ORDER BY name");
    const products = rows.map((r) => ({
      ...r,
      price: Number(r.price),
      mrp: r.mrp ? Number(r.mrp) : null,
      rating: Number(r.rating) || 0,
      badges: typeof r.badges === "string" ? JSON.parse(r.badges) : r.badges || [],
      features: typeof r.features === "string" ? JSON.parse(r.features) : r.features || [],
      specs: typeof r.specs === "string" ? JSON.parse(r.specs) : r.specs || [],
    }));
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.post("/api/admin/products", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { id, name, category, brand, tagline, description, price, mrp, image, features, specs, stock, rating, badges } = req.body ?? {};
  if (!id || !name || !category || !brand || price == null) {
    return res.status(400).json({ error: "id, name, category, brand, and price are required" });
  }
  try {
    await query(
      "INSERT INTO products (id, name, category, brand, tagline, description, price, mrp, image, features, specs, stock, rating, badges) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, name, category, brand, tagline || null, description || null, price, mrp || null, image || null, JSON.stringify(features || []), JSON.stringify(specs || []), stock || 0, rating || 0, JSON.stringify(badges || [])],
    );
    res.status(201).json({ ok: true, id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Product ID already exists" });
    }
    next(err);
  }
});

app.put("/api/admin/products/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { name, category, brand, tagline, description, price, mrp, image, features, specs, stock, rating, badges } = req.body ?? {};
  try {
    const existing = await query("SELECT id FROM products WHERE id = ?", [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: "Product not found" });
    await query(
      "UPDATE products SET name=COALESCE(?,name), category=COALESCE(?,category), brand=COALESCE(?,brand), tagline=COALESCE(?,tagline), description=COALESCE(?,description), price=COALESCE(?,price), mrp=COALESCE(?,mrp), image=COALESCE(?,image), features=COALESCE(?,features), specs=COALESCE(?,specs), stock=COALESCE(?,stock), rating=COALESCE(?,rating), badges=COALESCE(?,badges) WHERE id=?",
      [name, category, brand, tagline, description, price, mrp, image, features ? JSON.stringify(features) : null, specs ? JSON.stringify(specs) : null, stock, rating, badges ? JSON.stringify(badges) : null, req.params.id],
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/admin/products/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* ADMIN — Orders Management                                          */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/orders", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const rows = await query(`
      SELECT o.*, u.full_name AS customer_name, u.email AS customer_email, u.phone AS customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    const statusDisplayMap = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Completed",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    const paymentMethodDisplay = {
      fonepay: "Fonepay QR",
      cod: "Cash on Delivery",
      bank: "Bank Transfer",
      esewa: "eSewa",
      khalti: "Khalti",
    };

    const orders = await Promise.all(
      rows.map(async (o) => {
        const items = await query("SELECT * FROM order_items WHERE order_id = ?", [o.id]);
        const orderStatus = statusDisplayMap[o.status] || "Pending";
        const method = paymentMethodDisplay[o.payment_method] || o.payment_method || "Fonepay QR";
        
        let payStatus = "Unpaid";
        if (o.status === "cancelled") {
          payStatus = "Refunded";
        } else if (o.payment_method === "cod") {
          payStatus = o.status === "delivered" ? "Paid" : "Unpaid";
        } else if (o.status === "processing" || o.status === "shipped" || o.status === "delivered" || o.status === "completed") {
          payStatus = "Paid";
        } else if (o.payment_receipt) {
          payStatus = "Pending Verification";
        } else {
          payStatus = "Unpaid";
        }

        return {
          id: o.order_ref,
          customerName: o.customer_name || o.shipping_name,
          customerEmail: o.customer_email || "Customer Direct",
          customerPhone: o.shipping_phone || o.customer_phone || "+977-9800000000",
          shippingAddress: `${o.shipping_address}, ${o.shipping_city}`,
          shippingCity: o.shipping_city,
          notes: o.notes,
          paymentReceipt: o.payment_receipt || null,
          items: items.map((i) => ({
            productId: i.product_id,
            name: i.product_name,
            price: Number(i.unit_price),
            quantity: i.qty,
            image: "",
          })),
          totalAmount: Number(o.grand_total),
          discountAmount: 0,
          paymentMethod: method,
          paymentStatus: payStatus,
          orderStatus: orderStatus,
          createdAt: o.created_at,
          timeline: [
            { title: "Order Placed", timestamp: new Date(o.created_at).toLocaleString() },
            ...(o.payment_receipt ? [{ title: "Payment Receipt / Slip Attached", timestamp: "Uploaded" }] : []),
            ...(o.status === "processing" ? [{ title: "Payment Verified & Order Confirmed", timestamp: "Approved" }] : []),
            ...(o.status === "shipped" ? [{ title: "Dispatched with Carrier", timestamp: "In Transit" }] : []),
            ...(o.status === "delivered" ? [{ title: "Delivered to Customer", timestamp: "Completed" }] : []),
            ...(o.status === "cancelled" ? [{ title: "Order Cancelled / Rejected", timestamp: "Closed" }] : []),
          ],
        };
      }),
    );
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

app.put("/api/admin/orders/:ref/status", authMiddleware, adminMiddleware, async (req, res, next) => {
  let { status } = req.body ?? {};
  if (!status) return res.status(400).json({ error: "status is required" });
  status = status.toLowerCase();
  if (status === "completed") status = "delivered";
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(", ")}` });
  }
  try {
    const rawRef = req.params.ref;
    const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;
    const result = await query(
      "UPDATE orders SET status = ? WHERE order_ref = ? OR order_ref = ?",
      [status, rawRef, refWithPrefix],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ ok: true, status });
  } catch (err) {
    next(err);
  }
});

/* Admin Verify / Approve Payment for Order */
app.put("/api/admin/orders/:ref/verify-payment", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { approve } = req.body ?? {};
  try {
    const rawRef = req.params.ref;
    const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;
    const newStatus = approve ? "processing" : "cancelled";
    const result = await query(
      "UPDATE orders SET status = ? WHERE order_ref = ? OR order_ref = ?",
      [newStatus, rawRef, refWithPrefix],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({
      ok: true,
      status: newStatus,
      message: approve ? "Payment verified and order approved!" : "Payment rejected",
    });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/admin/orders/:ref", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const rawRef = req.params.ref;
    const refWithPrefix = rawRef.startsWith("OMS-") ? rawRef : `OMS-${rawRef}`;
    const rows = await query(
      "SELECT id FROM orders WHERE order_ref = ? OR order_ref = ?",
      [rawRef, refWithPrefix],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    const orderId = rows[0].id;
    await query("DELETE FROM order_items WHERE order_id = ?", [orderId]);
    await query("DELETE FROM orders WHERE id = ?", [orderId]);
    res.json({ ok: true, message: `Order ${rawRef} deleted successfully` });
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
      detectedExt = type.includes("jpeg") || type.includes("jpg") ? ".jpg" : type.includes("webp") ? ".webp" : type.includes("svg") ? ".svg" : ".png";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    }

    const ext = (fileName && path.extname(fileName)) || detectedExt;
    const cleanExt = ext.replace(/[^a-zA-Z0-9.]/g, "") || ".png";
    const safeName = `omsun-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${cleanExt}`;
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
      images: typeof r.images === "string" ? JSON.parse(r.images) : r.images || [],
      badges: typeof r.badges === "string" ? JSON.parse(r.badges) : r.badges || [],
      features: typeof r.features === "string" ? JSON.parse(r.features) : r.features || [],
      specs: typeof r.specs === "string" ? JSON.parse(r.specs) : r.specs || [],
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
        JSON.stringify(images || (image ? [image] : [])),
        JSON.stringify(features || []),
        JSON.stringify(specs || []),
        Number(stock) || 0,
        Number(rating) || 4.8,
        JSON.stringify(badges || []),
      ]
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
    const existing = await query("SELECT id FROM products WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found" });
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
         images = ?,
         features = COALESCE(?, features),
         specs = COALESCE(?, specs),
         stock = COALESCE(?, stock),
         rating = COALESCE(?, rating),
         badges = COALESCE(?, badges)
       WHERE id = ?`,
      [
        name,
        category,
        subcategory !== undefined ? subcategory : null,
        brand,
        tagline !== undefined ? tagline : null,
        description !== undefined ? description : null,
        price != null ? Number(price) : null,
        mrp != null ? Number(mrp) : null,
        image,
        images ? JSON.stringify(images) : (image ? JSON.stringify([image]) : null),
        features ? JSON.stringify(features) : null,
        specs ? JSON.stringify(specs) : null,
        stock != null ? Number(stock) : null,
        rating != null ? Number(rating) : null,
        badges ? JSON.stringify(badges) : null,
        req.params.id,
      ]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/admin/products/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const existing = await query("SELECT id FROM products WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    await query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ ok: true, message: `Product ${req.params.id} deleted` });
  } catch (err) {
    next(err);
  }
});

app.patch("/api/admin/products/:id/stock", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { stock } = req.body ?? {};
  if (stock == null) return res.status(400).json({ error: "stock is required" });
  try {
    await query("UPDATE products SET stock = ? WHERE id = ?", [Number(stock), req.params.id]);
    res.json({ ok: true, stock: Number(stock) });
  } catch (err) {
    next(err);
  }
});

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
/* ADMIN — Coupons CRUD                                               */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/coupons", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const rows = await query("SELECT * FROM coupons ORDER BY created_at DESC");
    const coupons = rows.map((r) => ({
      id: r.id,
      code: r.code,
      discountType: r.discount_type === "percentage" ? "Percentage" : "Fixed",
      discountValue: Number(r.discount_value),
      minSpend: Number(r.min_spend),
      usageCount: r.usage_count,
      usageLimit: r.usage_limit,
      expiryDate: r.expiry_date ? new Date(r.expiry_date).toISOString().split("T")[0] : "",
      status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
    }));
    res.json(coupons);
  } catch (err) {
    next(err);
  }
});

app.post("/api/admin/coupons", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { code, discountType, discountValue, minSpend, usageLimit, expiryDate } = req.body ?? {};
  if (!code || !discountType || !discountValue) {
    return res.status(400).json({ error: "code, discountType, and discountValue are required" });
  }
  try {
    const id = `CPN-${code.toUpperCase()}`;
    await query(
      "INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, usage_limit, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, code.toUpperCase(), discountType.toLowerCase(), discountValue, minSpend || 0, usageLimit || 100, expiryDate || null],
    );
    res.status(201).json({ ok: true, id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Coupon code already exists" });
    }
    next(err);
  }
});

/* ═══════════════════════════════════════════════════════════════════ */
/* ADMIN — Coupons UPDATE / DELETE                                     */
/* ═══════════════════════════════════════════════════════════════════ */
app.put("/api/admin/coupons/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  const { code, discountType, discountValue, minSpend, usageLimit, expiryDate, status } = req.body ?? {};
  try {
    const existing = await query("SELECT id FROM coupons WHERE id = ?", [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: "Coupon not found" });
    await query(
      "UPDATE coupons SET code=COALESCE(?,code), discount_type=COALESCE(?,discount_type), discount_value=COALESCE(?,discount_value), min_spend=COALESCE(?,min_spend), usage_limit=COALESCE(?,usage_limit), expiry_date=COALESCE(?,expiry_date), status=COALESCE(?,status) WHERE id=?",
      [code?.toUpperCase(), discountType?.toLowerCase(), discountValue, minSpend, usageLimit, expiryDate, status?.toLowerCase(), req.params.id],
    );
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Coupon code already exists" });
    }
    next(err);
  }
});

app.delete("/api/admin/coupons/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await query("DELETE FROM coupons WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
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
      [partnerId, name, category, partnerSince || "", status?.includes("active") ? "active" : "pending", logoUrl || null, notes || null],
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
      [name, category, partnerSince, status?.includes("active") ? "active" : "pending", logoUrl, notes, req.params.id],
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
  const { id, title, subtitle, ctaText, ctaLink, image, tagBadge, displayOrder, status } = req.body ?? {};
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }
  try {
    const bannerId = id || `BAN-${Date.now().toString(36).toUpperCase()}`;
    await query(
      "INSERT INTO banners (id, title, subtitle, cta_text, cta_link, image, tag_badge, display_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [bannerId, title, subtitle || null, ctaText || null, ctaLink || null, image || null, tagBadge || null, displayOrder || 0, status?.toLowerCase() === "active" ? "active" : "draft"],
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
  const { title, subtitle, ctaText, ctaLink, image, tagBadge, displayOrder, status } = req.body ?? {};
  try {
    const existing = await query("SELECT id FROM banners WHERE id = ?", [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: "Banner not found" });
    await query(
      "UPDATE banners SET title=COALESCE(?,title), subtitle=COALESCE(?,subtitle), cta_text=COALESCE(?,cta_text), cta_link=COALESCE(?,cta_link), image=COALESCE(?,image), tag_badge=COALESCE(?,tag_badge), display_order=COALESCE(?,display_order), status=COALESCE(?,status) WHERE id=?",
      [title, subtitle, ctaText, ctaLink, image, tagBadge, displayOrder, status?.toLowerCase(), req.params.id],
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
/* ADMIN — Stats / Analytics                                           */
/* ═══════════════════════════════════════════════════════════════════ */
app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (_req, res, next) => {
  try {
    const [productCount] = await query("SELECT COUNT(*) AS cnt FROM products");
    const [orderCount] = await query("SELECT COUNT(*) AS cnt FROM orders");
    const [customerCount] = await query("SELECT COUNT(*) AS cnt FROM users WHERE role = 'customer'");
    const [revenueSum] = await query("SELECT COALESCE(SUM(grand_total), 0) AS total FROM orders WHERE status != 'cancelled'");
    const [pendingOrders] = await query("SELECT COUNT(*) AS cnt FROM orders WHERE status = 'pending'");
    const [lowStock] = await query("SELECT COUNT(*) AS cnt FROM products WHERE stock <= 10");
    const categoryRows = await query("SELECT category, COUNT(*) AS cnt FROM products GROUP BY category ORDER BY cnt DESC");
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
      monthlyTrend: monthlyRows.map((r) => ({ month: r.month, revenue: Number(r.revenue), orders: r.orders })),
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/admin/sync-catalog", async (req, res, next) => {
  try {
    await setup();
    const rows = await query("SELECT COUNT(*) as count FROM products");
    res.json({ ok: true, count: rows[0].count });
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
