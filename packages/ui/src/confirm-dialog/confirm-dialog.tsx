import cls from './confirm-dialog.module.css'
import { useRef, type ReactNode } from 'react'
import { Button } from '../button/button'
import { useEscape } from '../lib/esc'
import { useFocusTrap, useScrollLock } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'

/** El diálogo que pregunta antes de algo que no se puede deshacer. */
export function ConfirmDialog({
  open, onCancel, onConfirm, title, body, confirmLabel = 'Aceptar', cancelLabel = 'Cancelar', tone = 'neutral',
}: {
  /** Lo dibuja o no: cerrado no monta nada. */
  open: boolean
  /** Lo llaman Cancelar, el velo y Escape. */
  onCancel: () => void
  /** Lo que pasa si dice que sí. */
  onConfirm: () => void
  /** La pregunta, con el nombre de lo que se va a tocar adentro. */
  title: string
  /** Qué más se lleva puesto. */
  body?: ReactNode
  /** El verbo de lo que va a pasar, no "Sí". */
  confirmLabel?: string
  /** La salida segura. */
  cancelLabel?: string
  /** Bad pinta el botón de confirmar y arranca el foco en Cancelar. */
  tone?: 'neutral' | 'bad'
}) {
  const panel = useRef<HTMLDivElement>(null)
  useScrollLock(open)
  useEscape(open, onCancel)
  useFocusTrap(open, panel)
  if (!open) return null
  return (
    <Portal>
      <div className={cls.div}>
        <div className={`${cls.div2} ui-fade`} onClick={onCancel} />
        <div
          ref={panel}
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className={`${cls.box} ui-zoom bg-surface`}
        >
          <div className={cls.div3}>
            <h2 className={cls.h2}>{title}</h2>
            {body && <div className={cls.div4}>{body}</div>}
          </div>
          <div className={cls.div5}>
            <Button variant="ghost" size="sm" data-autofocus={tone === 'bad' || undefined} onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={tone === 'bad' ? 'bad' : 'solid'}
              size="sm"
              data-autofocus={tone === 'bad' ? undefined : true}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
