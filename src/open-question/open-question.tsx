import s from './open-question.module.css'
import { useId, type ReactNode } from 'react'
import { Textarea } from '../textarea/textarea'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

/** Lo que se pregunta. Va como hijo porque lo escribe una persona. */
function Prompt({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** La línea de apoyo: qué se espera que aparezca en la respuesta. */
function Hint({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Una pregunta que se responde escribiendo. No la corrige nadie solo: lo que se escribe acá lo lee una persona, y por eso la pieza no tiene noción de respuesta correcta. */
function Root({
  value, onChange, placeholder, maxLength = 600, rows = 3, readOnly, children, className,
}: {
  /** Lo escrito hasta ahora. */
  value: string
  /** Recibe el texto nuevo. Sin esto la pregunta se lee y no se responde. */
  onChange?: (next: string) => void
  /** Lo que se ve con el campo vacío: una pista de por dónde empezar, no la respuesta. */
  placeholder?: string
  /** El tope, que el campo avisa recién cuando queda poco. */
  maxLength?: number
  /** El alto de arranque. Crece sola hasta el doble. */
  rows?: number
  /** Se lee y no se escribe: la entrega de otro, una consigna cerrada. */
  readOnly?: boolean
  /** El `OpenQuestion.Prompt` y, si hace falta, el `OpenQuestion.Hint`. */
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const promptId = `${id}-prompt`
  const [prompt, rest] = takePart(children, Prompt)
  const [hint] = takePart(rest, Hint)

  const quieto = readOnly || !onChange
  const vacia = value.trim() === ''

  return (
    <div className={cx(s.root, className)}>
      <p id={promptId} className={s.prompt}>{prompt}</p>
      {hint.length > 0 && <p className={s.hint}>{hint}</p>}

      {quieto
        ? (
            <p className={cx(s.answer, vacia && s.empty)} aria-labelledby={promptId}>
              {vacia ? 'Sin responder' : value}
            </p>
          )
        : (
            <Textarea
              value={value}
              rows={rows}
              maxRows={rows * 2}
              counter
              maxLength={maxLength}
              placeholder={placeholder}
              aria-labelledby={promptId}
              onChange={e => onChange(e.target.value)}
            />
          )}
    </div>
  )
}

export const OpenQuestion = Object.assign(Root, { Prompt, Hint })
