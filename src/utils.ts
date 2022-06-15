import {Color, Curve, Palette, Scale} from './types'
import hsluv from 'hsluv'
import {toHex} from 'color2k'
import {camelCase} from 'lodash-es'

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

export function getHexScales(curves: Palette['curves'], scales: Palette['scales']) {
  return Object.values(scales).reduce<Record<string, string | string[]>>((acc, scale) => {
    let key = camelCase(scale.name)
    let i = 1

    while (key in acc) {
      i++
      key = `${camelCase(scale.name)}${i}`
    }

    const colors = scale.colors.map((_, index) => getColor(curves, scale, index)).map(colorToHex)

    acc[key] = colors.length === 1 ? colors[0] : colors
    return acc
  }, {})
}
