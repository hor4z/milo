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

    const afuera = (e: PointerEvent) => { if (!inside(e.target)) close() }

    const corrio = (e: Event) => {
      if (e.type === 'scroll' && inside(e.target)) return
      close()
    }

    document.addEventListener('pointerdown', afuera)
    window.addEventListener('scroll', corrio, true)
    window.addEventListener('resize', corrio)
    return () => {
      document.removeEventListener('pointerdown', afuera)
      window.removeEventListener('scroll', corrio, true)
      window.removeEventListener('resize', corrio)
    }
  }, [active])
}
