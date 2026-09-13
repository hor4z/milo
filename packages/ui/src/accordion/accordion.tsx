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
    <details open={defaultOpen} className={cx('group border-b border-line last:border-0', className)}>
      <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-reading font-semibold text-ink marker:content-none">
        <Icon
          name="keyboard_arrow_down"
          size={18}
          className="icon-muted shrink-0 transition-transform ease-out duration-normal group-open:rotate-180"
        />
        <span className="min-w-0 flex-1">{summary}</span>
      </summary>
      <div className="pb-4 pl-[calc(18px+var(--spacing)*3)] text-body font-medium text-ink-muted">{children}</div>
    </details>
  )
}

/** Varias filas que se abren, una debajo de la otra. */
export function Accordion({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('rounded-xl border border-line bg-surface px-4', className)} {...props} />
}
