// Hook.tsx — five words slam in on the beat over the real annotated site image.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme, useLayout } from "../theme";
import { BgMesh } from "../components/Layers";
import { useExit } from "../components/Type";
import { brief } from "../brief";

const WORDS = brief.hook;

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { s, portrait, w } = useLayout();
  const exit = useExit(8);
  const kb = interpolate(frame, [0, durationInFrames], [1.15, 1.3], { easing: theme.ease.inOut, extrapolateRight: "clamp" });
  const size = (portrait ? 172 : 210) * s;
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile(`shots/${brief.hookBackdrop}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${kb})`, filter: "blur(10px) brightness(0.38) saturate(0.8)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 * s,
        opacity: exit.opacity, transform: `translateY(${exit.y}px)` }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${0.22 * size}px`,
          maxWidth: portrait ? w * 0.92 : w * 0.8, fontFamily: theme.fonts.display, fontWeight: 900,
          fontSize: size, lineHeight: 1.0, letterSpacing: -size * 0.04, color: theme.colors.text, textAlign: "center" }}>
          {WORDS.map((word, i) => {
            const p = spring({ frame: frame - i * BEAT, fps, config: theme.spring.bouncy });
            const hero = word === brief.hookHero;
            return <span key={i} style={{ display: "inline-block", opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [1.45, 1])}) translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
              color: hero ? theme.colors.primary : undefined,
              textShadow: hero ? `0 0 70px ${theme.colors.glow}` : "0 20px 50px rgba(0,0,0,0.6)" }}>{word}</span>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
