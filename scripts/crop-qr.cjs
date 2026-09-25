const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function measureExactQr() {
  const img = sharp('C:\\omsun-website\\omsum\\public\\images\\payments\\omsun-fonepay-qr-standee.jpg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's find rows with the characteristic finder pattern:
  // Around x: 190..230, find where the top black finder begins and bottom black finder ends
  // Let's check column x = 200 from y = 200 to y = 600
  let qrTop = 0, qrBottom = 0;
  for (let y = 200; y < 600; y++) {
    const idx = (y * width + 200) * channels;
    if (data[idx] < 50 && data[idx+1] < 50 && data[idx+2] < 50) {
      if (!qrTop) qrTop = y;
      qrBottom = y;
    }
  }

  // Check row y = 300 to find qrLeft and qrRight
  let qrLeft = 0, qrRight = 0;
  for (let x = 100; x < 600; x++) {
    const idx = (300 * width + x) * channels;
    if (data[idx] < 50 && data[idx+1] < 50 && data[idx+2] < 50) {
      if (!qrLeft) qrLeft = x;
      qrRight = x;
    }
  }

  console.log('Sampled QR bounds:', { qrTop, qrBottom, qrLeft, qrRight });

  // Let's find exact top of the top-left finder pattern:
  // Look at x between 180 and 250, scan y from 220 downwards
  let finderTop = 0;
  for (let y = 220; y < 300; y++) {
    let blackCount = 0;
    for (let x = 180; x < 250; x++) {
      const idx = (y * width + x) * channels;
      if (data[idx] < 50) blackCount++;
    }
    if (blackCount > 30) {
      finderTop = y;
      break;
    }
  }

  // Look at x between 180 and 250, scan y from 580 upwards
  let finderBottom = 0;
  for (let y = 580; y > 480; y--) {
    let blackCount = 0;
    for (let x = 180; x < 250; x++) {
      const idx = (y * width + x) * channels;
      if (data[idx] < 50) blackCount++;
    }
    if (blackCount > 30) {
      finderBottom = y;
      break;
    }
  }

  // Look at y between 250 and 320, scan x from 160 upwards
  let finderLeft = 0;
  for (let x = 160; x < 250; x++) {
    let blackCount = 0;
    for (let y = 250; y < 320; y++) {
      const idx = (y * width + x) * channels;
      if (data[idx] < 50) blackCount++;
    }
    if (blackCount > 30) {
      finderLeft = x;
      break;
    }
  }

  // Look at y between 250 and 320, scan x from 540 downwards
  let finderRight = 0;
  for (let x = 540; x > 450; x--) {
    let blackCount = 0;
    for (let y = 250; y < 320; y++) {
      const idx = (y * width + x) * channels;
      if (data[idx] < 50) blackCount++;
    }
    if (blackCount > 30) {
      finderRight = x;
      break;
    }
  }

  console.log('Finder corners:', { finderTop, finderBottom, finderLeft, finderRight });
  const qrW = finderRight - finderLeft;
  const qrH = finderBottom - finderTop;
  console.log('Size of QR area:', qrW, 'x', qrH);

  // Add 16px white quiet zone border
  const quietZone = 16;
  const cropLeft = finderLeft - quietZone;
  const cropTop = finderTop - quietZone;
  const cropSize = Math.max(qrW, qrH) + quietZone * 2;

  await sharp('C:\\omsun-website\\omsum\\public\\images\\payments\\omsun-fonepay-qr-standee.jpg')
    .extract({ left: cropLeft, top: cropTop, width: cropSize, height: cropSize })
    .jpeg({ quality: 98 })
    .toFile('C:\\omsun-website\\omsum\\public\\images\\payments\\omsun-fonepay-qr-code.jpg');

  fs.copyFileSync(
    'C:\\omsun-website\\omsum\\public\\images\\payments\\omsun-fonepay-qr-code.jpg',
    'C:\\omsun-website\\omsum\\src\\assets\\images\\payments\\omsun-fonepay-qr-code.jpg'
  );

  console.log('Cropped square QR code saved successfully at:', { cropLeft, cropTop, cropSize });
}

measureExactQr().catch(console.error);
