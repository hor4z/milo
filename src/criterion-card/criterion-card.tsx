import s from './criterion-card.module.css'
import { useId, type ReactNode } from 'react'
import { Card } from '../card/card'
import { useRovingRadio } from '../lib/roving'
import { Icon } from '../icon/icon'
import { IconButton } from '../icon-button/icon-button'
import { Tooltip } from '../tooltip/tooltip'
import { cx } from '../lib/cx'
import { labelSoft, type LabelColor } from '../lib/colors'
import { share } from '../lib/number'

/** Cómo quedó un renglón al corregirlo: lo hizo, no lo hizo, o todavía nadie lo miró. */
export type Met = boolean | undefined

/** Un aspecto: qué se mira, cuánto vale contra los demás y qué se ve en cada nivel. */
export type Criterion = {
  /** Único en la rúbrica. */
  id: string
  /** Qué se mira, en las palabras de quien corrige. */
  label: string
  /** Cuánto vale contra los demás. De acá sale su porcentaje. */
  weight: number
  /** El color de su flecha, y el de su tramo en la barra de la rúbrica. */
  color: LabelColor
  /** Un descriptor por nivel, del más flojo al más completo. */
  levels: string[]
}

function Pick({ value, label, onPick }: {
  value: Met
  label: string
  onPick: (value: Met) => void
}) {
  const roving = useRovingRadio(
    value === undefined ? '' : String(value),
    v => onPick(v === 'true'),
    [{ value: 'true' }, { value: 'false' }],
  )
  return (
    <span role="radiogroup" aria-label={`Cómo quedó: ${label}`} onKeyDown={roving.onKeyDown} className={s.picks}>
      <button
        ref={roving.ref('true')}
        type="button"
        role="radio"
        aria-checked={value === true}
        aria-label="Lo hizo"
        tabIndex={roving.tabIndex('true')}
        onClick={() => onPick(value === true ? undefined : true)}
        className={cx(s.pick, value === true && s.met)}
      >
        <Icon name="check" weight={600} />
      </button>
      <button
        ref={roving.ref('false')}
        type="button"
        role="radio"
        aria-checked={value === false}
        aria-label="No lo hizo"
        tabIndex={roving.tabIndex('false')}
        onClick={() => onPick(value === false ? undefined : false)}
        className={cx(s.pick, value === false && s.failed)}
      >
        <Icon name="close" weight={600} />
      </button>
    </span>
  )
}

/** Un aspecto adentro de una rúbrica: la marca, el nombre y, plegados, sus niveles. Cerrado ocupa una fila, así que una rúbrica de ocho aspectos mide lo mismo que una de dos. */
export function CriterionCard({ criterion, total, open, onToggle, onRemove, met, onMet, meta, children, className }: {
  /** Lo que la tarjeta muestra. */
  criterion: Criterion
  /** La suma de los pesos de la rúbrica: con eso la tarjeta dice cuánto vale este aspecto. */
  total: number
  /** Es controlada: la rúbrica decide cuál está abierta. */
  open: boolean
  /** Recibe el pedido de abrir o cerrar. */
  onToggle: () => void
  /** Sin esto el aspecto no se puede sacar. */
  onRemove?: () => void
  /** Cómo quedó cada renglón, en el orden de `levels`: cumple, no cumple, o sin mirar. */
  met?: Met[]
  /** Sin esto los renglones se leen y no se marcan. */
  onMet?: (level: number, value: Met) => void
  /** A la derecha del nombre, y se ve también plegada: en qué anda este aspecto. */
  meta?: ReactNode
  /** Debajo de los niveles: lo que se dijo sobre este aspecto. */
  children?: ReactNode
  className?: string
}) {
  const id = useId()
  const titleId = `${id}-title`
  const bodyId = `${id}-body`

  return (
    <Card className={cx(s.root, className)}>
      <Card.Header className={cx(s.header, open && s.headerOpen)}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-labelledby={titleId}
          onClick={onToggle}
          className={cx(s.trigger, labelSoft[criterion.color])}
        >
          <Icon
            name="keyboard_arrow_down"
            size={18}
            className={cx(s.chevron, open && s.chevronOpen)}
          />
        </button>
        <Card.Title id={titleId} className={s.title}>
          {criterion.label}
          <span className="sr-only">, vale {share(criterion.weight, total).percent} de la nota</span>
        </Card.Title>
        {meta && <span className={`${s.meta} tabular`}>{meta}</span>}
        {onRemove && (
          <Tooltip label="Sacar de la rúbrica">
            <IconButton
              icon="delete"
              label={`Sacar ${criterion.label} de la rúbrica`}
              size="sm"
              variant="ghost"
              onClick={onRemove}
              className={s.remove}
            />
          </Tooltip>
        )}
      </Card.Header>

      <div className={cx(s.body, open && s.bodyOpen)}>
        <div id={bodyId} inert={!open} className={s.bodyInner}>
          <Card.Body className={s.levels}>
            <ul className={s.ladder}>
              {criterion.levels.map((text, i) => (
                <li key={text} className={cx(s.step, s.row)}>
                  {onMet
                    ? <Pick value={met?.[i]} label={text} onPick={v => onMet(i, v)} />
                    : met && (
                        <span aria-hidden className={met[i] ? s.met : s.unmet}>
                          <Icon name={met[i] ? 'check' : 'remove'} weight={600} />
                        </span>
                      )}
                  <span className={cx(s.stepText, met?.[i] && s.stepMet)}>
                    {text}
                    {met && !onMet && (
                      <span className="sr-only">{met[i] ? ', cumplido' : ', todavía no'}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {children}
          </Card.Body>
        </div>
      </div>
    </Card>
  )
}
