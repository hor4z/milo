import cls from './nav.module.css'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Icon, type IconName } from '../icon/icon'

/** El item de navegación, en dos mitades: las clases del contenedor y el contenido de adentro. */

export function navItemClass({
  active, collapsed, muted,
}: { active?: boolean; collapsed?: boolean; muted?: boolean } = {}) {
  return cx(
    cls.root,
    cls.motion,
    collapsed ? cls.collapsed : cls.expanded,
    active
      ? cls.active
      : muted
        ? cls.muted
        : cls.plain,
  )
}

export function NavItemBody({
  icon, glyph, label, badge, collapsed,
}: {
  /** El glifo del set; para uno propio va `glyph`. */
  icon?: IconName
  /** Para cuando el glifo no sale del set: la carpeta de color de un espacio. */
  glyph?: ReactNode
  /** El texto del item, que se esconde al contraerse. */
  label: string
  /** Hundido como un kbd: un contador no es accionable. */
  badge?: string
  /** El riel de 72: queda el icono y nada más. */
  collapsed?: boolean
}) {
  return (
    <>
      <span className={cls.glyphSlot}>
        <span className={cls.glyph}>
          {glyph ?? (icon && <Icon name={icon} size={20} className={cls.icon} />)}
        </span>
      </span>

      {!collapsed && <span className={cls.label}>{label}</span>}

      {!collapsed && badge && (
        <span className={`${cls.count} inset-relief tabular`}>
          {badge}
        </span>
      )}
    </>
  )
}

/** La sangría de los subitems: la columna del texto del padre, no un valor nuevo. */
export function navSubItemClass({ active }: { active?: boolean } = {}) {
  return cx(
    cls.subitem,
    cls.subitemMotion,
    active
      ? cls.subitemActive
      : cls.subitemPlain,
  )
}
