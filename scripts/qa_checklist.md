# Danone Deck — Visual QA Checklist

Read the rendered slide PNGs (60–100 dpi via LibreOffice → pdftoppm) and check
each applicable rule. Every finding = slide + location + what is wrong.
Reference look: `Danone Real Templates/rendered/standard-contact-sheet.jpg`.

1. Cover & closing: whole background solid #005EB8 (no photo, gradient or seam).
   One LARGE white circle that touches/bleeds off the top and bottom edges.
   Kicker (black Light) above, title in blue condensed CAPS, logo at the circle
   bottom. Nothing clipped by the circle. No right bar.
2. Body pages: white background. Thick blue bar on the right edge (~5% of the
   slide width), page number white and centred INSIDE the bar near the bottom.
   Blue Danone logo bottom-left. No slogan text, no "02 / 09", no bottom bar.
3. Navy variant: same bar in navy #002677. Logo still blue on white.
4. Full-colour / divider pages: colour panel stops above a white footer strip;
   logo blue on that strip; right bar white (full colour) or photo to the edge
   (divider); page number in the panel colour.
5. Colour balance: the deck reads blue and white. Auxiliary colours (red, green,
   dark green, orange, salmon, mint, pink, yellow) appear only in small areas —
   charts, number circles, dots, tags, one highlight box. Max 2 per slide. Never
   as a page background, panel, bar or title colour.
6. Typography: titles condensed bold CAPS black; subheaders condensed CAPS blue;
   body light weight, ≥14pt. Letterforms narrow (Danone One Condensed), not wide
   like Arial/Calibri.
7. Boxes: flat tint (#E5EFF8 light blue or #F2F2F2 grey), square corners, no
   border, no shadow.
8. Photos: plain rectangles at original aspect (no oval masks, no rounded crops,
   no distortion).
9. General: no content inside the right bar (x > 12.65 in), text overflow or
   cut-off, overlaps, misalignment, uneven gaps, low contrast, leftover
   placeholder text, invented numbers that should read "Data TBD".

Output: per slide, PASS/FAIL per applicable rule + defects with exact location.
End with a priority-ordered defect list (blockers first) or "ALL CLEAN".
