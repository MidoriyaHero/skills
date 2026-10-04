---
name: short-motion-video
description: Builds a 20-second showreel-style motion graphics video for a product in Remotion — kinetic-type hook, real UI assembling from screenshot slices, three cursor-driven feature moments, one proof number — with code-synthesized 120 BPM music and beat-locked SFX, rendered to 9:16, 1:1 and 16:9 from one timeline with parallel workers. Use when the user asks for a short product video, showreel, teaser, promo, Reel/Short, or invokes /short-motion-video.
disable-model-invocation: true
---

# Short Motion Video (20 s product showreel)

Produces the video described in [reference/brief.md](reference/brief.md) for any product. The
Remotion project in `template/` already implements the motion craft; per product you collect
real assets, fill one file (`src/brief.ts`), review a contact sheet, then render.

Read `/Users/admin/.cursor/skills/remotion-motion-graphics/SKILL.md` first — its rules
(no linear easing, staggered multi-property entrances, five-layer stack, verify frames) apply
to every change you make in the template.

## Inputs to confirm before starting

Check the user's message against this list. Anything missing is asked **before any work starts**,
in one AskQuestion form (one question per gap, with proposed defaults as the first option).
Never fill a gap with an assumption — not the path, not the format, not the brand.

| # | Input | If not provided |
|---|---|---|
| 1 | **Product name**, **hero word** (last word of the wordmark gets the hero colour), **tagline** | Ask; propose a tagline from the product description. |
| 2 | **Real UI source**: site URL(s) to screenshot, or recordings / screenshots to crop from | Ask for a URL or files. Never redraw UI; if nothing real exists, say so and stop. |
| 3 | **Logo** file (SVG/PNG) and **brand colours / font** | Ask whether a logo exists; offer "none — use a typographic wordmark" as the fallback. Colours/fonts can be extracted from the site, so only ask when there is no site. |
| 4 | **Hook** (exactly five words) | Propose 2–3 options from the problem the product solves; user picks or writes one. |
| 5 | **Three features**, each with the real control the cursor acts on | Propose three from the UI you can see; confirm. |
| 6 | **Proof number** + label (e.g. "80% less MLOps effort") and the metrics shot that backs it | Ask — never invent a number. If the real metric is weak, say so and ask which real evidence to show. |
| 7 | **Output format(s)**: 9:16 (Portrait), 1:1 (Square), 16:9 (Landscape), or all three | Ask (allow multiple). Default option: all three, Portrait first. Only the chosen compositions are contact-sheeted and rendered. |
| 8 | **Output directory** | Ask; never assume a path. Assets, the Remotion project and renders all go under it (`<outDir>/assets`, `<outDir>/video`, `<outDir>/video/out`). |

Ask only for what is missing; do not re-ask what the user already stated.

## Workflow

```
- [ ] 1. Collect real assets, write ASSETS.md, SHOW THE LIST and stop for confirmation
- [ ] 2. Instantiate template, fill src/brief.ts, generate audio
- [ ] 3. Contact sheet (one still per beat) → SHOW IT and stop for approval
- [ ] 4. Parallel render of the chosen formats → verify frames + audio from the finished files
```

### 1. Assets (gate: list before animating)

```bash
mkdir -p <outDir> && cd <outDir> && npm init -y >/dev/null && npm i playwright
node ~/.cursor/skills/short-motion-video/scripts/collect_assets.mjs <outDir> <url> [url...]
```
Writes `assets/shots/*.png` (1920×1080, 1080×1920, 1080×1080 per URL), `assets/logo/*`,
and `assets/ASSETS.md` (colours and fonts computed from the live DOM). Playwright browsers
are usually cached at `~/Library/Caches/ms-playwright`; otherwise `npx playwright install chromium`.

If the site is not capturable: extract full-res frames from recordings with
`ffmpeg -ss <t> -i clip.mp4 -frames:v 1 shot.png`, sample colours with
`ffmpeg -i shot.png -vf "crop=6:6:X:Y,scale=1:1" -f rawvideo -pix_fmt rgb24 - | xxd -p`,
and write the same `ASSETS.md` by hand. Record what was unreachable and why.

