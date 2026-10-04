// Showreel.tsx — the 20 s product showreel (reference/brief-showreel.md). Beats are absolute
// frames on the 120 BPM grid; the same component renders 9:16, 1:1 and 16:9 via useLayout().
import React from "react";
import { AbsoluteFill } from "remotion";
import { BEAT, T, theme } from "../theme";
import { Beat, Finish, type Hit } from "../components/Timeline";
import { Hook } from "../scenes/Hook";
import { Assemble } from "../scenes/Assemble";
import { CLICK_AT, FEATURES, Feature } from "../scenes/Feature";
import { Outro, Proof } from "../scenes/Proof";

export const SHOWREEL_FRAMES = T.total;

export const Showreel: React.FC = () => {
  const hits: Hit[] = [];
  // Hook: a whoosh per word, thumps on the first and the hero word.
  [0, 1, 2, 3, 4].forEach((i) => hits.push({ at: i * BEAT, file: i === 0 || i === 3 ? "thump" : "whoosh", volume: 0.6 }));
  // Assemble: wordmark hit, then a tick per UI slice.
  hits.push({ at: T.assemble[0], file: "thump", volume: 0.8 });
  for (let i = 0; i < 7; i++) hits.push({ at: T.assemble[0] + BEAT + i * 4, file: "tick", volume: 0.5 });
  // Features: whoosh on entry, click on the cursor click, ticks while typing.
  [T.f1, T.f2, T.f3].forEach(([from], i) => {
    hits.push({ at: from, file: "whoosh", volume: 0.6 });
    hits.push({ at: from + CLICK_AT, file: "click", volume: 0.9 });
    if (FEATURES[i].typed) for (let c = 0; c < FEATURES[i].typed!.length; c++) hits.push({ at: from + CLICK_AT + 6 + c * 2, file: "tick", volume: 0.35 });
  });
  // Proof: impact, counter ticks, shimmer on the outro.
  hits.push({ at: T.proof[0], file: "thump", volume: 1 });
  for (let i = 0; i < 10; i++) hits.push({ at: T.proof[0] + 4 + i * 3, file: "tick", volume: 0.4 });
  hits.push({ at: T.outro[0], file: "shimmer", volume: 0.6 });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
      <Beat range={T.hook}><Hook /></Beat>
      <Beat range={T.assemble}><Assemble /></Beat>
      <Beat range={T.f1}><Feature spec={FEATURES[0]} /></Beat>
      <Beat range={T.f2}><Feature spec={FEATURES[1]} /></Beat>
      <Beat range={T.f3}><Feature spec={FEATURES[2]} /></Beat>
      <Beat range={T.proof}><Proof /></Beat>
      <Beat range={T.outro}><Outro /></Beat>
      <Finish hits={hits} />
    </AbsoluteFill>
  );
};
