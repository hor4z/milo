import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const css = readFileSync(join(import.meta.dirname, '../../../tokens/src/primitives.css'), 'utf8')

function value(token: string, theme: 'light' | 'dark'): string | undefined {
  const blocks = css.split('[data-theme="dark"]')
  const text = theme === 'light' ? blocks[0] : blocks[1] ?? ''
  const m = text.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8}|var\\(--[\\w-]+\\))`))
  const raw = m?.[1]
  if (!raw) return undefined
  const ref = raw.match(/var\((--[\w-]+)\)/)
  return ref ? value(ref[1], theme) : raw
}

function luminance(hex: string) {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255)
    .map(s => (s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

const pairs: [string, string][] = [
  ['--ok-700', '--ok-050'],
  ['--warn-700', '--warn-050'],
  ['--bad-700', '--bad-050'],
  ['--blue-700', '--blue-050'],
]

describe('contraste de los tonos de estado', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const [ink, back] of pairs) {
      it(`${ink} sobre ${back} en ${theme} llega a AA`, () => {
        const a = value(ink, theme)
        const b = value(back, theme)
        expect(a, `falta ${ink} en ${theme}`).toBeTruthy()
        expect(b, `falta ${back} en ${theme}`).toBeTruthy()
        expect(ratio(a!, b!)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})

/** Las superficies sobre las que el sistema escribe en gris. */
const superficies = ['--shade-01', '--shade-02', '--shade-03', '--shade-04']

describe('el texto secundario se lee sobre cualquier superficie', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const back of superficies) {
      it(`--shade-06 sobre ${back} en ${theme} llega a AA`, () => {
        const gray = value('--shade-06', theme)!
        const paper = value(back, theme)!
        expect(ratio(gray, paper)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})

describe('el relleno que lleva texto encima llega a AA', () => {
  // Los dos rellenos saturados con una palabra arriba. Los dos están anclados:
  // son el escalón donde el blanco encima llega a 4.5:1, y no se eligieron
  // mirando. Era la única deuda de accesibilidad que el sistema arrastraba.
  for (const theme of ['light', 'dark'] as const) {
    for (const fill of ['--blue-600', '--bad-fill']) {
      it(`blanco sobre ${fill} en ${theme}`, () => {
        const f = value(fill, theme)
        expect(f, `falta ${fill} en ${theme}`).toBeTruthy()
        // En oscuro el azul baja a 400 porque la rampa se da vuelta.
        const usado = theme === 'dark' && fill === '--blue-600' ? value('--blue-400', theme)! : f!
        expect(ratio('#ffffff', usado)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})

describe('el texto sugerido de un campo se lee', () => {
  // Es el paso más claro del sistema que todavía lleva texto, así que es el que
  // está más cerca de romperse. Va contra el campo sobre papel —la superficie
  // más clara donde aparece— y contra el papel mismo.
  for (const theme of ['light', 'dark'] as const) {
    for (const back of ['--shade-01', '--shade-02']) {
      it(`--shade-placeholder sobre ${back} en ${theme} llega a AA`, () => {
        const ph = value('--shade-placeholder', theme)
        const paper = value(back, theme)
        expect(ph, `falta --shade-placeholder en ${theme}`).toBeTruthy()
        expect(ratio(ph!, paper!)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }

  it('es más claro que el gris del texto: si no, no se distingue de lo escrito', () => {
    for (const theme of ['light', 'dark'] as const) {
      const ph = ratio(value('--shade-placeholder', theme)!, value('--shade-01', theme)!)
      const gris = ratio(value('--shade-06', theme)!, value('--shade-01', theme)!)
      expect(ph, theme).toBeLessThan(gris)
    }
  })
})

const labels = ['--label-green', '--label-teal', '--label-blue', '--label-purple', '--label-pink', '--label-orange']

describe('el texto de una etiqueta de color se lee', () => {
  const ink = '#121212'
  for (const theme of ['light', 'dark'] as const) {
    for (const label of labels) {
      it(`${label} en ${theme} aguanta la tinta encima`, () => {
        const fill = value(label, theme)
        expect(fill, `falta ${label} en ${theme}`).toBeTruthy()
        expect(ratio(ink, fill!)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }

  it('la tinta del rol es la misma que se mide acá', () => {
    const semantic = readFileSync(join(import.meta.dirname, '../../../tokens/src/semantic.css'), 'utf8')
    expect(semantic).toMatch(/--on-label:\s*#121212/)
  })
})
