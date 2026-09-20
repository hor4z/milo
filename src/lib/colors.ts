import cls from './colors.module.css'
/** El par suave de cada tono: fondo apagado y tinta del mismo tono. Es lo que usa un chip. */
export const labelSoft = {
  green: cls.labelSoftGreen,
  teal: cls.labelSoftTeal,
  blue: cls.labelSoftBlue,
  purple: cls.labelSoftPurple,
  pink: cls.labelSoftPink,
  orange: cls.labelSoftOrange,
} as const

/** La familia viva de lo chico: el cuadradito de icono de una tarjeta, la inicial de un avatar. Lleva glifo blanco. */
export const labelFill = {
  green: cls.labelFillGreen,
  teal: cls.labelFillTeal,
  blue: cls.labelFillBlue,
  purple: cls.labelFillPurple,
  pink: cls.labelFillPink,
  orange: cls.labelFillOrange,
} as const

export type LabelColor = keyof typeof labelFill

/** La otra familia: pares relleno/glifo, pastel con el glifo del mismo tono varios pasos más oscuro. */
export const markFill = {
  green: cls.markFillGreen,
  purple: cls.markFillPurple,
  orange: cls.markFillOrange,
  blue: cls.markFillBlue,
  pink: cls.markFillPink,
} as const

export type MarkColor = keyof typeof markFill

/** Las cinco en orden de rueda, para quien elige por hash. */
export const markColors = Object.keys(markFill) as MarkColor[]

/** Las seis en orden de rueda, para quien elige por índice o por hash. */
export const labelColors = ['green', 'teal', 'blue', 'purple', 'pink', 'orange'] as const satisfies readonly LabelColor[]

/** El color de una persona, siempre el mismo para el mismo nombre. Es un hash de verdad y no la suma de los códigos, que ignora el orden de las letras y hace que "Ana Ruiz" y "Ruiz Ana" caigan siempre en el mismo tinte. */
export function colorForName(name: string): MarkColor {
  let h = 2166136261
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return markColors[Math.abs(h) % markColors.length]
}
