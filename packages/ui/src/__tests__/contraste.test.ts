import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const css = readFileSync(join(import.meta.dirname, '../../../tokens/src/primitives.css'), 'utf8')

function valor(token: string, tema: 'light' | 'dark') {
  const bloques = css.split('[data-theme="dark"]')
  const texto = tema === 'light' ? bloques[0] : bloques[1] ?? ''
  const m = texto.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8})`))
  return m?.[1]
}

function luminancia(hex: string) {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255)
    .map(s => (s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contraste(a: string, b: string) {
  const [x, y] = [luminancia(a), luminancia(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

const pares: [string, string][] = [
  ['--ok-700', '--ok-050'],
  ['--warn-700', '--warn-050'],
  ['--bad-700', '--bad-050'],
  ['--blue-700', '--blue-050'],
]

describe('contraste de los tonos de estado', () => {
  for (const tema of ['light', 'dark'] as const) {
    for (const [tinta, fondo] of pares) {
      it(`${tinta} sobre ${fondo} en ${tema} llega a AA`, () => {
        const a = valor(tinta, tema)
        const b = valor(fondo, tema)
        expect(a, `falta ${tinta} en ${tema}`).toBeTruthy()
        expect(b, `falta ${fondo} en ${tema}`).toBeTruthy()
        expect(contraste(a!, b!)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})
