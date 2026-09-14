import s from './toolbar.module.css'
import { useLayoutEffect, useRef, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'

/** La barra de herramientas: una sola parada de tabulación y flechas adentro, como manda un `toolbar`. */
export function Toolbar({ label, children, className }: {
  /** Qué controla esta barra. Dos barras sin nombre en una pantalla se leen como una sola. */
  label: string
  children: ReactNode
  className?: string
}) {
  const barRef = useRef<HTMLDivElement>(null)

  const enabledButtons = () => [...(barRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])]

  const roveTo = (active?: HTMLButtonElement) => {
    const enabled = enabledButtons()
    if (!enabled.length) return
    const target = active && enabled.includes(active) ? active : enabled[0]
    for (const b of enabled) b.tabIndex = b === target ? 0 : -1
  }

  useLayoutEffect(() => { roveTo() })

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    const toEdge = e.key === 'Home' ? 0 : e.key === 'End' ? -1 : null
    if (!step && toEdge === null) return
    const buttons = enabledButtons()
    if (!buttons.length) return
    e.preventDefault()
    const next = toEdge !== null
      ? buttons.at(toEdge)!
      : buttons[(buttons.indexOf(document.activeElement as HTMLButtonElement) + step + buttons.length) % buttons.length]
    roveTo(next)
    next.focus()
  }

  return (
    <div
      ref={barRef}
      role="toolbar"
      aria-label={label}
      onKeyDown={onKey}
      onFocus={(e: FocusEvent<HTMLDivElement>) => roveTo(e.target.closest('button') ?? undefined)}
      className={cx(`${s.root} bg-popover`, className)}
    >
      {children}
    </div>
  )
}

/** Un botón de la barra. Con `pressed` es un interruptor y lo dice: "negrita, activado". */
export function ToolbarButton({ icon, label, pressed, disabled, onClick }: {
  icon: IconName
  /** Sin esto el botón no dice nada: adentro solo hay un glifo. */
  label: string
  /** Presente lo vuelve un interruptor. Ausente es una acción que pasa y no queda. */
  pressed?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      tabIndex={-1}
      className={cx(
        `${s.button} touch-target`,
        s.disabled,
        pressed ? s.buttonOn : s.buttonOff,
      )}
    >
      <Icon name={icon} size={18} />
    </button>
  )
}

/** El corte entre dos grupos de la barra. */
export function ToolbarSeparator() {
  return <span aria-hidden className={s.separator} />
}
