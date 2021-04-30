import { Color } from "./types";
import hsluv from "hsluv";
import { toHex } from "color2k";

export function hexToColor(hex: string): Color {
  const [hue, saturation, lightness] = hsluv
    .hexToHsluv(toHex(hex))
    .map(value => Math.round(value * 100) / 100);
  return { hue, saturation, lightness };
}

export function colorToHex(color: Color): string {
  return hsluv.hsluvToHex([color.hue, color.saturation, color.lightness]);
}
