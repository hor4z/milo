import cls from './pagination.module.css'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button } from '../button/button'
import { cx } from '../lib/cx'

/** La línea de abajo de una tabla: qué tramo se está viendo y cómo pasar al que sigue. */
export function Pagination({ className, 'aria-label': label = 'Paginación', ...props }: ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav
      aria-label={label}
      className={cx(
        cls.nav,
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
  const howMany = total ?? to
  const word = Array.isArray(noun) ? (howMany === 1 ? noun[0] : noun[1]) : noun
  const tail = word ? ` ${word}` : ''
  const phrase = total !== undefined && from <= 1 && to >= total
    ? `${total}${tail}`
    : total !== undefined
      ? `${from} a ${to} de ${total}${tail}`
      : `${from} a ${to}${tail}`
  return (
    <p role="status" className={cx(`${cls.p} tabular`, className)} {...props}>
      {children ?? phrase}
    </p>
  )
}

type PaginationNavProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  children?: ReactNode
}

/** Los dos viajan juntos y están siempre, apagados en las puntas. */
export function PaginationPrev({ className, children = 'Anterior', ...props }: PaginationNavProps) {
  return (
    <Button type="button" variant="ghost" size="sm" icon="chevron_left" className={cx(cls.button, className)} {...props}>
      {children}
    </Button>
  )
}

/** Su `disabled` es el "hay más" que contesta el back: mientras haya, hay siguiente. */
export function PaginationNext({ className, children = 'Siguiente', ...props }: PaginationNavProps) {
  return (
    <Button type="button" variant="ghost" size="sm" iconEnd="chevron_right" className={cx(cls.button2, className)} {...props}>
      {children}
    </Button>
  )
}
