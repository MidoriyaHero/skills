// Proof.tsx — the number: 80% less MLOps effort, counted up over the real metrics strip.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme, useLayout } from "../theme";
import { BgMesh } from "../components/Layers";
import { Shot } from "../components/Shot";
import { Counter, Entrance, WordReveal, Wordmark, useExit } from "../components/Type";
import { brief } from "../brief";

export const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, w, h, portrait, pad } = useLayout();
  const exit = useExit(8);
  const breathe = 1 + Math.sin(frame / 20) * 0.012;
  const shown = brief.proof.display;
  const glyph = shown || `${brief.proof.number}${brief.proof.suffix}`;
  const num = (portrait ? 400 : 360) * s * (glyph.length > 6 ? 0.5 : glyph.length > 4 ? 0.7 : 1);
  const stripW = Math.min(w - 2 * pad, 1200 * s), stripH = portrait ? 300 * s : 320 * s;
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exit.opacity,
        transform: `translateY(${exit.y}px)`, gap: 24 * s }}>
        <Entrance delay={0} config={theme.spring.heavy} dist={120}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: num, lineHeight: 0.95,
            letterSpacing: -num * 0.05, color: theme.colors.primary, textShadow: `0 0 90px ${theme.colors.glow}`,
            transform: `scale(${breathe})` }}>
            {shown ? shown : <Counter to={brief.proof.number} suffix={brief.proof.suffix} delay={2} />}
          </div>
        </Entrance>
        <WordReveal text={brief.proof.label} delay={14} per={4}
          style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: 92 * s, letterSpacing: -2 * s,
            color: theme.colors.text, justifyContent: "center" }} />
        <Entrance delay={26} from="up" dist={80} style={{ marginTop: 24 * s }}>
          <Shot id={brief.proof.shot} crop={brief.proof.crop} width={stripW} height={stripH} zoomTo={1.05} radius={22 * s} />
        </Entrance>
        <Entrance delay={34} style={{ marginTop: 8 * s }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 32 * s, color: theme.colors.textDim }}>
            {brief.proof.footnote}
          </div>
        </Entrance>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Outro: React.FC = () => {
  const { s, portrait } = useLayout();
  const exit = useExit(6);
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exit.opacity, transform: `translateY(${exit.y}px)` }}>
        <Wordmark size={(portrait ? 110 : 130) * s} delay={0} />
        <WordReveal text={brief.tagline} delay={4} per={1}
          style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 40 * s, marginTop: 28 * s,
            color: theme.colors.textDim, justifyContent: "center", padding: `0 ${60 * s}px`, textAlign: "center" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
