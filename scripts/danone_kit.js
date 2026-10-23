/* Danone brand kit for pptxgenjs.
   Every geometry/size/color below is measured from the real corporate
   template "Standard Danone Template.pptx" (Blue + Navy masters, layouts
   1/9/11/14/16/22/24/27). See ../brand-spec.md for the source table.

   Usage (in your build script):
     const pptxgen = require('pptxgenjs');
     const pptx = new pptxgen();
     const dn = require('<skill-dir>/scripts/danone_kit.js')(pptx);
     dn.cover({ kicker: 'October 2026', title: 'Deck title' });
     const s = dn.body({ title: 'Slide title', subtitle: 'One-line subtitle' });
     dn.text(s, 'Body copy', dn.G.x, dn.G.bodyY, dn.G.w, 1);
     dn.closing();
     pptx.writeFile({ fileName: 'out.pptx' });

   Page numbers are automatic (cover = 1, as in the template). */
const path = require('path');
const fs = require('fs');

const ASSETS = path.join(__dirname, '..', 'assets', 'danone-brand');
const LOGO = path.join(ASSETS, 'logo-danone.png');

// Primary = blue/white. Navy and aqua are brand-core supports.
const C = {
  blue: '005EB8', navy: '002677', aqua: '00ACED', white: 'FFFFFF',
  text: '000000', textSec: '595959',
  tint: 'E5EFF8',   // blue 10% (Blue: Two Content Box)
  grey: 'F2F2F2',   // lt2 (second box)
  line: 'BFBFBF',
};
// Auxiliary only: charts, number circles, status dots, single highlights.
const AUX = {
  red: 'EF3340', green: '54AD18', darkGreen: '00843D', orange: 'F88806',
  salmon: 'EE8C6B', mint: '57BAB7', pink: 'FFB2BE', yellow: 'F3D03E',
};
const AUX_TINT = {
  red: 'FDEBEC', green: 'EEF7E8', darkGreen: 'E5F3EC', orange: 'FDF4F0',
  mint: 'EEF8F8', pink: 'FFF7F9', yellow: 'FEFAEC', aqua: 'E5F7FD',
};
const F = { head: 'Danone One Condensed', body: 'Danone One Light', reg: 'Danone One' };

const G = {
  SW: 13.333, SH: 7.5,
  x: 0.642, w: 11.852,                 // content column (ends 12.494)
  titleY: 0.453, bodyY: 1.859, bodyBottom: 6.939,
  bar: { x: 12.651, w: 0.682 },
  num: { x: 12.793, y: 6.969, w: 0.399, h: 0.399 },
  logo: { x: 0.302, y: 7.052, w: 1.13, h: 0.339 },
  panelH: 6.941,                       // colour panels stop here; footer strip stays white
  circle: { x: 2.533, y: -0.384, d: 8.268 },
  coverLogo: { x: 5.524, y: 6.363, w: 2.285, h: 0.686 },
};

