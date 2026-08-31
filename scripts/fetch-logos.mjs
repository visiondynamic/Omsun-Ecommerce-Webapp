import fs from 'fs';
import path from 'path';

async function getLogos() {
  const sites = [
    { name: 'smarten', url: 'https://www.smartenpowersystems.com/' },
    { name: 'luminous', url: 'https://www.luminousindia.com/' },
    { name: 'dynapower', url: 'https://dynapowerworld.com/' },
    { name: 'greenvolt', url: 'https://greenvoltpowerindia.com/' }
  ];

  for (const s of sites) {
    try {
      console.log(`\nFetching ${s.name} from ${s.url}...`);
      const res = await fetch(s.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      });
      const html = await res.text();
      console.log(`${s.name} status: ${res.status}, length: ${html.length}`);

      // Search for img tags with logo
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let match;
      const logos = [];
      while ((match = imgRegex.exec(html)) !== null) {
        if (/logo/i.test(match[0])) {
          logos.push(match[1]);
        }
      }
      console.log(`${s.name} logo candidates:`, logos.slice(0, 8));

      // Also check SVG tags or header logo
      const headerRegex = /<header[\s\S]*?<\/header>/i;
      const headerMatch = html.match(headerRegex);
      if (headerMatch) {
        const headerImgs = [];
        while ((match = imgRegex.exec(headerMatch[0])) !== null) {
          headerImgs.push(match[1]);
        }
        console.log(`${s.name} header images:`, headerImgs);
      }
    } catch (e) {
      console.error(`Error for ${s.name}:`, e.message);
    }
  }
}

getLogos().catch(console.error);
