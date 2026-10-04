// Showreel.tsx — the 20 s timeline. Beats are absolute frames on the 120 BPM grid;
// the same component renders 9:16, 1:1 and 16:9 via useLayout().
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BEAT, T, theme } from "./theme";
import { Grade, Grain, Vignette } from "./components/Layers";
import { Hook } from "./scenes/Hook";
import { Assemble } from "./scenes/Assemble";
import { CLICK_AT, FEATURES, Feature } from "./scenes/Feature";
import { Outro, Proof } from "./scenes/Proof";

const Beat: React.FC<{ range: readonly [number, number]; children: React.ReactNode }> = ({ range, children }) => (
  <Sequence from={range[0]} durationInFrames={range[1] - range[0]}>{children}</Sequence>
);

/** SFX land 2–3 frames before the visual so they read as synced. */
const Sfx: React.FC<{ at: number; file: string; volume?: number }> = ({ at, file, volume = 0.7 }) => (
  <Sequence from={Math.max(0, at - 3)}><Audio src={staticFile(`sfx/${file}.wav`)} volume={volume} /></Sequence>
);

export const Showreel: React.FC = () => {
  const sfx: { at: number; file: string; volume?: number }[] = [];
  // Hook: a whoosh per word, thumps on the first and the hero word.
  [0, 1, 2, 3, 4].forEach((i) => sfx.push({ at: i * BEAT, file: i === 0 || i === 3 ? "thump" : "whoosh", volume: 0.6 }));
  // Assemble: wordmark hit, then a tick per UI slice.
  sfx.push({ at: T.assemble[0], file: "thump", volume: 0.8 });
  for (let i = 0; i < 7; i++) sfx.push({ at: T.assemble[0] + BEAT + i * 4, file: "tick", volume: 0.5 });
  // Features: whoosh on entry, click on the cursor click, ticks while typing.
  [T.f1, T.f2, T.f3].forEach(([from], i) => {
    sfx.push({ at: from, file: "whoosh", volume: 0.6 });
    sfx.push({ at: from + CLICK_AT, file: "click", volume: 0.9 });
    if (FEATURES[i].typed) for (let c = 0; c < FEATURES[i].typed!.length; c++) sfx.push({ at: from + CLICK_AT + 6 + c * 2, file: "tick", volume: 0.35 });
  });
  // Proof: impact, counter ticks, shimmer on the outro.
  sfx.push({ at: T.proof[0], file: "thump", volume: 1 });
  for (let i = 0; i < 10; i++) sfx.push({ at: T.proof[0] + 4 + i * 3, file: "tick", volume: 0.4 });
  sfx.push({ at: T.outro[0], file: "shimmer", volume: 0.6 });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
      <Beat range={T.hook}><Hook /></Beat>
      <Beat range={T.assemble}><Assemble /></Beat>
      <Beat range={T.f1}><Feature spec={FEATURES[0]} /></Beat>
      <Beat range={T.f2}><Feature spec={FEATURES[1]} /></Beat>
      <Beat range={T.f3}><Feature spec={FEATURES[2]} /></Beat>
      <Beat range={T.proof}><Proof /></Beat>
      <Beat range={T.outro}><Outro /></Beat>
      <Grade />
      <Grain />
      <Vignette />
      <Audio src={staticFile("sfx/music.wav")} volume={0.9} />
      {sfx.map((s, i) => <Sfx key={i} {...s} />)}
    </AbsoluteFill>
  );
};
