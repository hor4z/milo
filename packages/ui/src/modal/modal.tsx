import { useRef, type ReactNode } from 'react'
import { IconButton } from '../icon-button/icon-button'
import { useEscape } from '../lib/esc'
import { useFocusTrap, useScrollLock } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'

export function Modal({
  open, onClose, children, width = 620, label,
}: {
  /** Cerrado no monta nada. */
  open: boolean
  /** Lo llaman Escape y el click en el backdrop. */
  onClose: () => void
  children: ReactNode
  /** El ancho del panel en px. */
  width?: number
  /** El aria-label del role="dialog". */
  label: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  useScrollLock(open)
  useEscape(open, onClose)
  useFocusTrap(open, panel)
  if (!open) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="ui-fade absolute inset-0 bg-scrim backdrop-blur-[3px]" onClick={onClose} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          style={{ width, maxWidth: '100%' }}
          className="ui-zoom relative z-10 max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl bg-surface shadow-popover ring-1 ring-line"
        >
          {children}
        </div>
        <IconButton
          icon="close"
          label="Cerrar"
          variant="solid"
          size="lg"
          onClick={onClose}
          className="!absolute top-4 right-4 z-20 !rounded-lg"
        />
      </div>
    </Portal>
  )
}
