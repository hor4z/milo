import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '../lib/cx'

/** El hueco que ocupa algo que todavía está cargando. */
export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={cx('ui-pulse block rounded-md bg-track', className)}
      {...props}
    />
  )
}
