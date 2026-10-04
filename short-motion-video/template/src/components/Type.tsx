// Type.tsx — kinetic type primitives: entrances, word reveals, hero pill, wordmark, counter.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, useLayout } from "../theme";
import { brief } from "../brief";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Exit transform for a scene's graphics over its last `n` frames. */
export const useExit = (n = 8) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = durationInFrames - n - 1, b = durationInFrames - 1;
  return { opacity: interpolate(frame, [a, b], [1, 0], clamp),
    y: interpolate(frame, [a, b], [0, -40], { easing: theme.ease.in, ...clamp }) };
};

export const Entrance: React.FC<{ delay?: number; from?: "up" | "down" | "left" | "right"; dist?: number;
  config?: { damping: number; stiffness: number; mass: number }; children: React.ReactNode; style?: React.CSSProperties }> =
  ({ delay = 0, from = "up", dist = 60, config = theme.spring.smooth, children, style }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = spring({ frame: frame - delay, fps, config });
    const d = interpolate(p, [0, 1], [dist, 0]);
    const t = from === "up" ? `translateY(${d}px)` : from === "down" ? `translateY(${-d}px)`
      : from === "left" ? `translateX(${-d}px)` : `translateX(${d}px)`;
    return <div style={{ opacity: p, transform: `${t} scale(${interpolate(p, [0, 1], [0.92, 1])})`, ...style }}>{children}</div>;
  };

/** Word-by-word reveal; `hero` paints one word in the hero colour with glow. */
export const WordReveal: React.FC<{ text: string; delay?: number; per?: number; hero?: string;
  rise?: number; style?: React.CSSProperties }> = ({ text, delay = 0, per = 3, hero, rise = 40, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.24em", ...style }}>
      {text.split(" ").map((word, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        const isHero = hero !== undefined && word.replace(/[^\w]/g, "") === hero;
        return <span key={i} style={{ display: "inline-block", opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [rise, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
          color: isHero ? theme.colors.primary : undefined,
          textShadow: isHero ? `0 0 50px ${theme.colors.glow}` : undefined }}>{word}</span>;
      })}
    </div>
  );
};

/** Hero pill label — the single hero-coloured element on feature beats. */
export const Pill: React.FC<{ text: string; delay?: number; style?: React.CSSProperties }> = ({ text, delay = 0, style }) => {
  const { s } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  return (
    <div style={{ display: "inline-block", opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
      transformOrigin: "left center", padding: `${14 * s}px ${30 * s}px`, borderRadius: 999,
      background: theme.colors.primary, color: theme.colors.bg, fontFamily: theme.fonts.display,
      fontWeight: 900, fontSize: 34 * s, boxShadow: `0 0 60px ${theme.colors.glow}`, ...style }}>{text}</div>
  );
};

/** Typographic wordmark: cyan bar + "SiteSense Autopilot", last word in hero orange. */
export const Wordmark: React.FC<{ size?: number; delay?: number; align?: "center" | "left" }> = ({ size = 120, delay = 0, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start" }}>
      <div style={{ width: interpolate(bar, [0, 1], [0, size * 1.1]), height: size * 0.07, borderRadius: 99,
        background: theme.colors.accent, marginBottom: size * 0.22 }} />
      <WordReveal text={brief.product} delay={delay + 4} per={5} hero={brief.heroWord} rise={size * 0.4}
        style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: size, lineHeight: 1.02,
          letterSpacing: -size * 0.03, color: theme.colors.text, justifyContent: align === "center" ? "center" : "flex-start" }} />
    </div>
  );
};

/** Animated counter with tabular numerals. */
export const Counter: React.FC<{ to: number; delay?: number; suffix?: string; style?: React.CSSProperties }> =
  ({ to, delay = 0, suffix = "%", style }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = spring({ frame: frame - delay, fps, config: theme.spring.heavy });
    return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{Math.round(interpolate(p, [0, 1], [0, to]))}{suffix}</span>;
  };
