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
  // Los dos están anclados: son el escalón donde el blanco llega a 4.5:1.
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

describe('el hover no deshace el anclaje', () => {
  // El relleno del CTA está en el escalón exacto donde el blanco llega a 4.5:1,
  // así que no tiene aire para arriba. Un `filter: brightness(1.06)` en hover lo
  // dejaba en 4.07 todo el tiempo que el puntero estaba encima — sobre el botón
  // que más se mira. El hover **oscurece**, y esto lo mide.
  const theme = readFileSync(join(import.meta.dirname, '../theme.css'), 'utf8')

  it('ningún relleno con texto encima se aclara al pasar el mouse', () => {
    const reglas = [...theme.matchAll(/\.raised-(brand|solid)[^{]*:hover[^{]*\{([^}]*)\}/g)]
    const aclaran = reglas
      .filter(m => /brightness\(1\.[1-9]|brightness\(1\.0[1-9]/.test(m[2]))
      .map(m => m[1])
    expect(aclaran).toEqual([])
  })

  it('el degradado del hover es más oscuro que el de reposo', () => {
    for (const t of ['light', 'dark'] as const) {
      const paso = (n: string) => value(n, t)!
      const reposo = t === 'light' ? paso('--blue-600') : paso('--blue-400')
      const hover = t === 'light' ? paso('--blue-700') : paso('--blue-300')
      expect(ratio('#ffffff', hover), t).toBeGreaterThan(ratio('#ffffff', reposo))
      expect(ratio('#ffffff', hover), t).toBeGreaterThanOrEqual(4.5)
    }
  })
})

describe('el texto sugerido de un campo se lee', () => {
  // El paso más claro que todavía lleva texto: el que está más cerca de romperse.
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

const marks = ['green', 'purple', 'orange', 'blue', 'pink']

describe('el glifo de una marca se lee sobre su propio relleno', () => {
  // La familia pastel no la miraba ningún test, y la regla estaba escrita: el
  // glifo es el mismo tono a 4.5:1 contra su relleno en claro, y a 7:1 en
  // oscuro, porque un trazo claro y fino sobre un relleno profundo se apaga.
  // Estaba escrita y no se cumplía: verde 4.45 y azul 4.40 en claro, naranja y
  // rosa 6.95 en oscuro.
  for (const [theme, piso] of [['light', 4.5], ['dark', 7]] as const) {
    for (const m of marks) {
      it(`--mark-${m}-ink sobre --mark-${m} en ${theme} llega a ${piso}:1`, () => {
        const fill = value(`--mark-${m}`, theme)
        const ink = value(`--mark-${m}-ink`, theme)
        expect(fill, `falta --mark-${m} en ${theme}`).toBeTruthy()
        expect(ink, `falta --mark-${m}-ink en ${theme}`).toBeTruthy()
        expect(ratio(ink!, fill!)).toBeGreaterThanOrEqual(piso)
      })
    }
  }
})
