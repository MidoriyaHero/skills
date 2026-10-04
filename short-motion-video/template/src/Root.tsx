// Root.tsx — one timeline, three formats.
import React from "react";
import { Composition } from "remotion";
import { Showreel } from "./Showreel";
import { T, theme } from "./theme";

const base = { component: Showreel, durationInFrames: T.total, fps: theme.fps } as const;

export const Root: React.FC = () => (
  <>
    <Composition id="Portrait" {...base} width={1080} height={1920} />
    <Composition id="Square" {...base} width={1080} height={1080} />
    <Composition id="Landscape" {...base} width={1920} height={1080} />
  </>
);
