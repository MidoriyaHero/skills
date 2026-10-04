// Sting.tsx — 5 s logo sting: wordmark hit → tagline → breathe → exit. Music is cut to 5 s
// (LEN=5 node src/audio/gen.mjs) so the final impact lands on the wordmark.
import React from "react";
import { AbsoluteFill } from "remotion";
import { bar, theme } from "../theme";
import { Beat, Finish } from "../components/Timeline";
import { Outro } from "../scenes/Proof";

export const STING_FRAMES = bar(2.5);

export const Sting: React.FC = () => (
  <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
    <Beat range={[0, STING_FRAMES]}><Outro /></Beat>
    <Finish hits={[{ at: 0, file: "thump", volume: 1 }, { at: 8, file: "shimmer", volume: 0.7 }]} music={0.6} />
  </AbsoluteFill>
);
