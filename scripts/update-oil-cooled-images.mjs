import fs from "fs";
import path from "path";
import { pool } from "../server-api/src/db.js";

const TARGET_IMAGE = "/uploads/omsun-40kva-oil-cooled-servo.jpg";
const BLUE_IMAGE = "/uploads/omsun-40kva-oil-cooled-servo-blue.jpeg";

const oilProductIds = [
  "omsun-oil-cooled-30kva",
  "omsun-oil-cooled-40kva",
  "omsun-oil-cooled-40kva-260v",
  "omsun-oil-cooled-50kva",
  "omsun-oil-cooled-60kva",
  "omsun-oil-cooled-100kva",
  "omsun-oil-cooled-150kva",
];

async function updateCatalogJson() {
  console.log("=== 1. Updating server-api/src/catalog-data.json ===");
  const catalogPath = path.resolve("server-api/src/catalog-data.json");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));

  let updatedCount = 0;
  for (const product of catalog) {
    if (oilProductIds.includes(product.id)) {
      product.image = TARGET_IMAGE;
      if (product.id === "omsun-oil-cooled-40kva-260v") {
        product.images = JSON.stringify([TARGET_IMAGE, BLUE_IMAGE]);
      } else {
        product.images = JSON.stringify([TARGET_IMAGE]);
      }
      updatedCount++;
      console.log(`Updated catalog entry: ${product.id} -> ${product.image}`);
    }
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf-8");
  console.log(`✓ Catalog file successfully updated (${updatedCount} products)!`);
}

async function updateLocalDb() {
  console.log("\n=== 2. Updating Local MySQL Database ===");
  try {
    for (const id of oilProductIds) {
      const gallery =
        id === "omsun-oil-cooled-40kva-260v"
          ? JSON.stringify([TARGET_IMAGE, BLUE_IMAGE])
          : JSON.stringify([TARGET_IMAGE]);

      const [res] = await pool.query(
        "UPDATE products SET image = ?, images = ? WHERE id = ?",
        [TARGET_IMAGE, gallery, id]
      );
      console.log(`DB Update [${id}]: affectedRows = ${res.affectedRows}`);
    }

    const [rows] = await pool.query(
      `SELECT id, name, image, images FROM products WHERE id IN (${oilProductIds.map(() => "?").join(",")})`,
      oilProductIds
    );
    console.log("Verified local DB rows:");
    for (const r of rows) {
      console.log(` - [${r.id}] ${r.name} -> image: ${r.image}`);
    }
  } catch (err) {
    console.error("Local DB update error:", err.message);
  } finally {
    await pool.end();
  }
}

async function updateRailwayLive() {
  console.log("\n=== 3. Updating Live Railway Production API ===");
  const BASE = "https://omsun-api-production-13f4.up.railway.app";
  try {
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@omsun.com.np", password: "admin123" }),
    });
    const loginData = await loginRes.json();
    if (!loginData.ok || !loginData.token) {
      console.log("Could not login to Railway API (check credentials):", loginData);
      return;
    }
    const token = loginData.token;
    console.log("✓ Logged into Railway admin API successfully!");

    for (const id of oilProductIds) {
      const gallery =
        id === "omsun-oil-cooled-40kva-260v"
          ? [TARGET_IMAGE, BLUE_IMAGE]
          : [TARGET_IMAGE];

      const putRes = await fetch(`${BASE}/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: TARGET_IMAGE,
          images: gallery,
        }),
      });
      const putData = await putRes.json();
      console.log(`Railway update [${id}]: status ${putRes.status}`, putData.id ? "SUCCESS" : putData);
    }

    console.log("✓ Railway live database updated successfully!");
  } catch (err) {
    console.log("Railway API sync note:", err.message);
  }
}

async function main() {
  await updateCatalogJson();
  await updateLocalDb();
  await updateRailwayLive();
}

main().catch(console.error);
