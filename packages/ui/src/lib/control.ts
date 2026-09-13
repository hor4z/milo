import s from './control.module.css'
/** `brand` es el botón que manda y hay uno por pantalla; `solid` es el mismo rol en tinta, para donde el azul no se puede usar. Va uno o el otro, nunca los dos. */
export const variants = {
  brand: `${s.variants} raised-brand`,
  solid: `${s.variants2} raised-solid`,
  raised: `${s.variants3} raised`,
  muted: s.variants4,
  ghost: s.variants5,
  bad: s.variants6,
} as const

/** La escalera de los controles. */
export const control = {
  sm: { box: s.controlSm, square: s.controlSm2, px: s.controlSm3, text: s.controlSm4, gap: s.controlSm5, radius: s.controlSm6, icon: 16, dot: s.controlSm7 },
  md: { box: s.controlMd, square: s.controlMd2, px: s.controlMd3, text: s.controlMd4, gap: s.controlMd5, radius: s.controlMd6, icon: 18, dot: s.controlMd7 },
  lg: { box: s.controlLg, square: s.controlLg2, px: s.controlLg3, text: s.controlLg4, gap: s.controlLg5, radius: s.controlLg6, icon: 20, dot: s.controlLg7 },
} as const

/** Los campos van en el cuerpo de la interfaz y no un escalón arriba como el botón: lo que se escribe tiene que medir lo mismo que lo que se lee alrededor. En táctil sube a 16, y eso lo hace `theme.css`. */
export const fieldSizes = {
  sm: s.fieldSizes,
  md: s.fieldSizes2,
  lg: s.fieldSizes3,
} as const
