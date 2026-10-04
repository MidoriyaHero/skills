// Explainer.tsx — "how it works" (~25–30 s): statement → pipeline flow (hero walks the steps) →
// three UI moments → proof → wordmark. Length derives from the number of flow steps.
import React from "react";
import { AbsoluteFill } from "remotion";
import { BEAT, bar, theme } from "../theme";
import { Beat, Finish, type Hit } from "../components/Timeline";
import { Statement } from "../scenes/Statement";
import { Flow, stepAt } from "../scenes/Flow";
import { CLICK_AT, FEATURES, Feature } from "../scenes/Feature";
import { Outro, Proof } from "../scenes/Proof";
import { brief } from "../brief";

const n = brief.flow.steps.length;
const flowLen = stepAt(n - 1, n) + BEAT * 2 + 10;
const seq = (lens: number[]) => lens.reduce<[number, number][]>((acc, l) => { const s = acc.length ? acc[acc.length - 1][1] : 0; acc.push([s, s + l]); return acc; }, []);
const [S, F, F1, F2, F3, P, O] = seq([bar(1.75), flowLen, bar(1.5), bar(1.5), bar(1.5), bar(1.5), bar(0.75)]);
export const EXPLAINER_FRAMES = O[1];

export const Explainer: React.FC = () => {
  const hits: Hit[] = [{ at: 0, file: "thump", volume: 0.7 }, { at: F[0], file: "whoosh", volume: 0.6 }];
  for (let i = 0; i < n; i++) hits.push({ at: F[0] + 6 + i * 4, file: "tick", volume: 0.5 }, { at: F[0] + stepAt(i, n), file: "click", volume: 0.7 });
  [F1, F2, F3].forEach(([from]) => hits.push({ at: from, file: "whoosh", volume: 0.6 }, { at: from + CLICK_AT, file: "click", volume: 0.9 }));
  hits.push({ at: P[0], file: "thump", volume: 1 }, { at: O[0], file: "shimmer", volume: 0.6 });
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
      <Beat range={S}><Statement {...brief.statement} /></Beat>
      <Beat range={F}><Flow {...brief.flow} /></Beat>
      <Beat range={F1}><Feature spec={FEATURES[0]} /></Beat>
      <Beat range={F2}><Feature spec={FEATURES[1]} /></Beat>
      <Beat range={F3}><Feature spec={FEATURES[2]} /></Beat>
      <Beat range={P}><Proof /></Beat>
      <Beat range={O}><Outro /></Beat>
      <Finish hits={hits} />
    </AbsoluteFill>
  );
};
