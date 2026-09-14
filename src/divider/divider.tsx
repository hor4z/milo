import s from './divider.module.css'
import { cx } from '../lib/cx'

/** La línea que separa. */
export function Divider({ orientation = 'horizontal', className }: {
  /** El vertical se estira solo: en una fila que centra a sus hijos mediría cero. */
  orientation?: 'horizontal' | 'vertical'
  /** Para el margen, que depende de dónde esté. */
  className?: string
}) {
  return (
    <div
      data-divider=""
      role="separator"
      aria-orientation={orientation}
      className={cx(
        s.root,
        orientation === 'horizontal' ? s.horizontal : s.vertical,
        className,
      )}
    />
  )
}
