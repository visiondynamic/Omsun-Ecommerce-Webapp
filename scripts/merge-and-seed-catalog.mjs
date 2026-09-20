import fs from 'fs';
import path from 'path';

const catalogPath = path.resolve('server-api/src/catalog-data.json');
const existing = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Filter out any SMF products if ever present in existing catalog
const cleanedExisting = existing.filter(p => {
  const cat = (p.category || '').toLowerCase();
  const sub = (p.subcategory || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  return !cat.includes('smf') && !sub.includes('smf') && !name.includes('smf battery');
});

// Load compiled Smarten products
const smartenPath = path.resolve('scripts/smarten-products.json');
const smartenProducts = JSON.parse(fs.readFileSync(smartenPath, 'utf8'));

// Format Smarten products to match catalog-data.json structure
const formattedSmarten = smartenProducts.map(p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  subcategory: p.subcategory,
  series: p.series,
  model: p.model,
  capacity: p.capacity,
  brand: p.brand,
  tagline: p.tagline,
  description: p.description,
  price: p.price,
  mrp: p.compareAt || null,
  image: p.image,
  images: JSON.stringify(p.images || [p.image]),
  features: JSON.stringify(p.features || []),
  specs: JSON.stringify(p.specs || []),
  specifications: JSON.stringify(p.specifications || {}),
  applications: JSON.stringify(p.applications || []),
  warranty: p.warranty,
  brochure_url: p.brochureUrl || null,
  source_url: p.sourceUrl || null,
  stock: p.stock || 20,
  rating: p.rating || 4.9,
  badges: JSON.stringify(p.badges || [])
}));

// Combine existing non-Smarten products and new Smarten products
const nonSmartenExisting = cleanedExisting.filter(p => p.brand !== 'Smarten');
const finalCatalog = [...nonSmartenExisting, ...formattedSmarten];

console.log(`Original catalog count: ${existing.length}`);
console.log(`Cleaned non-Smarten existing: ${nonSmartenExisting.length}`);
console.log(`New authentic Smarten products: ${formattedSmarten.length}`);
console.log(`Final combined catalog count: ${finalCatalog.length}`);

// Write back to server-api/src/catalog-data.json
fs.writeFileSync(catalogPath, JSON.stringify(finalCatalog, null, 2), 'utf8');
console.log('✓ Successfully wrote updated catalog-data.json!');
