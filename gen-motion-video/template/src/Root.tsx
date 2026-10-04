// Root.tsx — every recipe × every format from one brief. Composition ids: <Recipe>-<Format>.
import React from "react";
import { Composition } from "remotion";
import { theme } from "./theme";
import { Showreel, SHOWREEL_FRAMES } from "./recipes/Showreel";
import { Teaser, TEASER_FRAMES } from "./recipes/Teaser";
import { Explainer, EXPLAINER_FRAMES } from "./recipes/Explainer";
import { Sting, STING_FRAMES } from "./recipes/Sting";
import { Enhance, ENHANCE_FRAMES } from "./recipes/Enhance";

const FORMATS = { Portrait: [1080, 1920], Square: [1080, 1080], Landscape: [1920, 1080] } as const;
const RECIPES = {
  Showreel: [Showreel, SHOWREEL_FRAMES], Teaser: [Teaser, TEASER_FRAMES], Explainer: [Explainer, EXPLAINER_FRAMES],
  Sting: [Sting, STING_FRAMES], Enhance: [Enhance, ENHANCE_FRAMES],
} as const;

export const Root: React.FC = () => (
  <>
    {Object.entries(RECIPES).flatMap(([recipe, [component, durationInFrames]]) =>
      Object.entries(FORMATS).map(([format, [width, height]]) => (
        <Composition key={`${recipe}-${format}`} id={`${recipe}-${format}`} component={component}
          durationInFrames={durationInFrames} fps={theme.fps} width={width} height={height} />
      )))}
  </>
);
