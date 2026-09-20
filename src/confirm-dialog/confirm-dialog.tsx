import cls from './confirm-dialog.module.css'
import { createContext, useContext, useId, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Button } from '../button/button'
import { useEscape } from '../lib/esc'
import { useFocusTrap, useScrollLock } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'
import { cx } from '../lib/cx'

type Ctx = {
  onCancel: () => void
  onConfirm: () => void
  tone: 'neutral' | 'bad'
  titleId: string
}
const ConfirmContext = createContext<Ctx | null>(null)

function Root({
  open, onCancel, onConfirm, children, tone = 'neutral',
}: {
  /** Cerrado no monta nada. */
  open: boolean
  /** Lo llaman el botón de cancelar, el velo y Escape. */
  onCancel: () => void
  /** Lo que pasa si dice que sí. */
  onConfirm: () => void
  children: ReactNode
  /** Bad pinta el botón de confirmar y arranca el foco en cancelar. */
  tone?: 'neutral' | 'bad'
}) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useScrollLock(open)
  useEscape(open, onCancel)
  useFocusTrap(open, panel)
  if (!open) return null
  return (
    <Portal>
      <div className={cls.viewport}>
        <div className={`${cls.veil} ui-fade`} onClick={onCancel} />
        <div
          ref={panel}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={`${cls.panel} ui-zoom bg-surface`}
        >
          <ConfirmContext.Provider value={{ onCancel, onConfirm, tone, titleId }}>
            {children}
          </ConfirmContext.Provider>
        </div>
      </div>
    </Portal>
  )
}

type PartProps = ComponentPropsWithoutRef<'div'>

/** La cabecera. No lleva X: la salida segura es el botón de cancelar, que ya está a la vista. */
function Header({ className, ...rest }: PartProps) {
  return <div className={cx(cls.header, className)} {...rest} />
}

/** La pregunta, con el nombre de lo que se va a tocar adentro. Es el nombre que anuncia el lector. */
function Title({ className, id, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  const ctx = useContext(ConfirmContext)
  return <h2 id={id ?? ctx?.titleId} className={cx(cls.title, className)} {...rest} />
}

/** Qué más se lleva puesto. */
function Body({ className, ...rest }: PartProps) {
  return <div className={cx(cls.body, className)} {...rest} />
}

/** La fila de los dos botones, contra el borde derecho. */
function Footer({ className, ...rest }: PartProps) {
  return <div className={cx(cls.footer, className)} {...rest} />
}

/** La salida segura. Con `tone="bad"` arranca con el foco. */
function Cancel({ children = 'Cancelar' }: { children?: ReactNode }) {
  const ctx = useContext(ConfirmContext)
  return (
    <Button
      variant="ghost"
      size="sm"
      data-autofocus={ctx?.tone === 'bad' || undefined}
      onClick={ctx?.onCancel}
    >
      {children}
    </Button>
  )
}

/** El verbo de lo que va a pasar, no "Sí". Con `tone="bad"` se pinta y cede el foco. */
function Confirm({ children = 'Aceptar' }: { children?: ReactNode }) {
  const ctx = useContext(ConfirmContext)
  return (
    <Button
      variant={ctx?.tone === 'bad' ? 'bad' : 'brand'}
      size="sm"
      data-autofocus={ctx?.tone === 'bad' ? undefined : true}
      onClick={ctx?.onConfirm}
    >
      {children}
    </Button>
  )
}

/** El diálogo que pregunta antes de algo que no se puede deshacer. Se arma con sus partes, igual que el `Modal`. */
export const ConfirmDialog = Object.assign(Root, { Header, Title, Body, Footer, Cancel, Confirm })
