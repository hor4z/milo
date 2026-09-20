import s from './rubric.module.css'
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Button } from '../button/button'
import { Card } from '../card/card'
import { CriterionCard, type Criterion } from '../criterion-card/criterion-card'
import { Field } from '../field/field'
import { Icon } from '../icon/icon'
import { Slider } from '../slider/slider'
import { TextField } from '../text-field/text-field'
import { Tooltip } from '../tooltip/tooltip'
import { cx } from '../lib/cx'
import { labelFill } from '../lib/colors'
import { counted, share } from '../lib/number'
import { useDisclosure } from '../lib/use-disclosure'
import { useRovingRadio } from '../lib/roving'
import { takePart } from '../lib/parts'

export type { Criterion }

/** Lo que devuelve el alta. El id, el color y el glifo los pone quien la guarda. */
export type CriterionDraft = {
  label: string
  weight: number
  levels: string[]
}

const emptyLevels = ['', '', '', '']

const levelHints = [
  'Lo más flojo que se puede llegar a ver',
  'Va por buen camino',
  'Cumple con lo que pedís',
  'Cumple y va más lejos',
]

/** Cómo se llama la rúbrica, en la cabecera. */
function Title({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Con qué se mira un trabajo: los criterios, cuánto vale cada uno y qué se ve en cada nivel. El porcentaje sale de los pesos, así que no se puede despegar de ellos. */
function Root({ criteria, onAdd, onRemove, defaultOpen = true, children, className }: {
  /** En el orden en que se leen. */
  criteria: Criterion[]
  /** Sin esto la rúbrica se lee y no se edita. */
  onAdd?: (draft: CriterionDraft) => void
  /** Sin esto ningún criterio se puede sacar. */
  onRemove?: (criterion: Criterion) => void
  /** Arranca abierta. Plegada deja a la vista el nombre, el contador y la barra. */
  defaultOpen?: boolean
  /** El `Rubric.Title`. */
  children: ReactNode
  className?: string
}) {
  const [lit, setLit] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [openCard, setOpenCard] = useState<string | null>(criteria[0]?.id ?? null)
  const [runs, setRuns] = useState(0)
  const [label, setLabel] = useState('')
  const [weight, setWeight] = useState(3)
  const [levels, setLevels] = useState(emptyLevels)

  const panel = useDisclosure(defaultOpen)
  const form = useDisclosure(false)
  const addRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLInputElement>(null)
  const cards = useRef<Record<string, HTMLLIElement | null>>({})
  const id = useId()
  const titleId = `${id}-title`
  const bodyId = `${id}-body`

  const [title] = takePart(children, Title)
  const total = criteria.reduce((sum, c) => sum + c.weight, 0)
  const active = lit ?? pinned
  const roving = useRovingRadio(active ?? criteria[0]?.id ?? '', setPinned, criteria.map(c => ({ value: c.id })))

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (form.open) labelRef.current?.focus()
    else addRef.current?.focus()
  }, [form.open])

  const bring = (id: string) => cards.current[id]?.scrollIntoView({ block: 'nearest' })

  const openForm = () => {
    setLabel('')
    setWeight(3)
    setLevels(emptyLevels)
    form.onOpen()
  }

  const closeForm = () => form.onClose()

  const add = () => {
    const name = label.trim()
    if (!name) {
      labelRef.current?.focus()
      return
    }
    onAdd?.({
      label: name,
      weight,
      levels: levels.map((l, i) => l.trim() || `Sin descriptor para el nivel ${i + 1}`),
    })
    closeForm()
  }

  return (
    <aside
      aria-labelledby={titleId}
      onPointerLeave={() => setLit(null)}
      className={cx(s.root, className)}
    >
      <div className={s.header}>
        <button
          type="button"
          aria-expanded={panel.open}
          aria-controls={bodyId}
          aria-labelledby={titleId}
          onClick={() => {
            if (!panel.open) setRuns(n => n + 1)
            panel.onToggle()
          }}
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
          {counted(criteria.length, ['criterio', 'criterios'])}
        </span>
      </div>

      <div
        role="toolbar"
        aria-label="Cuánto vale cada criterio"
        onKeyDown={roving.onKeyDown}
        className={s.weights}
      >
        {criteria.map(c => (
          <span key={c.id} style={{ flexGrow: c.weight }} className={s.weight}>
            <Tooltip label={`${c.label}: ${share(c.weight, total).percent}`}>
              <button
                ref={roving.ref(c.id)}
                type="button"
                tabIndex={roving.tabIndex(c.id)}
                aria-label={`${c.label}, vale ${share(c.weight, total).percent} de la nota`}
                onPointerEnter={() => setLit(c.id)}
                onPointerLeave={() => setLit(null)}
                onFocus={() => { setLit(c.id); setOpenCard(c.id); bring(c.id) }}
                onBlur={() => setLit(null)}
                onClick={() => {
                  setPinned(p => (p === c.id ? null : c.id))
                  setOpenCard(c.id)
                  if (!panel.open) {
                    setRuns(n => n + 1)
                    panel.onOpen()
                  }
                  requestAnimationFrame(() => bring(c.id))
                }}
                className={cx(s.weightBand, labelFill[c.color], active && active !== c.id && s.weightDim)}
              />
            </Tooltip>
          </span>
        ))}
      </div>

      <div className={cx(s.body, panel.open && s.bodyOpen)}>
        <div id={bodyId} inert={!panel.open} className={s.bodyInner}>
          <div className={s.cards}>
            <ul key={runs} className={s.items}>
              {criteria.map((c, i) => (
                <li
                  key={c.id}
                  ref={el => { cards.current[c.id] = el }}
                  style={{ '--enter': i } as CSSProperties}
                  className={cx(s.criterion, active && active !== c.id && s.criterionDim)}
                >
                  <CriterionCard
                    criterion={c}
                    total={total}
                    open={openCard === c.id}
                    onToggle={() => setOpenCard(o => (o === c.id ? null : c.id))}
                    onRemove={onRemove && (() => onRemove(c))}
                  />
                </li>
              ))}
            </ul>

            {onAdd && !form.open && (
              <Button
                ref={addRef}
                size="sm"
                variant="ghost"
                onClick={openForm}
                className={s.addCriterion}
              >
                Agregar criterio
              </Button>
            )}

            {onAdd && form.open && (
              <Card className={s.form}>
                <Card.Body className={s.formFields}>
                  <Field>
                    <Field.Label>Qué vas a mirar</Field.Label>
                    <TextField
                      inputRef={labelRef}
                      size="sm"
                      value={label}
                      placeholder="Trabajo en equipo"
                      onChange={e => setLabel(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Escape') closeForm() }}
                    />
                  </Field>

                  <Field>
                    <Field.Label>Cuánto vale contra los demás</Field.Label>
                    <div className={s.weightRow}>
                      <Slider value={weight} onChange={setWeight} min={1} max={5} className={s.weightSlider} />
                      <span className={`${s.share} tabular`}>{share(weight, total + weight).percent} de la nota</span>
                    </div>
                  </Field>

                  {levels.map((level, i) => (
                    <Field key={levelHints[i]}>
                      <Field.Label>Nivel {i + 1}</Field.Label>
                      <TextField
                        size="sm"
                        value={level}
                        placeholder={levelHints[i]}
                        onChange={e => setLevels(ls => ls.map((l, j) => (j === i ? e.target.value : l)))}
                        onKeyDown={e => { if (e.key === 'Escape') closeForm() }}
                      />
                    </Field>
                  ))}
                </Card.Body>
                <Card.Footer className={s.formActions}>
                  <Button size="sm" variant="ghost" onClick={closeForm}>Cancelar</Button>
                  <Button size="sm" variant="brand" onClick={add}>Agregar</Button>
                </Card.Footer>
              </Card>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export const Rubric = Object.assign(Root, { Title })
