import { useCallback, useEffect, useRef } from 'react'

const ID = 'milo-live'

/** La región viva, una sola para todo el documento: dos regiones compitiendo se pisan. */
function region(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const ya = document.getElementById(ID)
  if (ya) return ya
  const el = document.createElement('div')
  el.id = ID
  el.className = 'sr-only'
  el.setAttribute('aria-atomic', 'true')
  document.body.append(el)
  return el
}

/** Decirle algo a quien escucha la pantalla cuando el cambio no tiene dónde leerse: cuántos resultados quedaron, que se guardó, dónde quedó la fila que acaba de moverse. */
export function useAnnounce() {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  return useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const el = region()
    if (!el) return
    el.setAttribute('aria-live', politeness)
    el.textContent = ''
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { el.textContent = message }, 50)
  }, [])
}