module.exports = function danoneKit(pptx) {
  pptx.layout = 'LAYOUT_WIDE';
  pptx.theme = { headFontFace: F.head, bodyFontFace: F.body };
  pptx.company = pptx.company || 'Danone';
  let page = 0;
  const none = c => ({ color: c, transparency: 100 });

  function text(s, v, x, y, w, h, o = {}) {
    s.addText(v, { x, y, w, h, fontFace: F.body, fontSize: 16, color: C.text,
      margin: 0, valign: 'top', ...o });
  }
  function rect(s, x, y, w, h, color, o = {}) {
    s.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color, ...(o.fill || {}) }, line: none(color) });
  }
  function pageNum(s, color) {
    text(s, String(page), G.num.x, G.num.y, G.num.w, G.num.h,
      { fontFace: F.head, fontSize: 14, color, align: 'center', valign: 'middle' });
  }
  function slideNum(s, barColor, numColor) {
    rect(s, G.bar.x, 0, G.bar.w, G.SH, barColor);
    pageNum(s, numColor);
  }
  function footerLogo(s) { s.addImage({ path: LOGO, ...G.logo }); }

  /* Title block: 28pt Condensed bold CAPS black; optional 20pt Condensed subtitle. */
  function title(s, t, sub, color = C.text) {
    // CAPS only on the title run; the subtitle keeps sentence case (as in the template)
    const runs = [{ text: t.toUpperCase(), options: { fontSize: 28, bold: true, breakLine: !!sub } }];
    if (sub) runs.push({ text: sub, options: { fontSize: 20, bold: false } });
    text(s, runs, G.x, G.titleY, G.w, 1.407, { fontFace: F.head, color, lineSpacingMultiple: 0.9 });
  }

  function circleSlide({ kicker, title: t, desc }) {
    page += 1;
    const s = pptx.addSlide();
    s.background = { color: C.blue };
    const { x, y, d } = G.circle;
    s.addShape(pptx.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: C.white }, line: none(C.white) });
    if (kicker) text(s, kicker, 4.027, 1.214, 5.227, 1.035,
      { fontSize: 28, align: 'center', valign: 'middle' });
    const tH = desc ? 3.0 : 4.229;
    text(s, t.toUpperCase(), 2.848, 1.865, 7.638, tH,
      { fontFace: F.head, fontSize: 66, bold: true, color: C.blue, align: 'center', valign: 'middle',
        lineSpacingMultiple: 0.9, fit: 'shrink' });
    if (desc) text(s, desc, 3.4, 4.95, 6.533, 1.1,
      { fontSize: 18, color: C.textSec, align: 'center', valign: 'top' });
    s.addImage({ path: LOGO, ...G.coverLogo });
    return s;
  }

  return {
    C, AUX, AUX_TINT, F, G, LOGO, text, rect,
    get page() { return page; },

    cover: o => circleSlide(o),
    closing: (o = {}) => circleSlide({ title: 'Thank you', ...o }),

    /* Standard white content page. dark=true uses the Navy master (navy bar). */
    body({ title: t, subtitle, dark = false } = {}) {
      page += 1;
      const s = pptx.addSlide();
      s.background = { color: C.white };
      slideNum(s, dark ? C.navy : C.blue, C.white);
      footerLogo(s);
      if (t) title(s, t, subtitle);
      return s;
    },

    /* Full-colour emphasis page (layout "Full Colour - Big Text").
       Panel blue or navy, white right bar with coloured page number, white footer strip. */
    fullColour({ title: t, big, sub, color = C.blue } = {}) {
      page += 1;
      const s = pptx.addSlide();
      s.background = { color: C.white };
      rect(s, 0, 0, G.bar.x, G.panelH, color);
      slideNum(s, C.white, color);
      footerLogo(s);
      if (t) title(s, t, null, C.white);
      if (big) text(s, big.toUpperCase(), 0.643, 1.214, 9.566, sub ? 3.9 : 5.5,
        { fontFace: F.head, fontSize: 60, bold: true, color: C.white, valign: 'middle',
          lineSpacingMultiple: 0.9, fit: 'shrink' });
      if (sub) text(s, sub, 0.643, 5.25, 9.566, 1.4, { fontSize: 18, color: C.white });
      return s;
    },

    /* Chapter divider (layout "Divider Slide"): blue arc panel left, photo right.
       Needs a photo; without one, use fullColour(). */
    divider({ title: t, sub, photo, color = C.blue }) {
      if (!photo || !fs.existsSync(photo)) throw new Error('divider() needs an existing photo; use fullColour() instead');
      page += 1;
      const s = pptx.addSlide();
      s.background = { color: C.white };
      // photo starts under the arc so the arc edge never shows white; 60% colour veil up to x=6.666
      s.addImage({ path: photo, x: 4.8, y: 0, w: G.SW - 4.8, h: G.panelH, sizing: { type: 'cover', w: G.SW - 4.8, h: G.panelH } });
      rect(s, 4.8, 0, 1.866, G.panelH, color, { fill: { transparency: 40 } });
      // arc panel: circle through (4.83,0) (6.0,3.47) (4.83,6.94), measured from the template render
      s.addShape(pptx.ShapeType.ellipse, { x: -5.46, y: -2.26, w: 11.46, h: 11.46, fill: { color }, line: none(color) });
      rect(s, 0, G.panelH, G.SW, G.SH - G.panelH, C.white);                        // re-open footer strip
      pageNum(s, color);                                   // photo runs to the edge: no right bar here
      footerLogo(s);
      text(s, t.toUpperCase(), G.x, 0.48, 3.98, 3.12,
        { fontFace: F.head, fontSize: 36, bold: true, color: C.white, valign: 'bottom', lineSpacingMultiple: 0.9 });
      if (sub) text(s, sub, G.x, 3.832, 3.98, 1.641, { fontFace: F.reg, fontSize: 18, color: C.white });
      return s;
    },

    /* Content box (layout "Two Content Box"): flat tint fill, square corners, no border. */
    box(s, x, y, w, h, fill = C.tint) { rect(s, x, y, w, h, fill); },

    /* Level-1 subheader: 20pt Condensed bold CAPS blue. */
    subhead(s, t, x, y, w, color = C.blue) {
      text(s, t.toUpperCase(), x, y, w, 0.4, { fontFace: F.head, fontSize: 20, bold: true, color });
    },

    /* Number circle (layout "Two numbers"): filled circle, 60pt white figure + caption. */
    numberCircle(s, x, y, d, figure, caption, fill = C.navy) {
      s.addShape(pptx.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: none(fill) });
      text(s, figure, x, y + d * 0.14, d, d * 0.34,
        { fontFace: F.head, fontSize: 60, bold: true, color: C.white, align: 'center', valign: 'middle', fit: 'shrink' });
      if (caption) text(s, caption, x + d * 0.12, y + d * 0.52, d * 0.76, d * 0.3,
        { fontSize: 14, color: C.white, align: 'center' });
    },

    /* Photo at original aspect, fitted inside the box. Plain rectangle, never rounded. */
    contain(s, file, x, y, w, h) {
      const { w: pw, h: ph } = imageSize(file);
      const r = pw / ph;
      const iw = r > w / h ? w : h * r, ih = r > w / h ? w / r : h;
      s.addImage({ path: file, x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih });
    },
  };
};

// PNG/JPEG header read, so the kit needs no image library.
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      const m = b[i + 1], len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  throw new Error('contain(): only PNG/JPEG supported: ' + file);
}
