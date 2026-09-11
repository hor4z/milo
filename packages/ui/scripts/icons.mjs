#!/usr/bin/env node
/**
 * El set de iconos se administra desde acá. Nunca se edita a mano ni el
 * manifiesto ni los `.gen.ts`.
 *
 *   npm run icons -w @melu/ui -- search <texto>   busca en el catálogo, offline
 *   npm run icons -w @melu/ui -- add <nombre...>  agrega al set y regenera
 *   npm run icons -w @melu/ui -- sync             rebaja la fuente y regenera
 *   npm run icons -w @melu/ui -- check            nombres usados que faltan, y al revés
 *   npm run icons -w @melu/ui -- refresh          reconstruye el catálogo desde Google
 *
 * Por qué el catálogo está versionado: `search` y `add` tienen que andar sin
 * internet. Es el mismo argumento de las caras de los avatares. Nunca llega al
 * browser: solo lo importan este script y la historia del kit.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const pkg = resolve(here, '..')
const root = resolve(pkg, '../..')
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

const P = {
  manifest: join(pkg, 'icons.manifest.json'),
  catalog: join(here, 'catalog.json'),
  font: join(pkg, 'src/assets/material-symbols-rounded.woff2'),
  gen: join(pkg, 'src/icons.gen.ts'),
  meta: join(pkg, 'src/icons.meta.ts'),
}

const readJSON = p => JSON.parse(readFileSync(p, 'utf8'))
const manifest = () => readJSON(P.manifest)
const catalog = () => {
  const m = new Map()
  for (const c of readJSON(P.catalog)) m.set(c.n, c)
  return m
}

/* ------------------------------------------------------------------ search */

/** Distancia de edición, para sugerir cuando el nombre no existe. */
function dist(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0))
  return d[a.length][b.length]
}

function buscar(q, cat, limite = 20) {
  const n = q.toLowerCase()
  const hits = []
  for (const c of cat.values()) {
    let puntos = 0
    if (c.n === n) puntos = 1000
    else if (c.n.startsWith(n)) puntos = 500
    else if (c.n.includes(n)) puntos = 200
    else if (c.t.some(t => t === n)) puntos = 150
    else if (c.t.some(t => t.includes(n))) puntos = 50
    if (puntos) hits.push([puntos + Math.min(c.p / 1000, 99), c])
  }
  hits.sort((a, b) => b[0] - a[0])
  return hits.slice(0, limite).map(h => h[1])
}

/* -------------------------------------------------------------------- sync */

