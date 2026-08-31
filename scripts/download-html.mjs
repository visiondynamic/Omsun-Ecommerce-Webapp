import fs from 'fs';

async function downloadAndInspect() {
  const sites = [
    { name: 'smarten', url: 'https://www.smartenpowersystems.com/' },
    { name: 'luminous', url: 'https://www.luminousindia.com/' },
    { name: 'dynapower', url: 'https://dynapowerworld.com/' },
    { name: 'greenvolt', url: 'https://greenvoltpowerindia.com/' }
  ];

  for (const s of sites) {
    try {
      const res = await fetch(s.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await res.text();
      fs.writeFileSync(`scripts/${s.name}.html`, html, 'utf-8');
      console.log(`Saved ${s.name}.html (${html.length} bytes)`);

      // Find all img tags
      const imgTags = [...html.matchAll(/<img[^>]+>/gi)].map(m => m[0]);
      console.log(`${s.name} img tags count:`, imgTags.length);
      console.log(`${s.name} first 5 img tags:`, imgTags.slice(0, 5));
    } catch (e) {
      console.error(s.name, e.message);
    }
  }
}

downloadAndInspect().catch(console.error);
