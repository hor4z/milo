import cls from './colors.module.css'
/** El par suave de cada tono: fondo apagado y tinta del mismo tono. Es lo que usa un chip. */
export const labelSoft = {
  green: cls.labelSoft,
  teal: cls.labelSoft2,
  blue: cls.labelSoft3,
  purple: cls.labelSoft4,
  pink: cls.labelSoft5,
  orange: cls.labelSoft6,
} as const

/** La familia viva de lo chico: el cuadradito de icono de una tarjeta, la inicial de un avatar. Lleva glifo blanco. */
export const labelFill = {
  green: cls.labelFill,
  teal: cls.labelFill2,
  blue: cls.labelFill3,
  purple: cls.labelFill4,
  pink: cls.labelFill5,
  orange: cls.labelFill6,
} as const

export type LabelColor = keyof typeof labelFill

/** La otra familia: pares relleno/glifo, pastel con el glifo del mismo tono varios pasos más oscuro. */
export const markFill = {
  green: cls.markFill,
  purple: cls.markFill2,
  orange: cls.markFill3,
  blue: cls.markFill4,
  pink: cls.markFill5,
} as const

export type MarkColor = keyof typeof markFill

/** Las cinco en orden de rueda, para quien elige por hash. */
export const markColors = Object.keys(markFill) as MarkColor[]

/** Las seis en orden de rueda, para quien elige por índice o por hash. */
export const labelColors = ['green', 'teal', 'blue', 'purple', 'pink', 'orange'] as const satisfies readonly LabelColor[]
