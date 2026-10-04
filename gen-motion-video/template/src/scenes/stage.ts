// stage.ts — where the screenshot card and copy live for each format (9:16, 1:1, 16:9).
import { useLayout } from "../theme";
import type { Crops } from "../brief";
export type { Crops };

/** Card geometry per format; the copy block sits above (pill) and below (line). */
export const useStage = () => {
  const L = useLayout();
  const { w, h, pad, s } = L;
  if (L.landscape) return { ...L, cardW: w * 0.66, cardH: h * 0.70, cardTop: h * 0.17, cardLeft: (w - w * 0.66) / 2 };
  if (L.square) return { ...L, cardW: w - 2 * pad, cardH: h * 0.56, cardTop: h * 0.25, cardLeft: pad };
  return { ...L, cardW: w - 2 * pad, cardH: h * 0.47, cardTop: h * 0.265, cardLeft: pad, s };
};

/** Portrait cards are near-square, so only 9:16 uses the tall crop. */
export const pickCrop = (c: Crops, landscape: boolean, square = false) => (landscape || square ? c.land : c.port);
