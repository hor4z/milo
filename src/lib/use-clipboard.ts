import { useCallback, useEffect, useRef, useState } from 'react'

/** Copiar al portapapeles y avisar que se copió. El aviso se apaga solo, y el temporizador se limpia si la pieza se desmonta antes. */
export function useClipboard({ ms = 1400 }: { ms?: number } = {}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), ms)
      return true
    } catch {
      return false
    }
  }, [ms])

  return { copied, copy }
}
