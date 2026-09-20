import s from './modal.module.css'
import { createContext, useContext, useId, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { IconButton } from '../icon-button/icon-button'
import { useEscape } from '../lib/esc'
import { useFocusTrap, useScrollLock } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'
import { cx } from '../lib/cx'

type Ctx = { onClose: () => void; titleId: string }
const ModalContext = createContext<Ctx | null>(null)

/** Los tres anchos, y el de arriba es el tope: más que eso deja de ser un diálogo y es una pantalla. */
const widths = { sm: 420, md: 620, lg: 820 } as const

export type ModalSize = keyof typeof widths

function Root({
  open, onClose, children, size = 'md', label,
}: {
  /** Cerrado no monta nada. */
  open: boolean
  /** Lo llaman Escape, el velo y la X del header. */
  onClose: () => void
  children: ReactNode
  /** `sm` una pregunta o un campo, `md` el de siempre, `lg` lo que necesita dos columnas. */
  size?: ModalSize
  /** Solo si no hay `Title`: con título, el nombre sale de ahí. */
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
          aria-labelledby={titleId}
          aria-label={label}
          tabIndex={-1}
          style={{ width: widths[size], maxWidth: '100%' }}
          className={`${s.panel} ui-zoom bg-surface`}
        >
          <ModalContext.Provider value={{ onClose, titleId }}>
            {children}
          </ModalContext.Provider>
        </div>
      </div>
    </Portal>
  )
}

type PartProps = ComponentPropsWithoutRef<'div'>

/** La cabecera: adentro van `Title` y `Hint`, y la X la pone ella. */
function Header({ className, children, ...rest }: PartProps) {
  const ctx = useContext(ModalContext)
  return (
    <div className={cx(s.header, className)} {...rest}>
      <div className={s.heading}>{children}</div>
      {ctx && (
        <IconButton
          icon="close"
          label="Cerrar"
          size="sm"
          variant="ghost"
          onClick={ctx.onClose}
          className={s.close}
        />
      )}
    </div>
  )
}

/** El título, y de paso el nombre que anuncia el lector: se ata solo. */
function Title({ className, id, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  const ctx = useContext(ModalContext)
  return <h2 id={id ?? ctx?.titleId} className={cx(s.title, className)} {...rest} />
}

/** La línea de apoyo debajo del título, en gris. */
function Hint({ className, ...rest }: PartProps) {
  return <div className={cx(s.hint, className)} {...rest} />
}

/** El cuerpo, y lo único que scrollea cuando el contenido no entra. */
function Body({ className, ...rest }: PartProps) {
  return <div className={cx(s.body, className)} {...rest} />
}

/** La fila de acciones, contra el borde derecho. */
function Footer({ className, ...rest }: PartProps) {
  return <div className={cx(s.footer, className)} {...rest} />
}

/** El diálogo centrado que tapa la pantalla. Se arma con `Modal.Header`, `Modal.Body` y `Modal.Footer`. */
export const Modal = Object.assign(Root, { Header, Title, Hint, Body, Footer })
