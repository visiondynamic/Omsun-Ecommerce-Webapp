import fs from 'fs';
import path from 'path';

async function fetchBrandAssets() {
  // 1. SMARTEN
  console.log('Fetching Smarten logo...');
  try {
    const smartenRes = await fetch('https://www.smartenpowersystems.com/wp-content/uploads/2021/12/smarten-logo.svg', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (smartenRes.ok) {
      const svgText = await smartenRes.text();
      fs.writeFileSync('src/assets/brands/smarten.svg', svgText, 'utf-8');
      console.log('✓ Successfully downloaded official Smarten SVG logo!');
    } else {
      console.log('Smarten SVG status:', smartenRes.status);
    }
  } catch (e) {
    console.error('Smarten error:', e.message);
  }

  // 2. LUMINOUS
  console.log('\nFetching Luminous logo...');
  try {
    const lumHtmlRes = await fetch('https://www.luminousindia.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const lumHtml = await lumHtmlRes.text();
    // Search for logo
    const lumMatch = lumHtml.match(/src=["']([^"']*luminous[^"']*\.(?:png|svg|webp|jpg))["']/i) ||
                     lumHtml.match(/src=["']([^"']*(?:logo|brand)[^"']*\.(?:png|svg|webp|jpg))["']/i);
    console.log('Luminous match:', lumMatch ? lumMatch[1] : 'none');

    // Also check standard Luminous logo asset paths
    const lumUrls = [
      'https://www.luminousindia.com/static/edge/public/styles/webp_image/azblob/2026-01/7eb59a25-e033-49fb-81fa-0e95207441ba.png.webp?itok=CiMVzBvw',
      'https://www.luminousindia.com/sites/default/files/logo.svg',
      'https://www.luminousindia.com/static/frontend/Luminous/default/en_US/images/logo.svg'
    ];
    for (const url of lumUrls) {
      try {
        const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        console.log(`Luminous test: ${url} -> ${r.status}, content-type: ${r.headers.get('content-type')}`);
        if (r.ok) {
          const buf = Buffer.from(await r.arrayBuffer());
          const ext = url.includes('.svg') ? 'svg' : url.includes('.webp') ? 'webp' : 'png';
          fs.writeFileSync(`src/assets/brands/luminous.${ext}`, buf);
          console.log(`✓ Saved luminous.${ext}`);
          break;
        }
      } catch (err) {
        console.log('Luminous attempt error:', err.message);
      }
    }
  } catch (e) {
    console.error('Luminous error:', e.message);
  }

  // 3. DYNAPOWER / DYNA PLUS
  console.log('\nFetching Dyna Plus / Dyna Power logo...');
  try {
    const dynaHtmlRes = await fetch('https://dynapowerworld.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const dynaHtml = await dynaHtmlRes.text();
    const dynaImgs = [...dynaHtml.matchAll(/src=["'](https:\/\/dynapowerworld\.com\/wp-content\/uploads\/[^"']+)["']/gi)].map(m => m[1]);
    console.log('Dyna images:', dynaImgs.slice(0, 8));

    for (const url of dynaImgs.slice(0, 5)) {
      if (/logo|sem-nome|untitled/i.test(url)) {
        console.log('Downloading Dyna logo candidate:', url);
        const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (r.ok) {
          const buf = Buffer.from(await r.arrayBuffer());
          const ext = path.extname(url.split('?')[0]) || '.png';
          fs.writeFileSync(`src/assets/brands/dyna-plus${ext}`, buf);
          console.log(`✓ Saved dyna-plus${ext}`);
          break;
        }
      }
    }
  } catch (e) {
    console.error('Dyna error:', e.message);
  }

  // 4. GREENVOLT POWER INDIA
  console.log('\nFetching GreenVolt Power India logo...');
  try {
    const gvHtmlRes = await fetch('https://greenvoltpowerindia.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const gvHtml = await gvHtmlRes.text();
    const gvImgs = [...gvHtml.matchAll(/src=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('GreenVolt images:', gvImgs.slice(0, 10));

    for (const url of gvImgs) {
      if (/logo|brand|greenvolt/i.test(url)) {
        const fullUrl = url.startsWith('http') ? url : `https://greenvoltpowerindia.com/${url.replace(/^\//, '')}`;
        console.log('Downloading GreenVolt candidate:', fullUrl);
        const r = await fetch(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (r.ok) {
          const buf = Buffer.from(await r.arrayBuffer());
          const ext = path.extname(url.split('?')[0]) || '.png';
          fs.writeFileSync(`src/assets/brands/greenvolt${ext}`, buf);
          console.log(`✓ Saved greenvolt${ext}`);
          break;
        }
      }
    }
  } catch (e) {
    console.error('GreenVolt error:', e.message);
  }
}

fetchBrandAssets().catch(console.error);
