import type { ComponentPropsWithoutRef } from 'react'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

/** Un enlace dentro de un texto o suelto en una fila. */
export function Link({ external, className, children, ...props }: ComponentPropsWithoutRef<'a'> & {
  /** Abre en otra pestaña y lo avisa, en vez de hacerlo en silencio. */
  external?: boolean
}) {
  return (
    <a
      className={cx(
        'inline-flex items-center gap-1 rounded-sm text-brand-ink underline decoration-current underline-offset-[3px]',
        'transition-[text-decoration-thickness] ease-out duration-fast hover:decoration-2',
        className,
      )}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : null)}
      {...props}
    >
      {children}
      {external && (
        <>
          <Icon name="open_in_new" size={14} className="icon-muted" />
          <span className="sr-only">(se abre en otra pestaña)</span>
        </>
      )}
    </a>
  )
}
