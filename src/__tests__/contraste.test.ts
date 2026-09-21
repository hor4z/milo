import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const css = readFileSync(join(import.meta.dirname, '../styles/tokens/primitives.css'), 'utf8')
const roles = readFileSync(join(import.meta.dirname, '../styles/tokens/semantic.css'), 'utf8')

/** Cada archivo se corta por su propio bloque oscuro antes de juntarlos: si se concatenan primero, lo claro de los roles cae adentro de lo oscuro de las primitivas. */
function scope(theme: 'light' | 'dark') {
  return [css, roles]
    .map(f => { const b = f.split('[data-theme="dark"]'); return theme === 'light' ? b[0] : b[1] ?? '' })
    .join('\n')
}

function value(token: string, theme: 'light' | 'dark'): string | undefined {
  const lookUp = (t: 'light' | 'dark') =>
    scope(t).match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8}|var\\(--[\\w-]+\\))`))?.[1]
  const raw = lookUp(theme) ?? (theme === 'dark' ? lookUp('light') : undefined)
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
  ['--yellow-800', '--yellow-050'],
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
const surfaces = ['--shade-01', '--shade-02', '--shade-03', '--shade-04']

describe('el texto secundario se lee sobre cualquier superficie', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const back of surfaces) {
      it(`--shade-06 sobre ${back} en ${theme} llega a AA`, () => {
        const gray = value('--shade-06', theme)!
        const paper = value(back, theme)!
        expect(ratio(gray, paper)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})

describe('el relleno que lleva texto encima llega a AA', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const fill of ['--blue-600', '--bad-fill']) {
      it(`blanco sobre ${fill} en ${theme}`, () => {
        const f = value(fill, theme)
        expect(f, `falta ${fill} en ${theme}`).toBeTruthy()
        const used = theme === 'dark' && fill === '--blue-600' ? value('--blue-400', theme)! : f!
        expect(ratio('#ffffff', used)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})

describe('el hover no deshace el anclaje', () => {
  /** Cada variante de control: su relleno en reposo, el del hover, y la tinta que lleva encima. Cuando los botones tenían relieve esto se verificaba sobre las recetas de `theme.css`; en plano lo que hay que mirar es que el paso del hover siga aguantando su propio texto. */
  const variants: [string, string, string][] = [
    ['--brand', '--brand-hover', '--on-brand'],
    ['--solid', '--solid-hover', '--on-solid'],
    ['--surface-muted', '--surface-sunken', '--text'],
    ['--bad', '--bad-hover', '--on-bad'],
  ]

  for (const theme of ['light', 'dark'] as const) {
    for (const [rest, hover, ink] of variants) {
      it(`${hover} sigue aguantando ${ink} en ${theme}`, () => {
        const a = value(hover, theme)
        const b = value(ink, theme)
        expect(a, `falta ${hover} en ${theme}`).toBeTruthy()
        expect(b, `falta ${ink} en ${theme}`).toBeTruthy()
        expect(ratio(a!, b!), `${rest} da ${ratio(value(rest, theme)!, b!).toFixed(2)}`)
          .toBeGreaterThanOrEqual(4.5)
      })
    }
  }

  it('el degradado del hover es más oscuro que el de reposo', () => {
    for (const t of ['light', 'dark'] as const) {
      const step = (n: string) => value(n, t)!
      const rest = t === 'light' ? step('--blue-600') : step('--blue-400')
      const hover = t === 'light' ? step('--blue-700') : step('--blue-300')
      expect(ratio('#ffffff', hover), t).toBeGreaterThan(ratio('#ffffff', rest))
      expect(ratio('#ffffff', hover), t).toBeGreaterThanOrEqual(4.5)
    }
  })
})

describe('el texto sugerido de un campo se lee', () => {
  const backgrounds = {
    light: ['--shade-01', '--shade-02', '--shade-02', '--shade-03'],
    dark: ['--shade-01', '--shade-03', '--shade-03'],
  } as const
  for (const theme of ['light', 'dark'] as const) {
    for (const back of [...new Set(backgrounds[theme])]) {
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

  for (const theme of ['light', 'dark'] as const) {
    for (const ink of ['--shade-06', '--warn-700', '--bad-700']) {
      for (const back of [...new Set(backgrounds[theme])]) {
        it(`la cuenta en ${ink} sobre ${back} en ${theme} llega a AA`, () => {
          const c = value(ink, theme)
          const paper = value(back, theme)
          expect(c, `falta ${ink} en ${theme}`).toBeTruthy()
          expect(ratio(c!, paper!)).toBeGreaterThanOrEqual(4.5)
        })
      }
    }
  }
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

  for (const theme of ['light', 'dark'] as const) {
    for (const label of labels) {
      it(`el par suave de ${label} en ${theme} se lee`, () => {
        const soft = value(`${label}-soft`, theme)
        const ink = value(`${label}-ink`, theme)
        expect(soft, `falta ${label}-soft en ${theme}`).toBeTruthy()
        expect(ink, `falta ${label}-ink en ${theme}`).toBeTruthy()
        expect(ratio(ink!, soft!)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }

  it('la tinta del rol es la misma que se mide acá', () => {
    const semantic = readFileSync(join(import.meta.dirname, '../styles/tokens/semantic.css'), 'utf8')
    expect(semantic).toMatch(/--on-label:\s*#121212/)
  })
})

const marks = ['green', 'purple', 'orange', 'blue', 'pink']

describe('el glifo de una marca se lee sobre su propio relleno', () => {
  for (const [theme, floor] of [['light', 4.5], ['dark', 7]] as const) {
    for (const m of marks) {
      it(`--mark-${m}-ink sobre --mark-${m} en ${theme} llega a ${floor}:1`, () => {
        const fill = value(`--mark-${m}`, theme)
        const ink = value(`--mark-${m}-ink`, theme)
        expect(fill, `falta --mark-${m} en ${theme}`).toBeTruthy()
        expect(ink, `falta --mark-${m}-ink en ${theme}`).toBeTruthy()
        expect(ratio(ink!, fill!)).toBeGreaterThanOrEqual(floor)
      })
    }
  }
})

const exceptions: Record<string, number> = {
  '--chart-warn light': 2.2,
}

describe('el relleno de un dato se despega de su pista', () => {
  const semantic = readFileSync(join(import.meta.dirname, '../styles/tokens/semantic.css'), 'utf8')
  const halves = (f: string) => {
    const [light, ...rest] = f.split('[data-theme="dark"]')
    return { light, oscuro: rest.join('') }
  }
  const layers = [halves(css), halves(semantic)]

  /** Resuelve un token hasta su valor literal, saltando los `var()` del camino. */
  function literal(token: string, theme: 'light' | 'dark', seen = 0): string {
    if (seen > 12) throw new Error(`${token} da vueltas`)
    const order = theme === 'light'
      ? layers.map(c => c.light)
      : [...layers.map(c => c.oscuro), ...layers.map(c => c.light)]
    for (const text of order) {
      const m = text.match(new RegExp(`${token}:\\s*([^;]+);`))
      if (!m) continue
      const raw = m[1].trim()
      const ref = raw.match(/^var\((--[\w-]+)\)$/)
      return ref ? literal(ref[1], theme, seen + 1) : raw
    }
    throw new Error(`no encuentro ${token} en ${theme}`)
  }

  const canal = (hex: string) => {
    const h = hex.replace('#', '')
    const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h
    return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16))
  }

  /** La pista es tinta en alpha: se compone sobre el papel antes de medir. */
  function track(theme: 'light' | 'dark') {
    const [r, g, b, a] = literal('--track', theme).match(/[\d.]+/g)!.map(Number)
    const background = canal(literal('--shade-01', theme))
    const mixed = [r, g, b].map((c, i) => Math.round(c * a + background[i] * (1 - a)))
    return '#' + mixed.map(c => c.toString(16).padStart(2, '0')).join('')
  }

  for (const theme of ['light', 'dark'] as const) {
    for (const tone of ['--chart-fill', '--chart-ok', '--chart-warn', '--chart-bad']) {
      const floor = exceptions[`${tone} ${theme}`]
      it(`${tone} sobre la pista en ${theme} llega a ${floor ?? 3}:1`, () => {
        const r = ratio(literal(tone, theme), track(theme))
        expect(r, floor ? 'es una excepción escrita: no puede empeorar' : undefined)
          .toBeGreaterThanOrEqual(floor ?? 3)
      })
    }
  }

  describe('la marca del Indicator lleva la tinta que su relleno aguanta', () => {
    const pairs: [string, string][] = [
      ['--on-accent', '--accent-fill'],
      ['--on-ok', '--ok-fill'],
      ['--on-warn', '--warn'],
      ['--on-bad', '--bad'],
    ]

    for (const theme of ['light', 'dark'] as const) {
      for (const [ink, fill] of pairs) {
        it(`${ink} sobre ${fill} en ${theme} llega a 4.5:1`, () => {
          const i = literal(ink, theme)
          const f = literal(fill, theme)
          expect(i, `falta ${ink} en ${theme}`).toBeTruthy()
          expect(f, `falta ${fill} en ${theme}`).toBeTruthy()
          expect(ratio(i, f)).toBeGreaterThanOrEqual(4.5)
        })
      }
    }
  })
})

describe('el amarillo lleva tinta oscura, y eso se verifica', () => {
  const ink = '--on-yellow'

  for (const theme of ['light', 'dark'] as const) {
    const fills = theme === 'light'
      ? ['--yellow-050', '--yellow-100', '--yellow-200', '--yellow-300', '--yellow-400']
      : ['--yellow-700', '--yellow-800', '--yellow-900']

    for (const fill of fills) {
      it(`${fill} aguanta la tinta del sistema en ${theme}`, () => {
        const a = value(fill, theme)
        const b = value(ink, theme)
        expect(a, `falta ${fill} en ${theme}`).toBeTruthy()
        expect(b, `falta ${ink} en ${theme}`).toBeTruthy()
        expect(ratio(a!, b!)).toBeGreaterThanOrEqual(4.5)
      })
    }

    it(`ningún relleno de amarillo llegaría a AA con blanco en ${theme}`, () => {
      const onWhite = fills.filter(r => ratio(value(r, theme)!, '#ffffff') >= 4.5)
      expect(onWhite).toEqual([])
    })
  }
})
