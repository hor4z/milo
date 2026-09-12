import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrefsProvider } from '@milo/ui'
import { App } from './App'
import './app.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
)
