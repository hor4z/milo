/** `solid` y `brand` son el mismo rol —el botón que manda—: va uno o el otro, nunca los dos en la misma pantalla. */
export const variants = {
  solid: 'raised-solid bg-solid text-on-solid hover:bg-solid-hover',
  raised: 'raised text-ink',
  brand: 'raised-brand text-on-brand',
  muted: 'bg-muted text-ink hover:bg-sunken',
  ghost: 'text-ink-muted hover:bg-hover hover:text-ink',
  bad: 'bg-bad text-on-bad hover:bg-bad-hover',
} as const

/** La escalera de los controles. */
export const control = {
  sm: { box: 'h-8', square: 'size-8', px: 'px-4', text: 'text-body', gap: 'gap-1.5', radius: 'rounded-md', icon: 16, dot: 'top-[5px] right-[5px]' },
  md: { box: 'h-9', square: 'size-9', px: 'px-5', text: 'text-reading', gap: 'gap-2', radius: 'rounded-lg', icon: 18, dot: 'top-1.5 right-1.5' },
  lg: { box: 'h-10', square: 'size-10', px: 'px-6', text: 'text-reading', gap: 'gap-2', radius: 'rounded-lg', icon: 20, dot: 'top-[7px] right-[7px]' },
} as const

export const fieldSizes = {
  sm: 'h-8 gap-1.5 rounded-md px-2.5 text-body',
  md: 'h-9 gap-2 rounded-lg px-3 text-reading',
  lg: 'h-10 gap-2 rounded-lg px-3 text-reading',
} as const
