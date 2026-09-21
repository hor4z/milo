import s from './choice.module.css'
import { useId, type ReactNode } from 'react'
import { Checkbox } from '../checkbox/checkbox'
import { Icon } from '../icon/icon'
import { Radio } from '../radio/radio'
import { cx } from '../lib/cx'
import { useRovingRadio } from '../lib/roving'
import { takePart } from '../lib/parts'

/** Una de las opciones que se ofrecen. */
export type Option = {
  /** Único en la pregunta. */
  id: string
  /** Lo que se lee en la tarjeta. */
  label: string
}

/** Lo que se pregunta. Va como hijo porque es texto de la pantalla y lo escribe una persona. */
function Prompt({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** La línea de apoyo: de dónde sacar el dato, cuántas hay que marcar. */
function Hint({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Una pregunta con opciones: el enunciado y las tarjetas. Con `multiple` vale marcar más de una. Elegir no dice si estuvo bien: eso lo dice `revealed`, y hasta entonces la pieza no corrige a nadie. */
function Root({
  options, value, onChange, multiple, correct, revealed, readOnly, children, className,
}: {
  /** En el orden en que se leen. */
  options: Option[]
  /** Lo marcado, siempre como array: así el call site no cambia de forma al pasar de una a varias. */
  value: string[]
  /** Recibe lo marcado después del toque, no el id que se tocó. Eligiendo una sola, volver a tocar la elegida no la apaga: es lo mismo que hace `Radio`, y una opción única que se puede dejar en blanco se destilda sin querer. */
  onChange: (next: string[]) => void
  /** Más de una puede estar bien, y entonces las tarjetas son casillas y no opciones únicas. */
  multiple?: boolean
  /** Cuáles estaban bien. Sin `revealed` no se dibuja: la pieza lo guarda hasta que alguien decide mostrarlo. */
  correct?: string[]
  /** Muestra cuáles estaban bien y deja de aceptar cambios: una pregunta corregida no se vuelve a responder. */
  revealed?: boolean
  /** Se lee y no se toca: la entrega de otro, una consigna cerrada. */
  readOnly?: boolean
  /** El `Choice.Prompt` y, si hace falta, el `Choice.Hint`. */
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const promptId = `${id}-prompt`
  const [prompt, rest] = takePart(children, Prompt)
  const [hint] = takePart(rest, Hint)

  const quieto = revealed || readOnly
  const marcado = (o: Option) => value.includes(o.id)
  const acertada = (o: Option) => revealed && correct?.includes(o.id)
  const errada = (o: Option) => revealed && marcado(o) && !correct?.includes(o.id)

  const toggle = (o: Option) => {
    if (quieto) return
    if (!multiple) return marcado(o) ? undefined : onChange([o.id])
    onChange(marcado(o) ? value.filter(v => v !== o.id) : [...value, o.id])
  }

  const roving = useRovingRadio(
    value[0] ?? options[0]?.id ?? '',
    v => toggle(options.find(o => o.id === v)!),
    options.map(o => ({ value: o.id, disabled: quieto })),
  )

  return (
    <div className={cx(s.root, className)}>
      <p id={promptId} className={s.prompt}>{prompt}</p>
      {hint.length > 0 && <p className={s.hint}>{hint}</p>}

      <div
        role={multiple ? 'group' : 'radiogroup'}
        aria-labelledby={promptId}
        onKeyDown={multiple ? undefined : roving.onKeyDown}
        className={s.options}
      >
        {options.map(o => (
          <label
            key={o.id}
            className={cx(
              s.option,
              !quieto && s.interactive,
              marcado(o) && s.selected,
              acertada(o) && s.met,
              errada(o) && s.unmet,
            )}
          >
            <span className={s.control}>
              {multiple
                ? <Checkbox checked={marcado(o)} disabled={quieto} onChange={() => toggle(o)} />
                : (
                    <Radio
                      ref={roving.ref(o.id)}
                      checked={marcado(o)}
                      disabled={quieto}
                      tabIndex={roving.tabIndex(o.id)}
                      onChange={() => toggle(o)}
                    />
                  )}
            </span>
            <span className={s.text}>{o.label}</span>
            {acertada(o) && (
              <span aria-hidden className={s.trailing}>
                <Icon name="check" size={14} weight={600} />
              </span>
            )}
            {revealed && (
              <span className="sr-only">
                {correct?.includes(o.id) ? ', es una de las que iban' : marcado(o) ? ', esta no iba' : ''}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}

export const Choice = Object.assign(Root, { Prompt, Hint })
