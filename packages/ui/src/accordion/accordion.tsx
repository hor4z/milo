import s from './accordion.module.css'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

type AccordionItemProps = {
  /** Lo que se ve siempre y se toca para abrir. */
  summary: ReactNode
  /** Lo que aparece al abrir. */
  children: ReactNode
  /** Arranca abierta. */
  defaultOpen?: boolean
  className?: string
}

/** Una fila que se abre. Es un `<details>`, así que funciona sin JavaScript. */
export function AccordionItem({ summary, children, defaultOpen, className }: AccordionItemProps) {
  return (
    <details open={defaultOpen} className={cx(`${s.root} group`, className)}>
      <summary className={s.trigger}>
        <Icon
          name="keyboard_arrow_down"
          size={18}
          className={`${s.icon} icon-muted`}
        />
        <span className={s.title}>{summary}</span>
      </summary>
      <div className={s.body}>{children}</div>
    </details>
  )
}

/** Varias filas que se abren, una debajo de la otra. */
export function Accordion({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(`${s.list} bg-surface`, className)} {...props} />
}
