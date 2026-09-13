import { describe, expect, it } from 'vitest'
import { bytes, count, decimals, delta, share, span, withUnit } from './number'

describe('el separador', () => {
  it('la coma es el decimal y el punto separa los miles, que es como se escribe acá', () => {
    expect(decimals(9.8)).toBe('9,8')
    expect(count(1250)).toBe('1.250')
    expect(decimals(1250.5)).toBe('1.250,5')
  })

  it('no inventa precisión: pide los dígitos que se midieron', () => {
    expect(decimals(9.84, 1)).toBe('9,8')
    expect(decimals(9, 2)).toBe('9,00')
  })
})

describe('una parte de un total', () => {
  it('trae las dos formas, y la que se usa casi siempre es la cuenta', () => {
    const s = share(18, 24)
    expect(s.count).toBe('18 de 24')
    expect(s.percent).toBe('75%')
  })

  it('un total en cero no divide por cero', () => {
    expect(share(0, 0).percent).toBe('0%')
  })
})

describe('las unidades', () => {
  it('el espacio antes de la unidad va', () => {
    expect(withUnit(45, 'min')).toBe('45 min')
    expect(withUnit(1.4, 'GB', 1)).toBe('1,4 GB')
  })

  it('un tamaño sube a la unidad en la que el número se lee', () => {
    expect(bytes(900)).toBe('900 bytes')
    expect(bytes(1024)).toBe('1,0 KB')
    expect(bytes(1024 ** 3 * 1.4)).toBe('1,4 GB')
    expect(bytes(1024 ** 3 * 24)).toBe('24 GB')
  })
})

describe('un rango', () => {
  it('va con la palabra y no con un guion, que entre números se lee como un menos', () => {
    expect(span(3, 7)).toBe('3 a 7')
    expect(span(3, 7, 'entregas')).toBe('3 a 7 entregas')
  })
})

describe('un cambio', () => {
  it('lleva el signo pegado', () => {
    expect(delta(12, { percent: true })).toBe('+12%')
    expect(delta(-3)).toBe('-3')
  })

  it('el cero no lleva signo porque no cambió nada', () => {
    expect(delta(0)).toBe('0')
    expect(delta(0, { percent: true })).toBe('0%')
  })
})
