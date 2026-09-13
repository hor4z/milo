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
    cls.box,
    collapsed ? cls.box2 : cls.box3,
    active
      ? cls.box4
      : muted
        ? cls.box5
        : cls.box6,
  )
}

export function NavItemBody({
  icon, glyph, label, badge, active, collapsed, chip = true,
}: {
  /** El glifo del set; para uno propio va `glyph`. */
  icon?: IconName
  /** Para cuando el glifo no sale del set: la carpeta de color de un espacio. */
  glyph?: ReactNode
  /** El texto del item, que se esconde al contraerse. */
  label: string
  /** Hundido como un kbd: un contador no es accionable. */
  badge?: string
  /** Dónde estás parado. Se marca con el azul primario y su canto. */
  active?: boolean
  /** El riel de 72: queda el icono y nada más. */
  collapsed?: boolean
  /** El chip de papel detrás del icono cuando el item está activo. */
  chip?: boolean
}) {
  return (
    <>
      <span className={cls.span}>
        <span
          className={cx(
            cls.span2,
            active && chip && `${cls.chip} bg-surface`,
          )}
        >
          {glyph ?? (icon && <Icon name={icon} size={20} className={cls.icon} />)}
        </span>
      </span>

      {!collapsed && <span className={cls.span3}>{label}</span>}

      {!collapsed && badge && (
        <span className={`${cls.span4} inset-relief tabular`}>
          {badge}
        </span>
      )}
    </>
  )
}

/** La sangría de los subitems: la columna del texto del padre, no un valor nuevo. */
export function navSubItemClass({ active }: { active?: boolean } = {}) {
  return cx(
    cls.box7,
    cls.box8,
    active
      ? cls.box9
      : cls.box10,
  )
}
