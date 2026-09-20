#!/usr/bin/env node
/** El set de iconos: `search`, `add`, `sync`, `check` y `refresh`. Las cuatro primeras andan sin internet, y por eso el catálogo está versionado. */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

const P = {
  manifest: join(root, 'icons.manifest.json'),
  catalog: join(here, 'catalog.json'),
  font: join(root, 'src/assets/material-symbols-rounded.woff2'),
  gen: join(root, 'src/icons.gen.ts'),
  meta: join(root, 'src/icons.meta.ts'),
}

const readJSON = p => JSON.parse(readFileSync(p, 'utf8'))
const manifest = () => readJSON(P.manifest)
const catalog = () => {
  const m = new Map()
  for (const c of readJSON(P.catalog)) m.set(c.n, c)
  return m
}

/** Distancia de edición, para sugerir cuando el nombre no existe. */
function dist(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0))
  return d[a.length][b.length]
}

function search(q, cat, limit = 20) {
  const n = q.toLowerCase()
  const hits = []
  for (const c of cat.values()) {
    let score = 0
    if (c.n === n) score = 1000
    else if (c.n.startsWith(n)) score = 500
    else if (c.n.includes(n)) score = 200
    else if (c.t.some(t => t === n)) score = 150
    else if (c.t.some(t => t.includes(n))) score = 50
    if (score) hits.push([score + Math.min(c.p / 1000, 99), c])
  }
  hits.sort((a, b) => b[0] - a[0])
  return hits.slice(0, limit).map(h => h[1])
}

