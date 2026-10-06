# Sourcing real images

Every picture in the video is a file you downloaded or a screenshot you captured. Record it before it is used.

## Fact topics

1. Open the Wikipedia article. Use only images that appear on the article or that the article cites.
2. Open the file page on Wikimedia Commons. Read the license block, not the thumbnail caption.
3. Accept only: CC-BY, CC-BY-SA, CC0, or public domain. Reject NC, ND, "fair use", and "all rights reserved".
4. Download the original file, not the preview. Prefer a width of at least 1280 px.
5. If the article has fewer than four usable images, search Commons for the subject and apply the same license rule. Do not leave Wikipedia for a random image host.

Attribution line, one per file:

```
Photo: <Author> / <Source page title>, <License>, <file page URL>
```

Public domain: `Photo: <Author or "unknown">, public domain, <file page URL>`.

## Discussion topics

Use the `playwright` skill. Capture the real thread, do not retype it into a fake UI.

1. Open the thread URL (old.reddit.com is easier to crop).
2. Screenshot the post title and body.
3. Screenshot 3–4 top-level comments, highest score first. Skip deleted, removed, and bot comments.
4. Crop so usernames, avatars, and vote arrows are outside the frame. Keep the comment text and the score if it is part of the point.
5. One PNG per comment, named `comment-1.png` … in rank order. The post is `post.png`.

These screenshots are fair-use excerpts of a public thread, not Commons files. Still record the thread URL. Do not add a face, a meme, or a generated stand-in when a comment has no image — the frame is the cropped text plus typography.

## ASSETS.md

Write `<outDir>/assets/ASSETS.md` in this shape:

```markdown
# Assets

Topic: <one line>
Kind: fact | discussion
Source: <article or thread URL>

| id | file | shows | license | attribution |
|---|---|---|---|---|
| hook | assets/hook.jpg | <what is in the frame> | CC-BY-SA 4.0 | Photo: … |
| fact-1 | assets/fact-1.jpg | … | public domain | Photo: … |
```

`id` is what the beat table references. `file` is the path relative to `<outDir>`. If a row has no license you can name, delete the file.

## Gate

Show the table to the user. Wait. Do not copy files into `public/images/` until they accept the list.
