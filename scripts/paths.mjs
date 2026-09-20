/** Escribe el `paths` de tsconfig.json con una entrada por pieza: TypeScript admite una sola estrella por sustitución, así que el patrón genérico no puede resolver a una carpeta y su archivo. Con `--check` falla si quedó viejo. */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const file = join(root, 'tsconfig.json')

const paths = {
  '@milo/ui/icons.meta': ['./src/icons.meta.ts'],
  '@milo/ui/icons': ['./src/icons.gen.ts'],
  '@milo/ui/props': ['./src/props.gen.ts'],
  '@milo/ui/lib/*': ['./src/lib/*'],
}

for (const folder of readdirSync(src).sort()) {
  const dir = join(src, folder)
  if (!statSync(dir).isDirectory()) continue
  if (['__tests__', 'lib', 'styles', 'assets'].includes(folder)) continue
  const entry = readdirSync(dir).find(f => f === `${folder}.tsx` || f === `${folder}.ts`)
  if (entry) paths[`@milo/ui/${folder}`] = [`./src/${folder}/${entry}`]
}

const config = JSON.parse(readFileSync(file, 'utf8'))
config.compilerOptions.paths = paths
const body = JSON.stringify(config, null, 2) + '\n'

if (process.argv.includes('--check')) {
  if (readFileSync(file, 'utf8') !== body) {
    console.error('✗ el paths de tsconfig.json quedó viejo: corré `npm run paths`')
    process.exit(1)
  }
  console.log(`✓ paths al día (${Object.keys(paths).length} entradas)`)
} else {
  writeFileSync(file, body)
  console.log(`✓ ${Object.keys(paths).length} entradas en paths`)
}
