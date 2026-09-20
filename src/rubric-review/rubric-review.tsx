import s from './rubric-review.module.css'
import { useId, useState, type ReactNode } from 'react'
import { Avatar } from '../avatar/avatar'
import { Button } from '../button/button'
import { CriterionCard, type Criterion } from '../criterion-card/criterion-card'
import { Icon } from '../icon/icon'
import { Textarea } from '../textarea/textarea'
import { cx } from '../lib/cx'
import { labelFill } from '../lib/colors'
import { counted } from '../lib/number'
import { takePart } from '../lib/parts'

export type { Criterion }

/** Quién escribió una devolución. Un agente firma igual que una persona: lo que cambia es el nombre, no lo que puede hacer. */
export type Reviewer = {
  /** Como se lo nombra en la firma. */
  name: string
  /** La foto, si es una persona. */
  src?: string
  /** Lo marca como asistente, para que no se confunda con alguien del curso. */
  assistant?: boolean
}

/** Lo que se dijo sobre un aspecto. */
export type Note = {
  id: string
  by: Reviewer
  text: string
}

/** Cómo le fue a un trabajo en un aspecto. */
export type Mark = {
  /** En qué nivel cayó, contando desde cero. Sin esto está sin corregir. */
  level?: number
  /** Lo que le dijeron, en el orden en que se escribió. */
  notes?: Note[]
}

/** Cómo se llama la devolución, en la cabecera. */
function Title({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function Signature({ by }: { by: Reviewer }) {
  return (
    <span className={s.by}>
      {by.assistant
        ? <span aria-hidden className={s.bot}><Icon name="smart_toy" size={14} /></span>
        : <Avatar name={by.name} src={by.src} size={20} />}
      <span className={s.byName}>{by.name}</span>
      {by.assistant && <span className={s.badge}>asistente</span>}
    </span>
  )
}

/** Cómo le fue a un trabajo contra su rúbrica: en qué nivel cayó cada aspecto y qué le dijeron. Sin los callbacks es la devolución que lee quien entregó; con ellos, la pantalla donde se corrige. */
function Root({ criteria, marks, by, onMark, onNote, children, className }: {
  /** Los aspectos de la rúbrica, en su orden. */
  criteria: Criterion[]
  /** Lo corregido hasta ahora, por id de aspecto. */
  marks: Record<string, Mark>
  /** Quién está corrigiendo ahora: firma lo que escriba. */
  by?: Reviewer
  /** Sin esto los niveles se leen y no se eligen. */
  onMark?: (id: string, level: number) => void
  /** Sin esto no se puede comentar. */
  onNote?: (id: string, text: string) => void
  /** El `RubricReview.Title`. */
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState<string | null>(criteria[0]?.id ?? null)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const id = useId()
  const titleId = `${id}-title`

  const [title] = takePart(children, Title)
  const total = criteria.reduce((sum, c) => sum + c.weight, 0)
  const done = criteria.filter(c => marks[c.id]?.level !== undefined).length

  return (
    <section aria-labelledby={titleId} className={cx(s.root, className)}>
      <div className={s.header}>
        <p id={titleId} className={s.title}>{title}</p>
        <span className={`${s.count} tabular`}>
          {done === criteria.length
            ? 'corregida'
            : `${done} de ${counted(criteria.length, ['aspecto', 'aspectos'])}`}
        </span>
      </div>

      <div aria-hidden className={s.weights}>
        {criteria.map(c => {
          const level = marks[c.id]?.level
          const reached = level === undefined ? 0 : ((level + 1) / c.levels.length) * 100
          return (
            <span key={c.id} style={{ flexGrow: c.weight }} className={s.weight}>
              <span
                style={{ inlineSize: `${reached}%` }}
                className={`${s.fill} ${labelFill[c.color]}`}
              />
            </span>
          )
        })}
      </div>

      <div className={s.cards}>
        {criteria.map(c => {
          const mark = marks[c.id] ?? {}
          const next = mark.level === undefined ? undefined : c.levels[mark.level + 1]
          return (
            <CriterionCard
              key={c.id}
              criterion={c}
              total={total}
              level={mark.level}
              onLevel={onMark && (level => onMark(c.id, level))}
              open={open === c.id}
              onToggle={() => setOpen(o => (o === c.id ? null : c.id))}
            >
              {next && (
                <p className={s.next}>
                  <Icon name="arrow_forward" size={14} className={`${s.nextIcon} icon-muted`} />
                  <span>Para el que sigue: {next.charAt(0).toLowerCase()}{next.slice(1)}</span>
                </p>
              )}

              {mark.notes?.map(n => (
                <div key={n.id} className={s.note}>
                  <Signature by={n.by} />
                  <p className={s.noteText}>{n.text}</p>
                </div>
              ))}

              {onNote && by && (
                <div className={s.write}>
                  <Textarea
                    value={draft[c.id] ?? ''}
                    placeholder={`Qué le decís sobre ${c.label.toLowerCase()}`}
                    aria-label={`Comentario sobre ${c.label}`}
                    onChange={e => setDraft(d => ({ ...d, [c.id]: e.target.value }))}
                  />
                  <div className={s.writeActions}>
                    <Signature by={by} />
                    <Button
                      size="sm"
                      variant="brand"
                      disabled={!(draft[c.id] ?? '').trim()}
                      onClick={() => {
                        onNote(c.id, (draft[c.id] ?? '').trim())
                        setDraft(d => ({ ...d, [c.id]: '' }))
                      }}
                    >
                      Comentar
                    </Button>
                  </div>
                </div>
              )}
            </CriterionCard>
          )
        })}
      </div>
    </section>
  )
}

export const RubricReview = Object.assign(Root, { Title })
