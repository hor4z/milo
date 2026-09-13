import s from './divider.module.css'
import { cx } from '../lib/cx'

/** La línea que separa. */
export function Divider({ orientation = 'horizontal', className }: {
  /** El vertical lleva `self-stretch` adentro: en una fila con `items-center` mediría cero. */
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
        s.div,
        orientation === 'horizontal' ? s.horizontal : s.box,
        className,
      )}
    />
  )
}
