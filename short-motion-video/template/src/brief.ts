// brief.ts — THE ONLY FILE TO EDIT PER PRODUCT. Every scene reads from here.
// Shots are real screenshots in public/shots/<id>.png; crops are in source pixels.
import type { Crop } from "./components/Shot";

export type Crops = { land: Crop; port: Crop };

export const SHOTS: Record<string, [number, number]> = {
  // id: [sourceWidth, sourceHeight]
  rf_3: [1920, 1080], rf_30: [1920, 1080], rf_48_5: [1920, 1080], rf_62: [1920, 1080], v1_200: [1280, 720],
};

export const brief = {
  product: "SiteSense Autopilot",
  heroWord: "Autopilot",                      // last word of the wordmark, painted in hero colour
  tagline: "Describe the hazard. Get a deployed detector.",

  // Beat 1 — five words, one per beat; `hookHero` gets the hero colour.
  hook: ["Weeks", "of", "labeling.", "Zero", "detectors."],
  hookHero: "Zero",
  hookBackdrop: "v1_200",

  // Beat 2 — the UI that assembles itself from slices of a real screenshot.
  assemble: {
    shot: "rf_30",
    crops: { land: { x: 380, y: 60, w: 1160, h: 760 }, port: { x: 400, y: 60, w: 760, h: 820 } } as Crops,
    line: "An agent that labels, trains and evaluates",
    lineEmphasis: "for you.",
  },

  // Beat 3 — three UI moments; `target` is a real control in source pixels.
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

  // Beat 4 — the number.
  proof: {
    number: 80, suffix: "%", display: "",   // non-empty replaces the counter (e.g. "Every day")
    label: "less MLOps effort",
    shot: "rf_48_5", crop: { x: 560, y: 380, w: 1200, h: 360 } as Crop,
    footnote: "labeling · training · evaluation · retraining — handled",
  },
};
