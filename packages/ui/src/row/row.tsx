import { useId, type ReactNode } from 'react'
import { FieldCtx } from '../field/field'

/** La fila de un panel: 56px de alto, padding 16/24, label a la izquierda y control a la derecha. */
export function Row({ label, hint, children }: { /** nombra el control y lo enfoca al tocarlo */
                                                 label: string; /** segunda línea en 11px gris */
                                                                hint?: string; /** el control, alineado a la derecha */
                                                                               children?: ReactNode }) {
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`
  return (
    <FieldCtx.Provider value={{ id, labelId, describedBy: hint ? hintId : undefined, invalid: false }}>
      <div className="flex min-h-14 items-center gap-4 border-t border-line px-6 py-4 first:border-t-0">
        <div className="min-w-0 flex-1">
          <label id={labelId} htmlFor={id} className="block cursor-pointer text-xs font-medium text-ink">{label}</label>
          {hint && <span id={hintId} className="mt-1 block text-2xs text-ink-muted">{hint}</span>}
        </div>
        {children}
      </div>
    </FieldCtx.Provider>
  )
}
