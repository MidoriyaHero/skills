---
name: content-video-pipeline
description: Routes a content video from topic to finished Remotion file using real photos and on-screen typography, never AI-generated images. Use when the user asks to make a video about a topic, a fact video, a Wikipedia video, a Reddit story video, a discussion video, or invokes content-video-pipeline.
---

# Content Video Pipeline

Router for topic videos. Pictures come from real sources. Type is drawn in Remotion. Do not generate images, clips, or stills with a model.

```
topic → real images → beat script → Remotion typography → frame check
```

## Intake

Ask only for gaps, in one pass. Do not invent the output directory.

| Input | If missing |
|---|---|
| Topic, or "pick one" | Propose 3 topics. User picks. |
| Kind: `fact` or `discussion` | Fact = verifiable claim. Discussion = a thread of opinions. |
| Format: `short` or `long` | Ask. Short = 9:16, 30–60 s. Long = 16:9, 3–10 min. |
| Output directory | Ask. All files go under `<outDir>/`. |
| Voiceover | Ask. Default: no — on-screen type carries the story. |

## Which skill

One skill per step. `none` means this skill's reference files are enough.

| Step | Skill |
|---|---|
| 1. Find a topic | none |
| 2a. Fact images (Wikipedia / Commons) | none — follow [reference/sourcing.md](reference/sourcing.md) |
| 2b. Discussion images (Reddit thread) | `playwright` — capture the thread, then follow sourcing.md |
| 3. Beat script | none — follow [reference/script-format.md](reference/script-format.md). If the user will record voiceover, also read `script-to-teleprompter`. |
| 4. Build | `remotion-motion-graphics` — read it before any Remotion code |
| 5. Frame check | `remotion-motion-graphics` Step 5 |

Do not use `short-motion-video` or `gen-motion-video` recipes. Those templates are for product UI, not topic videos. Copy only the music generator: `~/.cursor/skills/gen-motion-video/template/src/audio/gen.mjs`.

After the frame check, and only if needed:

| Need | Skill |
|---|---|
| Mix a recorded voiceover with the music | `audio-mixer-assistant` |
| Captions for a voiceover track | `subtitle-generator-pro` |
| YouTube thumbnail for a long video | `thumbnail-designer` |

`video-editor-ai` is for recorded footage. This pipeline does not use it.

## Forbidden

- `sora`, `GenerateImage`, or any image/video model
- Stock renders, AI faces, AI "historical" photos
- Redrawing a real photo as an illustration
- Shipping without the asset list and the frame check

On-screen type is the caption. Do not burn a second subtitle track unless there is a voiceover.

## Workflow

```
- [ ] 1. Topic
- [ ] 2. Images → ASSETS.md → SHOW the list and wait
- [ ] 3. Beat script
- [ ] 4. Remotion build
- [ ] 5. Frame check → SHOW stills and wait
```

### 1. Topic

Search, do not invent. Fact: Wikipedia "Did you know", a sourced article. Discussion: a real Reddit thread (AskReddit, todayilearned, a niche sub the user names) with a clear question and several top comments. State the URL and one sentence on why it holds attention. Stop if the claim has no source.

### 2. Images

Follow [reference/sourcing.md](reference/sourcing.md).

- Fact: article images and Wikimedia Commons files. License must be CC-BY, CC-BY-SA, or public domain. Write author, license, and source URL per file.
- Discussion: read `playwright` and screenshot the post plus 3–4 top comments. Crop usernames and avatars out of frame.

Save files under `<outDir>/assets/`. Write `<outDir>/assets/ASSETS.md`. Show the list (file, what it shows, license, attribution). Wait. Do not animate until the user accepts it.

### 3. Script

Follow [reference/script-format.md](reference/script-format.md). One beat table: beat, on-screen text (≤ 8 words), image id, frames, SFX. Fact shape: hook → 3–5 facts → payoff. Discussion shape: question → 3–4 comments → verdict. Every image id must exist in `ASSETS.md`.

### 4. Build

Read `~/.cursor/skills/remotion-motion-graphics/SKILL.md` and follow it. Copy `assets/theme.ts` from that skill into `src/theme.ts`.

```bash
mkdir -p <outDir>/video && cd <outDir>/video
npm install remotion @remotion/cli react react-dom @remotion/google-fonts
```

Layout: `src/index.ts` → `src/Root.tsx` → `src/scenes/*.tsx`. Put accepted images in `public/images/` and load them with `staticFile()`. Each still gets Ken Burns. Each line uses WordReveal or Stagger. One image per beat; type sits on the image, not instead of it.

| Format | Size | fps | Length | Image hold |
|---|---|---|---|---|
| short | 1080×1920 | 30 | 30–60 s | 3–5 s |
| long | 1920×1080 | 30 | 3–10 min | 6–10 s |

Short: keep type in the middle 75% of the frame. Long: add a chapter card when the subject changes, then run `thumbnail-designer` after the cut is approved.

Music and SFX: copy `gen.mjs` from `gen-motion-video/template/src/audio/` and set `LEN` to the composition length in seconds. No downloaded tracks.

### 5. Frame check

From `remotion-motion-graphics` Step 5, extract stills at the first frame of each beat:

```bash
npx remotion still src/index.ts <CompId> out/check_<frame>.png --frame <frame> --overwrite
```

Look at every still. Fix overflow, type touching the edge, a missing image, or type that repeats the image caption with no new information. Re-render the stills. Show them. Wait. Deliver the mp4 only after a clean pass.

Report: output path, duration, topic URL, and the attribution lines from `ASSETS.md`.
