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

  return { ref, scrolls, clipped }
}
