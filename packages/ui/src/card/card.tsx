import s from './card.module.css'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cx } from '../lib/cx'

/** El contenedor de radio 16: lo que se apoya en la página. Lo que flota sobre un velo (un modal, un diálogo) va en 24. */
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
        s.div,
        surface === 'muted' ? s.muted : `${s.div2} bg-surface`,
        interactive && s.interactive,
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
    <div className={cx(s.div3, className)} {...props}>
      {children}
    </div>
  )
}

/** Cómo se llama lo que hay en la tarjeta. */
export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cx(s.h3, className)} {...props} />
}

/** La línea de apoyo, debajo del título. */
export function CardHint({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx(s.p, className)} {...props} />
}

/** El cuerpo, con el padding que la tarjeta no pone. */
export function CardBody({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.div4, className)} {...props} />
}

/** La fila de abajo, separada por una línea. */
export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.div5, className)} {...props} />
}
