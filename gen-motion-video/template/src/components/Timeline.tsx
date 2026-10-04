// Timeline.tsx — beat-grid helpers shared by every recipe: a Sequence per beat range,
// SFX that land 3 frames early, the music bed, and the top-of-stack grade layers.
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { Grade, Grain, Vignette } from "./Layers";

export type Range = readonly [number, number];
export type Hit = { at: number; file: "whoosh" | "click" | "thump" | "tick" | "shimmer"; volume?: number };

/** Mount `children` only inside the frame range. */
export const Beat: React.FC<{ range: Range; children: React.ReactNode }> = ({ range, children }) => (
  <Sequence from={range[0]} durationInFrames={range[1] - range[0]}>{children}</Sequence>
);

/** SFX land 2–3 frames before the visual so they read as synced. */
export const Sfx: React.FC<Hit> = ({ at, file, volume = 0.7 }) => (
  <Sequence from={Math.max(0, at - 3)}><Audio src={staticFile(`sfx/${file}.wav`)} volume={volume} /></Sequence>
);

/** Grade + grain + vignette on top, then the music bed and every SFX hit. */
export const Finish: React.FC<{ hits: Hit[]; music?: number }> = ({ hits, music = 0.9 }) => (
  <>
    <Grade />
    <Grain />
    <Vignette />
    <Audio src={staticFile("sfx/music.wav")} volume={music} />
    {hits.map((h, i) => <Sfx key={i} {...h} />)}
  </>
);
