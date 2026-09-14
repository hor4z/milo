import cls from './table.module.css'
import { type ReactNode, type ThHTMLAttributes, type TdHTMLAttributes } from 'react'
import { cx } from '../lib/cx'
import { useSideScroll } from '../lib/side-scroll'

/** La tabla, en piezas. */
export function Table({ children, label, minWidth = 640, footer, className }: {
  children: ReactNode
  /** De qué es la tabla. Cuando scrollea se vuelve una región enfocable, y dos regiones que se llaman igual se leen como una sola. */
  label?: string
  /** Abajo de esto la tabla scrollea en vez de apretar las columnas. */
  minWidth?: number
  /** La franja de abajo: vive adentro del marco pero fuera del scroll. */
  footer?: ReactNode
  className?: string
}) {
  const { ref: scroller, scrolls, clipped } = useSideScroll<HTMLDivElement>(children)

  return (
    <div className={cx(`${cls.root} bg-surface`, className)}>
      <div
        ref={scroller}
        tabIndex={scrolls ? 0 : undefined}
        role={scrolls ? 'region' : undefined}
        aria-label={scrolls ? `${label ?? 'Tabla'}, se desplaza de costado` : undefined}
        className={`${cls.scroller} zebra`}
      >
        <table className={cls.table} style={{ minWidth }}>
          {children}
        </table>
      </div>
      {clipped && (
        <span
          aria-hidden="true"
          className={cls.clipShadow}
        />
      )}
      {footer}
    </div>
  )
}

/** La cabecera va sobre `--surface-muted` y no sobre el papel: es lo que la separa del cuerpo sin gastar un divisor más grueso. */
export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className={cls.head}>{children}</thead>
}

/** El cuerpo de la tabla. */
export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

/** La fila del total, abajo de todo. */
export function TableFooter({ children }: { children: ReactNode }) {
  return (
    <tfoot className={cls.foot}>
      {children}
    </tfoot>
  )
}

/** La última fila se queda sin divisor: abajo ya está el borde de la tabla. */
export function TableRow({ children, onClick, active, className }: {
  children: ReactNode
  /** Sin esto la fila no toma hover ni cursor. */
  onClick?: () => void
  /** La fila elegida: apagada, no teñida. */
  active?: boolean
  className?: string
}) {
  return (
    <tr
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick
        ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }
        : undefined}
      className={cx(
        cls.row,
        active && cls.active,
        onClick && !active && cls.clickable,
        className,
      )}
    >
      {children}
    </tr>
  )
}

type CellProps = { children?: ReactNode; className?: string }

/** De qué lado del ancho se apoya lo que la celda dice. */
type Align = 'left' | 'right'

/** Un encabezado de columna: 11/600 con tracking, en tinta. */
export function TableHead({ children, scope = 'col', align, className, ...rest }: CellProps & {
  /** A la derecha cuando la columna es de números, para que el encabezado caiga sobre ellos. */
  align?: Align
} & ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope={scope}
      className={cx(cls.headCell, align === 'right' && cls.alignRight, className)}
      {...rest}
    >
      {children}
    </th>
  )
}

/** Una celda: 12/500, con el alto de fila de 56. */
export function TableCell({ children, align, fit, className, ...rest }: CellProps & {
  /** A la derecha cuando lo que lleva se compara hacia abajo. */
  align?: Align
  /** La columna se achica a lo que lleva adentro: para la de acciones, que va al borde. */
  fit?: boolean
} & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cx(cls.cell, align === 'right' && cls.alignRight, fit && cls.fitCell, className)} {...rest}>
      {children}
    </td>
  )
}

/** La fila entera cuando no hay ninguna: adentro va un `EmptyState`. */
export function TableEmpty({ children, colSpan, className }: CellProps & {
  /** Cuántas columnas tiene la tabla ahora mismo: la tabla no las sabe contar sola. */
  colSpan: number
}) {
  return (
    <tr>
      <td colSpan={colSpan} className={cx(cls.emptyCell, className)}>
        {children}
      </td>
    </tr>
  )
}

/** Lo que se lee primero de una fila. */
export function TableTitle({ children, className }: CellProps) {
  return <span className={cx(cls.cellTitle, className)}>{children}</span>
}

/** La línea de apoyo debajo del título, en gris. */
export function TableHint({ children, className }: CellProps) {
  return <span className={cx(cls.cellHint, className)}>{children}</span>
}

/** Una columna de números. */
export function TableNum({ children, className, ...rest }: CellProps & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cx(`${cls.numberCell} tabular`, className)} {...rest}>
      {children}
    </td>
  )
}
