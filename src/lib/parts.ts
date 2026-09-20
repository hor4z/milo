import { Children, isValidElement, type ElementType, type ReactNode } from 'react'

/** Una parte sin contenido es como si no estuviera: si no, un `<Menu.Shortcut>{undefined}</Menu.Shortcut>` dibuja el hueco igual. */
function tieneAlgo(node: ReactNode): boolean {
  if (node === null || node === undefined || node === false || node === '') return false
  if (Array.isArray(node)) return node.some(tieneAlgo)
  if (isValidElement<{ children?: ReactNode }>(node)) {
    const hijos = node.props.children
    return hijos === undefined ? true : tieneAlgo(hijos)
  }
  return true
}

/** Separa de los hijos los que son de un tipo: una parte que la pieza dibuja en otro lugar del marco. Devuelve `[la parte, el resto]`, y descarta la parte que quedó vacía. */
export function takePart(children: ReactNode, part: ElementType): [ReactNode[], ReactNode[]] {
  const todo = Children.toArray(children)
  const es = (c: ReactNode) => isValidElement(c) && c.type === part
  return [todo.filter(c => es(c) && tieneAlgo(c)), todo.filter(c => !es(c))]
}
