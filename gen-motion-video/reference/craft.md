# Motion craft — non-negotiables, verification, failure modes

Remotion renders React frame-by-frame. Code is not the bottleneck; motion design craft is.
Untrained output = linear easing, opacity-only fades, simultaneous entrances, flat colour, no
texture — the "generic AI video" look. Every rule below exists to prevent it. The template already
obeys them; keep obeying them in every scene you add or change.

## Rules

1. **Never linear.** Every `interpolate()` has an easing and `extrapolateLeft/Right: "clamp"`; entrances use `spring()`.
2. **Entrances move 2–3 properties** (opacity + translate + scale). A lone fade is forbidden.
3. **Stagger everything** — words, cards, slices, steps: 3–6 frame offsets. Nothing enters simultaneously.
4. **Exits exist and are faster than entrances** (~8–10 frames vs ~20). Use `useExit(n)`.
5. **Five-layer stack in every scene**: `BgMesh` → assets → type/graphics → `Grade` → `Grain` + `Vignette`
   (`Finish` adds the top three). Never a flat solid background.
6. **Every still gets Ken Burns** (`Shot` zoomTo 1.04–1.14, `zoomOrigin` to keep edge controls in frame).
   Footage uses `<OffthreadVideo>`, never `<Video>`.
7. **Idle elements breathe** (`1 + Math.sin(frame/20) * 0.01`) when on screen > 2 s.
8. **All timing derives from `BEAT`/`fps`** (`theme.ts`). No magic frame numbers in scenes.
9. **One theme object.** Colours, easings, springs, fonts live in `theme.ts`; never inline a hex or easing.
   Hero colour on at most one element per frame; glow only on that element.
10. **Real UI only.** Screenshots and footage are cropped, never redrawn. Click targets are measured in
    source pixels on the actual frame (`target`, `targetSize`) — the ring must hug the real control.
11. **Numbers are real.** Never invent a metric. If the real one is weak, say so and ask.
12. **Sound is half the quality.** Music bed + SFX 3 frames before each hit, cuts on beat. Never silent unless asked.
13. **Render → extract frames → look → fix → re-render.** Never deliver an unverified file.

## Rhythm
HIT → hold (15–20 still frames) → build → HIT. Something moves in the first 15 frames. New visual
element at least every 90 frames. Holds are a design tool; constant motion reads amateur.
9:16 safe zone: critical text inside the middle ~75 % vertically.

## Verification loop (mandatory)

```bash
npx tsc --noEmit && npx remotion compositions src/index.ts
bash scripts/contact_sheet.sh <Comp> <frames…>        # stills, one per beat → look at every tile
bash scripts/render_all.sh <name> <Comp…>              # parallel render
ffmpeg -i out/<name>-<Comp>.mp4 -af volumedetect -f null - 2>&1 | grep max_volume   # expect ≈ -2 dB
ffmpeg -v error -ss <t> -i out/<name>-<Comp>.mp4 -frames:v 1 check.jpg               # from the MP4, mid-animation
```
Look for, in order of frequency: text overflowing/touching edges (lower `size`), click ring off the
control (`target`/`targetSize`/`crops`, verify with `drawbox` on the source frame), element visible
before entrance or after exit (missing clamp), `em` gaps around big type (use px), hero colour on
two elements, dim text unreadable over the grade, layer order (grain/vignette must be topmost),
empty-looking shots (tighten the crop). Fix → re-render → re-inspect. Deliver only after a clean pass,
then run the checklist at the end of [design-rules.md](design-rules.md).

## Failure modes to avoid
- Emoji as icons (platform glyphs break the palette). Draw glyphs with CSS/SVG in theme colours.
- Shipping silent because there are no SFX files — `src/audio/gen.mjs` synthesizes the whole kit.
- One giant component instead of themed scenes composed from shared components.
- `durationInFrames` that does not match the content (dead air at the end).
- Forgetting `--overwrite`, then inspecting the stale render.
- System default font on hero text — fonts load via `@remotion/google-fonts` in `theme.ts`.
- Describing the result instead of rendering and verifying it.
- Read tool caching: when re-viewing an image at the same path, copy it to a new filename first.

## Chromium
Remotion needs Chromium. If auto-download fails: `which chromium google-chrome`, or Playwright's
`~/Library/Caches/ms-playwright/chromium*/`, then `npx remotion render … --browser-executable=<path>`.
If full Chrome errors with "Old Headless mode has been removed", use a `headless_shell` binary.
