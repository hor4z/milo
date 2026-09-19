import { describe, expect, it } from 'vitest'
import { clock, day, dayAndTime, duration, machineTime, timeAgo, zoneLabel } from './time'

const AR = 'America/Argentina/Buenos_Aires'
const now = new Date('2026-03-09T15:00:00-03:00')

describe('el reloj', () => {
  it('va de veinticuatro horas y no dice am ni pm', () => {
    expect(clock('2026-03-09T23:59:00-03:00', { zone: AR })).toBe('23:59')
    expect(clock('2026-03-09T00:05:00-03:00', { zone: AR })).toBe('00:05')
  })

  it('la hora es la de la zona del contenido, no la de quien mira', () => {
    const iso = '2026-03-09T23:59:00-03:00'
    expect(clock(iso, { zone: AR })).toBe('23:59')
    expect(clock(iso, { zone: 'Europe/Madrid' })).toBe('03:59')
  })
})

describe('la fecha', () => {
  it('sin el año cuando el año se da por sabido', () => {
    expect(day('2026-03-09T12:00:00-03:00', { zone: AR })).toBe('9 de marzo')
  })

  it('entera cuando hay que poder anotarla', () => {
    expect(day('2026-03-09T12:00:00-03:00', { zone: AR, full: true })).toBe('lunes, 9 de marzo de 2026')
  })

  it('junto con la hora usa la palabra y no una coma', () => {
    expect(dayAndTime('2026-03-09T23:59:00-03:00', { zone: AR })).toBe('9 de marzo a las 23:59')
  })
})

describe('cuánto hace', () => {
  const ago = (ms: number) => new Date(now.getTime() - ms)

  it('abajo del minuto no dice un número', () => {
    expect(timeAgo(ago(20_000), { now: now })).toBe('recién')
  })

  it('dice la unidad entera y no abreviada', () => {
    expect(timeAgo(ago(20 * 60_000), { now: now })).toBe('hace 20 minutos')
    expect(timeAgo(ago(2 * 3_600_000), { now: now })).toBe('hace 2 horas')
  })

  it('el singular no dice "1 minutos"', () => {
    expect(timeAgo(ago(60_000), { now: now })).toBe('hace 1 minuto')
    expect(timeAgo(ago(3_600_000), { now: now })).toBe('hace 1 hora')
  })

  it('un día es ayer, que es como se dice', () => {
    expect(timeAgo(ago(24 * 3_600_000), { now: now })).toBe('ayer')
  })

  it('pasada la semana vuelve a la fecha: "hace 23 días" no ubica a nadie', () => {
    expect(timeAgo(ago(23 * 24 * 3_600_000), { now: now, zone: AR })).toBe('14 de febrero')
  })

  it('lo que todavía no pasó nunca va en relativo', () => {
    const tomorrow = new Date(now.getTime() + 24 * 3_600_000)
    expect(timeAgo(tomorrow, { now: now, zone: AR })).toBe('10 de marzo')
  })
})

describe('la duración', () => {
  it('es un reloj de lo que dura, no una hora del día', () => {
    expect(duration(7)).toBe('0:07')
    expect(duration(90)).toBe('1:30')
    expect(duration(3661)).toBe('1:01:01')
  })

  it('lo que no se sabe cuánto dura no dice cero: cero es un valor', () => {
    expect(duration(-5)).toBe('--:--')
    expect(duration(NaN)).toBe('--:--')
    expect(duration(Infinity)).toBe('--:--')
  })
})

describe('el valor que lee una máquina', () => {
  it('viaja en el atributo y es siempre el mismo, mire quien mire', () => {
    expect(machineTime('2026-03-09T23:59:00-03:00')).toBe('2026-03-10T02:59:00.000Z')
  })

  it('una fecha rota no inventa un valor', () => {
    expect(machineTime('no es una fecha')).toBe('')
  })
})

describe('la zona', () => {
  it('se puede nombrar para escribirla al lado de la hora', () => {
    expect(zoneLabel(AR, now)).toMatch(/GMT/)
  })
})
