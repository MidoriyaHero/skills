---
name: gen-motion-video
description: Generates motion-graphics videos in Remotion from real product assets — 20 s showreel, 12 s teaser, how-it-works explainer with an animated pipeline, 5 s logo sting, or an enhancement of the user's own footage (grade, captions, intro/outro, music) — in 9:16, 1:1 and 16:9 from one brief, with code-synthesized music and beat-locked SFX and a mandatory frame-verification loop. Use when the user asks for a product video, demo video, promo, reel, short, teaser, explainer, logo sting, showreel, or to make existing footage look better, or invokes /gen-motion-video.
disable-model-invocation: true
---

# Gen Motion Video

One Remotion template (`template/`), one per-product file (`src/brief.ts`), five recipes, three
formats. The craft rules in [reference/craft.md](reference/craft.md) are mandatory for every scene
you touch; the recipe table in [reference/recipes.md](reference/recipes.md) decides what to build.

## 1. Intake — ask before any work starts

Compare the request against this list. Everything missing goes into **one** AskQuestion form
(one question per gap, proposed default as the first option). Never fill a gap with an assumption.

| # | Input | If not provided |
|---|---|---|
| 1 | **Video type**: Showreel 20 s · Teaser 12 s · Explainer ~25 s · Sting 5 s · Enhance (their footage) · other length | Ask; recommend from the request (see recipes.md "When to pick it"). |
| 2 | **Output format(s)**: 9:16 Portrait · 1:1 Square · 16:9 Landscape | Ask (multi-select). Default: all three, Portrait first. Only chosen compositions are sheeted and rendered. |
| 3 | **Output directory** | Ask; never assume. Everything goes under `<outDir>/assets`, `<outDir>/video`, `<outDir>/video/out`. |
| 4 | **Product name**, hero word (last word of the wordmark), tagline | Ask; propose a tagline. |
| 5 | **Real UI source**: site URL(s), or recordings/screenshots | Ask. Never redraw UI; if nothing real exists, say so and stop. |
| 6 | **Logo**, brand colours, font | Ask whether a logo exists; fallback "none — typographic wordmark". Colours/fonts are extracted from a site when there is one. |
| 7 | **Copy**: hook (5 words, Showreel) or statement (Teaser/Explainer/Enhance), feature lines, flow steps | Propose 2–3 options; user picks or writes. |
| 8 | **Proof number** + label + the shot that backs it | Ask — never invent a number. If the real metric is weak, say so and ask what real evidence to show. |
| 9 | **Footage** (Enhance): file, which segments, keep original audio or not | Ask for the file and the moments to keep. |

Ask only for what is missing; do not re-ask what the user already said.

## 2. Workflow

```
- [ ] 1. Assets: real frames/screenshots, colours, ASSETS.md → SHOW the list, wait
- [ ] 2. Project: copy template, fill src/brief.ts + theme colours, generate audio to the recipe length
- [ ] 3. Contact sheet per chosen format → SHOW it, wait for approval
- [ ] 4. Parallel render → verify frames + audio from the finished MP4s → deliver
```

### 2.1 Assets (gate)

Site available:
```bash
mkdir -p <outDir> && cd <outDir> && npm init -y >/dev/null && npm i playwright
node ~/.cursor/skills/gen-motion-video/scripts/collect_assets.mjs <outDir> <url> [url...]
```
No site (login, localhost, recordings only): extract full-res frames and measure controls.
```bash
ffmpeg -ss <t> -i clip.mp4 -frames:v 1 shot.png                      # one real frame
tesseract shot.png stdout --psm 6 tsv | awk -F'\t' '$12 ~ /Create|Save/ {print $7,$8,$9,$10,$12}'   # control boxes
ffmpeg -i shot.png -vf "drawbox=X:Y:W:H:red@0.8:t=4,crop=800:400:X-300:Y-150" check.png   # confirm visually
ffmpeg -i shot.png -vf "crop=4:4:X:Y,scale=1:1" -f rawvideo -pix_fmt rgb24 - | xxd -p      # brand colour
```
Write `assets/ASSETS.md`: file → what it shows, source + timestamp, colours, font, logo or "none",
what was unreachable. Show it and wait.

