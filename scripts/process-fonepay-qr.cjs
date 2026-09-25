const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcPath = 'C:\\Users\\acer\\.gemini\\antigravity-ide\\brain\\2271af2a-75c1-4bf6-97c5-3c5a2e8715d5\\.user_uploaded\\media_1790315907368.jpg';
const destDirPublic = path.resolve(__dirname, '../public/images/payments');
const destDirSrc = path.resolve(__dirname, '../src/assets/images/payments');

fs.mkdirSync(destDirPublic, { recursive: true });
fs.mkdirSync(destDirSrc, { recursive: true });

async function run() {
  const meta = await sharp(srcPath).metadata();
  console.log('Original dimensions:', meta.width, 'x', meta.height);

  // 1. Copy/optimize full standee
  const fullDestPublic = path.join(destDirPublic, 'omsun-fonepay-qr-standee.jpg');
  const fullDestSrc = path.join(destDirSrc, 'omsun-fonepay-qr-standee.jpg');
  await sharp(srcPath).jpeg({ quality: 95 }).toFile(fullDestPublic);
  fs.copyFileSync(fullDestPublic, fullDestSrc);
  console.log('Saved standee to:', fullDestPublic);

  // 2. Crop just the QR code square
  // In the image, width is meta.width, let's find the QR code box
  // Let's estimate from visual:
  // Total width: W, height: H
  // The QR code is roughly horizontally centered from ~0.24W to 0.76W (or similar)
  // Let's calculate exact bounds
  console.log('Done full copy!');
}

run().catch(console.error);