async function downloadFont(names, axes) {
  const url = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:${axes}`
    + `&icon_names=${names.join(',')}`
  const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text()
  const src = css.match(/https:\/\/fonts\.gstatic\.com[^)]*/)?.[0]
  if (!src) throw new Error('no vino una url de fuente en el CSS de Google:\n' + css.slice(0, 400))
  const buf = Buffer.from(await (await fetch(src, { headers: { 'User-Agent': UA } })).arrayBuffer())
  if (buf.subarray(0, 4).toString('latin1') !== 'wOF2')
    throw new Error(`lo que bajó no es woff2 (empieza con ${JSON.stringify(buf.subarray(0, 4).toString('latin1'))})`)
  return { buf, src }
}

function writeGen(names, cat) {
  const rows = names.map(n => `  ${n}: 0x${cat.get(n).c.toString(16)},`).join('\n')
  writeFileSync(P.gen, `/* GENERADO por scripts/icons.mjs: no editar a mano.
   Se regenera con: npm run icons -w @milo/ui -- sync

   Son codepoints y no ligaduras a propósito: con ligaduras, el instante previo
   a que cargue la fuente muestra la palabra "chevron_right" adentro de un
   botón. Y van en hexa y no como el carácter, porque un char del área privada
   guardado en un .ts es invisible en el editor y en el diff. */
export const codepoints = {
${rows}
} as const

export type IconName = keyof typeof codepoints
export const iconNames = Object.keys(codepoints) as IconName[]
`)

  const metaRows = names.map(n => `  ${n}: ${JSON.stringify(cat.get(n).t.join(' '))},`).join('\n')
  writeFileSync(P.meta, `/* GENERADO por scripts/icons.mjs: no editar a mano.

   Los tags de cada icono, para el buscador de la galería del kit. Va aparte de
   icons.gen.ts a propósito: si los tags viajaran con los codepoints, la app de
   producto pagaría en su bundle el catálogo de búsqueda del muestrario. Esto lo
   importa SOLO la historia del kit. */
import type { IconName } from './icons.gen'

export const iconTags: Record<IconName, string> = {
${metaRows}
}
`)
}

async function sync() {
  const m = manifest()
  const cat = catalog()
  const missing = m.names.filter(n => !cat.has(n))
  if (missing.length) {
    console.error(`estos nombres no están en el catálogo: ${missing.join(', ')}`)
    process.exit(1)
  }
  const { buf, src } = await downloadFont(m.names, m.axes)
  writeFileSync(P.font, buf)
  writeGen(m.names, cat)
  m.font = {
    url: src,
    bytes: buf.length,
    sha256: createHash('sha256').update(buf).digest('hex'),
    fetchedAt: new Date().toISOString().slice(0, 10),
  }
  writeFileSync(P.manifest, JSON.stringify(m, null, 2) + '\n')
  console.log(`${m.names.length} iconos · ${(buf.length / 1024).toFixed(1)} KB · sha256 ${m.font.sha256.slice(0, 12)}…`)
}

async function add(args) {
  const yes = args.includes('--yes')
  const requested = args.filter(a => !a.startsWith('--'))
  if (!requested.length) return console.error('uso: icons add <nombre...> [--yes]'), process.exit(1)

  const m = manifest()
  const cat = catalog()
  const added = []

  for (const n of requested) {
    if (!cat.has(n)) {
      const near = [...cat.keys()].map(k => [dist(n, k), k]).sort((a, b) => a[0] - b[0]).slice(0, 5)
      console.error(`✗ "${n}" no existe en Material Symbols Rounded.`)
      console.error(`  ¿quisiste decir? ${near.map(c => c[1]).join(' · ')}`)
      console.error(`  o probá: icons search ${n.split('_')[0]}`)
      process.exit(1)
    }
    if (m.names.includes(n)) {
      console.log(`· "${n}" ya está en el set. No hay nada que bajar.`)
      continue
    }
    const tags = new Set(cat.get(n).t)
    const similar = m.names
      .map(k => [[...tags].filter(t => cat.get(k)?.t.includes(t)).length, k])
      .filter(([c]) => c >= 2)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 3)
    if (similar.length && !yes) {
      console.error(`? "${n}" se parece a lo que ya tenés:`)
      for (const [c, k] of similar) console.error(`    ${k}: ${c} tags en común (${cat.get(k).t.slice(0, 5).join(', ')})`)
      console.error(`  Si igual lo querés: icons add ${n} --yes`)
      process.exit(1)
    }
    added.push(n)
  }

  if (!added.length) return
  m.names = [...new Set([...m.names, ...added])].sort()
  writeFileSync(P.manifest, JSON.stringify(m, null, 2) + '\n')
  console.log(`+ ${added.join(', ')}`)
  await sync()
}

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
  const inManifest = new Set(m.names)
  const used = new Set()
  for (const f of [...fuentes(join(root, 'src')), ...fuentes(join(root, 'kit/src'))]) {
    const src = readFileSync(f, 'utf8')
    for (const re of [/\bicon(?:End)?=["']([a-z0-9_]+)["']/g, /\bname=["']([a-z0-9_]+)["']/g, /\bicon:\s*'([a-z0-9_]+)'/g]) {
      for (const mm of src.matchAll(re)) used.add(mm[1])
    }
    for (const mm of src.matchAll(/['"`]([a-z][a-z0-9_]{2,})['"`]/g)) {
      if (inManifest.has(mm[1])) used.add(mm[1])
    }
  }
  const missing = [...used].filter(n => !inManifest.has(n) && catalog().has(n)).sort()
  const sinUso = m.names.filter(n => !used.has(n)).sort()
  if (missing.length) console.error(`✗ usados pero fuera del manifiesto: ${missing.join(', ')}`)
  if (sinUso.length) console.log(`· en el manifiesto sin ningún uso (${sinUso.length}): ${sinUso.join(', ')}`)
  if (!missing.length) console.log('✓ todo lo que se usa está en el manifiesto')
  process.exit(missing.length ? 1 : 0)
}

const [cmd, ...args] = process.argv.slice(2)
if (cmd === 'sync') await sync()
else if (cmd === 'add') await add(args)
else if (cmd === 'check') check()
else if (cmd === 'search') {
  const cat = catalog()
  const have = new Set(manifest().names)
  const hits = search(args.join(' '), cat)
  if (!hits.length) console.log('nada')
  for (const c of hits) console.log(`  ${have.has(c.n) ? '✓' : ' '} ${c.n.padEnd(30)} ${String(c.p).padStart(7)}  ${c.t.slice(0, 5).join(', ')}`)
  console.log(`\n  ✓ = ya está en el set`)
} else {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*?/, '').replace(/^ \* ?/gm, ''))
}
