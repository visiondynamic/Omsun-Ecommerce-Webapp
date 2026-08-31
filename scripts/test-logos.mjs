import fs from 'fs';

async function testEach() {
  // 1. SMARTEN
  const smarten = await fetch('https://www.smartenpowersystems.com/wp-content/uploads/2021/12/smarten-logo.svg');
  console.log('Smarten SVG status:', smarten.status);
  if (smarten.ok) {
    const text = await smarten.text();
    fs.writeFileSync('src/assets/brands/smarten.svg', text);
    console.log('✓ Saved Smarten SVG (length:', text.length, ')');
  }

  // 2. LUMINOUS
  const luminous = await fetch('https://www.luminousindia.com/');
  const lumText = await luminous.text();
  const lumSvg = lumText.match(/<svg[^>]*class="[^"]*logo[^"]*"[^>]*>[\s\S]*?<\/svg>/i) ||
                 lumText.match(/<a[^>]*class="[^"]*logo[^"]*"[^>]*>([\s\S]*?)<\/a>/i);
  console.log('Luminous logo html match:', lumSvg ? lumSvg[0].slice(0, 200) : 'none');

  // 3. DYNA PLUS
  const dyna = await fetch('https://dynapowerworld.com/');
  const dynaText = await dyna.text();
  const dynaLogoMatch = dynaText.match(/<img[^>]+src="([^"]+)"[^>]*alt="[^"]*logo[^"]*"[^>]*>/i) ||
                        dynaText.match(/class="[^"]*logo[^"]*"[^>]*><img[^>]+src="([^"]+)"/i) ||
                        dynaText.match(/<img[^>]+src="(https:\/\/dynapowerworld\.com\/wp-content\/uploads\/[^"]+)"/i);
  console.log('Dyna logo match:', dynaLogoMatch ? dynaLogoMatch[1] : 'none');
  if (dynaLogoMatch) {
    const dynaImgRes = await fetch(dynaLogoMatch[1]);
    const buf = Buffer.from(await dynaImgRes.arrayBuffer());
    fs.writeFileSync('src/assets/brands/dyna-plus.png', buf);
    console.log('✓ Saved dyna-plus.png');
  }

  // 4. GREENVOLT
  const gv = await fetch('https://greenvoltpowerindia.com/');
  const gvText = await gv.text();
  const gvLogoMatch = gvText.match(/<img[^>]+src="([^"]+)"[^>]*alt="[^"]*logo[^"]*"[^>]*>/i) ||
                      gvText.match(/class="[^"]*logo[^"]*"[^>]*><img[^>]+src="([^"]+)"/i) ||
                      gvText.match(/<img[^>]+src="([^"]+)"/i);
  console.log('GreenVolt logo match:', gvLogoMatch ? gvLogoMatch[1] : 'none');
}

testEach().catch(console.error);
