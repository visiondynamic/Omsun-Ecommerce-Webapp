import fs from 'fs';

async function searchAllChunks() {
  const html = fs.readFileSync('scripts/luminous.html', 'utf-8');
  const scripts = [...html.matchAll(/src=["']([^"']+\.js[^"']*)["']/gi)].map(m => m[1]);

  for (const src of scripts) {
    const fullUrl = src.startsWith('http') ? src : `https://www.luminousindia.com${src.startsWith('/') ? '' : '/'}${src}`;
    try {
      const res = await fetch(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const js = await res.text();
      // Search for SVG or logo in JS
      if (js.includes('logo') || js.includes('Logo') || js.includes('LUMINOUS')) {
        const matches = [...js.matchAll(/https?:\/\/[^"'\s]+\.(?:png|svg|webp|jpg)/gi)].map(m => m[0]);
        if (matches.length > 0) {
          console.log(`\nUrls in ${src.slice(-25)}:`, Array.from(new Set(matches)));
        }
      }
    } catch (e) {}
  }
}

searchAllChunks().catch(console.error);
