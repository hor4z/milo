import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Kbd } from '../kbd/kbd'
import { Icon, type IconName } from '../icon/icon'

/** El menú, en piezas. */
export function Menu({ children, width, className }: {
  children: ReactNode
  width?: number
  className?: string
}) {
  return (
    <div
      role="menu"
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
  disabled?: boolean
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
        'flex h-10 w-full items-center gap-3.5 rounded-lg px-2.5 text-left text-xs font-semibold',
        'transition-colors duration-[120ms]',
        'disabled:pointer-events-none disabled:opacity-45',
        danger ? 'text-bad hover:bg-bad-subtle' : 'text-ink hover:bg-hover',
        className,
      )}
    >
      {icon && <Icon name={icon} size={20} className={danger ? undefined : 'icon-muted'} />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut && <Kbd>{shortcut}</Kbd>}
      {hint && <span className="shrink-0 text-2xs font-medium text-ink-muted">{hint}</span>}
      {checked && <Icon name="check" size={18} />}
      {submenu && <Icon name="chevron_right" size={18} className="icon-muted -mr-1" />}
    </button>
  )
}

/** El rótulo de un grupo de opciones. */
export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <div role="presentation" className="px-2.5 pt-2 pb-1.5 text-2xs font-semibold tracking-wide text-ink">
      {children}
    </div>
  )
}
