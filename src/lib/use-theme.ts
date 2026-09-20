import { useCallback, useEffect } from 'react'
import { useLocalStorage } from './use-local-storage'
import { useMediaQuery } from './use-media-query'

export type Theme = 'light' | 'dark' | 'system'

/** El tema, con `system` de verdad: si nadie eligió, sigue al sistema operativo mientras cambia, y se sincroniza entre pestañas. Escribe `data-theme` en el `<html>`, que es de donde lo leen los tokens. */
export function useTheme(inicial: Theme = 'system') {
  const [theme, setTheme] = useLocalStorage<Theme>('milo.theme', inicial)
  const prefiereOscuro = useMediaQuery('(prefers-color-scheme: dark)')
  const resolved: 'light' | 'dark' = theme === 'system' ? (prefiereOscuro ? 'dark' : 'light') : theme

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  const toggle = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setTheme])

  return { theme, resolved, setTheme, toggle }
}
