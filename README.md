# Ioanna Zarkadoula – Product Design Portfolio

A personal portfolio showcasing product design case studies, design systems, and professional experience.

## Purpose

This website presents Product Design work through detailed case studies that demonstrate product thinking, UX research, interaction design, design systems, business impact, and collaboration with engineering.

## Tech Stack

- HTML5
- CSS3 (custom properties / component CSS)
- Vanilla JavaScript

No frameworks. No Bootstrap. No Tailwind. No React.

## Develop

```bash
node scripts/build.js
npx serve dist
```

Source pages live in `src/`. Shared partials live in `components/`. The build assembles includes into `dist/`.

## Design tokens (frozen)

| Role | Value |
|------|-------|
| Accent 500 | `#2060E8` |
| Accent 600 / 700 | `#1848D0` / `#1840A8` |
| Neutral ink | `#14141C` |
| Background | `#FFFFFF` |
| Spacing base | 4px |
| Page max-width | 1200px |
| Prose measure | 760px |
| Fonts | Source Serif 4 · Source Sans 3 · IBM Plex Mono |

Full token map: `assets/css/tokens.css`

## Project Structure

```
src/                 # Page sources
components/          # header, footer, skip-link
assets/css|js|images|fonts|icons
scripts/build.js     # Include assembler
docs/                # Source of truth (not shipped as content pages)
dist/                # Build output
```

## Goals

- Accessible (WCAG AA)
- Responsive (desktop-first)
- Fast (Lighthouse 95+)
- Semantic HTML
- SEO friendly
