export type Color = {
  hue: number // 0-360
  saturation: number // 0-100
  lightness: number // 0-100
}

export type Curve = {
  id: string
  name: string
  type: 'hue' | 'saturation' | 'lightness'
  values: number[]
}

export type Scale = {
  id: string
  name: string
  colors: Color[]
  curves: Partial<Record<Curve['type'], string>>
  namingSchemeId: string | null
}

export type NamingScheme = {
  id: string
  name: string
  names: string[]
}

export type Palette = {
  id: string
  name: string
  backgroundColor: string
  scales: Record<string, Scale>
  curves: Record<string, Curve>
  namingSchemes: Record<string, NamingScheme>
}
