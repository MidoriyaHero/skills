// brief.ts — THE ONLY FILE TO EDIT PER PRODUCT. Every scene and recipe reads from here.
// Shots are real screenshots in public/shots/<id>.png; clips are real footage in public/clips/.
// Crops, targets and sizes are in SOURCE pixels. Sections you do not use may keep the sample values.
import type { Crop } from "./components/Shot";
import type { Step } from "./scenes/Flow";
import type { ClipSpec } from "./scenes/Clip";

export type Crops = { land: Crop; port: Crop };

export const SHOTS: Record<string, [number, number]> = {
  // id: [sourceWidth, sourceHeight]
  rf_3: [1920, 1080], rf_30: [1920, 1080], rf_48_5: [1920, 1080], rf_62: [1920, 1080], v1_200: [1280, 720],
};

export const brief = {
  product: "SiteSense Autopilot",
  heroWord: "Autopilot",                      // last word of the wordmark, painted in hero colour
  tagline: "Describe the hazard. Get a deployed detector.",

  // Showreel beat 1 — five words, one per beat; `hookHero` gets the hero colour.
  hook: ["Weeks", "of", "labeling.", "Zero", "detectors."],
  hookHero: "Zero",
  hookBackdrop: "v1_200",

  // Showreel beat 2 — the UI that assembles itself from slices of a real screenshot.
  assemble: {
    shot: "rf_30",
    crops: { land: { x: 380, y: 60, w: 1160, h: 760 }, port: { x: 400, y: 60, w: 760, h: 820 } } as Crops,
    line: "An agent that labels, trains and evaluates",
    lineEmphasis: "for you.",
  },

  // Showreel beat 3 / Teaser / Explainer — UI moments; `target` + `targetSize` are a real control.
  features: [
    { shot: "rf_3", pill: "1 · Say what you need", line: "One sentence → classes, prompts, cost estimate.",
      crops: { land: { x: 380, y: 20, w: 1180, h: 700 }, port: { x: 400, y: 20, w: 640, h: 640 } } as Crops,
      target: { x: 961, y: 122 }, targetSize: { w: 1116, h: 132 }, typed: "/label ppe", zoomTo: 1.06 },
    { shot: "rf_62", pill: "2 · You approve the labels", line: "Review in Roboflow, say “keep going”.",
      crops: { land: { x: 230, y: 0, w: 1690, h: 1000 }, port: { x: 740, y: 0, w: 960, h: 1000 } } as Crops,
      target: { x: 1570, y: 370 }, targetSize: { w: 250, h: 48 }, zoomTo: 1.1 },
    { shot: "rf_48_5", pill: "3 · It trains, evaluates, retrains", line: "Weak score? It tunes and goes again — overnight.",
      crops: { land: { x: 230, y: 0, w: 1690, h: 1000 }, port: { x: 820, y: 0, w: 1100, h: 1100 } } as Crops,
      target: { x: 1800, y: 93 }, targetSize: { w: 215, h: 46 }, zoomTo: 1.1, zoomOrigin: "100% 20%" },
  ],

  // Proof — the number (or a short `display` string that replaces the counter).
  proof: {
    number: 80, suffix: "%", display: "",
    label: "less MLOps effort",
    shot: "rf_48_5", crop: { x: 560, y: 380, w: 1200, h: 360 } as Crop,
    footnote: "labeling · training · evaluation · retraining — handled",
  },

  // Teaser / Explainer opening — one kinetic headline (any length), one hero word, optional sub-line.
  statement: { text: "Your site. Watched. Understood.", hero: "Understood.", sub: "Detectors trained while you sleep.", backdrop: "v1_200" },

  // Explainer — the pipeline, in order. `detail` shows while the step is active.
  flow: {
    title: "How it works",
    steps: [
      { label: "Describe", detail: "One sentence: what to detect" },
      { label: "Label", detail: "SAM3 auto-labels, you approve" },
      { label: "Train", detail: "Ray cluster, overnight" },
      { label: "Evaluate", detail: "mAP gate — retrain if weak" },
      { label: "Deploy", detail: "Roboflow model, live" },
    ] as Step[],
  },

  // Enhance — real footage segments (public/clips/<file>), `seconds` on screen each.
  clips: [
    { file: "demo.mp4", from: 12, seconds: 6, caption: "Describe the hazard in one sentence", badge: "1 · Ask" },
    { file: "demo.mp4", from: 40, seconds: 6, caption: "The agent labels and trains", badge: "2 · Train" },
  ] as (ClipSpec & { seconds: number })[],
};
