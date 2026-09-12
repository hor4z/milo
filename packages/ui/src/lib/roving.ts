import { useRef } from 'react'

type Option<T extends string> = { value: T; disabled?: boolean }

/** La receta de un grupo donde se elige una opción: flechas para moverse y una sola parada de tabulación. */
export function useRovingRadio<T extends string>(
  value: T,
  onChange: (v: T) => void,
  options: readonly Option<T>[],
) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const live = options.filter(o => !o.disabled)

  const step = (dir: 1 | -1) => {
    if (!live.length) return
    const i = live.findIndex(o => o.value === value)
    const next = live[(i + dir + live.length) % live.length].value
    onChange(next)
    refs.current[next]?.focus()
  }

  return {
    onKeyDown(e: { key: string; preventDefault: () => void }) {
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
      if (!dir) return
      e.preventDefault()
      step(dir)
    },
    ref: (v: T) => (el: HTMLButtonElement | null) => { refs.current[v] = el },
    tabIndex: (v: T) =>
      v === value || (!live.some(l => l.value === value) && v === live[0]?.value) ? 0 : -1,
  }
}
