// Flow.tsx — a pipeline of steps (e.g. CCTV → ingest → RAG → agent → report). Steps enter
// staggered, then the hero highlight walks across them one beat at a time; the active
// step's detail line is shown underneath. Portrait stacks vertically, landscape in a row.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme, useLayout } from "../theme";
import { BgMesh } from "../components/Layers";
import { Entrance, useExit } from "../components/Type";

export type Step = { label: string; detail?: string };

/** Frame at which step `i` becomes active (after all steps have entered). */
export const stepAt = (i: number, n: number) => n * 4 + 10 + i * BEAT * 2;

export const Flow: React.FC<{ title?: string; steps: Step[] }> = ({ title, steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, portrait, w } = useLayout();
  const exit = useExit(8);
  const n = steps.length;
  const active = Math.max(-1, Math.min(n - 1, Math.floor((frame - stepAt(0, n)) / (BEAT * 2))));
  const col = portrait || n > 5;
  const pillW = col ? w * 0.72 : Math.min(300 * s, (w * 0.86 - (n - 1) * 70 * s) / n);
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 * s, opacity: exit.opacity, transform: `translateY(${exit.y}px)` }}>
        {title && <Entrance delay={0} dist={50}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: 56 * s, color: theme.colors.text, letterSpacing: -1 * s }}>{title}</div>
        </Entrance>}
        <div style={{ display: "flex", flexDirection: col ? "column" : "row", alignItems: "center", gap: col ? 18 * s : 0 }}>
          {steps.map((st, i) => {
            const p = spring({ frame: frame - 6 - i * 4, fps, config: theme.spring.snappy });
            const on = spring({ frame: frame - stepAt(i, n), fps, config: theme.spring.bouncy });
            const isActive = i === active;
            return (
              <React.Fragment key={i}>
                <div style={{ opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(on, [0, 1], [1, isActive ? 1.06 : 1])})`,
                  width: pillW, padding: `${22 * s}px ${26 * s}px`, borderRadius: 22 * s, textAlign: "center",
                  background: isActive ? theme.colors.primary : theme.colors.bgAlt, color: isActive ? theme.colors.bg : theme.colors.text,
                  border: `${2 * s}px solid ${isActive ? theme.colors.primary : "rgba(255,255,255,0.12)"}`,
                  boxShadow: isActive ? `0 0 60px ${theme.colors.glow}` : "none",
                  fontFamily: theme.fonts.display, fontWeight: 900, fontSize: 34 * s, whiteSpace: "nowrap" }}>{st.label}</div>
                {i < n - 1 && (
                  <div style={{ opacity: p, color: i < active ? theme.colors.accent : theme.colors.textDim, fontSize: 40 * s,
                    fontFamily: theme.fonts.display, fontWeight: 900, margin: col ? 0 : `0 ${14 * s}px`, lineHeight: 1 }}>{col ? "↓" : "→"}</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ height: 60 * s, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 36 * s, color: theme.colors.textDim, textAlign: "center", padding: `0 ${60 * s}px` }}>
          {active >= 0 && <Entrance key={active} delay={0} dist={24} config={theme.spring.snappy}>{steps[active].detail ?? ""}</Entrance>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
