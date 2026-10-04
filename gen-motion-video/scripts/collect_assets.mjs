#!/usr/bin/env node
// collect_assets.mjs — capture REAL product assets with Playwright: screenshots at the
// three formats, logo candidates, computed brand colours and fonts. Writes assets/ASSETS.md.
// Usage: node collect_assets.mjs <outDir> <url> [url...]      (run inside a dir with `playwright` installed)
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [outDir, ...urls] = process.argv.slice(2);
if (!outDir || !urls.length) { console.error("usage: collect_assets.mjs <outDir> <url> [url...]"); process.exit(2); }
const shots = join(outDir, "assets/shots"), logos = join(outDir, "assets/logo");
[shots, logos].forEach((d) => mkdirSync(d, { recursive: true }));

const VIEWPORTS = { land: [1920, 1080], port: [1080, 1920], square: [1080, 1080] };
const rows = [], palette = new Map(), fonts = new Map();
const browser = await chromium.launch();

for (const [i, url] of urls.entries()) {
  const slug = new URL(url).pathname.replace(/\W+/g, "_").replace(/^_|_$/g, "") || "home";
  for (const [k, [w, h]] of Object.entries(VIEWPORTS)) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch((e) => console.error("goto:", e.message));
    await page.waitForTimeout(1200);
    const file = `${String(i).padStart(2, "0")}_${slug}_${k}.png`;
    await page.screenshot({ path: join(shots, file), fullPage: false });
    rows.push([file, `${w}×${h}`, url]);
    if (k === "land") {
      // Brand signals: computed colours of prominent elements and the fonts actually in use.
      const sig = await page.evaluate(() => {
        const pick = (sel) => [...document.querySelectorAll(sel)].slice(0, 40);
        const els = [...pick("button, a[class*=btn], [class*=button]"), ...pick("h1, h2"), document.body];
        const out = { colors: {}, fonts: {}, logos: [] };
        for (const el of els) {
          const cs = getComputedStyle(el);
          for (const c of [cs.backgroundColor, cs.color]) if (c && !c.includes("0, 0, 0, 0")) out.colors[c] = (out.colors[c] || 0) + 1;
          const f = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(); if (f) out.fonts[f] = (out.fonts[f] || 0) + 1;
        }
        for (const el of pick("img[alt*=logo i], img[src*=logo i], header svg, [class*=logo] svg, [class*=logo] img"))
          out.logos.push(el.tagName === "IMG" ? el.currentSrc : "data:image/svg+xml;utf8," + encodeURIComponent(el.outerHTML));
        return out;
      });
      Object.entries(sig.colors).forEach(([c, n]) => palette.set(c, (palette.get(c) || 0) + n));
      Object.entries(sig.fonts).forEach(([f, n]) => fonts.set(f, (fonts.get(f) || 0) + n));
      for (const [j, src] of sig.logos.slice(0, 4).entries()) {
        try {
          const ext = src.startsWith("data:image/svg") ? "svg" : (src.split("?")[0].split(".").pop() || "png").slice(0, 4);
          const buf = src.startsWith("data:") ? Buffer.from(decodeURIComponent(src.split(",")[1])) : Buffer.from(await (await page.request.get(src)).body());
          writeFileSync(join(logos, `${slug}_${j}.${ext}`), buf);
        } catch (e) { console.error("logo:", e.message); }
      }
    }
    await page.close();
  }
}
await browser.close();

const hex = (rgb) => { const m = rgb.match(/\d+/g); return m ? "#" + m.slice(0, 3).map((v) => (+v).toString(16).padStart(2, "0")).join("").toUpperCase() : rgb; };
const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const md = `# Asset inventory (collected ${new Date().toISOString().slice(0, 10)})

## Screenshots (\`assets/shots/\`) — real UI, crop these, never redraw
| File | Viewport | URL |
|---|---|---|
${rows.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} |`).join("\n")}

## Colours (computed from buttons / headings / body, most frequent first)
| Hex | Hits |
|---|---|
${top(palette, 10).map(([c, n]) => `| ${hex(c)} | ${n} |`).join("\n")}

## Fonts in use
${top(fonts, 6).map(([f, n]) => `- ${f} (${n})`).join("\n")}

## Logo candidates (\`assets/logo/\`)
Check each file; keep the real one, delete the rest. If none is real, state that a typographic wordmark will be used.
`;
writeFileSync(join(outDir, "assets/ASSETS.md"), md);
console.log(md);
