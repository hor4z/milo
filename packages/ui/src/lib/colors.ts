/** La familia viva de lo chico: un chip, la inicial de un avatar, el cuadradito de icono de una tarjeta. */
export const labelFill = {
  green: 'bg-label-green',
  teal: 'bg-label-teal',
  blue: 'bg-label-blue',
  purple: 'bg-label-purple',
  pink: 'bg-label-pink',
  orange: 'bg-label-orange',
} as const

export type LabelColor = keyof typeof labelFill

/** La otra familia: pares relleno/glifo, pastel con el glifo del mismo tono varios pasos más oscuro. */
export const markFill = {
  green: 'bg-mark-green text-mark-green-ink',
  purple: 'bg-mark-purple text-mark-purple-ink',
  orange: 'bg-mark-orange text-mark-orange-ink',
  blue: 'bg-mark-blue text-mark-blue-ink',
  pink: 'bg-mark-pink text-mark-pink-ink',
} as const

export type MarkColor = keyof typeof markFill

/** Las cinco en orden de rueda, para quien elige por hash. */
export const markColors = Object.keys(markFill) as MarkColor[]

/** Las seis en orden de rueda, para quien elige por índice o por hash. */
export const labelColors = ['green', 'teal', 'blue', 'purple', 'pink', 'orange'] as const satisfies readonly LabelColor[]
