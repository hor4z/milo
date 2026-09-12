import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Icon, type IconName } from '../icon/icon'

/** El item de navegación, en dos mitades: las clases del contenedor y el contenido de adentro. */

export function navItemClass({
  active, collapsed, muted,
}: { active?: boolean; collapsed?: boolean; muted?: boolean } = {}) {
  return cx(
    'flex h-10 items-center gap-3 rounded-lg text-left text-xs font-semibold',
    'transition-[background-color,box-shadow] duration-[120ms] ease-out',
    collapsed ? 'justify-center px-0' : 'pr-3 pl-[3px]',
    active
      ? 'bg-muted text-ink shadow-[0_0_0_1px_var(--border)]'
      : muted
        ? 'text-ink-muted hover:bg-hover hover:text-ink'
        : 'text-ink hover:bg-hover',
  )
}

export function NavItemBody({
  icon, glyph, label, badge, active, collapsed, chip = true,
}: {
  icon?: IconName
  /** Para cuando el glifo no sale del set: la carpeta de color de un espacio. */
  glyph?: ReactNode
  label: string
  /** Hundido como un kbd: un contador no es accionable. */
  badge?: string
  active?: boolean
  collapsed?: boolean
  /** El chip de papel detrás del icono cuando el item está activo. */
  chip?: boolean
}) {
  return (
    <>
      <span className="flex size-[34px] shrink-0 items-center justify-center">
        <span
          className={cx(
            'flex size-[26px] items-center justify-center rounded-md transition-[background-color,box-shadow] duration-[120ms]',
            active && chip && 'bg-surface shadow-[0_0_0_1px_var(--border)]',
          )}
        >
          {glyph ?? (icon && <Icon name={icon} size={20} className="text-ink" />)}
        </span>
      </span>

      {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}

      {!collapsed && badge && (
        <span className="inset-relief tabular rounded-sm bg-muted px-1.5 py-0.5 text-2xs font-medium text-ink-muted">
          {badge}
        </span>
      )}
    </>
  )
}

/** La sangría de los subitems: la columna del texto del padre, no un valor nuevo. */
export function navSubItemClass({ active }: { active?: boolean } = {}) {
  return cx(
    'flex h-9 items-center rounded-lg pr-3 pl-12 text-left text-xs font-semibold transition-colors duration-[120ms]',
    active ? 'text-ink' : 'text-ink-muted hover:text-ink',
  )
}
