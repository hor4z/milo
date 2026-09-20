import { useEffect, useState } from 'react'

/** El mismo valor, pero recién después de que dejó de cambiar por `ms`. Para no filtrar una lista en cada tecla. */
export function useDebounce<T>(value: T, ms = 250) {
  const [quieto, setQuieto] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setQuieto(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return quieto
}
