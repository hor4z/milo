import s from './sheet.module.css'
import { createContext, useContext, useId, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { IconButton } from '../icon-button/icon-button'
import { cx } from '../lib/cx'
import { useEscape } from '../lib/esc'
import { useFocusTrap, useScrollLock } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'

type Ctx = { onClose: () => void; titleId: string }
const SheetContext = createContext<Ctx | null>(null)

function Root({
  open, onClose, children, side = 'right', width = 460, label,
}: {
  /** Cerrado no monta nada. */
  open: boolean
  /** Lo llaman la X, el velo y Escape. */
  onClose: () => void
  children: ReactNode
  /** De qué lado entra. La derecha es de donde vienen las cosas nuevas. */
  side?: 'right' | 'left'
  /** El ancho del panel en px. */
  width?: number
  /** Solo si no hay `Sheet.Title`: con título, el nombre sale de ahí. */
  label?: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
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
          aria-labelledby={label ? undefined : titleId}
          tabIndex={-1}
          style={{ width, maxWidth: '100%', ['--slide-from' as string]: side === 'right' ? '12px' : '-12px' }}
          className={cx(
            `${s.panel} ui-slide bg-surface`,
            side === 'right' ? s.right : s.left,
          )}
        >
          <SheetContext.Provider value={{ onClose, titleId }}>
            {children}
          </SheetContext.Provider>
        </div>
      </div>
    </Portal>
  )
}

/** La cabecera del panel: adentro va `Title`, y la X la pone ella. */
function Header({ className, children, ...rest }: ComponentPropsWithoutRef<'div'>) {
  const ctx = useContext(SheetContext)
  return (
    <div className={cx(s.header, className)} {...rest}>
      <div className={s.heading}>{children}</div>
      {ctx && (
        <IconButton icon="close" label="Cerrar" size="sm" variant="ghost" onClick={ctx.onClose} />
      )}
    </div>
  )
}

/** El título, y de paso el nombre que anuncia el lector: se ata solo. */
function Title({ className, id, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  const ctx = useContext(SheetContext)
  return <h2 id={id ?? ctx?.titleId} className={cx(s.title, className)} {...rest} />
}

/** El cuerpo del panel: lo único que scrollea. */
function Body({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.body, className)} {...props} />
}

/** La fila de acciones, abajo y siempre a la vista. */
function Footer({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.footer, className)} {...props} />
}

/** El panel que entra desde un costado: un formulario largo sin cambiar de pantalla. */
export const Sheet = Object.assign(Root, { Header, Title, Body, Footer })
