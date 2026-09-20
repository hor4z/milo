import s from './accordion.module.css'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

/** Una fila que se abre. Es un `<details>`, así que funciona sin JavaScript. */
function Item({ defaultOpen, className, children }: {
  /** Arranca abierta. */
  defaultOpen?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <details open={defaultOpen} className={cx(`${s.root} group`, className)}>
      {children}
    </details>
  )
}

/** Lo que se ve siempre y se toca para abrir. Va primero: es el `<summary>` del `<details>`. */
function Summary({ className, children }: ComponentPropsWithoutRef<'summary'>) {
  return (
    <summary className={cx(s.trigger, className)}>
      <Icon name="keyboard_arrow_down" size={18} className={`${s.icon} icon-muted`} />
      <span className={s.title}>{children}</span>
    </summary>
  )
}

/** Lo que aparece al abrir. */
function Body({ className, children }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.body, className)}>{children}</div>
}

function Root({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(`${s.list} bg-surface`, className)} {...props} />
}

/** Varias filas que se abren, una debajo de la otra. */
export const Accordion = Object.assign(Root, { Item, Summary, Body })
