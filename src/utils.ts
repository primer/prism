import {Color, Curve, Scale} from './types'
import hsluv from 'hsluv'
import {toHex} from 'color2k'

export function hexToColor(hex: string): Color {
  const [hue, saturation, lightness] = hsluv.hexToHsluv(toHex(hex)).map(value => Math.round(value * 100) / 100)
  return {hue, saturation, lightness}
}

export function colorToHex(color: Color): string {
  return hsluv.hsluvToHex([color.hue, color.saturation, color.lightness])
}

export function randomIntegerInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getColor(curves: Record<string, Curve>, scale: Scale, index: number) {
  const color = scale.colors[index]

  const hueCurve = curves[scale.curves.hue ?? '']?.values ?? []
  const saturationCurve = curves[scale.curves.saturation ?? '']?.values ?? []
  const lightnessCurve = curves[scale.curves.lightness ?? '']?.values ?? []

  const hue = color.hue + (hueCurve[index] ?? 0)
  const saturation = color.saturation + (saturationCurve[index] ?? 0)
  const lightness = color.lightness + (lightnessCurve[index] ?? 0)

  return {hue, saturation, lightness}
}

export function getRange(type: Curve['type']) {
  const ranges = {
    hue: {min: 0, max: 360},
    saturation: {min: 0, max: 100},
    lightness: {min: 0, max: 100}
  }
  return ranges[type]
}

export function getContrastScore(contrast: number) {
  return contrast < 3 ? 'Fail' : contrast < 4.5 ? 'AA+' : contrast < 7 ? 'AA' : 'AAA'
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
