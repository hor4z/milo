import s from './self-assessment.module.css'
import { useId, useState, type ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { namesFor, type Criterion } from '../criterion-card/criterion-card'
import { cx } from '../lib/cx'
import { counted } from '../lib/number'
import { useRovingRadio } from '../lib/roving'
import { takePart } from '../lib/parts'

export type { Criterion }

/** Cómo se llama la autoevaluación, en la cabecera. */
function Title({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Un aspecto: el nombre, dónde quedó, y los niveles cuando está abierto. */
function Aspect({ criterion, level, onLevel, open, onToggle }: {
  criterion: Criterion
  level?: number
  onLevel: (level: number) => void
  open: boolean
  onToggle: () => void
}) {
  const id = useId()
  const titleId = `${id}-title`
  const bodyId = `${id}-body`
  const nombres = namesFor(criterion)
  const roving = useRovingRadio(
    String(level ?? 0),
    v => onLevel(Number(v)),
    criterion.levels.map((_, i) => ({ value: String(i) })),
  )

  return (
    <div className={s.aspect}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        aria-labelledby={titleId}
        onClick={onToggle}
        className={s.header}
      >
        <Icon
          name="keyboard_arrow_down"
          size={18}
          className={cx(s.chevron, open && s.chevronOpen, 'icon-muted')}
        />
        <span id={titleId} className={s.title}>{criterion.label}</span>
        <span className={cx(s.count, level === undefined && s.empty)}>
          {level === undefined ? 'sin ubicar' : nombres?.[level] ?? `nivel ${level + 1}`}
        </span>
      </button>

      {open && (
        <div
          id={bodyId}
          role="radiogroup"
          aria-labelledby={titleId}
          onKeyDown={roving.onKeyDown}
          className={s.levels}
        >
          {criterion.levels.map((text, i) => (
            <button
              key={text}
              ref={roving.ref(String(i))}
              type="button"
              role="radio"
              aria-checked={i === level}
              tabIndex={roving.tabIndex(String(i))}
              onClick={() => onLevel(i)}
              className={cx(s.level, i === level && s.selected)}
            >
              <span aria-hidden className={cx(s.pick, i === level && s.picked)}>
                {i === level && <Icon name="check" size={12} weight={600} />}
              </span>
              <span className={s.text}>
                {nombres?.[i] && (
                  <>
                    <span className={s.levelName}>{nombres[i]}</span>
                    <span aria-hidden className={s.separator}>·</span>
                  </>
                )}
                {text}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Dónde se ubica quien entrega, aspecto por aspecto, contra la rúbrica con la que lo van a mirar. Los niveles son excluyentes: va uno solo, porque son cuatro descripciones del mismo estado. Arriba dice cuántos aspectos quedan sin ubicar, que es lo único que acá cuenta como progreso. */
function Root({ criteria, value, onChange, children, className }: {
  /** Los aspectos de la rúbrica, en su orden. */
  criteria: Criterion[]
  /** En qué nivel se ubicó cada aspecto, por id. */
  value: Record<string, number>
  /** Recibe el aspecto y el nivel elegido. */
  onChange: (id: string, level: number) => void
  /** El `SelfAssessment.Title`. */
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState<string | null>(criteria[0]?.id ?? null)
  const id = useId()
  const titleId = `${id}-title`

  const [title] = takePart(children, Title)
  const ubicados = criteria.filter(c => value[c.id] !== undefined).length
  const faltan = criteria.length - ubicados

  return (
    <section aria-labelledby={titleId} className={cx(s.root, className)}>
      <div className={s.top}>
        <p id={titleId} className={s.heading}>{title}</p>
        <p className={s.left}>
          {faltan === 0
            ? 'Los ubicaste todos'
            : `${counted(faltan, ['aspecto', 'aspectos'])} sin ubicar`}
        </p>
      </div>

      <div aria-hidden className={s.progress}>
        {criteria.map(c => (
          <span key={c.id} className={cx(s.slot, value[c.id] !== undefined && s.done)} />
        ))}
      </div>

      <div className={s.aspects}>
        {criteria.map(c => (
          <Aspect
            key={c.id}
            criterion={c}
            level={value[c.id]}
            onLevel={level => onChange(c.id, level)}
            open={open === c.id}
            onToggle={() => setOpen(o => (o === c.id ? null : c.id))}
          />
        ))}
      </div>
    </section>
  )
}

export const SelfAssessment = Object.assign(Root, { Title })
