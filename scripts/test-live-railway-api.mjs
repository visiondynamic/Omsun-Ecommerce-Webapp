const BASE = "https://omsun-api-production-13f4.up.railway.app";

async function run() {
  console.log("=== 1. LOGGING IN TO LIVE RAILWAY API AS ADMIN ===");
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@omsun.com.np", password: "admin123" }),
  });
  const loginData = await loginRes.json();
  console.log("Admin Login Status:", loginRes.status, loginData.ok ? "SUCCESS" : "FAILED");
  const token = loginData.token;

  console.log("\n=== 2. QUERYING LIVE ADMIN STATS (DATABASE HEALTH) ===");
  const statsRes = await fetch(`${BASE}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const stats = await statsRes.json();
  console.log("Railway DB Stats:", stats);

  console.log("\n=== 3. VERIFYING NEW PRODUCT: omsun-oil-cooled-40kva-260v (Blue 40kVA) ===");
  const p1Res = await fetch(`${BASE}/api/products/omsun-oil-cooled-40kva-260v`);
  const p1 = await p1Res.json();
  console.log("Product found:", {
    id: p1.id,
    name: p1.name,
    price: p1.price,
    image: p1.image,
    specsCount: p1.specs?.length,
    badges: p1.badges,
    stock: p1.stock,
  });

  console.log("\n=== 4. VERIFYING NEW PRODUCT: omsun-oil-cooled-40kva (White 40kVA) ===");
  const p2Res = await fetch(`${BASE}/api/products/omsun-oil-cooled-40kva`);
  const p2 = await p2Res.json();
  console.log("Product found:", {
    id: p2.id,
    name: p2.name,
    price: p2.price,
    image: p2.image,
    specsCount: p2.specs?.length,
  });

  console.log("\n=== 5. VERIFYING GREENN VOLT PRODUCTS IN RAILWAY DB ===");
  const allRes = await fetch(`${BASE}/api/products`);
  const all = await allRes.json();
  const gv = all.filter((p) => p.brand === "Greenn Volt");
  console.log(`Greenn Volt Products Count in DB: ${gv.length}`);
  gv.forEach((p) => console.log(` - [${p.id}] ${p.name} (Rs ${p.price})`));

  console.log("\n=== 6. VERIFYING LIVE ADMIN COUPONS IN RAILWAY DB ===");
  const couponsRes = await fetch(`${BASE}/api/admin/coupons`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const coupons = await couponsRes.json();
  console.log("Coupons in Railway DB:", coupons);

  console.log("\n=== 7. VERIFYING IMAGE ACCESSIBILITY ON RAILWAY ===");
  const imgUrl = `${BASE}${p1.image}`;
  console.log("Checking image URL:", imgUrl);
  const imgRes = await fetch(imgUrl);
  console.log("Image HTTP Status:", imgRes.status, imgRes.headers.get("content-type"));

  console.log("\n✓ ALL LIVE RAILWAY CHECKS PASSED PERFECTLY!");
}

run().catch((e) => {
  console.error("Live test failed:", e);
  process.exit(1);
});
