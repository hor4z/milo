import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@milo\/ui\/icons\.meta$/, replacement: `${src}/icons.meta.ts` },
      { find: /^@milo\/ui\/icons$/, replacement: `${src}/icons.gen.ts` },
      { find: /^@milo\/ui\/props$/, replacement: `${src}/props.gen.ts` },
      { find: /^@milo\/ui\/theme\.css$/, replacement: `${src}/theme.css` },
      { find: /^@milo\/ui\/lib\/(.+)$/, replacement: `${src}/lib/$1` },
      { find: /^@milo\/ui\/([^/]+)$/, replacement: `${src}/$1/$1` },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'kit/**/*.test.{ts,tsx}'],
    css: false,
  },
})
