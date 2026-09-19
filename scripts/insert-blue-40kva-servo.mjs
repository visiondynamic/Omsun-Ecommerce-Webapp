import { pool } from "../server-api/src/db.js";

const newProduct = {
  id: "omsun-oil-cooled-40kva-260v",
  name: "OMSUN 40 kVA Three-Phase Oil-Cooled Servo Voltage Stabilizer (260V–480V)",
  category: "Stabilizer",
  subcategory: "Oil Cooled Servo Stabilizer",
  brand: "OMSUN",
  tagline: "40 kVA three-phase oil-cooled servo stabilizer (Input 260V–480V AC, 100 AMP)",
  description:
    "The OMSUN 40 kVA Three-Phase Oil-Cooled Servo Voltage Stabilizer is designed to automatically regulate fluctuating electrical voltage and provide a stable output supply for industrial and commercial electrical systems. With an input voltage range of 260V–480V AC and regulated output of 380V AC ±1%, the stabilizer automatically responds to voltage fluctuations to support reliable operation of connected equipment. Its 40 kVA, three-phase, 100 AMP, oil-cooled configuration is suitable for demanding electrical environments.",
  price: 395000.0,
  mrp: 445000.0,
  image: "/uploads/omsun-40kva-oil-cooled-servo-blue.jpeg",
  images: JSON.stringify(["/uploads/omsun-40kva-oil-cooled-servo-blue.jpeg"]),
  features: JSON.stringify([
    "40 kVA 3-Phase",
    "260V - 480V Wide Input",
    "100 AMP Rated Current",
    "Oil Cooled Heat Dissipation",
    "Digital Voltage Monitoring Panel",
    "1 Year Full Warranty",
  ]),
  specs: JSON.stringify([
    { label: "Brand", value: "OMSUN" },
    { label: "Product Type", value: "Servo Voltage Stabilizer" },
    { label: "Capacity / Rating", value: "40 kVA" },
    { label: "Phase", value: "3 Phase" },
    { label: "Input Voltage", value: "260V – 480V AC" },
    { label: "Output Voltage", value: "380V AC ±1%" },
    { label: "Lead / Current", value: "100 AMP" },
    { label: "Cooling Type", value: "Oil Cooled" },
    { label: "Technology", value: "Servo-controlled automatic voltage regulation" },
    {
      label: "Applications",
      value: "Factory, CNC Machines, Printing, Medical & Commercial Loads",
    },
    { label: "Warranty", value: "1 Year Full Warranty" },
  ]),
  stock: 5,
  rating: 5.0,
  badges: JSON.stringify([
    "40 kVA Oil Cooled",
    "260V–480V AC",
    "100 AMP",
    "1 Year Warranty",
  ]),
};

async function main() {
  try {
    console.log("Inserting/Updating product into MySQL database...");
    const [result] = await pool.query(
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
        newProduct.id,
        newProduct.name,
        newProduct.category,
        newProduct.subcategory,
        newProduct.brand,
        newProduct.tagline,
        newProduct.description,
        newProduct.price,
        newProduct.mrp,
        newProduct.image,
        newProduct.images,
        newProduct.features,
        newProduct.specs,
        newProduct.stock,
        newProduct.rating,
        newProduct.badges,
      ]
    );

    console.log("DB Result:", result);

    const [rows] = await pool.query("SELECT id, name, price, image, stock FROM products WHERE id = ?", [newProduct.id]);
    console.log("Verified product in DB:", rows);
    process.exit(0);
  } catch (err) {
    console.error("Error inserting product:", err);
    process.exit(1);
  }
}

main();
