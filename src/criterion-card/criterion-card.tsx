import s from './criterion-card.module.css'
import { useId, type ReactNode } from 'react'
import { Card } from '../card/card'
import { Icon, type IconName } from '../icon/icon'
import { IconButton } from '../icon-button/icon-button'
import { Tooltip } from '../tooltip/tooltip'
import { cx } from '../lib/cx'
import { useRovingRadio } from '../lib/roving'
import { labelSoft, type LabelColor } from '../lib/colors'
import { share } from '../lib/number'

/** Un aspecto: qué se mira, cuánto vale contra los demás y qué se ve en cada nivel. */
export type Criterion = {
  /** Único en la rúbrica. */
  id: string
  /** Qué se mira, en las palabras de quien corrige. */
  label: string
  /** Cuánto vale contra los demás. De acá sale su porcentaje. */
  weight: number
  /** El color de su marca, y el de su tramo en la barra de la rúbrica. */
  color: LabelColor
  /** El glifo de su marca. */
  icon: IconName
  /** Un descriptor por nivel, del más flojo al más completo. */
  levels: string[]
}

/** Un aspecto adentro de una rúbrica: la marca, el nombre y, plegados, sus niveles. Cerrado ocupa una fila, así que una rúbrica de ocho aspectos mide lo mismo que una de dos. */
export function CriterionCard({ criterion, total, open, onToggle, onRemove, level, onLevel, children, className }: {
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
  /** En qué nivel cayó el trabajo, contando desde cero. Sin esto el aspecto está sin corregir. */
  level?: number
  /** Sin esto los niveles se leen y no se eligen. */
  onLevel?: (level: number) => void
  /** Debajo de los niveles: lo que se dijo sobre este aspecto. */
  children?: ReactNode
  className?: string
}) {
  const id = useId()
  const titleId = `${id}-title`
  const bodyId = `${id}-body`
  const roving = useRovingRadio(
    String(level ?? 0),
    v => onLevel?.(Number(v)),
    criterion.levels.map((_, i) => ({ value: String(i) })),
  )

  return (
    <Card className={cx(s.root, className)}>
      <Card.Header className={cx(s.header, open && s.headerOpen)}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-labelledby={titleId}
          onClick={onToggle}
          className={s.trigger}
        >
          <Icon
            name="keyboard_arrow_down"
            size={18}
            className={cx(s.chevron, open && s.chevronOpen, 'icon-muted')}
          />
        </button>
        <span aria-hidden className={`${s.swatch} mark ${labelSoft[criterion.color]}`}>
          <Icon name={criterion.icon} size={16} />
        </span>
        <Card.Title id={titleId} className={s.title}>
          {criterion.label}
          <span className="sr-only">, vale {share(criterion.weight, total).percent} de la nota</span>
        </Card.Title>
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
            {onLevel ? (
              <div
                role="radiogroup"
                aria-label={`En qué nivel cayó ${criterion.label}`}
                onKeyDown={roving.onKeyDown}
                className={s.ladder}
              >
                {criterion.levels.map((text, i) => (
                  <button
                    key={text}
                    ref={roving.ref(String(i))}
                    type="button"
                    role="radio"
                    aria-checked={level === i}
                    tabIndex={roving.tabIndex(String(i))}
                    onClick={() => onLevel(i)}
                    className={cx(
                      s.step,
                      s.stepPick,
                      i === criterion.levels.length - 1 && s.stepTop,
                      level === i && s.stepMarked,
                    )}
                  >
                    {text}
                  </button>
                ))}
              </div>
            ) : (
              <ol className={s.ladder}>
                {criterion.levels.map((text, i) => (
                  <li
                    key={text}
                    aria-current={level === i ? 'true' : undefined}
                    className={cx(
                      s.step,
                      i === criterion.levels.length - 1 && s.stepTop,
                      level === i && s.stepMarked,
                    )}
                  >
                    {text}
                  </li>
                ))}
              </ol>
            )}
            {children}
          </Card.Body>
        </div>
      </div>
    </Card>
  )
}
