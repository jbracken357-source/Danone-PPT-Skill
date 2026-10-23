# Danone Brand Spec (pptx)

> Measured: 2026-10-23, from `Standard Danone Template.pptx` slide XML (masters 1/2/4, layouts 1, 9, 11, 14, 16, 22, 24, 27) and its LibreOffice render.
> `Hight Danone Template.pptx` has the same theme and palette.
> Units: inches and pt on a 13.333 × 7.5 in canvas (`LAYOUT_WIDE`).
> `scripts/danone_kit.js` holds these numbers as code. If you change a value here, change it there too.

## 1. Colour policy

The deck is blue and white. Navy and aqua support blue. The other template colours are auxiliary only.

### Primary (use freely)

| Name | HEX | Template source | Use |
|---|---|---|---|
| Blue | `#005EB8` | theme accent1 | Cover/closing background, right bar, subheaders, big text, panels |
| White | `#FFFFFF` | lt1 | Body page background, cover circle |
| Navy | `#002677` | theme dk2 | Dark emphasis panel, navy right bar, number circle |
| Aqua | `#00ACED` | theme accent2 | Secondary accent on blue/white (lines, small highlights) |
| Blue tint | `#E5EFF8` | Blue: Two Content Box | Content boxes |
| Grey | `#F2F2F2` | lt2 | Second content box |
| Text | `#000000` | tx1 | All body text and titles |

### Auxiliary (small areas only)

| Name | HEX | 10% tint |
|---|---|---|
| Red | `#EF3340` | `#FDEBEC` |
| Green | `#54AD18` | `#EEF7E8` |
| Dark Green | `#00843D` | `#E5F3EC` |
| Orange | `#F88806` | `#FDF4F0` |
| Salmon | `#EE8C6B` | — |
| Mint | `#57BAB7` | `#EEF8F8` |
| Pink | `#FFB2BE` | `#FFF7F9` |
| Yellow | `#F3D03E` | `#FEFAEC` |

Rules for auxiliary colours:
- Use them for chart series, number circles, status dots, tags, and one highlighted box per slide.
- Use a maximum of 2 auxiliary colours on one slide.
- Do not use them for slide backgrounds, panels, the right bar, titles, the cover or the closing.
- Yellow is the warning colour.

## 2. Typography

Theme fonts: major = `Danone One Condensed`, minor = `Danone One Light`.

| Element | Font | Size | Style | Colour |
|---|---|---|---|---|
| Slide title | Condensed | 28pt | bold, CAPS, line 90% | black |
| Subtitle (under title, same box) | Condensed | 20pt | regular, sentence case | black |
| Subheader (body level 1) | Condensed | 20pt | bold, CAPS | blue |
| Body (level 2) | Light | 16–18pt | regular | black |
| Body emphasis (level 3) | Danone One | 16pt | regular | black |
| Big text | Condensed | 60pt | bold, CAPS | blue on white / white on panel |
| Page number | Condensed | 14pt | centred | white on bar |

Minimum body size: 14pt (dense tables and footnotes only).

## 3. Body page (master "Blue: Title and Content")

| Element | x | y | w | h | Notes |
|---|---|---|---|---|---|
| Right bar | 12.651 | 0 | 0.682 | 7.5 | `#005EB8`; Navy master uses `#002677` |
| Page number | 12.793 | 6.969 | 0.399 | 0.399 | inside the bar, white |
| Footer logo | 0.302 | 7.052 | 1.13 | 0.339 | blue PNG lockup |
| Title box | 0.642 | 0.453 | 11.852 | 1.407 | title + optional subtitle |
| Body area | 0.642 | 1.859 | 11.852 | 5.08 | ends at y 6.939 |

Content right edge: x 12.494. Do not put content in the bar.
No slogan text, no "NN / TT" page numbers, no bottom colour bar.

## 4. Cover and closing (layouts 1 and 9)

- Background: solid `#005EB8`. No gradient, photo or seam.
- White circle: diameter 8.268, x 2.533, y -0.384. It bleeds off the top and bottom edges.
- Kicker ("Date or subtitle"): box 4.027, 1.214, 5.227 × 1.035; Light 28pt, black, centred.
- Title: box 2.848, 1.865, 7.638 × 4.229; Condensed bold 66pt CAPS, blue, centred, middle.
- Description (optional, not in the template): Light 18pt, grey, under the title.
- Logo: 5.524, 6.363, 2.285 × 0.686, inside the circle bottom.
- No right bar on the cover or closing.
- Closing title: "THANK YOU".

## 5. Emphasis pages

**Full Colour – Big Text** (layouts 16 / 60):
- Panel: 0, 0, 12.651 × 6.941 in blue or navy.
- Right bar: white. Page number in the panel colour.
- Footer strip under y 6.941: white, blue logo.
- Title 28pt white; big text 60pt white in box 0.643, 1.214, 9.566 × 5.738.

**Divider** (layout 14):
- Blue panel with a convex arc edge (≈ x 4.83 at the top and bottom, x 6.0 at mid-height).
- Photo on the right, edge to edge, with a 60% blue veil next to the arc.
- No right bar. Page number blue in the footer strip.
- Title Condensed bold 36pt CAPS white, bottom-aligned in 0.642, 0.48, 3.98 × 3.12.
- Subtitle Danone One 18pt white at 0.642, 3.832.

**Big Text / Two numbers** (layout 24):
- Big text left (blue, CAPS).
- Two filled circles, diameter 3.187, at (6.386, 0.774) and (8.83, 3.322).
- 60pt white figure + 14–16pt caption. The template uses red + navy: red is the auxiliary use.

## 6. Components

- **Content box** (Two Content Box): flat fill `#E5EFF8` or `#F2F2F2`, square corners, no border, no shadow. Two boxes 5.789 wide with a 0.275 gap.
- **Photo**: plain rectangle at original aspect. Fit inside, or crop to fill (no distortion). No rounded or oval masks.
- **Logo**: the real PNG lockup (emblem + wordmark + slogan in one image, identical to template `image2.png`). Do not draw a logo. Do not split the lockup.
- **Dark backgrounds**: the template never puts the logo on a dark area. Colour panels stop at y 6.941, so the logo stays blue on the white footer strip. `logo-danone-white.png` is a fallback for a full-bleed photo only.

## 7. Anti-patterns

- Gradients, photos or overlays on the cover or closing.
- A small circle (the old 5.83 in / 560 px value) or a thin 4 px right bar.
- Page number outside the bar on body pages; "NN / TT" format; slogan text in the footer.
- Auxiliary colours used as page themes. The deck must read blue and white.
- Hand-drawn or SVG logos.
- Rounded or oval photo masks.
- Fake data. Use "Data TBD".
- Decorative illustrations, emoji icons.
- Fonts other than Danone One (Arial, Calibri, Inter, Playfair).
