/* Generate the WHITE variant of the Danone logo (for dark slides).
   Run: node make_white_logo.js [out.png]   (needs: npm i sharp, run in any dir)
   Pitfall this script avoids: sharp .composite({blend:'dest-in'}) with an
   extracted-alpha buffer produces a FULLY OPAQUE white slab (the alpha image
   itself is opaque). Correct approach: rebuild RGBA in a raw buffer, taking
   alpha from the source and RGB = pure white. Verify: opaque ratio must be
   ~0.29 (only the strokes), NOT 1.0. */
const path = require('path');
let sharp;
try {
  sharp = require('sharp');                       // resolved from this script's dir
} catch (e) {
  try {
    sharp = require(path.join(process.cwd(), 'node_modules', 'sharp'));  // from caller's project
  } catch (e2) {
    console.error('sharp not found. Run from a directory with sharp installed:');
    console.error('  npm i sharp   (then re-run), or run inside a project that has it');
    process.exit(1);
  }
}

const SKILL_DIR = path.join(__dirname, '..');
const SRC = path.join(SKILL_DIR, 'assets', 'danone-brand', 'logo-danone.png');
const OUT = process.argv[2] || path.join(SKILL_DIR, 'assets', 'danone-brand', 'logo-danone-white.png');

(async () => {
  const src = sharp(SRC).ensureAlpha();
  const meta = await src.metadata();
  const { data, info } = await src.raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const out = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    out[i*4] = 255; out[i*4+1] = 255; out[i*4+2] = 255;
    out[i*4+3] = data[i*4+3];               // alpha from source
  }
  await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(OUT);
  // verify
  const chk = await sharp(OUT).raw().toBuffer({ resolveWithObject: true });
  let op = 0; for (let i = 0; i < W * H; i++) if (chk.data[i*4+3] > 128) op++;
  const ratio = op / (W * H);
  console.log('white logo:', W + 'x' + H, 'opaque ratio:', ratio.toFixed(3));
  if (ratio > 0.9) { console.error('FAIL: fully opaque - alpha mask broken'); process.exit(1); }
  console.log('OK ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });
