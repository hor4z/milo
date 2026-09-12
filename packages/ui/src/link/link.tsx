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
        // Azul **y** subrayado, las dos cosas, y el subrayado en el mismo tono que
        // la letra. Estuvo un rato en `--brand-border`, que sobre papel da 1.49:1
        // y no se ve: el enlace quedaba dependiendo solo del color, que es
        // exactamente lo que el subrayado viene a evitar. Un subrayado que hay
        // que buscar no es una segunda señal.
        'inline-flex items-center gap-1 rounded-sm text-brand-ink underline decoration-current underline-offset-[3px]',
        'transition-[text-decoration-thickness] duration-fast hover:decoration-2',
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
