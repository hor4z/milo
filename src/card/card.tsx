import s from './card.module.css'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cx } from '../lib/cx'

function Root({ children, className, interactive, surface = 'paper' }: {
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
        s.root,
        surface === 'muted' ? s.muted : `${s.paper} bg-surface`,
        interactive && s.interactive,
        className,
      )}
    >
      {children}
    </div>
  )
}

/** La cabecera de una tarjeta: el título a la izquierda, lo que haya a la derecha. */
function Header({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cx(s.header, className)} {...props}>
      {children}
    </div>
  )
}

/** Cómo se llama lo que hay en la tarjeta. */
function Title({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cx(s.title, className)} {...props} />
}

/** La línea de apoyo, debajo del título. */
function Hint({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx(s.hint, className)} {...props} />
}

/** El cuerpo, con el padding que la tarjeta no pone. */
function Body({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.body, className)} {...props} />
}

/** La fila de abajo, separada por una línea. */
function Footer({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.footer, className)} {...props} />
}

/** El contenedor de radio 16: lo que se apoya en la página. Lo que flota sobre un velo (un modal, un diálogo) va en 24. */
export const Card = Object.assign(Root, { Header, Title, Hint, Body, Footer })
