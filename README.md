# Ioanna Zarkadoula — Product Design Portfolio

Static portfolio for Product Design work in fintech and payments. Documentation-first case studies, custom design tokens, no frameworks.

**Live domain (intended):** https://ioannazarkadoula.com

## Stack

- HTML5, CSS3 (custom properties), vanilla JavaScript
- Include-based build (`scripts/build.js`) → `dist/`
- No React, Bootstrap, or Tailwind

## Commands

```bash
npm run build    # Assemble pages into dist/
npm run serve    # Preview dist/ at http://localhost:4173
```

## Structure

```
src/                 Page sources + robots.txt + sitemap.xml
components/          header, footer, skip-link, head-icons
assets/              css, js, fonts, images
public/              favicon, manifest, root headers
scripts/build.js     Include assembler
dist/                Build output (gitignored)
docs/                Source material (not shipped as site pages)
```

## Design tokens

| Role | Value |
|------|-------|
| Accent 500 | `#2060E8` |
| Neutral ink | `#14141C` |
| Background | `#FFFFFF` |
| Spacing base | 4px |
| Page max-width | 1200px |
| Prose measure | 760px |
| Fonts | Source Serif 4 · Source Sans 3 · IBM Plex Mono |

Full map: `assets/css/tokens.css`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel, Netlify, and GitHub Pages (including custom domain).

## Goals

- Accessible (WCAG AA targets)
- Responsive (desktop-first)
- Fast static delivery
- Semantic HTML and SEO-ready metadata
