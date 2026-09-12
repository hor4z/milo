import { createContext, useContext, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Icon } from './icon'
import { cx } from './primitives'

type FieldCtx = { id: string; describedBy?: string; invalid: boolean }
const Ctx = createContext<FieldCtx | null>(null)

/** Lo que un control necesita para quedar bien atado a su etiqueta. */
export function useField() {
  const ctx = useContext(Ctx)
  if (!ctx) return { id: undefined, 'aria-describedby': undefined, 'aria-invalid': undefined }
  return {
    id: ctx.id,
    'aria-describedby': ctx.describedBy,
    'aria-invalid': ctx.invalid || undefined,
  }
}

type FieldProps = {
  label: string
  /** Debajo de la etiqueta: para qué sirve el campo. */
  hint?: string
  /** Lo que está mal. Reemplaza al hint y marca el control. */
  error?: string
  /** Marca visible de que sin esto no se puede seguir. */
  required?: boolean
  children: ReactNode
  className?: string
}

/** Une etiqueta, ayuda, error y control: los tres textos quedan atados al control. */
export function Field({ label, hint, error, required, children, className }: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <Ctx.Provider value={{ id, describedBy, invalid: Boolean(error) }}>
      <div className={cx('flex flex-col gap-1.5', className)}>
        <label htmlFor={id} className="flex items-center gap-1 text-xs font-semibold text-ink">
          {label}
          {required && <span aria-hidden="true" className="text-bad">*</span>}
          {required && <span className="sr-only">(obligatorio)</span>}
        </label>
        {hint && !error && <p id={hintId} className="text-2xs font-medium text-ink-muted">{hint}</p>}
        {children}
        {error && (
          <p id={errorId} className="flex items-center gap-1.5 text-2xs font-medium text-bad-ink">
            <Icon name="error" size={14} />
            {error}
          </p>
        )}
      </div>
    </Ctx.Provider>
  )
}

/** Varios campos, uno debajo del otro, con el aire del sistema. */
export function FieldSet({ legend, className, children, ...props }: ComponentPropsWithoutRef<'fieldset'> & { legend?: string }) {
  return (
    <fieldset className={cx('flex flex-col gap-4 border-0 p-0', className)} {...props}>
      {legend && <legend className="mb-1 text-base font-semibold text-ink">{legend}</legend>}
      {children}
    </fieldset>
  )
}
