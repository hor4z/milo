import s from './row.module.css'
import { useId, type ReactNode } from 'react'
import { FieldCtx } from '../lib/field-ctx'

/** La fila de un panel: 56px de alto, padding 16/24, label a la izquierda y control a la derecha. */
export function Row({ label, hint, children }: {
  /** Qué se ajusta. Es un `<label>` de verdad: tocarlo acciona el control. */
  label: string
  /** La segunda línea, en 11 gris. */
  hint?: string
  /** El control, alineado a la derecha. */
  children?: ReactNode
}) {
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`
  return (
    <FieldCtx.Provider value={{ id, labelId, describedBy: hint ? hintId : undefined, invalid: false }}>
      <div className={s.root}>
        <div className={s.body}>
          <label id={labelId} htmlFor={id} className={s.label}>{label}</label>
          {hint && <span id={hintId} className={s.hint}>{hint}</span>}
        </div>
        {children}
      </div>
    </FieldCtx.Provider>
  )
}
