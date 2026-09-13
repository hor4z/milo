import s from './skeleton.module.css'
import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '../lib/cx'

/** El hueco que ocupa algo que todavía está cargando. */
export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={cx(`${s.span} ui-pulse`, className)}
      {...props}
    />
  )
}
