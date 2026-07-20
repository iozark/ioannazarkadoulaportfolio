#!/usr/bin/env node
/**
 * Tiny include assembler — no framework.
 * Reads HTML under src/, replaces include comments with components,
 * replaces ROOT placeholders with relative paths, writes to dist/.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const COMPONENTS = path.join(ROOT, "components");
const ASSETS = path.join(ROOT, "assets");
const PUBLIC = path.join(ROOT, "public");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function depthOf(relPath) {
  const parts = relPath.split(path.sep).filter(Boolean);
  // index at root => 0; about/index.html => 1; work/green-helios/index.html => 2
  return Math.max(0, parts.length - 1);
}

function rootPrefix(depth) {
  if (depth === 0) return ".";
  return Array(depth).fill("..").join("/");
}

function resolveIncludes(html) {
  return html.replace(/<!--\s*include:([\w-]+)\s*-->/g, (_, name) => {
    const file = path.join(COMPONENTS, `${name}.html`);
    if (!fs.existsSync(file)) {
      throw new Error(`Missing component: ${name}.html`);
    }
    return fs.readFileSync(file, "utf8");
  });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function copyPublic() {
  if (!fs.existsSync(PUBLIC)) return;
  for (const entry of fs.readdirSync(PUBLIC, { withFileTypes: true })) {
    const s = path.join(PUBLIC, entry.name);
    const d = path.join(DIST, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
  console.log("copied public/");
}

function copyEmblaVendor() {
  const from = path.join(ROOT, "node_modules", "embla-carousel", "embla-carousel.umd.js");
  const toDir = path.join(ASSETS, "vendor");
  const to = path.join(toDir, "embla-carousel.umd.js");
  if (!fs.existsSync(from)) return;
  ensureDir(toDir);
  fs.copyFileSync(from, to);
  console.log("synced assets/vendor/embla-carousel.umd.js");
}

function build() {
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);

  copyEmblaVendor();

  const pages = walk(SRC);
  for (const file of pages) {
    const rel = path.relative(SRC, file);
    let html = fs.readFileSync(file, "utf8");
    html = resolveIncludes(html);
    const depth = depthOf(rel);
    html = html.replace(/\{\{ROOT\}\}/g, rootPrefix(depth));

    const out = path.join(DIST, rel);
    ensureDir(path.dirname(out));
    fs.writeFileSync(out, html, "utf8");
    console.log("built", rel);
  }

  for (const name of ["robots.txt", "sitemap.xml"]) {
    const srcFile = path.join(SRC, name);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(DIST, name));
      console.log("built", name);
    }
  }

  copyDir(ASSETS, path.join(DIST, "assets"));
  console.log("copied assets/");
  copyPublic();
  console.log("Done → dist/");
}

build();
