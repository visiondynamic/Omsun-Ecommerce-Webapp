import fs from 'fs';
import path from 'path';

async function extractAndDownload() {
  const sites = ['smarten', 'luminous', 'dynapower', 'greenvolt'];

  for (const name of sites) {
    const file = `scripts/${name}.html`;
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf-8');

    console.log(`\n=================== ${name.toUpperCase()} ===================`);
    
    // Find all images matching logo or in header / navbar
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
    console.log(`Found ${imgMatches.length} total <img> tags.`);

    const candidates = [];
    for (const m of imgMatches) {
      const tag = m[0];
      const src = m[1];
      if (/logo|brand|header|nav/i.test(tag) || /logo|brand|header|nav/i.test(src) || candidates.length < 5) {
        candidates.push({ src, tag: tag.slice(0, 150) });
      }
    }

    console.log('Candidates:');
    candidates.slice(0, 10).forEach((c, idx) => {
      console.log(`[${idx + 1}] ${c.src}`);
    });
  }
}

extractAndDownload().catch(console.error);
