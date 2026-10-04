// Statement.tsx — kinetic headline: words land one by one, one hero word glows, an optional
// sub-line follows. Optional blurred real backdrop with Ken Burns. Used by Teaser, Explainer, Sting.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, useLayout } from "../theme";
import { BgMesh } from "../components/Layers";
import { WordReveal, useExit } from "../components/Type";

export const Statement: React.FC<{ text: string; hero?: string; sub?: string; backdrop?: string; size?: number }> =
  ({ text, hero, sub, backdrop, size }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    const { s, portrait, w } = useLayout();
    const exit = useExit(8);
    const kb = interpolate(frame, [0, durationInFrames], [1.12, 1.25], { easing: theme.ease.inOut, extrapolateRight: "clamp" });
    const breathe = 1 + Math.sin(frame / 22) * 0.008;
    const fs = (size ?? (portrait ? 128 : 150)) * s;
    return (
      <AbsoluteFill>
        <BgMesh />
        {backdrop && (
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <Img src={staticFile(`shots/${backdrop}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${kb})`, filter: "blur(10px) brightness(0.38) saturate(0.8)" }} />
          </AbsoluteFill>
        )}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 * s, gap: 28 * s,
          opacity: exit.opacity, transform: `translateY(${exit.y}px) scale(${breathe})` }}>
          <WordReveal text={text} hero={hero} per={4} rise={fs * 0.35}
            style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: fs, lineHeight: 1.02, letterSpacing: -fs * 0.04,
              color: theme.colors.text, justifyContent: "center", textAlign: "center", maxWidth: portrait ? w * 0.92 : w * 0.8,
              textShadow: "0 20px 50px rgba(0,0,0,0.6)" }} />
          {sub && <WordReveal text={sub} delay={text.split(" ").length * 4 + 6} per={2}
            style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 40 * s, color: theme.colors.textDim,
              justifyContent: "center", textAlign: "center", maxWidth: w * 0.8 }} />}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  };
