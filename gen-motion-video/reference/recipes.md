# Recipes — which video to build, and what each one needs

All recipes live in `template/src/recipes/`, read one `src/brief.ts`, share the components in
`src/components/` and `src/scenes/`, and render to any format (`<Recipe>-<Portrait|Square|Landscape>`).
Timing derives from `BEAT` (fps·60/BPM) in `theme.ts`; never hard-code frame numbers in a scene.

| Recipe | Length | When to pick it | Story (scenes in order) | brief.ts sections used |
|---|---|---|---|---|
| **Showreel** | 20 s | Launch / social reel for a product with a UI; the original brief ([brief-showreel.md](brief-showreel.md)) | Hook (5 words) → Assemble (UI builds from slices) → Feature ×3 (cursor clicks real controls) → Proof → Outro | hook, assemble, features[3], proof |
| **Teaser** | 12 s | One feature or announcement; Reels/Shorts/LinkedIn | Statement → Feature[0] → Proof → Outro | statement, features[0], proof |
| **Explainer** | 23–30 s | "How it works": a pipeline, workflow or architecture | Statement → Flow (hero walks the steps) → Feature ×3 → Proof → Outro | statement, flow, features[3], proof |
| **Sting** | 5 s | Logo bumper for the start/end of other videos | Wordmark → tagline → breathe → exit | product, heroWord, tagline |
| **Enhance** | clip-driven | The user already has footage and wants it upgraded (grade, captions, intro/outro, music) | Statement → Clip ×N (real footage, caption, badge) → Outro | statement, clips[] |

Length that is not in the table (e.g. a 60 s cut): compose a new recipe file from the same scenes —
copy the closest recipe, change the `seq([...])` lengths, and register it in `Root.tsx`. Regenerate
music to the new length: `LEN=<seconds> node src/audio/gen.mjs` (BPM optional).

## Scenes available to every recipe

| Scene | What it does | Inputs |
|---|---|---|
| `Hook` | five words, one per beat, over a blurred real backdrop | `brief.hook*` |
| `Statement` | any-length kinetic headline, hero word, sub-line, optional backdrop | `text, hero, sub, backdrop` |
| `Assemble` | wordmark hit, then 7 slices of a real screenshot fly into place | `brief.assemble` |
| `Feature` | real screenshot card + pill + cursor travelling to and clicking a real control; ring hugs `targetSize`; optional typed text | one `brief.features[i]` |
| `Flow` | step pills with arrows; hero highlight advances one step per 2 beats, detail line per step; stacks vertically in portrait | `brief.flow` |
| `Proof` | counter (or `display` string) + label + real metrics strip + footnote | `brief.proof` |
| `Clip` | `<OffthreadVideo>` segment with Ken Burns, badge pill and caption | one `brief.clips[i]` |
| `Outro` | wordmark + tagline | product, heroWord, tagline |

Components: `Entrance`, `WordReveal`, `Pill`, `Wordmark`, `Counter`, `useExit` (Type.tsx);
`BgMesh`, `Grade`, `Grain`, `Vignette` (Layers.tsx); `Shot`/`toBox`/`scaleOf` (real screenshot crops);
`Cursor`; `Beat`, `Sfx`, `Finish` (Timeline.tsx — grade stack + music + hits in one call).
For anything not covered (parallax, transitions, motion blur, word-synced captions, spark mark), copy
the pattern from [motion-patterns.md](motion-patterns.md) into `src/components/`.

## Sound per recipe (all SFX fire 3 frames early via `Sfx`)

- Showreel: thump on word 1 and the hero word, whoosh on other words; thump + 7 ticks on assemble;
  whoosh/click/typing ticks per feature; thump + counter ticks on proof; shimmer on outro.
- Teaser: thump on word 1, whoosh per word; whoosh + click on the feature; thump + ticks; shimmer.
- Explainer: thump open; tick per step entering, click per step activation; features as above; thump; shimmer.
- Sting: thump at 0, shimmer at 8. Music at 0.6, `LEN=5`.
- Enhance: thump open, whoosh per clip, shimmer on outro. Music drops to 0.3 if any clip keeps its audio.

## Contact-sheet frames per recipe (pass to `scripts/contact_sheet.sh <Comp> <frames…>`)

Showreel `62 170 262 352 442 520 592` · Teaser `40 130 170 260 330` · Explainer `60 170 240 330 420 510 560 640` ·
Sting `20 80 140` · Enhance `30` then the middle of each clip range (intro 45 frames + Σ seconds·30).
