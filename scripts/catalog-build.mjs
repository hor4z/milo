/* Poda el catálogo de Google a lo que necesitamos y lo deja versionado.
   Se corre a mano cuando Google publica iconos nuevos: `npm run icons refresh`. */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
const SRC = 'https://fonts.google.com/metadata/icons?incomplete=1&key=material_symbols'
const here = dirname(fileURLToPath(import.meta.url))

const res = await fetch(SRC, { headers: { 'User-Agent': UA } })
if (!res.ok) throw new Error(`metadata: HTTP ${res.status}`)
// La respuesta viene con el prefijo anti-hijacking `)]}'` en la primera línea.
const raw = (await res.text()).replace(/^\)\]\}'\s*/, '')
const { icons } = JSON.parse(raw)

const seen = new Map()
for (const i of icons) {
  if (seen.has(i.name)) continue
  // `unsupported_families` dice en qué familias NO existe. Nos importa Rounded.
  if (i.unsupported_families?.includes('Material Symbols Rounded')) continue
  /* Los tags vienen con ruido: para `search` llegan "discover" y "discover icon",
     que es la misma palabra dos veces. Y los que repiten el propio nombre del
     icono no aportan nada, porque la búsqueda ya matchea contra el nombre. */
  const own = new Set(i.name.split('_'))
  const tags = [...new Set((i.tags ?? [])
    .map(t => t.replace(/\s+icon$/, '').trim().toLowerCase())
    .filter(t => t && !own.has(t)))].slice(0, 8)
  seen.set(i.name, { n: i.name, c: i.codepoint, p: i.popularity, t: tags })
}
const out = [...seen.values()].sort((a, b) => a.n.localeCompare(b.n))
const path = join(here, 'catalog.json')
writeFileSync(path, JSON.stringify(out))
console.log(`catálogo: ${out.length} iconos · ${(JSON.stringify(out).length / 1024).toFixed(0)} KB → ${path}`)
