export type Color = {
  hue: number; // 0-360
  saturation: number; // 0-100
  lightness: number; // 0-100
};

export type Scale = {
  id: string;
  name: string;
  colors: Color[];
};

export type Palette = {
  id: string;
  name: string;
  scales: Record<string, Scale>;
};
