import { useRef, type ReactNode } from 'react'
import { Button } from '../button/button'
import { useEscape } from '../lib/esc'
import { useFocusTrap, useScrollLock } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'

/** El diálogo que pregunta antes de algo que no se puede deshacer. */
export function ConfirmDialog({
  open, onCancel, onConfirm, title, body, confirmLabel = 'Aceptar', cancelLabel = 'Cancelar', tone = 'neutral',
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  /** La pregunta, con el nombre de lo que se va a tocar adentro. */
  title: string
  body?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'neutral' | 'bad'
}) {
  const panel = useRef<HTMLDivElement>(null)
  useScrollLock(open)
  useEscape(open, onCancel)
  useFocusTrap(open, panel)
  if (!open) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="ui-fade absolute inset-0 bg-scrim backdrop-blur-[3px]" onClick={onCancel} />
        <div
          ref={panel}
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className="ui-zoom relative z-10 flex w-full max-w-[420px] flex-col gap-4 rounded-2xl bg-surface p-5 shadow-popover ring-1 ring-line"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {body && <div className="text-xs font-medium text-ink-muted">{body}</div>}
          </div>
          <div className="flex items-center justify-end gap-2">
            {/* En una acción destructiva el foco arranca en la salida segura:
                con el foco en «Borrar», un Enter de más lo borra. */}
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
