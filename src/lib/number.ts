
const nf = (opts: Intl.NumberFormatOptions = {}) => new Intl.NumberFormat('es-AR', opts)

/** Un entero con su punto de miles: `1.250`. */
export function count(value: number) {
  return nf({ maximumFractionDigits: 0 }).format(value)
}

/** Un decimal, con los que de verdad se midieron: `9,8`. */
export function decimals(value: number, digits = 1) {
  return nf({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
}

/** Lo escrito, como número. Acepta la coma y el punto, porque acá se escribe "7,5" y el teclado del celular manda un punto. Lo que no es un número no es cero: es nada. */
export function parseNumber(raw: string): number | null {
  const limpio = raw.replace(/\s/g, '').replace(',', '.')
  if (limpio === '' || !/^-?\d*\.?\d*$/.test(limpio)) return null
  const n = Number(limpio)
  return Number.isFinite(n) ? n : null
}

/** Un número tal como se escribió, sin rellenar con ceros y sin redondear lo que alguien puso a propósito: `22`, `72,3`, `0,05`. */
export function amount(value: number) {
  return nf({ maximumFractionDigits: 3 }).format(value)
}

/** Una parte de un total, en las dos formas: `18 de 24` dice cuánto falta y `75%` obliga a calcularlo. */
export function share(value: number, total: number) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return { count: `${count(value)} de ${count(total)}`, percent: `${pct}%`, pct }
}

/** Un valor con su unidad, y el espacio va: `45 min`, `24 GB`. */
export function withUnit(value: number, name: string, digits = 0) {
  return `${digits ? decimals(value, digits) : count(value)} ${name}`
}

const SCALE = ['bytes', 'KB', 'MB', 'GB', 'TB'] as const

/** Un tamaño de archivo, en la unidad en la que el número se lee: `1,4 GB`. */
export function bytes(value: number) {
  let n = Math.max(0, value)
  let i = 0
  while (n >= 1024 && i < SCALE.length - 1) { n /= 1024; i++ }
  return `${i === 0 ? count(n) : decimals(n, n < 10 ? 1 : 0)} ${SCALE[i]}`
}

/** Un rango, con la palabra y no con un guion: `3 a 7`. Un guion entre números se lee como un menos. */
export function span(from: number, to: number, name?: string) {
  const core = `${count(from)} a ${count(to)}`
  return name ? `${core} ${name}` : core
}

/** Un cambio contra el período anterior: `+12%`, `-3`. El cero no lleva signo porque no cambió nada. */
export function delta(value: number, { percent = false }: { percent?: boolean } = {}) {
  if (value === 0) return percent ? '0%' : '0'
  const core = percent ? `${Math.abs(Math.round(value))}%` : count(Math.abs(value))
  return `${value > 0 ? '+' : '-'}${core}`
}

/** La palabra que corresponde a un número. El castellano no se resuelve sumando una `s`: "actividad" hace "actividades" y "lápiz" hace "lápices", así que las dos formas se escriben. */
export function plural(value: number, [singular, muchos]: readonly [string, string]) {
  return value === 1 ? singular : muchos
}

/** El número y su palabra: `1 entrega`, `18 entregas`. */
export function counted(value: number, formas: readonly [string, string]) {
  return `${count(value)} ${plural(value, formas)}`
}
