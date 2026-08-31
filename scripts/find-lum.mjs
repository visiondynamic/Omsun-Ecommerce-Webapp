import fs from 'fs';

async function findLuminousLogo() {
  const html = fs.readFileSync('scripts/luminous.html', 'utf-8');
  // Find all .js script tags
  const scripts = [...html.matchAll(/src=["']([^"']+\.js[^"']*)["']/gi)].map(m => m[1]);
  console.log('Found scripts:', scripts.slice(0, 10));

  for (const src of scripts.slice(0, 10)) {
    const fullUrl = src.startsWith('http') ? src : `https://www.luminousindia.com${src.startsWith('/') ? '' : '/'}${src}`;
    try {
      const res = await fetch(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const js = await res.text();
      const logoMatches = js.match(/["'][^"']*(?:logo|luminous)[^"']*\.(?:svg|png|webp|jpg)["']/gi);
      if (logoMatches) {
        console.log(`Matches in ${src.slice(-30)}:`, logoMatches.slice(0, 8));
      }
    } catch (e) {
      console.log('Error fetching script:', e.message);
    }
  }
}

findLuminousLogo().catch(console.error);
