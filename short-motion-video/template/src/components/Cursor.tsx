// Cursor.tsx — an animated pointer that travels between waypoints on springs and
// "clicks" with a squash + ripple. Positions are in the parent's pixel space.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export type Waypoint = { at: number; x: number; y: number; click?: boolean };

export const Cursor: React.FC<{ path: Waypoint[]; scale?: number }> = ({ path, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Position = first waypoint + spring-eased deltas toward each later waypoint.
  let x = path[0].x, y = path[0].y;
  for (let i = 1; i < path.length; i++) {
    const p = spring({ frame: frame - path[i - 1].at, fps, config: theme.spring.smooth, durationInFrames: path[i].at - path[i - 1].at });
    x += (path[i].x - path[i - 1].x) * p;
    y += (path[i].y - path[i - 1].y) * p;
  }
  const appear = spring({ frame: frame - path[0].at, fps, config: theme.spring.snappy });
  const clicks = path.filter((p) => p.click);
  let squash = 1, ripple = 0, rippleO = 0;
  for (const c of clicks) {
    const d = frame - c.at;
    if (d >= 0 && d < 18) {
      squash = interpolate(d, [0, 3, 10], [1, 0.8, 1], { extrapolateRight: "clamp", easing: theme.ease.out });
      ripple = interpolate(d, [0, 16], [0, 90 * scale], { extrapolateRight: "clamp", easing: theme.ease.out });
      rippleO = interpolate(d, [0, 16], [0.8, 0], { extrapolateRight: "clamp" });
    }
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: appear, pointerEvents: "none", zIndex: 10 }}>
      <div style={{ position: "absolute", left: -ripple / 2, top: -ripple / 2, width: ripple, height: ripple,
        borderRadius: "50%", border: `${3 * scale}px solid ${theme.colors.primary}`, opacity: rippleO }} />
      <svg width={44 * scale} height={52 * scale} viewBox="0 0 22 26"
        style={{ transform: `scale(${squash})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
        <path d="M2 2 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L17 14.3 Z" fill={theme.colors.text} stroke={theme.colors.bg} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
