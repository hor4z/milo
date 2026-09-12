import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button, cx } from './primitives'

/** La línea de abajo de una tabla: qué tramo se está viendo y cómo pasar al que sigue. */
export function Pagination({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cx(
        'flex flex-wrap items-center gap-3 border-t border-line px-4 py-3',
        className,
      )}
      {...props}
    />
  )
}

type PaginationStatusProps = Omit<ComponentPropsWithoutRef<'p'>, 'children'> & {
  /** El último de la pantalla, contando desde uno. */
  to: number
  /** El primero de la pantalla. */
  from?: number
  /** Cuántos hay en total. */
  total?: number
  /** Qué se está contando. */
  noun?: string | [singular: string, plural: string]
  /** Reemplaza la frase entera cuando la pantalla tiene una mejor. */
  children?: ReactNode
}

/** Qué tramo se está viendo. */
export function PaginationStatus({
  to, from = 1, total, noun, className, children, ...props
}: PaginationStatusProps) {
  const cuantos = total ?? to
  const palabra = Array.isArray(noun) ? (cuantos === 1 ? noun[0] : noun[1]) : noun
  const cola = palabra ? ` ${palabra}` : ''
  const frase = total !== undefined && from <= 1 && to >= total
    ? `${total}${cola}`
    : total !== undefined
      ? `${from} a ${to} de ${total}${cola}`
      : `${from} a ${to}${cola}`
  return (
    <p role="status" className={cx('tabular text-xs font-medium text-ink-muted', className)} {...props}>
      {children ?? frase}
    </p>
  )
}

type PaginationNavProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  children?: ReactNode
}

/** Los dos viajan juntos y están siempre, apagados en las puntas. */
export function PaginationPrev({ className, children = 'Anterior', ...props }: PaginationNavProps) {
  return (
    <Button type="button" variant="ghost" size="sm" icon="chevron_left" className={cx('ml-auto !text-ink', className)} {...props}>
      {children}
    </Button>
  )
}

/** Su `disabled` es el «hay más» que contesta el back: mientras haya, hay siguiente. */
export function PaginationNext({ className, children = 'Siguiente', ...props }: PaginationNavProps) {
  return (
    <Button type="button" variant="ghost" size="sm" iconEnd="chevron_right" className={cx('!text-ink', className)} {...props}>
      {children}
    </Button>
  )
}
