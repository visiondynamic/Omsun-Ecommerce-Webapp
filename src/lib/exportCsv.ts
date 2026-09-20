/**
 * Universal CSV Export Utility with Excel-compatible UTF-8 BOM encoding.
 */

function downloadCsvFile(filename: string, csvContent: string) {
  // \uFEFF is the UTF-8 Byte Order Mark (BOM) so Microsoft Excel opens Unicode and currency symbols cleanly
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '""';
  const stringVal = String(field).replace(/"/g, '""');
  return `"${stringVal}"`;
}

function buildCsvString(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const headerLine = headers.map(escapeCsvField).join(",");
  const dataLines = rows.map((row) => row.map(escapeCsvField).join(","));
  return [headerLine, ...dataLines].join("\r\n");
}

export function exportOrdersCsv(orders: any[]) {
  const headers = [
    "Order Reference",
    "Date Placed",
    "Customer Name",
    "Phone Number",
    "Email Address",
    "Delivery City",
    "Delivery Address",
    "Order Status",
    "Payment Method",
    "Payment Status",
    "Subtotal (NPR)",
    "Delivery Fee (NPR)",
    "Grand Total (NPR)",
    "Delivery Carrier",
    "Tracking Number",
  ];

  const rows = orders.map((o) => [
    o.orderRef || o.id,
    o.createdAt ? new Date(o.createdAt).toLocaleString("en-US") : "N/A",
    o.customerName,
    o.customerPhone,
    o.customerEmail || "N/A",
    o.shippingCity || "N/A",
    o.shippingAddress,
    o.orderStatus,
    (o.paymentMethod || "Fonepay").toUpperCase(),
    o.paymentStatus,
    o.subtotal || o.totalAmount,
    o.shippingFee || 0,
    o.totalAmount,
    o.deliveryCarrier || "N/A",
    o.trackingNumber || "N/A",
  ]);

  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsvFile(`omsun-orders-${dateStr}.csv`, buildCsvString(headers, rows));
}

export function exportInquiriesCsv(inquiries: any[]) {
  const headers = [
    "Inquiry ID",
    "Date Received",
    "Customer Name",
    "Email Address",
    "Phone Number",
    "Company / Organization",
    "Inquiry Category",
    "Solar System Size",
    "District / Location",
    "Message Details",
  ];

  const rows = inquiries.map((m) => [
    m.id,
    m.createdAt ? new Date(m.createdAt).toLocaleString("en-US") : "N/A",
    m.name,
    m.email,
    m.phone || "N/A",
    m.company || "N/A",
    m.inquiryType || "General",
    m.systemSize || "N/A",
    m.district || "N/A",
    m.message,
  ]);

  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsvFile(`omsun-inquiries-${dateStr}.csv`, buildCsvString(headers, rows));
}

export function exportSubscribersCsv(subscribers: any[]) {
  const headers = ["Subscriber ID", "Email Address", "Subscription Date"];

  const rows = subscribers.map((s) => [
    s.id,
    s.email,
    s.createdAt ? new Date(s.createdAt).toLocaleString("en-US") : "N/A",
  ]);

  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsvFile(`omsun-subscribers-${dateStr}.csv`, buildCsvString(headers, rows));
}

export function exportProductsCsv(products: any[]) {
  const headers = [
    "SKU ID",
    "Product Name",
    "Category",
    "Subcategory",
    "Brand",
    "Price (NPR)",
    "MRP / Compare Price (NPR)",
    "Stock Count",
    "Rating",
  ];

  const rows = products.map((p) => [
    p.id,
    p.name,
    p.category,
    p.subcategory || "N/A",
    p.brand,
    p.price,
    p.mrp || p.compareAt || "N/A",
    p.stock,
    p.rating || 4.8,
  ]);

  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsvFile(`omsun-products-catalog-${dateStr}.csv`, buildCsvString(headers, rows));
}

export function exportCustomersCsv(customers: any[]) {
  const headers = [
    "Client ID",
    "Full Name",
    "Email Address",
    "Phone Number",
    "City / Location",
    "Total Orders Placed",
    "Lifetime Spend (NPR)",
    "Client Status",
    "Registration Date",
  ];

  const rows = customers.map((c) => [
    c.id,
    c.name,
    c.email,
    c.phone || "N/A",
    c.city || "N/A",
    c.totalOrders,
    c.totalSpent,
    c.status,
    c.registeredDate || "N/A",
  ]);

  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsvFile(`omsun-customers-${dateStr}.csv`, buildCsvString(headers, rows));
}

export function exportFinancialSummaryCsv(monthlyData: any[]) {
  const headers = ["Month", "Total Revenue (NPR)", "Orders Count"];

  const rows = monthlyData.map((m) => [m.month, m.revenue, m.orders]);

  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsvFile(`omsun-financial-summary-${dateStr}.csv`, buildCsvString(headers, rows));
}