async function bajarFuente(names, axes) {
  const url = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:${axes}`
    + `&icon_names=${names.join(',')}`
  const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text()
  const src = css.match(/https:\/\/fonts\.gstatic\.com[^)]*/)?.[0]
  if (!src) throw new Error('no vino una url de fuente en el CSS de Google:\n' + css.slice(0, 400))
  const buf = Buffer.from(await (await fetch(src, { headers: { 'User-Agent': UA } })).arrayBuffer())
  /* Si el User-Agent no parece un browser moderno, Google devuelve TTF en vez
     de woff2 y el @font-face queda mintiendo sobre el formato. */
  if (buf.subarray(0, 4).toString('latin1') !== 'wOF2')
    throw new Error(`lo que bajó no es woff2 (empieza con ${JSON.stringify(buf.subarray(0, 4).toString('latin1'))})`)
  return { buf, src }
}

function escribirGen(names, cat) {
  const filas = names.map(n => `  ${n}: 0x${cat.get(n).c.toString(16)},`).join('\n')
  writeFileSync(P.gen, `/* GENERADO por scripts/icons.mjs — no editar a mano.
   Se regenera con: npm run icons -w @melu/ui -- sync

   Son codepoints y no ligaduras a propósito: con ligaduras, el instante previo
   a que cargue la fuente muestra la palabra "chevron_right" adentro de un
   botón. Y van en hexa y no como el carácter, porque un char del área privada
   guardado en un .ts es invisible en el editor y en el diff. */
export const codepoints = {
${filas}
} as const

export type IconName = keyof typeof codepoints
export const iconNames = Object.keys(codepoints) as IconName[]
`)

  const metaFilas = names.map(n => `  ${n}: ${JSON.stringify(cat.get(n).t.join(' '))},`).join('\n')
  writeFileSync(P.meta, `/* GENERADO por scripts/icons.mjs — no editar a mano.

   Los tags de cada icono, para el buscador de la galería del kit. Va aparte de
   icons.gen.ts a propósito: si los tags viajaran con los codepoints, la app de
   producto pagaría en su bundle el catálogo de búsqueda del muestrario. Esto lo
   importa SOLO la historia del kit. */
import type { IconName } from './icons.gen'

export const iconTags: Record<IconName, string> = {
${metaFilas}
}
`)
}

async function sync() {
  const m = manifest()
  const cat = catalog()
  const faltan = m.names.filter(n => !cat.has(n))
  if (faltan.length) {
    console.error(`estos nombres no están en el catálogo: ${faltan.join(', ')}`)
    process.exit(1)
  }
  const { buf, src } = await bajarFuente(m.names, m.axes)
  writeFileSync(P.font, buf)
  escribirGen(m.names, cat)
  m.font = {
    url: src,
    bytes: buf.length,
    sha256: createHash('sha256').update(buf).digest('hex'),
    fetchedAt: new Date().toISOString().slice(0, 10),
  }
  writeFileSync(P.manifest, JSON.stringify(m, null, 2) + '\n')
  console.log(`${m.names.length} iconos · ${(buf.length / 1024).toFixed(1)} KB · sha256 ${m.font.sha256.slice(0, 12)}…`)
}

/* --------------------------------------------------------------------- add */

async function add(args) {
  const yes = args.includes('--yes')
  const pedidos = args.filter(a => !a.startsWith('--'))
  if (!pedidos.length) return console.error('uso: icons add <nombre...> [--yes]'), process.exit(1)

  const m = manifest()
  const cat = catalog()
  const nuevos = []

  for (const n of pedidos) {
    // 1. ¿existe?
    if (!cat.has(n)) {
      const cerca = [...cat.keys()].map(k => [dist(n, k), k]).sort((a, b) => a[0] - b[0]).slice(0, 5)
      console.error(`✗ "${n}" no existe en Material Symbols Rounded.`)
      console.error(`  ¿quisiste decir? ${cerca.map(c => c[1]).join(' · ')}`)
      console.error(`  o probá: icons search ${n.split('_')[0]}`)
      process.exit(1)
    }
    // 2. ¿ya lo tenemos?
    if (m.names.includes(n)) {
      console.log(`· "${n}" ya está en el set. No hay nada que bajar.`)
      continue
    }
    // 3. ¿hay uno mejor, o uno que ya hace lo mismo?
    const tags = new Set(cat.get(n).t)
    const parecidos = m.names
      .map(k => [[...tags].filter(t => cat.get(k)?.t.includes(t)).length, k])
      .filter(([c]) => c >= 2)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 3)
    if (parecidos.length && !yes) {
      console.error(`? "${n}" se parece a lo que ya tenés:`)
      for (const [c, k] of parecidos) console.error(`    ${k} — ${c} tags en común (${cat.get(k).t.slice(0, 5).join(', ')})`)
      console.error(`  Si igual lo querés: icons add ${n} --yes`)
      process.exit(1)
    }
    nuevos.push(n)
  }

  if (!nuevos.length) return
  m.names = [...new Set([...m.names, ...nuevos])].sort()
  writeFileSync(P.manifest, JSON.stringify(m, null, 2) + '\n')
  console.log(`+ ${nuevos.join(', ')}`)
  await sync()
}

/* ------------------------------------------------------------------- check */

function fuentes(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e.startsWith('.')) continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) fuentes(p, out)
    else if (/\.tsx?$/.test(p) && !p.endsWith('.gen.ts') && !p.endsWith('icons.meta.ts')) out.push(p)
  }
  return out
}

function check() {
  const m = manifest()
  const enManifiesto = new Set(m.names)
  const usados = new Set()
  for (const f of [...fuentes(join(root, 'packages')), ...fuentes(join(root, 'apps'))]) {
    const src = readFileSync(f, 'utf8')
    for (const re of [/\bicon(?:End)?=["']([a-z0-9_]+)["']/g, /\bname=["']([a-z0-9_]+)["']/g, /\bicon:\s*'([a-z0-9_]+)'/g]) {
      for (const mm of src.matchAll(re)) usados.add(mm[1])
    }
  }
  const faltantes = [...usados].filter(n => !enManifiesto.has(n) && catalog().has(n)).sort()
  const sinUso = m.names.filter(n => !usados.has(n)).sort()
  if (faltantes.length) console.error(`✗ usados pero fuera del manifiesto: ${faltantes.join(', ')}`)
  if (sinUso.length) console.log(`· en el manifiesto sin ningún uso (${sinUso.length}): ${sinUso.join(', ')}`)
  if (!faltantes.length) console.log('✓ todo lo que se usa está en el manifiesto')
  process.exit(faltantes.length ? 1 : 0)
}

/* -------------------------------------------------------------------- main */

const [cmd, ...args] = process.argv.slice(2)
if (cmd === 'sync') await sync()
else if (cmd === 'add') await add(args)
else if (cmd === 'check') check()
else if (cmd === 'search') {
  const cat = catalog()
  const tengo = new Set(manifest().names)
  const hits = buscar(args.join(' '), cat)
  if (!hits.length) console.log('nada')
  for (const c of hits) console.log(`  ${tengo.has(c.n) ? '✓' : ' '} ${c.n.padEnd(30)} ${String(c.p).padStart(7)}  ${c.t.slice(0, 5).join(', ')}`)
  console.log(`\n  ✓ = ya está en el set`)
} else {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*?/, '').replace(/^ \* ?/gm, ''))
}
