import { createContext, useContext, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

type FieldState = { id: string; labelId: string; describedBy?: string; invalid: boolean }
export const FieldCtx = createContext<FieldState | null>(null)

/** Lo que un grupo de opciones necesita: no toma el id, se nombra con la etiqueta. */
export function useFieldGroup() {
  const ctx = useContext(FieldCtx)
  if (!ctx) return { 'aria-labelledby': undefined, 'aria-describedby': undefined, 'aria-invalid': undefined }
  return {
    'aria-labelledby': ctx.labelId,
    'aria-describedby': ctx.describedBy,
    'aria-invalid': ctx.invalid || undefined,
  }
}

/** Lo que un control necesita para quedar bien atado a su etiqueta. */
export function useField() {
  const ctx = useContext(FieldCtx)
  if (!ctx) return { id: undefined, 'aria-describedby': undefined, 'aria-invalid': undefined }
  return {
    id: ctx.id,
    'aria-describedby': ctx.describedBy,
    'aria-invalid': ctx.invalid || undefined,
  }
}

type FieldProps = {
  /** Nombra el control y lo enfoca al tocarla. */
  label: string
  /** Debajo de la etiqueta: para qué sirve el campo. */
  hint?: string
  /** Lo que está mal. Reemplaza al hint y marca el control. */
  error?: string
  /** Marca visible de que sin esto no se puede seguir. */
  required?: boolean
  /** El control, que toma el id solo. */
  children: ReactNode
  className?: string
}

/** Une etiqueta, ayuda, error y control: los tres textos quedan atados al control. */
export function Field({ label, hint, error, required, children, className }: FieldProps) {
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <FieldCtx.Provider value={{ id, labelId, describedBy, invalid: Boolean(error) }}>
      <div className={cx('flex flex-col gap-1.5', className)}>
        <label id={labelId} htmlFor={id} className="flex items-center gap-1 text-xs font-semibold text-ink">
          {label}
          {required && <span aria-hidden="true" className="text-bad-ink">*</span>}
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
    </FieldCtx.Provider>
  )
}

/** Varios campos, uno debajo del otro, con el aire del sistema. */
export function FieldSet({ legend, className, children, ...props }: ComponentPropsWithoutRef<'fieldset'> & { /** cómo se llama el grupo */
                                                                                                             legend?: string }) {
  return (
    <fieldset className={cx('flex flex-col gap-4 border-0 p-0', className)} {...props}>
      {legend && <legend className="mb-1 text-base font-semibold text-ink">{legend}</legend>}
      {children}
    </fieldset>
  )
}
