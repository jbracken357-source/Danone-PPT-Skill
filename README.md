# Danone PPT Skill

Agent skill (Claude Code / Codex) that builds Danone-branded PowerPoint decks with pptxgenjs.

- `SKILL.md` — workflow the agent follows.
- `brand-spec.md` — brand values, measured on 2026-10-23 from the real corporate template.
- `scripts/danone_kit.js` — brand layer as code (cover, body page, full-colour page, divider, closing, boxes, number circles).
- Colour policy: blue `#005EB8` and white dominate; the other template colours are auxiliary only.

Install: put this folder at `~/.agents/skills/danone-ppt` and link it into `~/.claude/skills/danone-ppt` (Windows: `New-Item -ItemType Junction`).

Previous versions: `shida-danone-ppt-skill-legacy` (v6 HTML pipeline and the pre-rewrite pptxgenjs skill).
