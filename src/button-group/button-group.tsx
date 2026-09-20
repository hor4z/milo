import s from './button-group.module.css'
import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '../lib/cx'

/** Botones pegados, con el canto solo en los extremos: una sola acción repartida en dos o tres pasos, o un conmutador de vista. Para elegir uno entre varios va `Segmented`, que trae el teclado. */
export function ButtonGroup({ label, vertical, className, ...rest }: ComponentPropsWithoutRef<'div'> & {
  /** Qué agrupa. Sin esto un lector lee los botones sueltos, sin saber que van juntos. */
  label: string
  /** Apilados, para un menú lateral angosto. */
  vertical?: boolean
}) {
  return (
    <div
      role="group"
      aria-label={label}
      data-variant={vertical ? 'vertical' : 'horizontal'}
      className={cx(s.root, vertical ? s.vertical : s.horizontal, className)}
      {...rest}
    />
  )
}
