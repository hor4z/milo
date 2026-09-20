import './app.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrefsProvider } from '@milo/ui/prefs'
import { App } from './app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
)
