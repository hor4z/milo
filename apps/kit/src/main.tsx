import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrefsProvider } from '@melu/ui'
import { App } from './App'
import './app.css'

/* `PrefsProvider` y no un `useState` propio: es el que aplica el tema en
   `<html>`, que es donde tiene que ir para que los portales —que viven en el
   `<body>`, fuera de cualquier wrapper de React— también cambien. */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
)
