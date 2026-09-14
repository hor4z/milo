import { useEffect } from 'react'

/** Bloquear el scroll del fondo mientras hay un overlay abierto. */
let lockCount = 0

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    lockCount++
    if (lockCount === 1) {
      const gap = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (gap > 0) document.body.style.paddingRight = `${gap}px`
    }
    return () => {
      lockCount--
      if (lockCount === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [active])
}

export const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Tab no se sale del modal, y al cerrar el foco vuelve a donde estaba. */
export function useFocusTrap(active: boolean, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return
    const previous = document.activeElement as HTMLElement | null
    const node = ref.current

    const ensureFocus = () => {
      if (!node || node.contains(document.activeElement)) return
      const target = node.querySelector<HTMLElement>('[data-autofocus]') ?? node
      target.focus({ preventScroll: true })
    }
    ensureFocus()
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      ensureFocus()
      raf2 = requestAnimationFrame(ensureFocus)
    })

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => el.offsetParent !== null)
      if (!items.length) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      document.removeEventListener('keydown', onKey)
      if (previous && previous !== document.body && previous.isConnected) previous.focus()
    }
  }, [active, ref])
}
