import type { ReactNode } from 'react'
import { cx } from './primitives'
import { Icon, type IconName } from './icon'

/**
 * La lista de acciones: filas altas, cada una con una marca de color, un título
 * y una línea de apoyo.
 *
 * No es `Row`. `Row` es la fila de un panel de ajustes: 56 de alto, texto de
 * interfaz, un control a la derecha y un divisor de un píxel entre filas. Esta
 * es una lista de cosas para hacer o para entrar, y todo lo suyo es al revés:
 * no hay divisores —cada fila es su propia caja con aire alrededor—, el título
 * sube a 16 porque es lo que se lee primero, y la marca de color es lo que te
 * deja encontrar una fila de reojo sin leerla.
 *
 * Las dos medidas salen de la regla del anidado: el contenedor tiene radio 24 y
 * 8 de padding, así que la fila lleva 16. Si la fila repitiera el 24 del padre,
 * la curva se vería doble.
 *
 * El alto de 72 no es arbitrario: la marca es de 44 y el aire de 14 arriba y
 * abajo. Cambiar la marca cambia el alto, no el padding.
 */

/* Las marcas van en pares relleno/glifo, y son de esta lista y de nada más.
   Lo chico —un chip, un avatar, un cuadradito de icono— usa `labelFill`, que es
   la familia viva. La diferencia entre las dos es el tamaño de la pieza: una
   marca de 44 dentro de una fila clara tiene lugar para ser un pastel con el
   glifo oscuro y leerse entera sin gritarle al título de al lado. */
const marks = {
  green: 'bg-mark-green text-mark-green-ink',
  purple: 'bg-mark-purple text-mark-purple-ink',
  orange: 'bg-mark-orange text-mark-orange-ink',
  blue: 'bg-mark-blue text-mark-blue-ink',
  pink: 'bg-mark-pink text-mark-pink-ink',
} as const

export type MarkColor = keyof typeof marks

export function List({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-2 rounded-2xl bg-surface p-2 shadow-card', className)}>
      {children}
    </div>
  )
}

export function ListItem({
  icon, color, title, hint, active, onClick, trailing,
}: {
  icon: IconName
  color: MarkColor
  title: string
  hint?: string
  /** La fila elegida: queda hundida, no teñida. El color ya lo gasta la marca. */
  active?: boolean
  onClick?: () => void
  trailing?: ReactNode
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cx(
        'flex min-h-[72px] w-full items-center gap-3.5 rounded-xl px-3.5 py-3.5 text-left',
        'transition-[background-color,box-shadow] duration-[120ms] ease-out',
        /* En reposo la fila es papel —blanca, con su canto de un píxel y la
           sombra de tarjeta— y en hover se asienta sobre la superficie: pasa a
           gris y suelta la sombra. Estuvo al revés, apagada en reposo y
           levantándose en hover, con el argumento de que oscurecer lee como
           "deshabilitada". No se sostiene acá: la fila es un elemento de una
           lista de cosas para hacer, así que en reposo tiene que verse
           accionable, y lo que marca el hover es que se hunde bajo el dedo.
           El canto va siempre: sin él, una fila blanca sobre un contenedor
           blanco no tiene dónde terminar. */
        'ring-1 ring-line',
        active ? 'bg-sunken shadow-none' : 'bg-surface shadow-card',
        onClick && !active && 'hover:bg-muted hover:shadow-none',
      )}
    >
      {/* `mark` va en este mismo nodo y no en un padre: el degradado y el
          relieve están escritos contra `currentColor`, y currentColor acá es el
          glifo que pone `marks[color]`. */}
      <span className={cx('mark inline-flex size-11 shrink-0 items-center justify-center rounded-full', marks[color])}>
        <Icon name={icon} size={22} weight={400} />
      </span>

      <span className="min-w-0 flex-1">
        {/* El título en 16/600 y la línea de apoyo en 14/500: dos pasos de la
            escala, no dos tamaños inventados. El apoyo va en gris porque es
            apoyo; el título nunca, ni en una fila sin elegir. */}
        <span className="block truncate text-md font-semibold text-ink">{title}</span>
        {hint && <span className="mt-0.5 block truncate text-base font-medium text-ink-muted">{hint}</span>}
      </span>

      {trailing && <span className="shrink-0">{trailing}</span>}
    </Tag>
  )
}
