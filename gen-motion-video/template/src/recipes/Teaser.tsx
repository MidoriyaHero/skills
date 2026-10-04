// Teaser.tsx — 12 s single-feature announcement: statement → one cursor-driven UI moment →
// proof → wordmark. Grid derives from BEAT; durations are exported for Root.
import React from "react";
import { AbsoluteFill } from "remotion";
import { bar, theme } from "../theme";
import { Beat, Finish, type Hit } from "../components/Timeline";
import { Statement } from "../scenes/Statement";
import { CLICK_AT, FEATURES, Feature } from "../scenes/Feature";
import { Outro, Proof } from "../scenes/Proof";
import { brief } from "../brief";

const G = { statement: [0, bar(1.5)], feature: [bar(1.5), bar(3.75)], proof: [bar(3.75), bar(5.25)], outro: [bar(5.25), bar(6)] } as const;
export const TEASER_FRAMES = G.outro[1];

export const Teaser: React.FC = () => {
  const words = brief.statement.text.split(" ").length;
  const hits: Hit[] = [];
  for (let i = 0; i < words; i++) hits.push({ at: i * 4, file: i === 0 ? "thump" : "whoosh", volume: 0.5 });
  hits.push({ at: G.feature[0], file: "whoosh", volume: 0.6 }, { at: G.feature[0] + CLICK_AT, file: "click", volume: 0.9 });
  hits.push({ at: G.proof[0], file: "thump", volume: 1 });
  for (let i = 0; i < 10; i++) hits.push({ at: G.proof[0] + 4 + i * 3, file: "tick", volume: 0.4 });
  hits.push({ at: G.outro[0], file: "shimmer", volume: 0.6 });
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
      <Beat range={G.statement}><Statement {...brief.statement} /></Beat>
      <Beat range={G.feature}><Feature spec={FEATURES[0]} /></Beat>
      <Beat range={G.proof}><Proof /></Beat>
      <Beat range={G.outro}><Outro /></Beat>
      <Finish hits={hits} />
    </AbsoluteFill>
  );
};

