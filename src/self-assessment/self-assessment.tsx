import s from './self-assessment.module.css'
import { useId, useState, type ReactNode } from 'react'
import { CriterionCard, namesFor, type Criterion } from '../criterion-card/criterion-card'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'
import { counted } from '../lib/number'
import { useDisclosure } from '../lib/use-disclosure'
import { takePart } from '../lib/parts'

export type { Criterion }

/** Cómo se llama la autoevaluación, en la cabecera. */
function Title({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Dónde se ubica quien entrega, aspecto por aspecto, contra la rúbrica con la que lo van a mirar. Es la misma tarjeta que usa quien corrige, así que lo que el docente escribe es lo que el estudiante lee. Los niveles son excluyentes: va uno solo, porque son descripciones del mismo estado. */
function Root({ criteria, value, onChange, defaultOpen = true, children, className }: {
  /** Los aspectos de la rúbrica, en su orden. */
  criteria: Criterion[]
  /** En qué nivel se ubicó cada aspecto, por id. */
  value: Record<string, number>
  /** Recibe el aspecto y el nivel elegido. */
  onChange: (id: string, level: number) => void
  /** Arranca abierta. Plegada deja a la vista el nombre, lo que falta y la barra. */
  defaultOpen?: boolean
  /** El `SelfAssessment.Title`. */
  children: ReactNode
  className?: string
}) {
  const [openCard, setOpenCard] = useState<string | null>(criteria[0]?.id ?? null)
  const panel = useDisclosure(defaultOpen)
  const id = useId()
  const titleId = `${id}-title`
  const bodyId = `${id}-body`

  const [title] = takePart(children, Title)
  const total = criteria.reduce((sum, c) => sum + c.weight, 0)
  const ubicados = criteria.filter(c => value[c.id] !== undefined).length
  const faltan = criteria.length - ubicados

  const nivel = (c: Criterion) => {
    const level = value[c.id]
    if (level === undefined) return 'sin ubicar'
    return namesFor(c)?.[level] ?? `nivel ${level + 1}`
  }

  return (
    <section aria-labelledby={titleId} className={cx(s.root, className)}>
      <div className={s.header}>
        <button
          type="button"
          aria-expanded={panel.open}
          aria-controls={bodyId}
          aria-labelledby={titleId}
          onClick={panel.onToggle}
          className={s.trigger}
        >
          <Icon
            name="keyboard_arrow_down"
            size={20}
            className={cx(s.chevron, panel.open && s.chevronOpen, 'icon-muted')}
          />
        </button>
        <p id={titleId} className={s.title}>{title}</p>
        <span className={`${s.count} tabular`}>
          {faltan === 0 ? 'lista' : counted(faltan, ['aspecto', 'aspectos'])}
        </span>
      </div>

      <div aria-hidden className={s.progress}>
        <span
          style={{ inlineSize: `${criteria.length === 0 ? 0 : (ubicados / criteria.length) * 100}%` }}
          className={s.fill}
        />
      </div>

      <div className={cx(s.body, panel.open && s.bodyOpen)}>
        <div id={bodyId} inert={!panel.open} className={s.bodyInner}>
          <ul className={s.items}>
            {criteria.map(c => (
              <li key={c.id}>
                <CriterionCard
                  criterion={c}
                  total={total}
                  level={value[c.id]}
                  onLevel={level => onChange(c.id, level)}
                  meta={nivel(c)}
                  open={openCard === c.id}
                  onToggle={() => setOpenCard(o => (o === c.id ? null : c.id))}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export const SelfAssessment = Object.assign(Root, { Title })
