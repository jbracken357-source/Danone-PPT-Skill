"""Install Danone One brand fonts (WOFF2 -> TTF -> per-user Windows fonts).

Run ONCE per machine before building/QA-rendering a Danone deck. Idempotent.
Requires: pip install fonttools brotli

Why: the WOFF2 files ship without usable name tables (family name = None),
so naive conversion produces fonts Windows cannot match by name. This script
fixes name/OS2/head tables, then registers under HKCU (no admin needed).
After running, NEW LibreOffice/PowerPoint processes resolve
"Danone One Condensed" / "Danone One Light" / "Danone One" correctly.
"""
import os, sys, shutil, subprocess
from fontTools.ttLib import TTFont

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(SKILL_DIR, "assets", "danone-brand", "fonts")
USER_FONTS = os.path.join(os.environ.get("LOCALAPPDATA", ""), "Microsoft", "Windows", "Fonts")
REG_ROOT = r"Software\Microsoft\Windows NT\CurrentVersion\Fonts"

PLAN = {  # file -> (family, subfamily, bold)
    "DanoneOne-Regular.woff2":        ("Danone One", "Regular", False),
    "DanoneOne-Bold.woff2":           ("Danone One", "Bold", True),
    "DanoneOne-Light.woff2":          ("Danone One Light", "Regular", False),
    "DanoneOne-Condensed.woff2":      ("Danone One Condensed", "Regular", False),
    "DanoneOne-CondensedBold.woff2":  ("Danone One Condensed", "Bold", True),
}

def main():
    os.makedirs(USER_FONTS, exist_ok=True)
    import winreg
    for fname, (fam, sub, bold) in PLAN.items():
        ttf_name = fname.replace(".woff2", ".ttf")
        dst = os.path.join(USER_FONTS, ttf_name)
        if os.path.exists(dst):
            print(f"already installed: {fam} {sub} (skip)")
            continue
        font = TTFont(os.path.join(SRC, fname))
        font.flavor = None
        name = font["name"]
        ps = fname.replace("-", "").replace(".woff2", "")
        full = (fam + " " + sub).replace(" Regular", "") or fam
        for pid, eid, lid in ((3, 1, 0x409), (1, 0, 0)):
            name.setName(fam, 1, pid, eid, lid)
            name.setName(sub, 2, pid, eid, lid)
            name.setName(full, 4, pid, eid, lid)
            name.setName(ps, 6, pid, eid, lid)
        os2 = font["OS/2"]
        os2.usWeightClass = 700 if bold else 400
        if bold:
            os2.fsSelection = (os2.fsSelection & ~0x40) | 0x20
            font["head"].macStyle |= 0x01
        else:
            os2.fsSelection = (os2.fsSelection & ~0x20) | 0x40
            font["head"].macStyle &= ~0x01
        tmp = os.path.join(USER_FONTS, ttf_name + ".tmp")
        font.save(tmp)
        os.replace(tmp, dst)
        with winreg.CreateKey(winreg.HKEY_CURRENT_USER, REG_ROOT) as k:
            winreg.SetValueEx(k, f"{fam} {sub} (Private)", 0, winreg.REG_SZ, dst)
        print(f"installed: {fam} {sub} -> {dst}")
    print("OK - restart any open LibreOffice/PowerPoint to pick up fonts")

if __name__ == "__main__":
    sys.exit(main())