Present the inventory (files, what each shows, colours, fonts, logo or "none — wordmark")
and wait for the user before animating.

### 2. Project

```bash
cp -R ~/.cursor/skills/short-motion-video/template/. <outDir>/video && cd <outDir>/video
cp -R ~/.cursor/skills/short-motion-video/scripts . && npm install
cp ../assets/shots/<chosen>.png public/shots/        # only the shots you will use
node src/audio/gen.mjs                                # music.wav + whoosh/click/tick/thump/shimmer
```

Edit **only** `src/brief.ts`:
- `SHOTS`: id → `[sourceWidth, sourceHeight]` for every file in `public/shots/`.
- `hook` (5 words), `hookHero`, `hookBackdrop`.
- `assemble.shot/crops`: the screenshot that builds itself from slices.
- `features[3]`: `shot`, `crops.{land,port}` (source px; keep `land` ≈16:10, `port` ≈1:1),
  `target` = a real control's centre in source px (the cursor clicks it), `targetSize` = that control's size in source px (the click ring hugs it), optional `typed` and `zoomOrigin` (anchor the Ken Burns zoom so an edge-hugging control stays in frame).
- `proof`: `number`, `suffix`, `label`, metrics `shot` + `crop`, `footnote`.

Brand colours live in `src/theme.ts` (`primary` = hero, one element per frame; `accent`).
Replace them with the real brand colours from `ASSETS.md`. Fonts load via
`@remotion/google-fonts` in `theme.ts`; swap the import if the brand uses another family.
To change music feel, edit the `bars`/`chords` arrays in `src/audio/gen.mjs` and re-run it.

### 3. Contact sheet (gate: show before full render)

```bash
npx tsc --noEmit && npx remotion compositions src/index.ts
bash scripts/contact_sheet.sh Portrait              # one still per beat, parallel, tiled (first chosen format)
bash scripts/contact_sheet.sh Landscape 262 520     # spot-check the other chosen formats
```
Inspect every tile. Fix overflow (hook words wider than the frame → lower `size` in
`scenes/Hook.tsx`), crops that miss the control (`target`/`crops`), empty-looking shots
(tighten the crop). Re-run until clean, then show the sheet and wait for approval.

### 4. Render and verify

```bash
bash scripts/render_all.sh <name> Portrait Square Landscape   # only the formats the user chose, in parallel
ffmpeg -i out/<name>-Portrait.mp4 -af volumedetect -f null - 2>&1 | grep max_volume
ffmpeg -v error -ss 3.4 -i out/<name>-Portrait.mp4 -frames:v 1 check.jpg   # mid-animation frames
```
Workers per process = CPUs / formats; with no composition args the script renders all three. Extract 6–8 frames from the finished MP4s (not stills),
look at them, and only then deliver. Report: files, durations, what was real vs. placeholder,
music attribution if any.

## Timeline (fixed, frames at 30 fps, 120 BPM = 15 frames/beat)

| Beat | Frames | Scene | Sound |
|---|---|---|---|
| Hook | 0–90 | 5 words, one per beat, over blurred real backdrop | thump on word 1 and the hero word, whoosh others |
| Assemble | 90–210 | wordmark hit → 7 screenshot slices fly in (4-frame stagger) | thump, tick per slice |
| Feature ×3 | 210–480 | card + pill + cursor travels, clicks a real control at frame +36 | whoosh in, click on click, ticks while typing |
| Proof | 480–570 | counter over the real metrics strip | riser (in music) → impact, counter ticks |
| Outro | 570–600 | wordmark + tagline | shimmer |

Change the grid only in `src/theme.ts` (`T`); every scene and SFX derives from it.

## Files

- `template/` — Remotion project (`src/brief.ts` is the per-product file; `theme.ts` brand; `scenes/`, `components/`, `audio/gen.mjs`).
- `scripts/collect_assets.mjs` — Playwright capture + colour/font extraction → `ASSETS.md`.
- `scripts/contact_sheet.sh` — parallel per-beat stills tiled into one image.
- `scripts/render_all.sh` — parallel multi-format render with per-process worker pools.
- `reference/brief.md` — the original brief, verbatim.
