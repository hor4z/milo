import { useCallback, useEffect, useState } from 'react'

/** Un estado que sobrevive al refresh, y que se entera si otra pestaña lo cambia. Si el navegador no deja escribir, funciona igual en memoria. */
export function useLocalStorage<T>(key: string, inicial: T) {
  const leer = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? inicial : JSON.parse(raw) as T
    } catch { return inicial }
  }, [key, inicial])

  const [value, setValue] = useState<T>(leer)

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* modo privado, o sin permiso */ }
  }, [key, value])

  useEffect(() => {
    const otra = (e: StorageEvent) => { if (e.key === key) setValue(leer()) }
    window.addEventListener('storage', otra)
    return () => window.removeEventListener('storage', otra)
  }, [key, leer])

  return [value, setValue] as const
}
