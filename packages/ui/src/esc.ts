import { useEffect } from 'react'

/** `Escape` cierra solo el overlay de arriba, y para eso hace falta una pila global: cada overlay se anota al abrirse y solo reacciona si es el último. */
const escStack: symbol[] = []

export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const token = Symbol('overlay')
    escStack.push(token)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (escStack[escStack.length - 1] !== token) return
      e.stopPropagation()
      onEscape()
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      const i = escStack.indexOf(token)
      if (i >= 0) escStack.splice(i, 1)
    }
  }, [active, onEscape])
}
