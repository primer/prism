import bezier, {EasingFunction} from 'bezier-easing'

export const easings = ['in', 'out', 'inOut'] as const
export type Easing = typeof easings[number]

type EasingFunctionsDefinition = {
  [name: string]:
    | EasingFunction
    | {
        [easing in Easing]: EasingFunction
      }
}

export const easingFunctions: EasingFunctionsDefinition = {
  linear: bezier(0.5, 0.5, 0.5, 0.5),

  quadratic: {
    inOut: bezier(0.455, 0.03, 0.515, 0.955),
    in: bezier(0.55, 0.085, 0.68, 0.53),
    out: bezier(0.25, 0.46, 0.45, 0.94)
  },

  cubic: {
    inOut: bezier(0.645, 0.045, 0.355, 1),
    in: bezier(0.55, 0.055, 0.675, 0.19),
    out: bezier(0.215, 0.61, 0.355, 1)
  },

  quartic: {
    inOut: bezier(0.77, 0, 0.175, 1),
    in: bezier(0.895, 0.03, 0.685, 0.22),
    out: bezier(0.165, 0.84, 0.44, 1)
  },

  quintic: {
    inOut: bezier(0.86, 0, 0.07, 1),
    in: bezier(0.755, 0.05, 0.855, 0.06),
    out: bezier(0.23, 1, 0.32, 1)
  },

  sine: {
    inOut: bezier(0.445, 0.05, 0.55, 0.95),
    in: bezier(0.47, 0, 0.745, 0.715),
    out: bezier(0.39, 0.575, 0.565, 1)
  },

  circular: {
    inOut: bezier(0.785, 0.135, 0.15, 0.86),
    in: bezier(0.6, 0.04, 0.98, 0.335),
    out: bezier(0.075, 0.82, 0.165, 1)
  },

  exponential: {
    inOut: bezier(1, 0, 0, 1),
    in: bezier(0.95, 0.05, 0.795, 0.035),
    out: bezier(0.19, 1, 0.22, 1)
  }
}
