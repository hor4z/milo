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
        'shrink-0 bg-line',
        orientation === 'horizontal' ? 'h-px' : 'w-px self-stretch',
        className,
      )}
    />
  )
}
