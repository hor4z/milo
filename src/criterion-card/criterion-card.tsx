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

/** Los cuatro escalones, del más flojo al más completo. Son los que usa el sistema educativo y no una escala propia: quien corrige ya los tiene en la cabeza y quien entregó los escuchó toda su escolaridad. Van en este orden y no al revés, porque el renglón de más abajo es hacia dónde ir. */
export const levelNames = ['Inicial', 'En proceso', 'Bueno', 'Excelente'] as const

/** Lo que entra en un aspecto. El nombre se lee plegado y por eso va corto; la descripción se lee al abrirlo, así que tiene más aire pero tampoco es un párrafo. */
export const criterionLimits = { label: 56, detail: 220 } as const

/** Un aspecto: qué se mira, cuánto vale contra los demás y qué se ve en cada renglón. */
export type Criterion = {
  /** Único en la rúbrica. */
  id: string
  /** Qué se mira, en las palabras de quien corrige. Corto: es lo único que se ve plegado. */
  label: string
  /** Lo que el nombre no alcanza a decir. Se lee recién al abrir el aspecto. */
  detail?: string
  /** Cuánto vale contra los demás. De acá sale su porcentaje. */
  weight: number
  /** El color de su marca, y el de su tramo en la barra de la rúbrica. */
  color: LabelColor
  /** Qué se ve en la entrega, del renglón más flojo al más completo. */
  levels: string[]
  /** Cómo se llama cada escalón. Con cuatro renglones y sin esto toma los del sistema educativo; con otra cantidad, los renglones van sin nombre. */
  levelNames?: string[]
}

/** El nombre de cada escalón, si esta rúbrica tiene nombres que poner. Una sola regla para todas las piezas que los muestran. */
export function namesFor(criterion: Criterion): string[] | undefined {
  if (criterion.levelNames) return criterion.levelNames
  return criterion.levels.length === levelNames.length ? [...levelNames] : undefined
}

/** Un aspecto adentro de una rúbrica: la marca, el nombre y, plegados, sus renglones. Cerrado ocupa una fila, así que una rúbrica de ocho aspectos mide lo mismo que una de dos. */
export function CriterionCard({ criterion, total, open, onToggle, onRemove, level, onLevel, meta, children, className }: {
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
  /** En qué nivel quedó: el índice del renglón elegido. Los renglones son excluyentes, así que es uno y no una lista. */
  level?: number
  /** Sin esto los renglones se leen y no se eligen. */
  onLevel?: (level: number) => void
  /** A la derecha del nombre, y se ve también plegada: en qué anda este aspecto. */
  meta?: ReactNode
  /** Debajo de los renglones: lo que se dijo sobre este aspecto. */
  children?: ReactNode
  className?: string
}) {
  const id = useId()
  const titleId = `${id}-title`
  const bodyId = `${id}-body`
  const nombres = namesFor(criterion)

  const roving = useRovingRadio(
    String(level ?? 0),
    v => onLevel?.(Number(v)),
    criterion.levels.map((_, i) => ({ value: String(i), disabled: !onLevel })),
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
          <Icon name="label" size={16} />
        </span>
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
            {criterion.detail && <p className={s.hint}>{criterion.detail}</p>}
            <ul
              role={onLevel ? 'radiogroup' : undefined}
              aria-labelledby={onLevel ? titleId : undefined}
              onKeyDown={onLevel ? roving.onKeyDown : undefined}
              className={s.ladder}
            >
              {criterion.levels.map((text, i) => {
                const elegido = i === level
                const cuerpo = (
                  <>
                    {onLevel || elegido
                      ? (
                          <span aria-hidden className={cx(s.pick, elegido && s.met)}>
                            {elegido && <Icon name="check" size={12} weight={600} />}
                          </span>
                        )
                      : <span aria-hidden className={s.bullet} />}
                    <span className={cx(s.stepText, elegido && s.stepMet)}>
                      {nombres?.[i] && (
                        <>
                          <span className={s.levelName}>{nombres[i]}</span>
                          <span aria-hidden className={s.separator}>·</span>
                        </>
                      )}
                      {text}
                      {!onLevel && elegido && (
                        <span className="sr-only">, es el nivel en el que quedó</span>
                      )}
                    </span>
                  </>
                )
                return (
                  <li key={text} role={onLevel ? 'none' : undefined} className={s.step}>
                    {onLevel
                      ? (
                          <button
                            ref={roving.ref(String(i))}
                            type="button"
                            role="radio"
                            aria-checked={elegido}
                            tabIndex={roving.tabIndex(String(i))}
                            onClick={() => onLevel(i)}
                            className={s.option}
                          >
                            {cuerpo}
                          </button>
                        )
                      : <span className={s.option}>{cuerpo}</span>}
                  </li>
                )
              })}
            </ul>
            {children}
          </Card.Body>
        </div>
      </div>
    </Card>
  )
}
