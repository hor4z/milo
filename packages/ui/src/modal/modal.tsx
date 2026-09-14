import s from './modal.module.css'
import { useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { IconButton } from '../icon-button/icon-button'
import { useEscape } from '../lib/esc'
import { useFocusTrap, useScrollLock } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'
import { cx } from '../lib/cx'

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
      <div className={s.viewport}>
        <div className={`${s.veil} ui-fade`} onClick={onClose} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          style={{ width, maxWidth: '100%' }}
          className={`${s.panel} ui-zoom bg-surface`}
        >
          {children}
        </div>
        <IconButton
          icon="close"
          label="Cerrar"
          variant="solid"
          size="lg"
          onClick={onClose}
          className={s.close}
        />
      </div>
    </Portal>
  )
}

type PartProps = ComponentPropsWithoutRef<'div'>

/** El cuerpo del modal, con su aire. Sin esto el contenido queda pegado al borde del panel. */
export function ModalBody({ className, ...rest }: PartProps) {
  return <div className={cx(s.body, className)} {...rest} />
}

/** El título, del mismo tamaño que el del `Sheet` y el del `ConfirmDialog`: un diálogo tiene un solo título. Va como encabezado para que el lector de pantalla lo encuentre. */
export function ModalTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <h2 className={cx(s.title, className)} {...rest} />
}

/** La línea de apoyo debajo del título, en gris. */
export function ModalHint({ className, ...rest }: PartProps) {
  return <div className={cx(s.hint, className)} {...rest} />
}

/** La fila de acciones, contra el borde derecho. */
export function ModalFooter({ className, ...rest }: PartProps) {
  return <div className={cx(s.footer, className)} {...rest} />
}
