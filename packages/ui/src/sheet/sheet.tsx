import { useRef, type ReactNode } from 'react'
import { IconButton } from '../icon-button/icon-button'
import { cx } from '../lib/cx'
import { useEscape } from '../lib/esc'
import { useFocusTrap, useScrollLock } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'

/** El panel que entra desde un costado: un formulario largo sin cambiar de pantalla. */
export function Sheet({
  open, onClose, children, side = 'right', width = 460, label,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  side?: 'right' | 'left'
  width?: number
  label: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  useScrollLock(open)
  useEscape(open, onClose)
  useFocusTrap(open, panel)
  if (!open) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-40">
        <div className="ui-fade absolute inset-0 bg-scrim" onClick={onClose} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          style={{ width, maxWidth: '100%', ['--slide-from' as string]: side === 'right' ? '12px' : '-12px' }}
          className={cx(
            'ui-slide absolute inset-y-0 flex flex-col bg-surface shadow-popover',
            side === 'right' ? 'right-0 border-l border-line' : 'left-0 border-r border-line',
          )}
        >
          {children}
        </div>
      </div>
    </Portal>
  )
}

/** La cabecera del panel, con su título y el botón de cerrar. */
export function SheetHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <IconButton icon="close" label="Cerrar" size="sm" variant="ghost" onClick={onClose} />
    </div>
  )
}

/** El cuerpo del panel: lo único que scrollea. */
export function SheetBody({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('flex-1 overflow-y-auto px-5 py-5', className)} {...props} />
}

/** La fila de acciones, abajo y siempre a la vista. */
export function SheetFooter({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('flex items-center justify-end gap-2 border-t border-line px-5 py-4', className)} {...props} />
}
