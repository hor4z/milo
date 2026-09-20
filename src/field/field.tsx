import s from './field.module.css'
import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { FieldCtx } from '../lib/field-ctx'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

type FieldProps = {
  /** Marca visible de que sin esto no se puede seguir. */
  required?: boolean
  /** El `Field.Label`, el `Field.Hint` o el `Field.Error` si van, y el control, que toma el id solo. */
  children: ReactNode
  className?: string
}

/** Nombra el control y lo enfoca al tocarla. */
function Label({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Debajo de la etiqueta: para qué sirve el campo. */
function Hint({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Lo que está mal. Reemplaza al hint y marca el control. */
function Error({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function Root({ required, children, className }: FieldProps) {
  const [label, sinLabel] = takePart(children, Label)
  const [hint, sinHint] = takePart(sinLabel, Hint)
  const [error, control] = takePart(sinHint, Error)
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint.length && hintId, error.length && errorId].filter(Boolean).join(' ') || undefined

  return (
    <FieldCtx.Provider value={{ id, labelId, describedBy, invalid: error.length > 0 }}>
      <div className={cx(s.root, className)}>
        <label id={labelId} htmlFor={id} className={s.label}>
          {label}
          {required && <span aria-hidden="true" className={s.required}>*</span>}
          {required && <span className="sr-only">(obligatorio)</span>}
        </label>
        {hint.length > 0 && error.length === 0 && <p id={hintId} className={s.hint}>{hint}</p>}
        {control}
        {error.length > 0 && (
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
function Set({ legend, className, children, ...props }: ComponentPropsWithoutRef<'fieldset'> & {
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

/** Une etiqueta, ayuda, error y control: los tres textos quedan atados al control. */
export const Field = Object.assign(Root, { Label, Hint, Error, Set })