### 2.2 Project

```bash
cp -R ~/.cursor/skills/gen-motion-video/template/. <outDir>/video && cd <outDir>/video
cp -R ~/.cursor/skills/gen-motion-video/scripts . && npm install
cp ../assets/<chosen>.png public/shots/          # screenshots; footage goes to public/clips/
LEN=20 node src/audio/gen.mjs                     # 20 Showreel · 12 Teaser · 5 Sting · Explainer/Enhance: see compositions list
```
Edit **only** `src/brief.ts` (sections per recipe are listed in recipes.md) and the colours in
`src/theme.ts` (`primary` = hero, `glow` = its rgba, `accent`). Rules for `brief.ts`:
- `SHOTS`: id → `[sourceWidth, sourceHeight]` for every PNG in `public/shots/`.
- `features[i].target` = centre of a real control in source px; `targetSize` = its real size (the
  click ring hugs it); `zoomOrigin` (e.g. `"100% 20%"`) when the control is near an edge.
- `crops.land` ≈ 16:10, `crops.port` ≈ 1:1, both containing the target.
- `proof.display` (short string) replaces the counter when the proof is not a number.
- `flow.steps` ≤ 6 (row in landscape, column in portrait); `clips[]` from real footage with `seconds`.

Then `npx tsc --noEmit && npx remotion compositions src/index.ts` — read the duration of the chosen
recipe and regenerate audio with that `LEN` if it differs from the default.

### 2.3 Contact sheet (gate)

```bash
bash scripts/contact_sheet.sh <Recipe>-<Format> <frames…>     # frames per recipe in recipes.md
```
Inspect every tile: overflow → lower `size` in the scene; ring off the control → fix `target`/`crops`;
empty shot → tighten the crop. Re-run until clean, show the sheet, wait.

### 2.4 Render and verify

```bash
bash scripts/render_all.sh <name> <Recipe>-Portrait <Recipe>-Landscape     # chosen formats, parallel
ffmpeg -i out/<name>-<Recipe>-Portrait.mp4 -af volumedetect -f null - 2>&1 | grep max_volume
ffmpeg -v error -ss <t> -i out/<name>-<Recipe>-Portrait.mp4 -frames:v 1 check.jpg
```
Extract 5–8 frames from the finished MP4s (click moments, proof, outro), look at them, fix, re-render.
Deliver: file paths, durations, what was real vs. stated (e.g. a proof number given by the user),
anything that could not be sourced.

## 3. Building a new recipe or scene

When no recipe fits (different length, extra beat): copy the closest file in `src/recipes/`, change
the `seq([...])`/`bar()` lengths, swap scenes, register it in `Root.tsx` (`RECIPES`), and regenerate
music. New scenes compose `Entrance`/`WordReveal`/`Pill`/`Shot`/`Cursor`/`Flow`/`Clip`; for
parallax, transitions, motion blur or word-synced captions copy the pattern from
[reference/motion-patterns.md](reference/motion-patterns.md). Palettes, type sizes, pacing and the
pre-delivery checklist are in [reference/design-rules.md](reference/design-rules.md).

## Files

- `template/` — Remotion project. `src/brief.ts` (per product), `src/theme.ts` (brand + BEAT grid),
  `src/recipes/{Showreel,Teaser,Explainer,Sting,Enhance}.tsx`, `src/scenes/`, `src/components/`,
  `src/audio/gen.mjs` (`LEN`/`BPM` env), `src/Root.tsx` (recipes × formats).
- `scripts/collect_assets.mjs` — Playwright capture + colour/font extraction → `ASSETS.md`.
- `scripts/contact_sheet.sh` — parallel per-beat stills tiled into one image.
- `scripts/render_all.sh` — parallel multi-composition render, workers split by CPU.
- `reference/craft.md` — rules, verification loop, failure modes. `reference/recipes.md` — recipe
  table, scenes, sound, sheet frames. `reference/design-rules.md`, `reference/motion-patterns.md` —
  design system and copy-paste patterns. `reference/brief-showreel.md` — the original showreel brief.
