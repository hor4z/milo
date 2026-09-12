import type { ReactNode } from 'react'

/** El kbd va hundido: 11px, radio 6, con luz arriba y sombra interior abajo. */
export function Kbd({ children }: {
  /** La tecla: un símbolo, un nombre corto o una unidad. */
  children: ReactNode
}) {
  return (
    <kbd className="inset-relief inline-flex min-h-5 min-w-[21px] items-center justify-center rounded-sm bg-muted px-1.5 font-sans text-meta font-medium text-ink-muted">
      {children}
    </kbd>
  )
}
