
/** La zona en la que vive lo que se está mirando: la del curso, no la del navegador. */
export type Zone = string

export type TimeOptions = {
  /** La zona del contenido. Sin esto toma la del navegador, que es lo correcto solo para lo que le pasó a quien mira. */
  zone?: Zone
  /** Para poder fijar el ahora en un test. */
  now?: Date
}

const MINUTO = 60_000
const HORA = 60 * MINUTO
const DIA = 24 * HORA

const parse = (value: string | Date) => (value instanceof Date ? value : new Date(value))

const fmt = (zone: Zone | undefined, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('es-AR', { ...opts, ...(zone ? { timeZone: zone } : null) })

/** El reloj, siempre de veinticuatro horas: `23:59`. */
export function clock(value: string | Date, { zone }: TimeOptions = {}) {
  return fmt(zone, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(parse(value))
}

/** El día sin el año: `9 de marzo`. Con `full`, `lunes 9 de marzo de 2026`. */
export function day(value: string | Date, { zone, full = false }: TimeOptions & { full?: boolean } = {}) {
  return fmt(zone, full
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    : { day: 'numeric', month: 'long' }).format(parse(value))
}

/** El día y la hora juntos: `9 de marzo a las 23:59`. */
export function dayAndTime(value: string | Date, o: TimeOptions & { full?: boolean } = {}) {
  return `${day(value, o)} a las ${clock(value, o)}`
}

/** Cuánto hace, en palabras: `recién`, `hace 20 minutos`, `ayer`. Solo el pasado, y solo hasta una semana. */
export function timeAgo(value: string | Date, { zone, now = new Date() }: TimeOptions = {}) {
  const d = parse(value)
  const delta = now.getTime() - d.getTime()
  if (delta < 0) return day(d, { zone })
  if (delta < MINUTO) return 'recién'
  if (delta < HORA) return plural(Math.floor(delta / MINUTO), 'minuto')
  if (delta < DIA) return plural(Math.floor(delta / HORA), 'hora')
  const dias = Math.floor(delta / DIA)
  if (dias === 1) return 'ayer'
  if (dias < 7) return plural(dias, 'día')
  return day(d, { zone })
}

const plural = (n: number, unidad: string) => `hace ${n} ${unidad}${n === 1 ? '' : 's'}`

/** Cuánto dura algo, en reloj: `1:30`. Lo que no se sabe cuánto dura va `--:--`, porque cero es un valor. */
export function duration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const s = Math.floor(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const dosCifras = (n: number) => String(n).padStart(2, '0')
  return h ? `${h}:${dosCifras(m)}:${dosCifras(r)}` : `${m}:${dosCifras(r)}`
}

/** El valor que va en el atributo `datetime`, que es el que lee una máquina. */
export function machineTime(value: string | Date) {
  const d = parse(value)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

/** Si la zona del contenido no es la de quien mira, hay que decir cuál es. */
export function zoneDiffers(zone: Zone | undefined, now: Date = new Date()) {
  if (!zone) return false
  const aca = new Intl.DateTimeFormat('es-AR', { timeZoneName: 'short' }).format(now)
  const alla = new Intl.DateTimeFormat('es-AR', { timeZone: zone, timeZoneName: 'short' }).format(now)
  return aca !== alla
}

/** Cómo se llama la zona para escribirla al lado de la hora: `GMT-3`. */
export function zoneLabel(zone: Zone, now: Date = new Date()) {
  const partes = new Intl.DateTimeFormat('es-AR', { timeZone: zone, timeZoneName: 'shortOffset' }).formatToParts(now)
  return partes.find(p => p.type === 'timeZoneName')?.value ?? zone
}
