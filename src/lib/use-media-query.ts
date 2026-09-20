import { useSyncExternalStore } from 'react'

/** Si una media query se cumple, y se entera cuando cambia. Fuera del navegador devuelve `false`. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (avisar) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', avisar)
      return () => mql.removeEventListener('change', avisar)
    },
    () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches),
    () => false,
  )
}

/** Quién pidió menos movimiento. Lo que informa por moverse necesita otra salida, no quedarse quieto. */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/** Un dedo y no un mouse: el objetivo de toque sube a 44. */
export function useCoarsePointer() {
  return useMediaQuery('(pointer: coarse)')
}
