import s from './modal.module.css'
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
      <div className={s.div}>
        <div className={`${s.div2} ui-fade`} onClick={onClose} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          style={{ width, maxWidth: '100%' }}
          className={`${s.box} ui-zoom bg-surface`}
        >
          {children}
        </div>
        <IconButton
          icon="close"
          label="Cerrar"
          variant="solid"
          size="lg"
          onClick={onClose}
          className={s.box2}
        />
      </div>
    </Portal>
  )
}
