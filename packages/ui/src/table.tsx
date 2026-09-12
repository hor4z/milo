import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { cx } from './primitives'

/**
 * La tabla, en piezas. No es un componente que recibe `columns` y `rows`: es un
 * juego de piezas que se arman, como el `<table>` de HTML pero con las medidas
 * del sistema puestas.
 *
 * El corte es ese a propósito. Una tabla de datos y una tabla de personas con
 * un grupo de avatares y un menú al final no comparten nada más que la grilla,
 * y una API de `columns` termina con un `render` por columna que es JSX metido
 * en un objeto — el mismo JSX, pero sin poder leerlo de arriba abajo.
 *
 * Las medidas salen de lo que ya hay:
 *
 * · La fila es de 56, la misma que `Row` en un panel de ajustes. Las dos son
 *   una línea de contenido con un divisor de un píxel entre filas, así que
 *   compartir el alto es lo que hace que una tabla y un panel puestos uno
 *   arriba del otro no se vean de dos sistemas distintos.
 * · La cabecera va en 11 con `tracking-wide` y en **tinta**, no en gris. En 11
 *   el tamaño ya dice "esto es un rótulo"; el gris encima lo apaga tanto que
 *   hay que buscar de qué es cada columna en vez de saberlo de reojo. El gris
 *   es para lo que acompaña a un dato, no para lo que lo nombra.
 * · El contenido va en 12/500, que es la interfaz. Lo que se lee primero dentro
 *   de una fila sube a 14/600, igual que en `ListItem`.
 * · El contenedor lleva radio 10 —`md`, el de lo cuadrado que se toca— y no el
 *   24 de una tarjeta. Una tabla es una grilla de filas rectas: con la curva
 *   grande, las cuatro esquinas se comen el principio y el final de la primera
 *   y la última fila, y el ojo lee una tarjeta con una tabla adentro en vez de
 *   una tabla. No hay padding, así que no hay radio de hijo que calcular.
 * · Las filas van alternadas, una de papel y la siguiente un paso más oscura
 *   (`--surface-alt`). En una tabla ancha el divisor de un píxel no alcanza para
 *   seguir una fila hasta la última columna: la banda sí.
 *
 * El scroll horizontal es obligatorio y va acá adentro. Una tabla es de las
 * tres cosas que pueden ser más anchas que el cuerpo de la página —con un
 * diagrama y un bloque de código—, y siempre dentro de su propio contenedor:
 * la página no scrollea de costado.
 */
export function Table({ children, minWidth = 640, footer, className }: {
  children: ReactNode
  /** Abajo de esto la tabla scrollea en vez de apretar las columnas. */
  minWidth?: number
  /**
   * La franja de abajo: la paginación, un resumen, un botón de exportar.
   *
   * **Va por prop y no como un hermano del `<Table>`**, y no es comodidad: el
   * marco —el radio, el fondo y el anillo— es uno solo para la tabla y su
   * franja, y puesta afuera queda una caja con esquinas redondeadas y otra caja
   * pegada abajo. Pero sobre todo, va **fuera del scroll horizontal y adentro
   * del marco**, que es un lugar que el call site no puede alcanzar: con la
   * franja adentro del scroller, scrollear una tabla ancha de costado se lleva
   * los botones de paginar, y quedan a mitad de camino de la pantalla.
   */
  footer?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('overflow-hidden rounded-md bg-surface ring-1 ring-line', className)}>
      <div className="zebra no-scrollbar overflow-x-auto overflow-y-hidden">
        <table className="w-full border-collapse text-left" style={{ minWidth }}>
          {children}
        </table>
      </div>
      {footer}
    </div>
  )
}

/**
 * La cabecera va sobre `--surface-muted` y no sobre el papel: es lo que la
 * separa del cuerpo sin gastar un divisor más grueso. El divisor de abajo sí
 * está, y es el mismo de un píxel que va entre filas — la cabecera no se
 * distingue por pesar más, se distingue por el fondo y por la medida del texto.
 */
export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-muted">{children}</thead>
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

/**
 * La fila del total, abajo de todo.
 *
 * **Va adentro de la tabla y no abajo**, porque un total es de las columnas: el
 * número tiene que caer en la misma columna que los números que suma, o hay que
 * seguir la línea con el dedo para saber de qué es. Eso es lo que una franja
 * afuera no puede hacer.
 *
 * Lleva el fondo apagado de la cabecera —es el otro borde de la tabla— y una
 * línea arriba en vez de un divisor entre filas: separa el cuerpo del resumen.
 * El `bg-muted` además lo saca de la alternancia de bandas, que si no le tocaba
 * el color que le siguiera a la última fila y el total se leía como una fila
 * más de datos.
 *
 * El `<tfoot>` va en el HTML después del `<tbody>` y el navegador lo dibuja
 * abajo igual: no hay que moverlo de lugar para que se vea donde va.
 */
export function TableFooter({ children }: { children: ReactNode }) {
  return (
    <tfoot className="border-t border-line bg-muted [&_td]:font-semibold [&_tr]:border-0">
      {children}
    </tfoot>
  )
}

/**
 * `last:border-0` saca el divisor de la última fila. Sin eso queda una línea
 * flotando contra la curva del contenedor, que es el borde de nada.
 */
export function TableRow({ children, onClick, active, className }: {
  children: ReactNode
  onClick?: () => void
  /** La fila elegida: apagada, no teñida. */
  active?: boolean
  className?: string
}) {
  return (
    <tr
      onClick={onClick}
      className={cx(
        'border-b border-line transition-colors duration-[120ms] last:border-0',
        active && 'bg-muted',
        onClick && !active && 'cursor-pointer hover:bg-muted',
        className,
      )}
    >
      {children}
    </tr>
  )
}

type CellProps = { children?: ReactNode; className?: string }

/* Las celdas llevan 16 entre columnas y 24 contra los bordes (`first`/`last`).
   No es simetría porque sí: entre dos columnas el aire se reparte —cada dato
   tiene 16 de un lado y 16 del otro— y contra el borde hay uno solo, así que
   con la misma medida el número de la última columna queda pegado al canto. Se
   nota sobre todo en una columna alineada a la derecha, que es la que termina
   justo ahí. */

export function TableHead({ children, className, ...rest }: CellProps & ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cx('h-10 px-4 first:pl-6 last:pr-6 text-2xs font-semibold tracking-wide text-ink', className)}
      {...rest}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className, ...rest }: CellProps & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cx('h-14 px-4 first:pl-6 last:pr-6 text-xs font-medium text-ink', className)} {...rest}>
      {children}
    </td>
  )
}

/**
 * Lo que se lee primero de una fila. Sube a 14/600 por lo mismo que el título
 * de un `ListItem`: con el mismo tamaño que su entorno, la fila no tiene
 * entrada y hay que leerla entera para saber de qué es.
 */
export function TableTitle({ children, className }: CellProps) {
  return <span className={cx('block truncate text-base font-semibold text-ink', className)}>{children}</span>
}

/** La línea de apoyo debajo del título, en gris. */
export function TableHint({ children, className }: CellProps) {
  return <span className={cx('mt-0.5 block truncate text-xs font-medium text-ink-muted', className)}>{children}</span>
}

/**
 * Una columna de números. `tabular` va acá y no en cada celda: sin él el 1 es
 * más angosto que el 4 y una columna de números baila.
 */
export function TableNum({ children, className, ...rest }: CellProps & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cx('tabular h-14 px-4 first:pl-6 last:pr-6 text-right text-xs font-medium text-ink', className)} {...rest}>
      {children}
    </td>
  )
}
