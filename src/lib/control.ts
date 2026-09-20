import s from './control.module.css'
/** Tres escalones de neutro y no cuatro: `solid` de relleno oscuro, `muted` de relleno claro y `ghost` sin relleno. En el medio la rampa no tiene dónde: los cuatro grises claros caen dentro de 1.27:1 entre sí, y los dos del medio no aguantan ningún texto. `brand` es el botón que manda y hay uno por pantalla; `solid` es el mismo rol en tinta, para donde el azul no se puede usar. Va uno o el otro, nunca los dos. */
export const variants = {
  brand: s.variantBrand,
  solid: s.variantSolid,
  muted: s.variantMuted,
  ghost: s.variantGhost,
  bad: s.variantBad,
} as const

/** La escalera de los controles. */
export const control = {
  sm: { box: s.heightSm, square: s.squareSm, px: s.padSm, text: s.textSm, gap: s.gapSm, radius: s.radiusSm, icon: 16, dot: s.dotSm },
  md: { box: s.heightMd, square: s.squareMd, px: s.padMd, text: s.textMd, gap: s.gapMd, radius: s.radiusMd, icon: 18, dot: s.dotMd },
  lg: { box: s.heightLg, square: s.squareLg, px: s.padLg, text: s.textLg, gap: s.gapLg, radius: s.radiusLg, icon: 24, dot: s.dotLg },
} as const

/** Los campos van en el cuerpo de la interfaz y no un escalón arriba como el botón: lo que se escribe tiene que medir lo mismo que lo que se lee alrededor. En táctil sube a 16, y eso lo hace `theme.css`. */
export const fieldSizes = {
  sm: s.fieldSm,
  md: s.fieldMd,
  lg: s.fieldLg,
} as const
