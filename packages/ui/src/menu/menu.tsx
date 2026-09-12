import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Kbd } from '../kbd/kbd'
import { Icon, type IconName } from '../icon/icon'

/** El menú, en piezas. */
export function Menu({ children, width, className }: {
  children: ReactNode
  /** Opcional: sin él, el panel mide lo que su contenido. */
  width?: number
  className?: string
}) {
  const box = useRef<HTMLDivElement>(null)

  // Un `role="menu"` promete flechas. Sin esto, las prometía y no las traía:
  // se recorría con Tab, que es lo que un menú justamente no hace.
  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0
    const edge = e.key === 'Home' ? 0 : e.key === 'End' ? -1 : null
    if (!step && edge === null) return
    const items = [...(box.current?.querySelectorAll<HTMLButtonElement>('[role^="menuitem"]:not(:disabled)') ?? [])]
    if (!items.length) return
    e.preventDefault()
    if (edge !== null) return items.at(edge)!.focus()
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    items[(i + step + items.length) % items.length].focus()
  }

  return (
    <div
      ref={box}
      role="menu"
      onKeyDown={move}
      style={width ? { width } : undefined}
      className={cx(
        'ui-pop rounded-xl border border-line bg-popover p-1 shadow-popover',
        '[&>[data-divider]]:-mx-1 [&>[data-divider]]:my-1.5',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Una fila del menú. */
export function MenuItem({
  children, icon, shortcut, hint, checked, submenu, danger, disabled, onSelect, className,
}: {
  children: ReactNode
  /** A la izquierda, en gris. */
  icon?: IconName
  /** El atajo, en un Kbd. */
  shortcut?: string
  /** Una línea de apoyo a la derecha, en gris. */
  hint?: string
  /** El tilde de "esta es la que está puesta". */
  checked?: boolean
  /** El chevron de "hay otro nivel". */
  submenu?: boolean
  /** Borrar, salir, revocar: lo que no se deshace. */
  danger?: boolean
  /** Apagada y a la vista: las flechas la saltean. */
  disabled?: boolean
  /** Cerrar el panel es de quien lo abrió. */
  onSelect?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      role={checked === undefined ? 'menuitem' : 'menuitemradio'}
      aria-checked={checked}
      onClick={onSelect}
      className={cx(
        'flex h-10 w-full items-center gap-3.5 rounded-lg px-2.5 text-left text-body font-semibold',
        'transition-colors duration-[120ms]',
        'disabled:pointer-events-none disabled:opacity-45',
        danger ? 'text-bad-ink hover:bg-bad-subtle' : 'text-ink hover:bg-hover',
        className,
      )}
    >
      {icon && <Icon name={icon} size={20} className={danger ? undefined : 'icon-muted'} />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut && <Kbd>{shortcut}</Kbd>}
      {hint && <span className="shrink-0 text-meta font-medium text-ink-muted">{hint}</span>}
      {checked && <Icon name="check" size={18} />}
      {submenu && <Icon name="chevron_right" size={18} className="icon-muted -mr-1" />}
    </button>
  )
}

/** El rótulo de un grupo de opciones. */
export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <div role="presentation" className="px-2.5 pt-2 pb-1.5 text-label font-semibold text-ink">
      {children}
    </div>
  )
}
