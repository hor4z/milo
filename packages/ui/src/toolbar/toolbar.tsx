import { useRef, type KeyboardEvent, type ReactNode } from 'react'
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

  // Un `role="toolbar"` promete flechas y una sola parada de tabulación. Sin
  // esto se recorrería con Tab, que es lo que una barra justamente no hace:
  // con doce botones, llegar al contenido de al lado costaría doce tabulaciones.
  const mover = (e: KeyboardEvent<HTMLDivElement>) => {
    const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    const borde = e.key === 'Home' ? 0 : e.key === 'End' ? -1 : null
    if (!paso && borde === null) return
    const botones = [...(caja.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])]
    if (!botones.length) return
    e.preventDefault()
    const destino = borde !== null
      ? botones.at(borde)!
      : botones[(botones.indexOf(document.activeElement as HTMLButtonElement) + paso + botones.length) % botones.length]
    destino.focus()
  }

  return (
    <div
      ref={caja}
      role="toolbar"
      aria-label={label}
      onKeyDown={mover}
      className={cx('flex items-center gap-1 rounded-xl border border-line bg-popover p-1 shadow-toolbar', className)}
    >
      {children}
    </div>
  )
}

/** Un botón de la barra. Con `pressed` es un interruptor y lo dice: «negrita, activado». */
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
      // Una sola parada de tabulación: entra en el primero y adentro se mueve
      // con flechas. Sin `tabIndex` cada botón sería una parada.
      tabIndex={-1}
      className={cx(
        'inline-flex size-8 items-center justify-center rounded-md transition-colors duration-fast ease-out',
        'disabled:pointer-events-none disabled:opacity-45',
        pressed ? 'bg-muted text-ink' : 'text-ink-muted hover:bg-hover hover:text-ink',
      )}
    >
      <Icon name={icon} size={18} />
    </button>
  )
}

/** El corte entre dos grupos de la barra. */
export function ToolbarSeparator() {
  return <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-line" />
}
