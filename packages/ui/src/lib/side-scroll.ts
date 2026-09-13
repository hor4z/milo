import { useEffect, useRef, useState } from 'react'

/** Mide si una caja desborda de costado, y si todavía queda algo a la derecha. */
export function useSideScroll<T extends HTMLElement>(deps?: unknown) {
  const ref = useRef<T>(null)
  const [scrolls, setScrolls] = useState(false)
  const [clipped, setClipped] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      setScrolls(el.scrollWidth > el.clientWidth + 1)
      setClipped(el.scrollWidth - el.clientWidth - el.scrollLeft > 1)
    }
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(el)
    return () => {
      el.removeEventListener('scroll', measure)
      ro?.disconnect()
    }
  }, [deps])

  // `scrolls` decide si la caja es una parada de tabulación: lo que se corta a
  // la derecha no se alcanza con el teclado de ninguna otra forma, y una parada
  // de más en algo que entra entero es ruido.
  return { ref, scrolls, clipped }
}
