// Feature.tsx — one UI moment: real screenshot card, hero pill, a cursor that travels to a
// real control and clicks it, and an optional typed command rendered over the real input.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme } from "../theme";
import { BgMesh } from "../components/Layers";
import { Shot, scaleOf, toBox, type ShotId } from "../components/Shot";
import { Cursor } from "../components/Cursor";
import { Entrance, Pill, useExit } from "../components/Type";
import { pickCrop, useStage, type Crops } from "./stage";
import { brief } from "../brief";

export type FeatureSpec = {
  shot: ShotId; crops: Crops; pill: string; line: string;
  target: { x: number; y: number };          // real control centre, in source pixels
  targetSize: { w: number; h: number };      // real control size, in source pixels (ring hugs it)
  typed?: string;                             // command typed into the real input after the click
  zoomTo?: number;
  zoomOrigin?: string;                       // Ken Burns anchor; keep edge-hugging controls in frame
};

export const CLICK_AT = BEAT * 2 + 6;         // cursor lands and clicks here (relative frame)

export const Feature: React.FC<{ spec: FeatureSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = useStage();
  const exit = useExit(8);
  const crop = pickCrop(spec.crops, st.landscape, st.square);
  const t = toBox(crop, st.cardW, st.cardH, spec.target.x, spec.target.y);
  const k = scaleOf(crop, st.cardW, st.cardH);
  const ring = { w: spec.targetSize.w * k + 16 * st.s, h: spec.targetSize.h * k + 16 * st.s };
  const start = { x: st.cardW * 0.15, y: st.cardH * 0.9 };
  const typedChars = spec.typed ? Math.floor(interpolate(frame, [CLICK_AT + 6, CLICK_AT + 6 + spec.typed.length * 2], [0, spec.typed.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : 0;
  const caret = Math.floor(frame / 8) % 2 === 0;
  const press = spring({ frame: frame - CLICK_AT, fps, config: theme.spring.snappy });
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ opacity: exit.opacity, transform: `translateY(${exit.y}px)` }}>
        <div style={{ position: "absolute", left: st.cardLeft, top: st.cardTop - 96 * st.s }}>
          <Pill text={spec.pill} delay={2} />
        </div>
        <Entrance delay={0} from={st.portrait ? "up" : "right"} dist={90}
          style={{ position: "absolute", left: st.cardLeft, top: st.cardTop }}>
          <Shot id={spec.shot} crop={crop} width={st.cardW} height={st.cardH} zoomTo={spec.zoomTo ?? 1.08} zoomOrigin={spec.zoomOrigin} radius={28 * st.s}>
            {/* Highlight ring that lands on the real control at the click. */}
            <div style={{ position: "absolute", left: t.x - ring.w / 2, top: t.y - ring.h / 2, width: ring.w, height: ring.h,
              borderRadius: 14 * st.s, border: `${3 * st.s}px solid ${theme.colors.accent}`, opacity: press * 0.9,
              transform: `scale(${interpolate(press, [0, 1], [1.5, 1])})`, boxShadow: `0 0 30px ${theme.colors.accent}66` }} />
            {spec.typed && typedChars > 0 && (
              <div style={{ position: "absolute", left: t.x - 60 * st.s, top: t.y + ring.h / 2 + 12 * st.s, padding: `${10 * st.s}px ${18 * st.s}px`,
                borderRadius: 12 * st.s, background: theme.colors.bg, color: theme.colors.text, fontFamily: "Menlo, monospace",
                fontWeight: 700, fontSize: 30 * st.s, border: `1px solid rgba(255,255,255,0.15)`, whiteSpace: "nowrap" }}>
                {spec.typed.slice(0, typedChars)}<span style={{ opacity: caret ? 1 : 0, color: theme.colors.accent }}>▌</span>
              </div>
            )}
            <Cursor scale={st.s} path={[{ at: 4, ...start }, { at: CLICK_AT, x: t.x, y: t.y, click: true }]} />
          </Shot>
        </Entrance>
        <Entrance delay={CLICK_AT + 4} style={{ position: "absolute", left: st.cardLeft, top: st.cardTop + st.cardH + 36 * st.s, width: st.cardW }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 40 * st.s, color: theme.colors.textDim }}>{spec.line}</div>
        </Entrance>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FEATURES: FeatureSpec[] = brief.features;
