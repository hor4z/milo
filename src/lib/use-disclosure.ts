import { useCallback, useState } from 'react'

/** Abrir y cerrar algo: un panel, un modal, una hoja. Devuelve el booleano y las tres acciones, que son estables. */
export function useDisclosure(inicial = false) {
  const [open, setOpen] = useState(inicial)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])
  const onToggle = useCallback(() => setOpen(v => !v), [])
  return { open, onOpen, onClose, onToggle, setOpen }
}
