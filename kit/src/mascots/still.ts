import { useEffect, useState } from 'react'

/** Si alguien pidió menos movimiento, el bucle no se muestra: se queda el retrato. */
export function useStill() {
  const [still, setStill] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setStill(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
  return still
}
