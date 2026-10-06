# Beat script

Write `<outDir>/script.md` after `ASSETS.md` is accepted. One row per beat. 30 fps.

```markdown
# <Title>

Format: short | long
Voiceover: no | yes

| beat | on-screen text | image id | frames | sfx |
|---|---|---|---|---|
| hook | Seven words here | hook | 0–120 | thump |
| fact-1 | The claim, short | fact-1 | 120–240 | whoosh |
```

Rules:

- On-screen text is at most 8 words. It adds the point; it does not describe the photo.
- `image id` must match an `id` in `ASSETS.md`. No beat without an image.
- Frames are contiguous. The last frame is the composition length.
- SFX is one of: `thump`, `whoosh`, `tick`, `click`, `shimmer`. The music bed covers the rest.

## Fact shape

hook → 3–5 facts → payoff.

- Hook: the surprising claim, no preamble.
- Each fact: one sourced sentence, one image.
- Payoff: the consequence or the number that makes the hook land. Do not add a fact that is not in the source article.

## Discussion shape

question → 3–4 comments → verdict.

- Question: the post title, trimmed to 8 words if needed. The full title can sit in a second line only on `long`.
- Each comment: the comment's actual point, paraphrased into ≤ 8 words, over that comment's screenshot. Do not invent a take the comment did not make.
- Verdict: what the top comments agree on, or the split (two sides). Label it as the cut's read, not as the thread's official answer.

## Frame budget

| Format | Total | Hook | Each middle beat | Last beat |
|---|---|---|---|---|
| short (30–60 s) | 900–1800 | 90–120 | 90–150 | 90–120 |
| long (3–10 min) | 5400–18000 | 150–210 | 180–300 | 150–240 |

Short: 6–10 beats. One image every 3–5 s. Long: a chapter card (type only, still over the previous image darkened) whenever the subject changes; one image every 6–10 s.

## Voiceover

Default is no voiceover. If the user said yes, expand each beat's on-screen text into one spoken line under the table, then read `script-to-teleprompter` for the recording copy. The on-screen line stays ≤ 8 words either way.
