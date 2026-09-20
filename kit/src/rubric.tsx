import cls from './rubric.module.css'
import { useRef, useState, type CSSProperties } from 'react'
import { Button } from '@milo/ui/button'
import { Checklist } from '@milo/ui/checklist'
import { Divider } from '@milo/ui/divider'
import { Field } from '@milo/ui/field'
import { Icon } from '@milo/ui/icon'
import { IconButton } from '@milo/ui/icon-button'
import { Slider } from '@milo/ui/slider'
import { TextField } from '@milo/ui/text-field'
import { Tooltip } from '@milo/ui/tooltip'
import { useToast } from '@milo/ui/toast'
import { cx } from '@milo/ui/lib/cx'
import { labelColors, labelFill, type LabelColor } from '@milo/ui/lib/colors'
import { counted, share } from '@milo/ui/lib/number'
import { useDisclosure } from '@milo/ui/lib/use-disclosure'

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
      'Una sola medición anotada',
      'Las tres, sin el error',
      'Las tres, con el error estimado',
      'Las tres, con el error y de dónde sale',
    ],
  },
  {
    id: 'grafico',
    label: 'Gráfico',
    weight: 3,
    color: 'teal',
    levels: [
      'Altura contra tiempo',
      'Altura contra el tiempo al cuadrado',
      'Con la unidad en cada eje y la escala legible',
      'Con la recta marcada y de dónde sale la pendiente',
    ],
  },
  {
    id: 'explicacion',
    label: 'Explicación',
    weight: 5,
    color: 'blue',
    levels: [
      'El resultado, sin explicación',
      'La pendiente tiene que ver con la gravedad',
      'Por qué la pendiente da la mitad de la gravedad',
      'Comparado con los 9,8 del libro, con la diferencia discutida',
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

/** Con qué se mira un trabajo: los criterios, cuánto pesa cada uno y qué se ve en cada nivel. */
export function RubricRail({ mode }: { mode: RubricMode }) {
  const [criteria, setCriteria] = useState(initialCriteria)
  const [lit, setLit] = useState<string | null>(null)
  const [reached, setReached] = useState<Record<string, number>>({})
  const [runs, setRuns] = useState(0)
  const [label, setLabel] = useState('')
  const [weight, setWeight] = useState(3)
  const [levels, setLevels] = useState(emptyLevels)

  const { toast } = useToast()
  const panel = useDisclosure(true)
  const form = useDisclosure(false)
  const addRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLInputElement>(null)

  const total = criteria.reduce((sum, c) => sum + c.weight, 0)

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

  const remove = (criterion: Criterion, at: number) => {
    setCriteria(cs => cs.filter(c => c.id !== criterion.id))
    toast({
      title: `Sacamos "${criterion.label}"`,
      action: {
        label: 'Deshacer',
        onClick: () => setCriteria(cs => [...cs.slice(0, at), criterion, ...cs.slice(at)]),
      },
    })
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

  if (mode === 'student') {
    const mark = (id: string, level: number) =>
      setReached(r => ({ ...r, [id]: (r[id] ?? 0) === level + 1 ? level : level + 1 }))

    return (
      <div className={cls.groups}>
        <p className={cls.lead}>
          Marcá hasta dónde llegaste en cada uno. No es la nota: es para ver qué te falta.
        </p>

        {criteria.map((c, i) => (
          <Checklist key={c.id} defaultOpen={i === 0}>
            <Checklist.Title>{c.label}</Checklist.Title>
            {c.levels.map((level, j) => (
              <Checklist.Item
                key={level}
                state={j < (reached[c.id] ?? 0) ? 'done' : 'todo'}
                onClick={() => mark(c.id, j)}
              >
                {level}
              </Checklist.Item>
            ))}
            <Checklist.Footer>
              Vale {share(c.weight, total).percent} de la nota. Cada renglón incluye al anterior.
            </Checklist.Footer>
          </Checklist>
        ))}
      </div>
    )
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
          <span key={c.id} style={{ flexGrow: c.weight }} className={cls.weight}>
            <Tooltip label={`${c.label}: ${share(c.weight, total).percent}`}>
              <span
                aria-hidden
                onPointerEnter={() => setLit(c.id)}
                onPointerLeave={() => setLit(null)}
                className={cx(cls.weightBand, labelFill[c.color], lit && lit !== c.id && cls.weightDim)}
              />
            </Tooltip>
          </span>
        ))}
      </div>

      <div className={cx(cls.body, panel.open && cls.bodyOpen)}>
        <div id="rubrica-cuerpo" inert={!panel.open} className={cls.bodyInner}>
          <div className={`${cls.paper} bg-surface`}>
            <ul key={runs} className={cls.items}>
              {criteria.map((c, i) => (
                <li
                  key={c.id}
                  style={{ '--enter': i } as CSSProperties}
                  className={cls.criterion}
                >
                  {i > 0 && <Divider className={cls.split} />}
                  <div className={cls.criterionTop}>
                    <span aria-hidden className={`${cls.swatch} ${labelFill[c.color]}`} />
                    <p className={cls.criterionLabel}>
                      {c.label}
                      <span className="sr-only">, vale {share(c.weight, total).percent} de la nota</span>
                    </p>
                    <Tooltip label="Sacar de la rúbrica">
                      <IconButton
                        icon="delete"
                        label={`Sacar ${c.label} de la rúbrica`}
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(c, i)}
                        className={cls.removeCriterion}
                      />
                    </Tooltip>
                  </div>

                  <ol className={cls.ladder}>
                    {c.levels.map((level, j) => (
                      <li key={level} className={cx(cls.step, j === c.levels.length - 1 && cls.stepTop)}>
                        <span className={cls.stepText}>{level}</span>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
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
                  <Field.Label>Cuánto vale contra los demás</Field.Label>
                  <div className={cls.weightRow}>
                    <Slider value={weight} onChange={setWeight} min={1} max={5} className={cls.weightSlider} />
                    <span className={`${cls.share} tabular`}>{share(weight, total + weight).percent} de la nota</span>
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

          </div>
        </div>
      </div>
    </aside>
  )
}
