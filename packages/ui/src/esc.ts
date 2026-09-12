import { useEffect } from 'react'

/**
 * `Escape` cierra **solo** el overlay de arriba, y para eso hace falta una pila
 * global: cada overlay se anota al abrirse y solo reacciona si es el último.
 *
 * **Vive en su propio archivo y no en `overlay.tsx` a propósito.** El `Select`
 * también necesita la pila —es un listbox anclado, aunque no sea un overlay del
 * archivo de overlays— y está en `primitives`, que es lo que `overlay` importa.
 * Con el hook allá, traerlo acá cerraba un ciclo entre los dos módulos. Esto no
 * importa nada más que React, así que los dos pueden colgarse de él.
 *
 * Y hace falta que los dos usen esta pila y no un listener propio: dos listeners
 * de captura sobre `document` corren los dos, y `stopPropagation` no apaga a un
 * hermano registrado en el mismo nodo y la misma fase. Con el `Select`
 * escuchando por su cuenta adentro de un `Modal`, un `Escape` cerraba el
 * listbox **y** el modal de atrás en el mismo golpe.
 */
const escStack: symbol[] = []

export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const token = Symbol('overlay')
    escStack.push(token)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (escStack[escStack.length - 1] !== token) return
      e.stopPropagation()
      onEscape()
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      const i = escStack.indexOf(token)
      if (i >= 0) escStack.splice(i, 1)
    }
  }, [active, onEscape])
}
