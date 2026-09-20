import s from './field.module.css'
import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { FieldCtx } from '../lib/field-ctx'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

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
      <div className={cx(s.root, className)}>
        <label id={labelId} htmlFor={id} className={s.label}>
          {label}
          {required && <span aria-hidden="true" className={s.required}>*</span>}
          {required && <span className="sr-only">(obligatorio)</span>}
        </label>
        {hint && !error && <p id={hintId} className={s.hint}>{hint}</p>}
        {children}
        {error && (
          <p id={errorId} className={s.error}>
            <Icon name="error" size={14} />
            {error}
          </p>
        )}
      </div>
    </FieldCtx.Provider>
  )
}

/** Varios campos, uno debajo del otro, con el aire del sistema. */
export function FieldSet({ legend, className, children, ...props }: ComponentPropsWithoutRef<'fieldset'> & {
  /** Cómo se llama el grupo. Un lector lo anuncia al entrar. */
  legend?: string
}) {
  return (
    <fieldset className={cx(s.set, className)} {...props}>
      {legend && <legend className={s.setLegend}>{legend}</legend>}
      {children}
    </fieldset>
  )
}
