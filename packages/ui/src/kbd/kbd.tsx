import cls from './kbd.module.css'
import type { ReactNode } from 'react'

/** El kbd va hundido: 11px, radio 6, con luz arriba y sombra interior abajo. */
export function Kbd({ children }: {
  /** La tecla: un símbolo, un nombre corto o una unidad. */
  children: ReactNode
}) {
  return (
    <kbd className={`${cls.kbd} inset-relief`}>
      {children}
    </kbd>
  )
}
