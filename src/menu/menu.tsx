import cls from './menu.module.css'
import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Kbd } from '../kbd/kbd'
import { Icon, type IconName } from '../icon/icon'

function Root({ children, label, width, className }: {
  children: ReactNode
  /** Qué menú es. Sin esto un lector lo anuncia como "menú" y nada más, y con dos abiertos en una pantalla no se distinguen. */
  label?: string
  /** Opcional: sin él, el panel mide lo que su contenido. */
  width?: number
  className?: string
}) {
  const box = useRef<HTMLDivElement>(null)

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
      aria-label={label}
      onKeyDown={move}
      style={width ? { width } : undefined}
      className={cx(
        `${cls.root} ui-pop bg-popover`,
        cls.separator,
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Una fila del menú. */
function Item({
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
        cls.item,
        cls.itemMotion,
        cls.disabled,
        danger ? cls.danger : cls.plain,
        className,
      )}
    >
      {icon && <Icon name={icon} size={20} className={danger ? undefined : 'icon-muted'} />}
      <span className={cls.label}>{children}</span>
      {shortcut && <Kbd>{shortcut}</Kbd>}
      {hint && <span className={cls.hint}>{hint}</span>}
      {checked && <Icon name="check" size={18} />}
      {submenu && <Icon name="chevron_right" size={18} className={`${cls.submenuChevron} icon-muted`} />}
    </button>
  )
}

/** El rótulo de un grupo de opciones. */
function Label({ children }: { children: ReactNode }) {
  return (
    <div role="presentation" className={cls.groupLabel}>
      {children}
    </div>
  )
}

/** El menú, en piezas. */
export const Menu = Object.assign(Root, { Item, Label })
