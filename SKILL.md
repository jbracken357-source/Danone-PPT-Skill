---
name: danone-ppt
description: "Turn any material into a Danone-branded PowerPoint deck (达浪风格PPT / 达能风格PPT / Danone-style deck). Use when the user says 达浪, 达浪风格, 达能风格, Danone style, Danone deck, Danone PPT, brand-spec PPT, or asks to convert a phrase / document / markdown / existing deck / outline into an on-brand Danone presentation with the official logo, Danone One fonts, blue-and-white #005EB8 corporate look, white-circle cover and the template's right bar footer. Also use for QA-ing or fixing an existing deck against the Danone brand spec. Not for non-Danone decks."
---

# Danone-Style PPT (达浪风格)

Input: a phrase, a markdown/docx/xlsx, an existing .pptx, or a rough outline.
Output: a NEW .pptx file (never modify the source) that reads as an official
Danone deck. The deck structure adapts to the material. Only the BRAND layer is fixed.

## Law: the brand layer comes from the real template

`brand-spec.md` holds every value, measured from the real corporate template.
`scripts/danone_kit.js` implements those values. Build with the kit; do not
re-type geometry or colours in the build script.

| Invariant | Rule |
|---|---|
| Colour | Blue `#005EB8` + white dominate. Navy `#002677` and aqua `#00ACED` support. The 8 other template colours are auxiliary: charts, number circles, status, one highlight box. Max 2 per slide. Never page themes |
| Cover / closing | Solid blue bg + large white circle (d 8.268, bleeds top and bottom); kicker 28pt Light black, title 66pt Condensed bold CAPS blue, logo at circle bottom. No right bar |
| Body page | White bg; blue right bar 0.682 wide at x 12.651; white page number inside the bar; logo bottom-left (0.302, 7.052, 1.13 × 0.339). No slogan text, no "NN/TT" |
| Titles | 28pt Condensed bold CAPS black; optional 20pt subtitle; subheaders 20pt Condensed bold CAPS blue; body 16pt Light black |
| Boxes | Flat `#E5EFF8` or `#F2F2F2` fill, square, no border |
| Emphasis | Full-colour panel (blue or navy) stops at y 6.941; right bar turns white; logo stays blue on the white footer strip |
| Logo / photos | Real PNG lockup only. Photos plain rectangles at original aspect |

Anti-patterns (hard): gradient covers, small circle, thin 4px bar, auxiliary colour
as page theme, hand-drawn logo, fake data (use "Data TBD"), decorative
illustrations, rounded photo masks, non-Danone fonts.

## Pipeline

### 1. Understand the material
- Phrase → ask (or infer) audience, occasion, length. Propose an outline first.
- Document/markdown → extract: core message, audience, mandatory content,
  anything that must be quoted verbatim.
- Existing .pptx → `markitdown` dump first (load the `pptx` skill for
  reading/editing decks); decide what carries over (text, images via
  slide-XML rels extraction) and what gets redesigned.
- Ask the user ONLY about real ambiguities (audience? length? language?).
  English body copy for global audiences unless told otherwise.

### 2. Plan slides before building
Write the outline (slide titles + one-line content each) and get user sign-off
for anything >6 slides. Default rhythm: cover → white body pages → a
full-colour or divider page between chapters → closing "Thank you". Vary
layouts (boxes, two numbers, photo + text, flow, table); never repeat one
layout more than twice in a row. Decide per slide whether an auxiliary colour
is needed at all; most slides need none.

### 3. Environment prep (once per machine)
- Fonts: `python scripts/install_fonts.py` (WOFF2→TTF, fixes broken name
  tables, registers under HKCU — no admin). New LibreOffice/PowerPoint
  processes then render the real brand fonts, so QA is trustworthy.
  PowerPoint on Danone-managed machines already has the fonts.
- `pptxgenjs` must be resolvable from the build script directory (`npm i pptxgenjs`).

### 4. Build with pptxgenjs + the kit
Write a build script next to the output (keep it — the user can rerun after
copy edits). Load the `pptx` skill for its pptxgenjs gotchas.

```js
const pptxgen = require('pptxgenjs');
const pptx = new pptxgen();
const dn = require('<this-skill-dir>/scripts/danone_kit.js')(pptx); // sets LAYOUT_WIDE + theme fonts

dn.cover({ kicker: 'October 2026', title: 'Deck title', desc: 'optional line' });
let s = dn.body({ title: 'Slide title', subtitle: 'optional subtitle' }); // dark: true → navy bar
dn.subhead(s, 'Level 1 header', dn.G.x, dn.G.bodyY, 6);
dn.text(s, 'Body copy', dn.G.x, dn.G.bodyY + 0.5, 6, 1);           // 16pt Light black default
dn.box(s, 0.642, 1.859, 5.789, 5.08);                               // tint box; dn.C.grey for 2nd
dn.numberCircle(s, 8.83, 3.322, 3.187, 'Data TBD', 'caption', dn.AUX.red);
dn.contain(s, 'photo.jpg', x, y, w, h);                             // PNG/JPEG, aspect kept
dn.fullColour({ title: 'Section', big: 'One key message', color: dn.C.navy });
dn.divider({ title: 'Chapter', sub: 'subtitle', photo: 'photo.jpg' }); // photo required
dn.closing();
pptx.writeFile({ fileName: 'deck.pptx' }).then(f => console.log('wrote', f));
```

Exports: `C` (primary colours), `AUX` / `AUX_TINT` (auxiliary), `F` (fonts),
`G` (template geometry: content column x 0.642, w 11.852, body y 1.859–6.939).
Keep all content inside x ≤ 12.494 (the bar starts at 12.651). Page numbers
are automatic. Add speaker notes (`s.addNotes()`) on every content slide.

### 5. QA — three gates, in order
1. File: `python <pptx-skill-dir>/scripts/office/validate.py deck.pptx` — must PASS.
   Find the dir with `ls ~/.claude/skills/synced/*/pptx/scripts/office/validate.py`.
2. Render: `soffice --headless --convert-to pdf` (use
   `-env:UserInstallation=file:///<tmp>/lo-profile` if fonts were just installed)
   → `pdftoppm -png -r 60`. Check `pdffonts` lists only DanoneOne fonts.
3. Visual: read the PNGs yourself against `scripts/qa_checklist.md`. Fix real
   defects, re-render changed slides, re-check once. Typical real catches: text
   in the right bar, title overflow on 2+ lines with a subtitle, auxiliary
   colour used as a large fill, cover title too long for the circle.

Deliver: absolute path of the new .pptx + the build script path. State that the
source file was not touched.

## Assets in this skill
- `brand-spec.md` — measured spec (colour policy, type scale, geometry, layouts, anti-patterns)
- `scripts/danone_kit.js` — brand layer for pptxgenjs (no other dependency)
- `assets/danone-brand/` — `logo-danone.png` (template `image2.png`, 1600×482),
  `logo-danone-white.png` (fallback for full-bleed photos only), 6× DanoneOne*.woff2
- `scripts/install_fonts.py`, `scripts/qa_checklist.md`,
  `scripts/make_white_logo.js` (regenerates the white PNG; needs `sharp`)
- Real corporate templates (source of every value):
  `D:/Coding Playground/shida-danone-ppt-skill/Danone Real Templates/`
  (contact sheet: `rendered/standard-contact-sheet.jpg`)
