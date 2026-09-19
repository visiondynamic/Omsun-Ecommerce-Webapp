import mysql from "../server-api/node_modules/mysql2/promise.js";

async function verify() {
  const url = process.env.MYSQL_URL;
  console.log("Connecting to Railway MySQL DB at:", url ? url.replace(/:[^:@]+@/, ":***@") : "No MYSQL_URL");

  const conn = await mysql.createConnection(url);

  console.log("\n=== 1. TABLES IN RAILWAY DATABASE ===");
  const [tables] = await conn.query("SHOW TABLES");
  console.log(tables);

  console.log("\n=== 2. PRODUCTS COUNT & SUMMARY ===");
  const [productCount] = await conn.query("SELECT COUNT(*) as total FROM products");
  console.log("Total Products in Railway DB:", productCount[0].total);

  console.log("\n=== 3. CHECK NEW 40 kVA OIL-COOLED PRODUCTS ===");
  const [fourtyKva] = await conn.query(
    "SELECT id, name, brand, price, stock, image, badges FROM products WHERE id IN ('omsun-oil-cooled-40kva-260v', 'omsun-oil-cooled-40kva')"
  );
  console.log(fourtyKva);

  console.log("\n=== 4. CHECK GREENN VOLT PRODUCTS ===");
  const [greennVolt] = await conn.query(
    "SELECT id, name, brand, price, stock FROM products WHERE brand = 'Greenn Volt'"
  );
  console.log(`Found ${greennVolt.length} Greenn Volt products:`, greennVolt.map(p => ({ id: p.id, name: p.name })));

  console.log("\n=== 5. CHECK USERS (ADMIN & CUSTOMERS) ===");
  const [users] = await conn.query("SELECT id, email, role, full_name, created_at FROM users");
  console.log(users);

  console.log("\n=== 6. CHECK COUPONS ===");
  const [coupons] = await conn.query("SELECT * FROM coupons");
  console.log(coupons);

  await conn.end();
  console.log("\n✓ All Railway Database checks completed successfully!");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
