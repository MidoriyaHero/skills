// Clip.tsx — a REAL footage segment (public/clips/<file>) with slow Ken Burns, an optional
// lower-third caption pill and a hero badge. Never <Video>; always <OffthreadVideo>.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, useLayout } from "../theme";
import { BgMesh } from "../components/Layers";
import { Entrance, Pill, useExit } from "../components/Type";

export type ClipSpec = { file: string; from: number; caption?: string; badge?: string; muted?: boolean; speed?: number };

export const Clip: React.FC<{ spec: ClipSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const { s, portrait, pad, w, h } = useLayout();
  const exit = useExit(8);
  const kb = interpolate(frame, [0, durationInFrames], [1, 1.06], { easing: theme.ease.inOut, extrapolateRight: "clamp" });
  const cardW = w - 2 * pad, cardH = portrait ? cardW * 9 / 16 : h * 0.74;
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exit.opacity, transform: `translateY(${exit.y}px)` }}>
        <Entrance delay={0} from={portrait ? "up" : "right"} dist={90}>
          <div style={{ width: cardW, height: cardH, borderRadius: 28 * s, overflow: "hidden", position: "relative",
            border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 50px 100px -30px rgba(0,0,0,0.8)" }}>
            <OffthreadVideo src={staticFile(`clips/${spec.file}`)} startFrom={Math.round(spec.from * fps)} muted={spec.muted ?? true}
              playbackRate={spec.speed ?? 1} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
            {spec.badge && <div style={{ position: "absolute", left: 28 * s, top: 24 * s }}><Pill text={spec.badge} delay={6} /></div>}
          </div>
        </Entrance>
        {spec.caption && (
          <Entrance delay={10} dist={40} style={{ marginTop: 32 * s, maxWidth: cardW }}>
            <div style={{ padding: `${16 * s}px ${30 * s}px`, borderRadius: 18 * s, background: theme.colors.panel, backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.12)", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 38 * s,
              color: theme.colors.text, textAlign: "center" }}>{spec.caption}</div>
          </Entrance>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
