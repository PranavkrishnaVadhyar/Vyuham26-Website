const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.resolve(__dirname, '..', 'public');

async function main() {
  const svgContent = fs.readFileSync(path.join(PUBLIC, 'vyuham_logo.svg'), 'utf-8');
  const match = svgContent.match(/href="data:image\/png;base64,([^"]+)"/);
  
  if (!match) {
    console.error('No base64 PNG found in SVG');
    return;
  }

  const buf = Buffer.from(match[1], 'base64');
  console.log('Original PNG from SVG:', Math.round(buf.length / 1024), 'KB');

  const sm = await sharp(buf)
    .resize(80, 80, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, 'vyuham_logo_sm.png'));
  console.log('Navbar PNG (80x80):', Math.round(sm.size / 1024), 'KB');

  const md = await sharp(buf)
    .resize(200, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, 'vyuham_logo_md.png'));
  console.log('Medium PNG (200x200):', Math.round(md.size / 1024), 'KB');

  const opt = await sharp(buf)
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, 'vyuham_logo_optimized.png'));
  console.log('Optimized full PNG:', Math.round(opt.size / 1024), 'KB');

  const logoBuf = await sharp(buf)
    .resize(350, 350, { fit: 'contain', background: { r: 3, g: 5, b: 4, alpha: 1 } })
    .toBuffer();

  const og = await sharp({
    create: { width: 1200, height: 630, channels: 4, background: { r: 3, g: 5, b: 4, alpha: 1 } }
  })
    .composite([{ input: logoBuf, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, 'og-image.png'));
  console.log('OG Image (1200x630):', Math.round(og.size / 1024), 'KB');

  console.log('\nDone!');
}

main().catch(console.error);
