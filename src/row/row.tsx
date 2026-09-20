import s from './row.module.css'
import { useId, type ReactNode } from 'react'
import { FieldCtx } from '../lib/field-ctx'
import { takePart } from '../lib/parts'

/** Qué se ajusta. Es un `<label>` de verdad: tocarlo acciona el control. */
function Label({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** La segunda línea, en 11 gris. */
function Hint({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function Root({ children }: {
  /** El `Row.Label`, el `Row.Hint` si va, y el control. */
  children?: ReactNode
}) {
  const [label, sinLabel] = takePart(children, Label)
  const [hint, control] = takePart(sinLabel, Hint)
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`
  return (
    <FieldCtx.Provider value={{ id, labelId, describedBy: hint.length ? hintId : undefined, invalid: false }}>
      <div className={s.root}>
        <div className={s.body}>
          <label id={labelId} htmlFor={id} className={s.label}>{label}</label>
          {hint.length > 0 && <span id={hintId} className={s.hint}>{hint}</span>}
        </div>
        {control}
      </div>
    </FieldCtx.Provider>
  )
}

/** La fila de un panel: 56px de alto, padding 16/24, label a la izquierda y control a la derecha. */
export const Row = Object.assign(Root, { Label, Hint })
