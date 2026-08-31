import fs from 'fs';

// 1. Save GreenVolt logo from greenvolt.html base64 image
const gvHtml = fs.readFileSync('scripts/greenvolt.html', 'utf-8');
const base64Match = gvHtml.match(/src="data:image\/png;base64,([^"]+)"/i);
if (base64Match) {
  const buf = Buffer.from(base64Match[1], 'base64');
  fs.writeFileSync('src/assets/brands/greenvolt.png', buf);
  console.log('✓ Decoded and saved official GreenVolt Power India logo (size:', buf.length, 'bytes)');
} else {
  console.log('No base64 found in greenvolt.html');
}

// 2. Extract Luminous logo from luminous.html
const lumHtml = fs.readFileSync('scripts/luminous.html', 'utf-8');
// Find all img tags in luminous.html
const imgMatches = [...lumHtml.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
console.log('Luminous images count:', imgMatches.length);
console.log('First 10 images from Luminous:\n', imgMatches.slice(0, 10));

// Find any image containing luminous
const lumSpecific = imgMatches.filter(src => /luminous|logo|header|brand/i.test(src));
console.log('Luminous filtered logo candidates:\n', lumSpecific);
