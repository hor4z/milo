import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'icons.meta': 'src/icons.meta.ts',
        'props.gen': 'src/props.gen.ts',
      },
      formats: ['es'],
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
      output: { assetFileNames: 'style.css' },
    },
  },
})
