// theme.ts — single source of truth: palette (sampled from the real UI + brand), type,
// easings, springs and the beat grid. Never inline these in components.
import { Easing, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Nunito";

const nunito = loadFont("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });

export const theme = {
  colors: {
    bg: "#0B0F14",
    bgAlt: "#131B26",
    primary: "#FF8A1F",      // hero — one element per frame
    accent: "#22D3EE",
    roboflow: "#8457D5",     // sampled from the real Roboflow UI
    text: "#F5F7FA",
    textDim: "#9AA4B2",
    glow: "rgba(255, 138, 31, 0.45)",
    panel: "rgba(11, 15, 20, 0.72)",
  },
  fonts: { display: nunito.fontFamily, body: nunito.fontFamily },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    heavy: { damping: 18, stiffness: 60, mass: 1.4 },
  },
  fps: 30,
  bpm: 120,
} as const;

/** Frames per beat at 120 BPM / 30 fps = 15. All timing derives from this. */
export const BEAT = Math.round((theme.fps * 60) / theme.bpm);
export const bar = (n: number) => n * BEAT * 4;
export const beat = (n: number) => n * BEAT;

/** Beat grid of the 20 s timeline (frames). */
export const T = {
  hook: [0, bar(1.5)],                 // 0–90
  assemble: [bar(1.5), bar(3.5)],      // 90–210
  f1: [bar(3.5), bar(5)],              // 210–300
  f2: [bar(5), bar(6.5)],              // 300–390
  f3: [bar(6.5), bar(8)],              // 390–480
  proof: [bar(8), bar(9.5)],           // 480–570
  outro: [bar(9.5), bar(10)],          // 570–600
  total: bar(10),
} as const;

/** Format-aware layout: everything scales from the short side; portrait stacks vertically. */
export const useLayout = () => {
  const { width: w, height: h } = useVideoConfig();
  const s = Math.min(w, h) / 1080;
  return { w, h, s, portrait: h > w, square: h === w, landscape: w > h, pad: 72 * s };
};
