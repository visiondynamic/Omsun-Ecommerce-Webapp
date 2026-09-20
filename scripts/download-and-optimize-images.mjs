import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = path.resolve('public/images/products/smarten');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Map of canonical image filenames to official Smarten image URLs
const imageTargets = [
  // Home UPS
  { name: 'bravo-900.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/bravo-900.png' },
  { name: 'bravo-1100.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/bravo-900.png' },
  { name: 'bravo-1700.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Bravo-1700-New-1.jpg' },
  { name: 'bravo-2500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/BRAVO-2.5KVA.jpg' },
  { name: 'bravo-3500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Bravo-3500KVA-New-1.jpg' },
  { name: 'bravo-5k-6k.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2022/03/BRAVO-SERIES-5K-6K.png' },
  { name: 'bravo-7k5-10k.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2022/03/BRAVO-7.5-10K.png' },
  { name: 'nova-700.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Nova-700-VA.jpg' },
  { name: 'nova-900.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Nova-900-VA.jpg' },
  { name: 'nova-1100.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Nova-1100-VA.jpg' },
  { name: 'everon-1500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2026/09/smarten-everon-1500-home-ups.png' },
  { name: 'everon-2500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2026/09/smarten-everon-2500-home-ups.png' },

  // Solar PCU - Saver Series
  { name: 'saver-700.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Saver-700VA-700x380-1.jpg' },
  { name: 'saver-900.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Saver-900va-700x266-1.jpg' },
  { name: 'saver-1100.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Saver-1100VA-700x293-1.jpg' },
  { name: 'saver-2000.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Saver-2000VA-700x753-1.jpg' },
  { name: 'saver-2500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Saver-2500VA-700x753-1.jpg' },
  { name: 'saver-3500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Saver-3500VA-700x738-1.jpg' },
  { name: 'saver-5k5.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Saver-5-10-KVA-700x886-1.jpg' },
  { name: 'saver-10k.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Saver-10KVA-1.jpg' },

  // Solar PCU - Shine Series
  { name: 'shine-700.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/IMG_8850-700x376-1.jpg' },
  { name: 'shine-1100.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/IMG_8865-700x379-1.jpg' },
  { name: 'shine-2500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/IMG_8875-2-700x629-1.jpg' },
  { name: 'shine-3500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/IMG_8876-1-700x638-1.jpg' },
  { name: 'shine-10k.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/IMG_8915-700x859-1.jpg' },

  // Solar PCU - Boom Series
  { name: 'boom-700.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Boom-Series-700VA-1-700x377-1.jpg' },
  { name: 'boom-900.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Boom-Series-900-700x269-1.jpg' },
  { name: 'boom-1100.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Boom-Series-1100VA-1-700x268-1.jpg' },
  { name: 'boom-1500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Boom-Series-1100VA-2-700x420-1.jpg' },
  { name: 'boom-2000.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/img-1.jpg' },

  // Solar PCU - MPPT Superb Series & Ultra
  { name: 'superb-1100.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/1100-L-700x809-1.jpg' },
  { name: 'superb-2250.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/1100-R-700x620-1.jpg' },
  { name: 'superb-3200.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Superb.jpg' },
  { name: 'superb-5k5.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/5-kva-4-700x830-1.jpg' },
  { name: 'superb-10k.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Superb-1.jpg' },

  // Solar Charge Controllers
  { name: 'savior-12-24.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Savior-12V-24V-700x579-copy.png' },
  { name: 'savior-48.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/WhatsApp-Image-2021-11-30-at-5.47.54-PM-700x669-copy-1.jpg' },
  { name: 'savior-120.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Savior-120v-700x698-copy.png' },
  { name: 'prime-plus-50a.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Prime-one.png' },
  { name: 'prime-plus-120.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Prime-two.png' },
  { name: 'tejas-dc-25a.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Tejas-700x593-1.jpg' },
  { name: 'kranti-pv-changer.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/kranti-pv-changer-700x399-1.jpg' },

  // Tubular Batteries (NO SMF)
  { name: 'bravo-battery-2400.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Bravo-2400-New-1.jpg' },
  { name: 'saver-battery-220.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Saver220-A.jpg' },
  { name: 'boom-battery-1500.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2025/07/Boom-1500-150Ah.jpg' },
  { name: 'boom-battery-2000.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2025/07/Boom-2000-200Ah.jpg' },

  // Solar Panels
  { name: 'mono-bifacial-panel.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Solar-Panel-Mono-Closeup-2.jpg' },
  { name: 'mono-halfcut-panel.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Solar-Panel-Front-Closeup-2.jpg' },
  { name: 'poly-solar-panel.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/poly-solar-panel.jpg' },
  { name: 'poly-solar-panel-detail.webp', url: 'https://www.smartenpowersystems.com/wp-content/uploads/2021/12/Solar-Panel-Closeup-2.jpg' }
];

async function downloadAndOptimize() {
  console.log(`Downloading and optimizing ${imageTargets.length} authentic Smarten product images...`);

  let count = 0;
  for (const item of imageTargets) {
    const targetPath = path.join(outputDir, item.name);
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res.ok) {
        console.warn(`Failed downloading ${item.url}: status ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());

      // Optimize with sharp
      await sharp(buffer)
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(targetPath);

      count++;
      const size = fs.statSync(targetPath).size;
      console.log(`[${count}/${imageTargets.length}] Saved: ${item.name} (${(size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`Error processing ${item.name}:`, e.message);
    }
  }

  console.log(`\n✓ Successfully downloaded and optimized ${count} product images into ${outputDir}`);
}

downloadAndOptimize().catch(console.error);
