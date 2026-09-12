import { useEffect, useRef, useState, type ReactNode, type ThHTMLAttributes, type TdHTMLAttributes } from 'react'
import { cx } from './primitives'

/** La tabla, en piezas. */
export function Table({ children, minWidth = 640, footer, className }: {
  children: ReactNode
  /** Abajo de esto la tabla scrollea en vez de apretar las columnas. */
  minWidth?: number
  /** La franja de abajo: vive adentro del marco pero fuera del scroll. */
  footer?: ReactNode
  className?: string
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [corte, setCorte] = useState(false)

  // Sin barra visible, un degradado en el canto es lo único que avisa que hay
  // más columnas a la derecha.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const medir = () => setCorte(el.scrollWidth - el.clientWidth - el.scrollLeft > 1)
    medir()
    el.addEventListener('scroll', medir, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(medir) : null
    ro?.observe(el)
    return () => {
      el.removeEventListener('scroll', medir)
      ro?.disconnect()
    }
  }, [children])

  return (
    <div className={cx('relative overflow-hidden rounded-md bg-surface ring-1 ring-line', className)}>
      <div ref={scroller} className="zebra no-scrollbar overflow-x-auto overflow-y-hidden">
        <table className="w-full border-collapse text-left" style={{ minWidth }}>
          {children}
        </table>
      </div>
      {corte && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-surface to-transparent"
        />
      )}
      {footer}
    </div>
  )
}

/** La cabecera va sobre `--surface-muted` y no sobre el papel: es lo que la separa del cuerpo sin gastar un divisor más grueso. */
export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-muted">{children}</thead>
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

/** La fila del total, abajo de todo. */
export function TableFooter({ children }: { children: ReactNode }) {
  return (
    <tfoot className="border-t border-line bg-muted [&_td]:font-semibold [&_tr]:border-0">
      {children}
    </tfoot>
  )
}

/** `last:border-0` saca el divisor de la última fila. */
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

/** Lo que se lee primero de una fila. */
export function TableTitle({ children, className }: CellProps) {
  return <span className={cx('block truncate text-base font-semibold text-ink', className)}>{children}</span>
}

/** La línea de apoyo debajo del título, en gris. */
export function TableHint({ children, className }: CellProps) {
  return <span className={cx('mt-0.5 block truncate text-xs font-medium text-ink-muted', className)}>{children}</span>
}

/** Una columna de números. */
export function TableNum({ children, className, ...rest }: CellProps & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cx('tabular h-14 px-4 first:pl-6 last:pr-6 text-right text-xs font-medium text-ink', className)} {...rest}>
      {children}
    </td>
  )
}
