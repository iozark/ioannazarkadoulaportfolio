# Deployment

Static portfolio. Build output is `dist/`. Custom domain assumed: `https://ioannazarkadoula.com`.

## Build locally

```bash
npm run build
npm run serve
```

- Build: `node scripts/build.js` → writes assembled HTML + assets into `dist/`
- Preview: http://localhost:4173

Publish only the contents of `dist/` (or point the host’s publish directory at `dist` and run the build on the platform).

## Vercel

1. Import the Git repository in [Vercel](https://vercel.com).
2. Framework Preset: **Other**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy.

You can also rely on the included `vercel.json` (`cleanUrls`, trailing slash, asset caching).

### Custom domain on Vercel

1. Project → Settings → Domains → add `ioannazarkadoula.com` (and `www` if desired).
2. Point DNS as Vercel instructs (A / CNAME).
3. Confirm HTTPS is issued automatically.
4. Keep canonical URLs and `sitemap.xml` / `robots.txt` pointing at `https://ioannazarkadoula.com`.

`404.html` in `dist/` is used for unknown routes.

## Netlify

1. Import the repository in [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

The included `netlify.toml` sets the same build settings, a 404 fallback, and cache headers.

### Custom domain on Netlify

1. Domain management → Add custom domain.
2. Configure DNS (Netlify DNS or external A/CNAME records).
3. Enable HTTPS (Let’s Encrypt).

## GitHub Pages

Recommended for a custom domain at the site root (user/organization site or project site with a custom domain).

### Option A — Deploy `dist` with GitHub Actions

1. Enable Pages: Settings → Pages → Source: **GitHub Actions**.
2. Add `.github/workflows/pages.yml` (example below) and push to `main`.
3. Settings → Pages → Custom domain: `ioannazarkadoula.com`.
4. Add a DNS CNAME (or A records for apex) as GitHub documents.
5. Check **Enforce HTTPS** after DNS propagates.

Example workflow:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Option B — Manual / `gh-pages` branch

```bash
npm run build
# publish the contents of dist/ to the gh-pages branch (or docs/ if configured)
```

### Project site without custom domain

If the site is served under `https://<user>.github.io/<repo>/`, relative `{{ROOT}}` links still work, but absolute canonical / Open Graph / sitemap URLs must be updated to include the repo base path. Prefer a custom domain for this portfolio.

## After deploy — checklist

- [ ] Homepage loads over HTTPS
- [ ] `/work/`, case studies, About, Contact, Design System resolve (trailing slash)
- [ ] Unknown URL shows the custom 404 page
- [ ] Favicon and apple-touch icon appear
- [ ] `https://ioannazarkadoula.com/robots.txt` and `/sitemap.xml` are reachable
- [ ] Open Graph preview looks correct (use a social debugger)
- [ ] Mobile nav opens/closes; skip link reaches `#main`

## Project layout (deploy-relevant)

| Path | Role |
|------|------|
| `src/` | Page sources |
| `components/` | Shared partials (header, footer, icons) |
| `assets/` | CSS, JS, fonts, images |
| `public/` | Root static files (favicon, manifest, headers) |
| `scripts/build.js` | Assembler |
| `dist/` | Build output (do not edit by hand) |
| `vercel.json` / `netlify.toml` | Host config |
