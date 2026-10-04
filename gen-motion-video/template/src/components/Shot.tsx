// Shot.tsx — shows a crop of a REAL screenshot. Never redraws UI: the crop rectangle is
// in source pixels, scaled to fit the target box, inside a rounded device card.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { SHOTS } from "../brief";

export type Crop = { x: number; y: number; w: number; h: number };
export type ShotId = keyof typeof SHOTS;

type Props = {
  id: ShotId; crop: Crop; width: number; height: number;
  zoomTo?: number; zoomOrigin?: string; radius?: number; style?: React.CSSProperties; children?: React.ReactNode;
};

/** Source-px → box-px scale factor (cover fit). */
export const scaleOf = (crop: Crop, width: number, height: number) => Math.max(width / crop.w, height / crop.h);

/** Pixel position inside the rendered box for a point given in source pixels. */
export const toBox = (crop: Crop, width: number, height: number, sx: number, sy: number) => {
  const k = scaleOf(crop, width, height);
  return { x: (sx - crop.x) * k - (crop.w * k - width) / 2, y: (sy - crop.y) * k - (crop.h * k - height) / 2 };
};

export const Shot: React.FC<Props> = ({ id, crop, width, height, zoomTo = 1.06, zoomOrigin = "50% 40%", radius = 28, style, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const [iw, ih] = SHOTS[id];
  const k = Math.max(width / crop.w, height / crop.h);      // cover the box with the crop
  const scale = interpolate(frame, [0, durationInFrames], [1, zoomTo],
    { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ width, height, borderRadius: radius, overflow: "hidden", position: "relative",
      border: "1px solid rgba(255,255,255,0.12)", background: theme.colors.bgAlt,
      boxShadow: "0 50px 100px -30px rgba(0,0,0,0.8)", ...style }}>
      {/* Overlays (ring, cursor, typed text) live INSIDE the Ken Burns layer so they stay pinned to the UI. */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${scale})`, transformOrigin: zoomOrigin }}>
        <Img src={staticFile(`shots/${id}.png`)} style={{ position: "absolute", width: iw * k, height: ih * k,
          left: -crop.x * k - (crop.w * k - width) / 2, top: -crop.y * k - (crop.h * k - height) / 2,
          maxWidth: "none" }} />
        {children}
      </div>
    </div>
  );
};
