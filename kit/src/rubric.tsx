import cls from './rubric.module.css'
import { useState } from 'react'
import { Checklist } from '@milo/ui/checklist'
import { Rubric, type Criterion } from '@milo/ui/rubric'
import { useToast } from '@milo/ui/toast'
import { labelColors } from '@milo/ui/lib/colors'
import { share } from '@milo/ui/lib/number'

/** Quién mira la rúbrica: uno la define, el otro se prepara con ella. */
export type RubricMode = 'teacher' | 'student'

const initialCriteria: Criterion[] = [
  {
    id: 'datos',
    icon: 'timer',
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
    icon: 'analytics',
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
    icon: 'description',
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

export function RubricRail({ mode }: { mode: RubricMode }) {
  const [criteria, setCriteria] = useState(initialCriteria)
  const [reached, setReached] = useState<Record<string, number>>({})
  const { toast } = useToast()

  const total = criteria.reduce((sum, c) => sum + c.weight, 0)

  const remove = (criterion: Criterion) => {
    const at = criteria.findIndex(c => c.id === criterion.id)
    setCriteria(cs => cs.filter(c => c.id !== criterion.id))
    toast({
      title: `Sacamos "${criterion.label}"`,
      action: {
        label: 'Deshacer',
        onClick: () => setCriteria(cs => [...cs.slice(0, at), criterion, ...cs.slice(at)]),
      },
    })
  }

  if (mode === 'student') {
    return (
      <div className={cls.groups}>
        <p className={cls.lead}>
          Marcá hasta dónde llegaste en cada uno. No es la nota: es para ver qué te falta.
        </p>

        {criteria.map((c, i) => (
          <Checklist
            key={c.id}
            size="sm"
            defaultOpen={i === 0}
            value={reached[c.id] ?? 0}
            onChange={n => setReached(r => ({ ...r, [c.id]: n }))}
          >
            <Checklist.Title>{c.label}</Checklist.Title>
            {c.levels.map(level => (
              <Checklist.Item key={level}>{level}</Checklist.Item>
            ))}
            <Checklist.Footer hint="Cada renglón incluye al anterior: al marcar uno quedan marcados los de arriba.">
              Vale {share(c.weight, total).percent} de la nota.
            </Checklist.Footer>
          </Checklist>
        ))}
      </div>
    )
  }

  return (
    <Rubric
      criteria={criteria}
      onRemove={remove}
      onAdd={draft => setCriteria(cs => [...cs, {
        ...draft,
        id: `c${Date.now()}`,
        color: labelColors[cs.length % labelColors.length],
        icon: 'bookmark',
      }])}
    >
      <Rubric.Title>Qué vamos a mirar</Rubric.Title>
    </Rubric>
  )
}
