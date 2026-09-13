import { useEffect, useState } from 'react'

/** Si alguien pidió menos movimiento, el bucle no se muestra: se queda el retrato. */
export function useQuieto() {
  const [quieto, setQuieto] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const leer = () => setQuieto(mq.matches)
    leer()
    mq.addEventListener('change', leer)
    return () => mq.removeEventListener('change', leer)
  }, [])
  return quieto
}
