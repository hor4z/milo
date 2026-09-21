import s from './number-answer.module.css'
import { useId, type ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { TextField } from '../text-field/text-field'
import { cx } from '../lib/cx'
import { count, decimals, withUnit } from '../lib/number'
import { takePart } from '../lib/parts'

/** Lo escrito, como número. Acepta la coma y el punto, porque acá se escribe "7,5" y el teclado del celular manda un punto. */
export function parseNumber(raw: string): number | null {
  const limpio = raw.replace(/\s/g, '').replace(',', '.')
  if (limpio === '' || !/^-?\d*\.?\d*$/.test(limpio)) return null
  const n = Number(limpio)
  return Number.isFinite(n) ? n : null
}

/** Qué hay que calcular. */
function Prompt({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** De dónde sale el número: qué cuenta hay que hacer, con qué datos. */
function Hint({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Un número que sale de una cuenta: un promedio, una diferencia, una métrica. La tolerancia existe porque una medición no da siempre lo mismo, así que la respuesta es un rango y no un valor. */
function Root({
  value, onChange, unit, expected, tolerance = 0, revealed, readOnly, children, className,
}: {
  /** Lo escrito, tal cual, para no pelearle al que está tipeando. */
  value: string
  /** Recibe el texto nuevo. Sin esto se lee y no se responde. */
  onChange?: (next: string) => void
  /** Lo que se mide: dB, cm, segundos. Va pegado al campo, no adentro del número. */
  unit?: string
  /** El valor al que hay que llegar. Sin `revealed` no se dibuja. */
  expected?: number
  /** El margen para arriba y para abajo. En cero, la respuesta es exacta. */
  tolerance?: number
  /** Muestra si cayó adentro del margen y deja de aceptar cambios. */
  revealed?: boolean
  /** Se lee y no se escribe. */
  readOnly?: boolean
  /** El `NumberAnswer.Prompt` y, si hace falta, el `NumberAnswer.Hint`. */
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const promptId = `${id}-prompt`
  const [prompt, rest] = takePart(children, Prompt)
  const [hint] = takePart(rest, Hint)

  const escrito = (v: number) => (Number.isInteger(v) ? count(v) : decimals(v, 1))
  const conUnidad = (v: number) => (unit ? withUnit(v, unit, Number.isInteger(v) ? 0 : 1) : escrito(v))
  const n = parseNumber(value)
  const quieto = revealed || readOnly || !onChange
  const acertó = revealed && expected !== undefined && n !== null && Math.abs(n - expected) <= tolerance

  return (
    <div className={cx(s.root, className)}>
      <p id={promptId} className={s.prompt}>{prompt}</p>
      {hint.length > 0 && <p className={s.hint}>{hint}</p>}

      <div className={s.row}>
        <TextField
          size="sm"
          inputMode="decimal"
          value={value}
          disabled={quieto}
          aria-labelledby={promptId}
          onChange={e => onChange?.(e.target.value)}
          suffix={unit ? <span className={s.unit}>{unit}</span> : undefined}
          className={s.control}
        />
        {revealed && expected !== undefined && (
          <p className={cx(s.verdict, acertó ? s.metText : s.unmetText)}>
            <span aria-hidden className={cx(s.trailing, acertó ? s.met : s.unmet)}>
              <Icon name={acertó ? 'check' : 'remove'} size={14} weight={600} />
            </span>
            {acertó
              ? 'Cae adentro del margen'
              : `Da ${conUnidad(expected)}${tolerance ? `, con ${escrito(tolerance)} de margen` : ''}`}
          </p>
        )}
      </div>
    </div>
  )
}

export const NumberAnswer = Object.assign(Root, { Prompt, Hint })
