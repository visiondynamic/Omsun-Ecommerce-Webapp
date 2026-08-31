import fs from 'fs';

async function inspectSites() {
  const sites = [
    { name: 'luminous', url: 'https://www.luminousindia.com/' },
    { name: 'dynapower', url: 'https://dynapowerworld.com/' },
    { name: 'greenvolt', url: 'https://greenvoltpowerindia.com/' }
  ];

  for (const s of sites) {
    console.log(`\n=== Inspecting ${s.name} ===`);
    try {
      const res = await fetch(s.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await res.text();

      // Find all image sources in first 50000 chars (header / navbar)
      const topSection = html.slice(0, 80000);
      const imgRegex = /src=["']([^"']+)["']/gi;
      let m;
      const urls = new Set();
      while ((m = imgRegex.exec(topSection)) !== null) {
        if (/\.(png|svg|jpg|webp|jpeg)/i.test(m[1])) {
          urls.add(m[1]);
        }
      }
      console.log(`${s.name} images in header area:`, Array.from(urls));

      // Look for any logo keyword anywhere
      const allMatches = html.match(/https?:\/\/[^"'\s]+\.(?:png|svg|webp|jpg)/gi) || [];
      const logos = allMatches.filter(u => /logo/i.test(u));
      console.log(`${s.name} all logo matches:`, Array.from(new Set(logos)));
    } catch (e) {
      console.error(s.name, e.message);
    }
  }
}

inspectSites().catch(console.error);
