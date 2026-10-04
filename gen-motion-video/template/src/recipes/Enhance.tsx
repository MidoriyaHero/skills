// Enhance.tsx — the user's own footage, upgraded: statement intro → captioned real clips →
// wordmark. Length = intro + Σ clip seconds + outro. Regenerate music with LEN=<seconds>.
import React from "react";
import { AbsoluteFill } from "remotion";
import { bar, theme } from "../theme";
import { Beat, Finish, type Hit } from "../components/Timeline";
import { Statement } from "../scenes/Statement";
import { Clip } from "../scenes/Clip";
import { Outro } from "../scenes/Proof";
import { brief } from "../brief";

const INTRO = bar(1.5), OUTRO = bar(1);
const ranges = brief.clips.reduce<[number, number][]>((acc, c) => {
  const s = acc.length ? acc[acc.length - 1][1] : INTRO; acc.push([s, s + Math.round(c.seconds * theme.fps)]); return acc; }, []);
export const ENHANCE_FRAMES = (ranges.at(-1)?.[1] ?? INTRO) + OUTRO;
export const ENHANCE_SECONDS = Math.ceil(ENHANCE_FRAMES / theme.fps);

export const Enhance: React.FC = () => {
  const hits: Hit[] = [{ at: 0, file: "thump", volume: 0.7 }];
  ranges.forEach(([from]) => hits.push({ at: from, file: "whoosh", volume: 0.6 }));
  hits.push({ at: ENHANCE_FRAMES - OUTRO, file: "shimmer", volume: 0.6 });
  const anyAudio = brief.clips.some((c) => c.muted === false);
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
      <Beat range={[0, INTRO]}><Statement {...brief.statement} /></Beat>
      {brief.clips.map((c, i) => <Beat key={i} range={ranges[i]}><Clip spec={c} /></Beat>)}
      <Beat range={[ENHANCE_FRAMES - OUTRO, ENHANCE_FRAMES]}><Outro /></Beat>
      <Finish hits={hits} music={anyAudio ? 0.3 : 0.9} />
    </AbsoluteFill>
  );
};
