// Assemble.tsx — the wordmark hits, then the real agent UI (rf_30) builds itself from
// horizontal slices of the actual screenshot flying in from alternating sides.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme } from "../theme";
import { BgMesh } from "../components/Layers";
import type { Crop } from "../components/Shot";
import { Entrance, Wordmark, useExit } from "../components/Type";
import { pickCrop, useStage } from "./stage";
import { SHOTS, brief } from "../brief";

const CROPS = brief.assemble.crops;
const SLICES = 7;
const START = BEAT;            // slices begin one beat after the wordmark

export const Assemble: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = useStage();
  const exit = useExit(8);
  const crop: Crop = pickCrop(CROPS, st.landscape, st.square);
  const [iw, ih] = SHOTS[brief.assemble.shot];
  const k = Math.max(st.cardW / crop.w, st.cardH / crop.h);
  const sliceH = st.cardH / SLICES;
  const markSize = (st.portrait ? 86 : 96) * st.s;
  const settle = spring({ frame: frame - START - SLICES * 4, fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ opacity: exit.opacity, transform: `translateY(${exit.y}px)` }}>
        <div style={{ position: "absolute", left: st.cardLeft, top: st.cardTop - markSize * 1.9, width: st.cardW }}>
          <Wordmark size={markSize} align="left" />
        </div>
        <div style={{ position: "absolute", left: st.cardLeft, top: st.cardTop, width: st.cardW, height: st.cardH,
          borderRadius: 28 * st.s, overflow: "hidden", border: `1px solid rgba(255,255,255,${0.12 * settle})`,
          boxShadow: `0 50px 100px -30px rgba(0,0,0,${0.8 * settle})` }}>
          {Array.from({ length: SLICES }).map((_, i) => (
            <Entrance key={i} delay={START + i * 4} from={i % 2 ? "right" : "left"} dist={st.cardW * 0.6}
              config={theme.spring.snappy} style={{ position: "absolute", top: i * sliceH, left: 0, width: st.cardW, height: sliceH + 1, overflow: "hidden" }}>
              <Img src={staticFile(`shots/${brief.assemble.shot}.png`)} style={{ position: "absolute", width: iw * k, height: ih * k, maxWidth: "none",
                left: -crop.x * k - (crop.w * k - st.cardW) / 2, top: -crop.y * k - (crop.h * k - st.cardH) / 2 - i * sliceH }} />
            </Entrance>
          ))}
        </div>
        <Entrance delay={START + SLICES * 4 + 6} style={{ position: "absolute", left: st.cardLeft, top: st.cardTop + st.cardH + 36 * st.s, width: st.cardW }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 40 * st.s, color: theme.colors.textDim }}>
            {brief.assemble.line} <span style={{ color: theme.colors.text }}>{brief.assemble.lineEmphasis}</span>
          </div>
        </Entrance>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
