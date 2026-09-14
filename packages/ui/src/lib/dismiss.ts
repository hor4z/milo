import { useEffect, type RefObject } from 'react'

/** Cerrar un panel anclado: tocar afuera, scrollear la página o cambiar el tamaño. */
export function useDismiss(
  active: boolean,
  close: () => void,
  refs: RefObject<HTMLElement | null>[],
) {
  useEffect(() => {
    if (!active) return
    const inside = (t: EventTarget | null) =>
      t instanceof Node && refs.some(r => r.current?.contains(t))

    const outside = (e: PointerEvent) => { if (!inside(e.target)) close() }

    const scrolled = (e: Event) => {
      if (e.type === 'scroll' && inside(e.target)) return
      close()
    }

    document.addEventListener('pointerdown', outside)
    window.addEventListener('scroll', scrolled, true)
    window.addEventListener('resize', scrolled)
    return () => {
      document.removeEventListener('pointerdown', outside)
      window.removeEventListener('scroll', scrolled, true)
      window.removeEventListener('resize', scrolled)
    }
  }, [active])
}
