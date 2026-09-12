import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cx } from '../lib/cx'

/** El contenedor de radio 24. */
export function Card({ children, className, interactive, surface = 'paper' }: {
  children: ReactNode
  /** Para el ancho y para cambiar el padding. */
  className?: string
  /** Levanta la tarjeta en hover; por defecto no se mueve. */
  interactive?: boolean
  /** Papel sobresale y tira sombra; muted es un hueco. */
  surface?: 'paper' | 'muted'
}) {
  return (
    <div
      className={cx(
        'rounded-2xl p-2',
        surface === 'muted' ? 'bg-muted' : 'bg-surface shadow-card',
        interactive && 'transition-[box-shadow,transform] duration-[190ms] ease-out hover:-translate-y-0.5 hover:shadow-toolbar',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** La cabecera de una tarjeta: el título a la izquierda, lo que haya a la derecha. */
export function CardHeader({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cx('flex items-start justify-between gap-4 px-3 pt-3 pb-1', className)} {...props}>
      {children}
    </div>
  )
}

/** Cómo se llama lo que hay en la tarjeta. */
export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cx('text-reading font-semibold text-ink', className)} {...props} />
}

/** La línea de apoyo, debajo del título. */
export function CardHint({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx('text-body font-medium text-ink-muted', className)} {...props} />
}

/** El cuerpo, con el padding que la tarjeta no pone. */
export function CardBody({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('px-3 py-2', className)} {...props} />
}

/** La fila de abajo, separada por una línea. */
export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('mt-1 flex items-center gap-2 border-t border-line px-3 pt-3 pb-2', className)} {...props} />
}
