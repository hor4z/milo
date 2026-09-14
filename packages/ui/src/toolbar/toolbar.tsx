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
  const caja = useRef<HTMLDivElement>(null)

  const vivos = () => [...(caja.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])]

  const rodar = (activo?: HTMLButtonElement) => {
    const bs = vivos()
    if (!bs.length) return
    const elegido = activo && bs.includes(activo) ? activo : bs[0]
    for (const b of bs) b.tabIndex = b === elegido ? 0 : -1
  }

  useLayoutEffect(() => { rodar() })

  const mover = (e: KeyboardEvent<HTMLDivElement>) => {
    const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    const borde = e.key === 'Home' ? 0 : e.key === 'End' ? -1 : null
    if (!paso && borde === null) return
    const botones = vivos()
    if (!botones.length) return
    e.preventDefault()
    const destino = borde !== null
      ? botones.at(borde)!
      : botones[(botones.indexOf(document.activeElement as HTMLButtonElement) + paso + botones.length) % botones.length]
    rodar(destino)
    destino.focus()
  }

  return (
    <div
      ref={caja}
      role="toolbar"
      aria-label={label}
      onKeyDown={mover}
      onFocus={(e: FocusEvent<HTMLDivElement>) => rodar(e.target.closest('button') ?? undefined)}
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
        s.button,
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
