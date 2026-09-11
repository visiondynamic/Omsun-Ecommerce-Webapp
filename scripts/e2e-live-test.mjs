// Comprehensive End-to-End Live Production Verification Script
// Tests: Catalog -> Order Placement -> Customer Tracking -> Slip Upload -> Admin Review -> Approval -> Delivery Update

const BASE_URL = "https://omsun-api-production.up.railway.app";

async function runE2ETest() {
  console.log("===============================================================");
  console.log("       OMSUN LIVE PRODUCTION FULL E2E SYSTEM AUDIT             ");
  console.log("===============================================================\n");

  const results = [];

  function record(testName, passed, detail) {
    results.push({ testName, passed, detail });
    const mark = passed ? "✓ PASS" : "✗ FAIL";
    console.log(`[${mark}] ${testName}: ${detail}`);
  }

  try {
    // STEP 1: Fetch Catalog Products
    console.log("1. Fetching active products from catalog...");
    const prodRes = await fetch(`${BASE_URL}/api/products`);
    if (!prodRes.ok) throw new Error(`Failed to fetch products: HTTP ${prodRes.status}`);
    const products = await prodRes.json();
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("No products returned by catalog");
    }
    const targetProduct = products[0];
    record("Product Catalog", true, `Loaded ${products.length} products. Selected: ${targetProduct.name} (NPR ${targetProduct.price})`);

    // STEP 2: Place an Order via Customer API
    console.log("\n2. Placing an order via POST /api/orders...");
    const orderPayload = {
      items: [
        {
          productId: targetProduct.id,
          quantity: 1
        }
      ],
      shipping: {
        name: "Test Customer Verification",
        phone: "+977-9812345678",
        email: "test-customer@omsunnepal.com",
        address: "Thamel Marg, Ward 26",
        city: "Kathmandu",
        notes: "Automated verification test order"
      },
      paymentMethod: "fonepay"
    };

    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    });

    if (!orderRes.ok) {
      const errBody = await orderRes.text();
      throw new Error(`Order placement failed: HTTP ${orderRes.status} - ${errBody}`);
    }

    const orderData = await orderRes.json();
    const orderRef = orderData.orderRef;
    if (!orderRef || !orderRef.startsWith("OMS-2026-")) {
      throw new Error(`Invalid order reference generated: ${orderRef}`);
    }
    record("Order Placement", true, `Generated sequential reference: #${orderRef} (Total: NPR ${orderData.grandTotal})`);

    // STEP 3: Fetch Order via Customer Tracking Endpoint
    console.log(`\n3. Fetching order via GET /api/orders/${orderRef}...`);
    const trackRes = await fetch(`${BASE_URL}/api/orders/${orderRef}`);
    if (!trackRes.ok) throw new Error(`Tracking endpoint failed: HTTP ${trackRes.status}`);
    const trackData = await trackRes.json();
    const pStatus = trackData.paymentStatus || trackData.payment_status;
    const oRef = trackData.orderRef || trackData.order_ref;
    if (oRef !== orderRef || pStatus !== "UNPAID") {
      throw new Error(`Tracking returned unexpected initial state: ${pStatus}`);
    }
    record("Order Tracking (Initial)", true, `Status: ${trackData.status || trackData.orderStatus}, Payment Status: ${pStatus}`);

    // STEP 4: Submit Payment Proof Screenshot
    console.log(`\n4. Submitting payment proof via POST /api/orders/${orderRef}/receipt...`);
    const testPngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const testTxnRef = `TXN-FP-${Date.now().toString().slice(-6)}`;

    const receiptRes = await fetch(`${BASE_URL}/api/orders/${orderRef}/receipt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiptBase64: testPngBase64,
        transactionRef: testTxnRef
      })
    });

    if (!receiptRes.ok) {
      const err = await receiptRes.text();
      throw new Error(`Receipt submission failed: HTTP ${receiptRes.status} - ${err}`);
    }

    const receiptData = await receiptRes.json();
    record("Payment Slip Submission", true, `Uploaded receipt: ${receiptData.receiptUrl}, Txn Ref: ${testTxnRef}`);

    // Re-verify tracking endpoint reflects PAYMENT_SUBMITTED
    const trackRes2 = await fetch(`${BASE_URL}/api/orders/${orderRef}`);
    const trackData2 = await trackRes2.json();
    const pStatus2 = trackData2.paymentStatus || trackData2.payment_status;
    if (pStatus2 !== "PAYMENT_SUBMITTED") {
      throw new Error(`Expected PAYMENT_SUBMITTED, got ${pStatus2}`);
    }
    record("Customer Tracking Status Transition", true, `Updated Payment Status: ${pStatus2}`);

    // STEP 5: Admin Login
    console.log("\n5. Authenticating Admin via POST /api/auth/login...");
    let adminToken = null;
    const adminEmails = ["admin@omsunnepal.com", "admin@omsun.com.np"];
    
    for (const email of adminEmails) {
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "admin123" })
      });
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        adminToken = loginData.token;
        record("Admin Authentication", true, `Logged in as ${email} (Role: ${loginData.user.role})`);
        break;
      }
    }

    if (!adminToken) {
      throw new Error("Admin login failed with default credentials");
    }

    // STEP 6: Admin Orders List Verification
    console.log("\n6. Fetching Admin Orders List via GET /api/admin/orders...");
    const adminOrdersRes = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!adminOrdersRes.ok) throw new Error(`Admin orders list failed: HTTP ${adminOrdersRes.status}`);
    const adminOrders = await adminOrdersRes.json();
    const foundOrder = adminOrders.find((o) => (o.orderRef === orderRef || o.order_ref === orderRef || o.id === orderRef));
    if (!foundOrder) throw new Error(`Order ${orderRef} not found in admin list`);
    const adminPStatus = foundOrder.paymentStatus || foundOrder.payment_status;
    record("Admin Order Dashboard List", true, `Found order #${orderRef} with payment status: ${adminPStatus}`);

    // STEP 7: Admin Verify Payment (Approval)
    console.log(`\n7. Approving payment proof via PUT /api/admin/orders/${orderRef}/verify-payment...`);
    const verifyRes = await fetch(`${BASE_URL}/api/admin/orders/${orderRef}/verify-payment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        approve: true,
        notes: "Verified by automated live system check"
      })
    });

    if (!verifyRes.ok) {
      const err = await verifyRes.text();
      throw new Error(`Admin payment verification failed: HTTP ${verifyRes.status} - ${err}`);
    }
    const verifyData = await verifyRes.json();
    record("Admin Payment Verification", true, `Payment verified. Status: ${verifyData.status}`);

    // STEP 8: Admin Assign Delivery Logistics
    console.log(`\n8. Updating delivery telemetry via PUT /api/admin/orders/${orderRef}/delivery...`);
    const deliveryPayload = {
      carrier: "Nepal Express Logistics",
      person: "Bikram Shrestha",
      phone: "+977-9851000000",
      trackingNumber: "NEX-KTM-2026-8812",
      notes: "Fragile solar inverter components handling",
      status: "OUT_FOR_DELIVERY",
      estimatedDelivery: "2026-09-12"
    };

    const deliveryRes = await fetch(`${BASE_URL}/api/admin/orders/${orderRef}/delivery`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(deliveryPayload)
    });

    if (!deliveryRes.ok) {
      const err = await deliveryRes.text();
      throw new Error(`Admin delivery update failed: HTTP ${deliveryRes.status} - ${err}`);
    }
    const deliveryData = await deliveryRes.json();
    record("Admin Delivery Assignment", true, `Assigned carrier: ${deliveryPayload.carrier}, Tracking: ${deliveryPayload.trackingNumber}`);

    // STEP 9: Final Customer Tracking Verification
    console.log(`\n9. Final customer tracking validation via GET /api/orders/${orderRef}...`);
    const finalTrackRes = await fetch(`${BASE_URL}/api/orders/${orderRef}`);
    const finalData = await finalTrackRes.json();

    const finalPStatus = finalData.paymentStatus || finalData.payment_status;
    const finalDCarrier = finalData.deliveryCarrier || finalData.delivery_carrier;
    const finalDStatus = finalData.deliveryStatus || finalData.delivery_status;
    const finalDPerson = finalData.deliveryPerson || finalData.delivery_person;
    const finalDPhone = finalData.deliveryPhone || finalData.delivery_phone;
    const finalVerifiedAt = finalData.paymentVerifiedAt || finalData.payment_verified_at;

    const checkApproval = finalPStatus === "PAYMENT_VERIFIED";
    const checkDelivery = finalDCarrier === "Nepal Express Logistics" && finalDStatus === "OUT_FOR_DELIVERY";

    if (!checkApproval || !checkDelivery) {
      throw new Error(`Final tracking validation mismatch: paymentStatus=${finalPStatus}, deliveryStatus=${finalDStatus}`);
    }

    record("Full Customer Lifecycle", true, `Order verified at: ${finalVerifiedAt}, Carrier: ${finalDCarrier}, Driver: ${finalDPerson} (${finalDPhone})`);

    console.log("\n===============================================================");
    console.log("        ALL 9 SYSTEM MODULES PASSED 100% SUCCESSFULLY          ");
    console.log("===============================================================");

    return orderRef;
  } catch (err) {
    record("E2E Test Exception", false, err.message);
    console.error("\n[CRITICAL ERROR DURING E2E RUN]:", err);
    process.exit(1);
  }
}

runE2ETest();
