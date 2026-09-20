import cls from './rubric.module.css'
import { useRef, useState, type CSSProperties } from 'react'
import { Button } from '@milo/ui/button'
import { Field } from '@milo/ui/field'
import { Icon } from '@milo/ui/icon'
import { Radio } from '@milo/ui/radio'
import { Slider } from '@milo/ui/slider'
import { TextField } from '@milo/ui/text-field'
import { cx } from '@milo/ui/lib/cx'
import { labelColors, labelFill, type LabelColor } from '@milo/ui/lib/colors'
import { counted } from '@milo/ui/lib/number'
import { useDisclosure } from '@milo/ui/lib/use-disclosure'
import { useRovingRadio } from '@milo/ui/lib/roving'

/** Quién mira la rúbrica: uno la define, el otro se revisa con ella. */
export type RubricMode = 'teacher' | 'student'

type Criterion = {
  id: string
  label: string
  weight: number
  color: LabelColor
  levels: string[]
}

const initialCriteria: Criterion[] = [
  {
    id: 'datos',
    label: 'Toma de datos',
    weight: 4,
    color: 'green',
    levels: [
      'Anotó una sola medición',
      'Anotó las tres, sin el error',
      'Anotó las tres y estimó el error',
      'Además explica de dónde sale ese error',
    ],
  },
  {
    id: 'grafico',
    label: 'Gráfico',
    weight: 3,
    color: 'teal',
    levels: [
      'Graficó altura contra tiempo',
      'Graficó contra el tiempo al cuadrado',
      'Los dos ejes llevan su unidad y la escala se lee',
      'Marcó la recta y de dónde sale la pendiente',
    ],
  },
  {
    id: 'explicacion',
    label: 'Explicación',
    weight: 5,
    color: 'blue',
    levels: [
      'Escribió el resultado sin explicarlo',
      'Dice que la pendiente se relaciona con la gravedad',
      'Explica por qué la pendiente da la mitad de la gravedad',
      'Compara con los 9,8 del libro y discute la diferencia',
    ],
  },
]

const emptyLevels = ['', '', '', '']

const levelHints = [
  'Lo más flojo que se puede llegar a ver',
  'Va por buen camino',
  'Cumple con lo que pedís',
  'Cumple y va más lejos',
]

function Ladder({ criterion, mark, onMark }: {
  criterion: Criterion
  mark: number | undefined
  onMark: (level: number) => void
}) {
  const options = criterion.levels.map((_, i) => ({ value: String(i) }))
  const roving = useRovingRadio(String(mark ?? 0), v => onMark(Number(v)), options)

  return (
    <div
      role="radiogroup"
      aria-label={`Dónde estoy en ${criterion.label}`}
      onKeyDown={roving.onKeyDown}
      className={cls.ladder}
    >
      {criterion.levels.map((level, i) => (
        <span
          key={level}
          onClick={() => onMark(i)}
          className={cx(cls.step, cls.stepPick, mark === i && cls.stepSelected)}
        >
          <Radio
            ref={roving.ref(String(i))}
            checked={mark === i}
            onChange={() => onMark(i)}
            label={`Nivel ${i + 1}: ${level}`}
            tabIndex={roving.tabIndex(String(i))}
          />
          <span aria-hidden className={`${cls.stepNumber} tabular`}>{i + 1}</span>
          <span aria-hidden className={cls.stepText}>{level}</span>
        </span>
      ))}
    </div>
  )
}

