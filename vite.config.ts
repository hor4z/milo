import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/** Una entrada por pieza y por utilidad: sin barril, el consumidor importa lo que usa. */
function entries() {
  const out: Record<string, string> = {
    'icons.gen': 'src/icons.gen.ts',
    'icons.meta': 'src/icons.meta.ts',
    'props.gen': 'src/props.gen.ts',
  }
  for (const folder of readdirSync('src')) {
    const dir = join('src', folder)
    if (!statSync(dir).isDirectory() || folder === '__tests__' || folder === 'styles' || folder === 'assets') continue
    if (folder === 'lib') {
      for (const file of readdirSync(dir)) {
        if (!file.endsWith('.ts') || file.endsWith('.test.ts')) continue
        out[`lib/${file.slice(0, -3)}`] = join(dir, file)
      }
      continue
    }
    for (const ext of ['tsx', 'ts']) {
      const file = join(dir, `${folder}.${ext}`)
      try { statSync(file); out[`${folder}/${folder}`] = file; break } catch { /* la pieza no está en ese ext */ }
    }
  }
  return out
}

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: entries(), formats: ['es'] },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
      output: { assetFileNames: 'style.css' },
    },
  },
})
