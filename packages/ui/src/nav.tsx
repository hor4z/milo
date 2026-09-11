import type { ReactNode } from 'react'
import { cx } from './primitives'
import { Icon, type IconName } from './icon'

/**
 * El item de navegación, en dos mitades: las clases del contenedor y el
 * contenido de adentro.
 *
 * Va partido y no como un componente único por culpa del router: `NavLink`
 * recibe `className` y `children` como funciones de su propio estado, así que
 * un componente que envuelva el elemento tiene que reimplementar esa API o
 * perderla. Partirlo deja que quien navega elija el elemento —un `NavLink`, un
 * `button`, un `<a>`— y que el sistema decida cómo se ve, que es el reparto
 * correcto. Las dos mitades van siempre juntas: `navItemClass` sin
 * `NavItemBody` deja el texto pegado al borde, porque la sangría de 3 del
 * contenedor asume que adentro hay un cuadro de icono de 34.
 *
 * Medidas: 40 de alto, radio 12, el icono en un cuadrado de 34 pegado al borde
 * izquierdo (padding de 3) y la etiqueta a 12/600.
 *
 * **El activo no se marca con color ni con `--relief-pressed`.** Es una
 * pastilla apagada con un anillo de un píxel, y el icono pasa a un chip de
 * papel con su propio anillo. `pressed` es la receta de algo que se aprieta y
 * vuelve —un toggle mientras su panel está abierto— y un item de nav no vuelve:
 * se queda. Con la sombra hundida puesta acá, el sidebar entero se lee como una
 * fila de botones apretados.
 *
 * **Y el inactivo va en tinta, no en gris.** Con la etiqueta apagada, una lista
 * de siete espacios se lee como si estuviera toda deshabilitada. Es el error
 * que ya se rompió tres veces en este repo.
 */

export function navItemClass({
  active, collapsed, muted,
}: { active?: boolean; collapsed?: boolean; muted?: boolean } = {}) {
  return cx(
    /* `text-left` explícito: un `<button>` centra su texto por defecto y un
       `<a>` no, así que sin esto la misma receta se ve distinta según con qué
       elemento la use quien navega. Es justo lo que la receta compartida tiene
       que evitar. */
    'flex h-10 items-center gap-3 rounded-lg text-left text-xs font-semibold',
    'transition-[background-color,box-shadow] duration-[120ms] ease-out',
    collapsed ? 'justify-center px-0' : 'pr-3 pl-[3px]',
    active
      ? 'bg-muted text-ink shadow-[0_0_0_1px_var(--border)]'
      /* `muted` es para lo que no es navegación aunque comparta la forma: el
         botón de contraer. Va en gris porque no compite con los destinos. */
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
  badge?: string
  active?: boolean
  collapsed?: boolean
  /**
   * El chip de papel detrás del icono cuando el item está activo. Existe para
   * levantar un icono monocromo de la pastilla apagada; un glifo que ya trae su
   * color propio —la carpeta de un espacio— no lo necesita, y con el chip puesto
   * el color de la carpeta pelea contra el papel.
   */
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

      {/* El badge va hundido, como el kbd: un contador no es accionable. */}
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