/** Con qué se mira un trabajo: los criterios, cuánto pesa cada uno y qué se ve en cada nivel. */
export function RubricRail({ mode }: { mode: RubricMode }) {
  const [criteria, setCriteria] = useState(initialCriteria)
  const [marks, setMarks] = useState<Record<string, number>>({})
  const [lit, setLit] = useState<string | null>(null)
  const [runs, setRuns] = useState(0)
  const [label, setLabel] = useState('')
  const [weight, setWeight] = useState(3)
  const [levels, setLevels] = useState(emptyLevels)

  const panel = useDisclosure(true)
  const form = useDisclosure(false)
  const addRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLInputElement>(null)

  const total = criteria.reduce((sum, c) => sum + c.weight, 0)
  const reviewed = criteria.filter(c => marks[c.id] !== undefined).length

  const openForm = () => {
    setLabel('')
    setWeight(3)
    setLevels(emptyLevels)
    form.onOpen()
    requestAnimationFrame(() => labelRef.current?.focus())
  }

  const closeForm = () => {
    form.onClose()
    requestAnimationFrame(() => addRef.current?.focus())
  }

  const add = () => {
    const name = label.trim()
    if (!name) {
      labelRef.current?.focus()
      return
    }
    setCriteria(cs => [...cs, {
      id: `c${Date.now()}`,
      label: name,
      weight,
      color: labelColors[cs.length % labelColors.length],
      levels: levels.map((l, i) => l.trim() || `Sin descriptor para el nivel ${i + 1}`),
    }])
    closeForm()
  }

  return (
    <aside
      aria-labelledby="rubrica"
      onPointerLeave={() => setLit(null)}
      className={cls.rubric}
    >
      <div className={cls.header}>
        <button
          type="button"
          aria-expanded={panel.open}
          aria-controls="rubrica-cuerpo"
          aria-labelledby="rubrica"
          onClick={() => {
            if (!panel.open) setRuns(n => n + 1)
            panel.onToggle()
          }}
          className={cls.trigger}
        >
          <Icon
            name="keyboard_arrow_down"
            size={20}
            className={cx(cls.chevron, panel.open && cls.chevronOpen, 'icon-muted')}
          />
        </button>
        <p id="rubrica" className={cls.title}>Qué vamos a mirar</p>
        <span className={`${cls.count} tabular`}>
          {counted(criteria.length, ['criterio', 'criterios'])}
        </span>
      </div>

      <div className={cls.weights}>
        {criteria.map(c => (
          <span
            key={c.id}
            aria-hidden
            style={{ flexGrow: c.weight }}
            onPointerEnter={() => setLit(c.id)}
            onPointerLeave={() => setLit(null)}
            className={cx(cls.weight, labelFill[c.color], lit && lit !== c.id && cls.weightDim)}
          />
        ))}
      </div>

      <div className={cx(cls.body, panel.open && cls.bodyOpen)}>
        <div id="rubrica-cuerpo" inert={!panel.open} className={cls.bodyInner}>
          <div className={`${cls.paper} bg-surface`}>
            <ul key={runs} className={cls.items}>
              {criteria.map((c, i) => {
                const mark = marks[c.id]
                const next = mark === undefined ? undefined : c.levels[mark + 1]
                return (
                  <li
                    key={c.id}
                    style={{ '--enter': i } as CSSProperties}
                    onPointerEnter={() => setLit(c.id)}
                    onPointerLeave={() => setLit(null)}
                    className={cx(cls.criterion, lit === c.id && cls.criterionLit)}
                  >
                    <div className={cls.criterionTop}>
                      <span aria-hidden className={`${cls.swatch} ${labelFill[c.color]}`} />
                      <p className={cls.criterionLabel}>{c.label}</p>
                      <span className={`${cls.share} tabular`}>pesa {c.weight} de {total}</span>
                    </div>

                    {mode === 'student' ? (
                      <Ladder
                        criterion={c}
                        mark={mark}
                        onMark={level => setMarks(m => ({ ...m, [c.id]: level }))}
                      />
                    ) : (
                      <ol className={cls.ladder}>
                        {c.levels.map((level, i) => (
                          <li key={level} className={cls.step}>
                            <span aria-hidden className={`${cls.stepNumber} tabular`}>{i + 1}</span>
                            <span className={cls.stepText}>{level}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {mode === 'student' && mark !== undefined && (
                      <p className={cls.next}>
                        <Icon name="arrow_forward" size={14} className={`${cls.nextIcon} icon-muted`} />
                        {next
                          ? <span>Lo que sigue: {next.charAt(0).toLowerCase()}{next.slice(1)}</span>
                          : <span>Llegaste al último nivel de este criterio.</span>}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>

            {mode === 'teacher' && !form.open && (
              <Button
                ref={addRef}
                size="sm"
                variant="ghost"
                onClick={openForm}
                className={cls.addCriterion}
              >
                Agregar criterio
              </Button>
            )}

            {mode === 'teacher' && form.open && (
              <div className={cls.form}>
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
                  <Field.Label>Cuánto pesa contra los demás</Field.Label>
                  <div className={cls.weightRow}>
                    <Slider value={weight} onChange={setWeight} min={1} max={5} className={cls.weightSlider} />
                    <span className={`${cls.share} tabular`}>{weight} de {total + weight}</span>
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

                <div className={cls.formActions}>
                  <Button size="sm" variant="ghost" onClick={closeForm}>Cancelar</Button>
                  <Button size="sm" variant="brand" onClick={add}>Agregar</Button>
                </div>
              </div>
            )}

            {mode === 'student' && (
              <p className={cls.review}>
                {reviewed === 0 && 'Antes de entregar, marcá en cada criterio el renglón que describe lo que hiciste.'}
                {reviewed > 0 && reviewed < criteria.length && `Te revisaste en ${counted(reviewed, ['criterio', 'criterios'])} de ${criteria.length}.`}
                {reviewed === criteria.length && 'Te revisaste en todos. Lo que sigue está escrito debajo de cada uno.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
