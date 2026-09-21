import { useEffect, type RefObject } from 'react'

const dentro = (refs: RefObject<HTMLElement | null>[], t: EventTarget | null) =>
  t instanceof Node && refs.some(r => r.current?.contains(t))

/** Soltar algo al tocar afuera, y nada más. Va con `pointerdown` y no con `click` porque el mismo gesto que abre otra cosa la cerraría y la reabriría. */
export function useOutside(
  active: boolean,
  close: () => void,
  refs: RefObject<HTMLElement | null>[],
) {
  useEffect(() => {
    if (!active) return
    const outside = (e: PointerEvent) => { if (!dentro(refs, e.target)) close() }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [active])
}

/** Cerrar un panel anclado: tocar afuera, scrollear la página o cambiar el tamaño. Las dos últimas son porque la posición se calculó una vez contra el disparador, así que esto no sirve para algo que no se midió contra nada: para eso está `useOutside`. */
export function useDismiss(
  active: boolean,
  close: () => void,
  refs: RefObject<HTMLElement | null>[],
) {
  useOutside(active, close, refs)
  useEffect(() => {
    if (!active) return
    const scrolled = (e: Event) => {
      if (e.type === 'scroll' && dentro(refs, e.target)) return
      close()
    }
    window.addEventListener('scroll', scrolled, true)
    window.addEventListener('resize', scrolled)
    return () => {
      window.removeEventListener('scroll', scrolled, true)
      window.removeEventListener('resize', scrolled)
    }
  }, [active])
}
