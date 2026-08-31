import fs from 'fs';

async function checkLuminous() {
  const urls = [
    'https://www.luminousindia.com/static/edge/public/styles/webp_image/azblob/2026-01/7eb59a25-e033-49fb-81fa-0e95207441ba.png.webp?itok=CiMVzBvw',
    'https://www.luminousindia.com/static/edge/public/styles/webp_image/azblob/2026-05/c73d9f3e-1662-4b44-a666-d143dbd5f34d.png.webp?itok=tC8C2_Ep'
  ];

  for (let i = 0; i < urls.length; i++) {
    const r = await fetch(urls[i]);
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(`src/assets/brands/luminous-test-${i}.webp`, buf);
    console.log(`Saved luminous-test-${i}.webp (${buf.length} bytes)`);
  }

  // Also search for any SVG inside luminous.html that has path data for the word LUMINOUS or Luminous logo
  const html = fs.readFileSync('scripts/luminous.html', 'utf-8');
  console.log('Searching for SVG in luminous.html...');
  const svgMatches = [...html.matchAll(/<svg[^>]*>[\s\S]*?<\/svg>/gi)];
  console.log(`Found ${svgMatches.length} total SVGs in luminous.html`);
  for (let i = 0; i < svgMatches.length; i++) {
    const s = svgMatches[i][0];
    if (s.toLowerCase().includes('luminous') || s.includes('viewBox="0 0') || s.length > 500) {
      console.log(`SVG ${i} (length: ${s.length}):\n`, s.slice(0, 300));
    }
  }
}

checkLuminous().catch(console.error);
