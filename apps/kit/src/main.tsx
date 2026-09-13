/* El CSS del sistema va primero y no es un gusto: adentro se declara el orden
   de las capas, y una capa vale por cuándo se la encuentra. Importado después de
   las piezas, los módulos registran las suyas antes y el reset le gana a todo. */
import './app.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrefsProvider } from '@milo/ui'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
)
