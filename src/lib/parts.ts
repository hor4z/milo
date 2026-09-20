import { Children, isValidElement, type ElementType, type ReactNode } from 'react'

/** Separa de los hijos los que son de un tipo: una parte que la pieza dibuja en otro lugar del marco. Devuelve `[la parte, el resto]`. */
export function takePart(children: ReactNode, part: ElementType): [ReactNode[], ReactNode[]] {
  const todo = Children.toArray(children)
  const es = (c: ReactNode) => isValidElement(c) && c.type === part
  return [todo.filter(es), todo.filter(c => !es(c))]
}
