import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const scales = readFileSync(join(import.meta.dirname, '../../../tokens/src/scales.css'), 'utf8')
const theme = readFileSync(join(import.meta.dirname, '../theme.css'), 'utf8')

/** Los siete roles, del más chico al más grande. El orden es lo que se mide. */
const roles = ['meta', 'label', 'body', 'reading', 'title', 'heading', 'display'] as const

/** Lee un token de `scales.css`. Devuelve el número en px, resolviendo rem a 16. */
function size(name: string): number {
  const m = scales.match(new RegExp(`--${name}:\\s*([\\d.]+)(rem|px)`))
  if (!m) throw new Error(`falta --${name}`)
  return m[2] === 'rem' ? Number(m[1]) * 16 : Number(m[1])
}

function tracking(role: string): number {
  const m = scales.match(new RegExp(`--type-${role}-ls:\\s*(-?[\\d.]+)em`))
  if (!m) throw new Error(`falta --type-${role}-ls`)
  return Number(m[1])
}

describe('la escala tipográfica', () => {
  it('cada rol declara sus tres valores', () => {
    // El bug que esto custodia: de nueve escalones viejos, solo tres declaraban
    // interlineado. `text-base` se quedó sin el suyo y Tailwind le puso el de la
    // casa —21px donde la doctrina decía 16— sin que nadie se enterara.
    const incompletos = roles.filter(r =>
      !new RegExp(`--type-${r}:`).test(scales) ||
      !new RegExp(`--type-${r}-lh:`).test(scales) ||
      !new RegExp(`--type-${r}-ls:`).test(scales),
    )
    expect(incompletos).toEqual([])
  })

  it('cada rol llega al @theme con los tres, o la utilidad sale coja', () => {
    const incompletos = roles.filter(r =>
      !new RegExp(`--text-${r}:\\s*var\\(--type-${r}\\)`).test(theme) ||
      !new RegExp(`--text-${r}--line-height:`).test(theme) ||
      !new RegExp(`--text-${r}--letter-spacing:`).test(theme),
    )
    expect(incompletos).toEqual([])
  })

  it('los nombres viejos están apagados', () => {
    // Sin esto, los valores que trae Tailwind resucitan: `text-xs` volvería a ser
    // 12px y un call site olvidado andaría con el tamaño equivocado, en silencio.
    expect(theme).toMatch(/--text-\*:\s*initial/)
  })

  it('ningún rol baja de 12px', () => {
    const chicos = roles.filter(r => size(`type-${r}`) < 12)
    expect(chicos).toEqual([])
  })

  it('la escala sube y no se repite', () => {
    const px = roles.map(r => size(`type-${r}`))
    expect(px).toEqual([...px].sort((a, b) => a - b))
    expect(new Set(px).size).toBe(px.length)
  })

  it('los tamaños son enteros y pares', () => {
    // Un tamaño impar cae en media grilla de píxeles, igual que los iconos.
    const raros = roles.filter(r => {
      const px = size(`type-${r}`)
      return !Number.isInteger(px) || px % 2 !== 0
    })
    // `label` es 13 a propósito: el escalón entre 12 y 14 no existe de otra forma.
    expect(raros).toEqual(['label'])
  })

  it('el rol de lectura llega a 1.5 de interlineado', () => {
    // El número de WCAG 1.4.12, y el piso de cualquier guía de lectura larga.
    expect(size('type-reading-lh') / size('type-reading')).toBeGreaterThanOrEqual(1.5)
  })

  it('la curva de interlineado tiene su máximo en el rol de lectura', () => {
    // No es «más chico, más aire»: es «el que se lee de corrido, más aire». Los
    // dos roles de abajo son cromo de una sola línea —un badge, la cabecera de
    // una columna— donde lo que importa es que la caja no crezca, y de `reading`
    // para arriba la caja se aprieta porque a 40px el aire sobra solo.
    const ratios = roles.map(r => size(`type-${r}-lh`) / size(`type-${r}`))
    const pico = ratios.indexOf(Math.max(...ratios))
    expect(roles[pico]).toBe('reading')

    const subida = ratios.slice(0, pico + 1)
    expect(subida).toEqual([...subida].sort((a, b) => a - b))
    const bajada = ratios.slice(pico)
    expect(bajada).toEqual([...bajada].sort((a, b) => b - a))
  })

  it('el interlineado nunca es menor que la letra', () => {
    const pisados = roles.filter(r => size(`type-${r}-lh`) < size(`type-${r}`))
    expect(pisados).toEqual([])
  })

  it('el tracking cruza el cero en la base y nunca sube', () => {
    // Positivo donde la letra es chica y se empasta, negativo donde es grande y
    // se despega. Es lo que hace el eje óptico de San Francisco. La regla vieja
    // hacía lo contrario —-0.015em a todos los h1-h3, medido contra Inter a
    // 12px— y apretar la letra chica es exactamente cómo se pierde nitidez.
    const ls = roles.map(tracking)
    expect(ls).toEqual([...ls].sort((a, b) => b - a))
    expect(tracking('meta')).toBeGreaterThan(0)
    expect(tracking('body')).toBe(0)
    expect(tracking('display')).toBeLessThan(0)
  })

  it('los h1-h3 no traen tracking propio: lo trae el rol', () => {
    const regla = theme.match(/^h1, h2, h3 \{.*$/m)?.[0] ?? ''
    expect(regla).not.toMatch(/letter-spacing/)
  })

  it('el body va en el rol de interfaz', () => {
    expect(theme).toMatch(/font-size:\s*var\(--type-body\)/)
    expect(theme).toMatch(/line-height:\s*var\(--type-body-lh\)/)
  })

  it('no queda nada de la escala vieja en los tokens', () => {
    for (const muerto of ['--leading-ui', '--tracking-tight', '--tracking-wide']) {
      expect(scales).not.toMatch(new RegExp(`^\\s*${muerto}:`, 'm'))
    }
  })
})
