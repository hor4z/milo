/** `brand` es el botón que manda y hay uno por pantalla; `solid` es el mismo rol en tinta, para donde el azul no se puede usar. Va uno o el otro, nunca los dos. */
export const variants = {
  brand: 'raised-brand text-on-brand',
  solid: 'raised-solid bg-solid text-on-solid hover:bg-solid-hover',
  raised: 'raised text-ink',
  muted: 'bg-muted text-ink hover:bg-sunken',
  ghost: 'text-ink-muted hover:bg-hover hover:text-ink',
  bad: 'bg-bad text-on-bad hover:bg-bad-hover',
} as const

/** La escalera de los controles. */
export const control = {
  sm: { box: 'h-8', square: 'size-8', px: 'px-4', text: 'text-body', gap: 'gap-2', radius: 'rounded-md', icon: 16, dot: 'top-[5px] right-[5px]' },
  md: { box: 'h-9', square: 'size-9', px: 'px-5', text: 'text-reading', gap: 'gap-2', radius: 'rounded-lg', icon: 18, dot: 'top-1.5 right-1.5' },
  lg: { box: 'h-10', square: 'size-10', px: 'px-6', text: 'text-reading', gap: 'gap-2', radius: 'rounded-lg', icon: 20, dot: 'top-[7px] right-[7px]' },
} as const

/** Los campos van en el cuerpo de la interfaz y no un escalón arriba como el botón: lo que se escribe tiene que medir lo mismo que lo que se lee alrededor. En táctil sube a 16, y eso lo hace `theme.css`. */
export const fieldSizes = {
  sm: 'h-8 gap-2 rounded-md px-3 text-body',
  md: 'h-9 gap-2 rounded-lg px-3 text-body',
  lg: 'h-10 gap-2 rounded-lg px-3 text-body',
} as const
