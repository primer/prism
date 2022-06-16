import bezier from "bezier-easing";

export const curves = {
  linear: bezier(0.5, 0.5, 0.5, 0.5),

  easeInCubic: bezier(0.55, 0.055, 0.675, 0.19),
  easeOutCubic: bezier(0.215, 0.61, 0.355, 1),
  easeInOutCubic: bezier(0.645, 0.045, 0.355, 1),

  easeInSine: bezier(0.47, 0, 0.745, 0.715),
  easeOutSine: bezier(0.39, 0.575, 0.565, 1),
  easeInOutSine: bezier(0.445, 0.05, 0.55, 0.95),

  easeInQuad: bezier(0.55, 0.085, 0.68, 0.53),
  easeOutQuad: bezier(0.25, 0.46, 0.45, 0.94),
  easeInOutQuad: bezier(0.455, 0.03, 0.515, 0.955),

  easeInQuart: bezier(0.895, 0.03, 0.685, 0.22),
  easeOutQuart: bezier(0.165, 0.84, 0.44, 1),
  easeInOutQuart: bezier(0.77, 0, 0.175, 1),

  easeInCirc: bezier(0.6, 0.04, 0.98, 0.335),
  easeOutCirc: bezier(0.075, 0.82, 0.165, 1),
  easeInOutCirc: bezier(0.785, 0.135, 0.15, 0.86),

  easeInQuint: bezier(0.755, 0.05, 0.855, 0.06),
  easeOutQuint: bezier(0.23, 1, 0.32, 1),
  easeInOutQuint: bezier(0.86, 0, 0.07, 1),

  easeInExpo: bezier(0.95, 0.05, 0.795, 0.035),
  easeOutExpo: bezier(0.19, 1, 0.22, 1),
  easeInOutExpo: bezier(1, 0, 0, 1),
};
