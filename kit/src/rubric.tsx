import cls from './rubric.module.css'
import { useState } from 'react'
import { Checklist } from '@milo/ui/checklist'
import { ConfirmDialog } from '@milo/ui/confirm-dialog'
import { Rubric, type Criterion } from '@milo/ui/rubric'
import { useToast } from '@milo/ui/toast'
import { labelColors } from '@milo/ui/lib/colors'
import { counted, share } from '@milo/ui/lib/number'

/** Quién mira la rúbrica: uno la define, el otro se prepara con ella. */
export type RubricMode = 'teacher' | 'student'

const initialCriteria: Criterion[] = [
  {
    id: 'medicion',
    label: 'Cómo midieron',
    detail: 'Se mira que los números se puedan comparar entre sí: el mismo aparato en todas las mediciones, los mismos tres momentos en todos los lugares, y anotado qué estaba pasando alrededor.',
    weight: 5,
    color: 'green',
    levels: [
      'Midieron una sola vez en cada lugar',
      'Midieron los tres momentos, pero no en todos los lugares',
      'Los cinco lugares en los tres momentos, siempre con el mismo teléfono',
      'Todo con el mismo teléfono, y anotado qué estaba pasando alrededor en cada medición',
    ],
  },
  {
    id: 'grafico',
    label: 'El gráfico',
    weight: 4,
    color: 'teal',
    levels: [
      'Los números en una lista, sin gráfico',
      'Un gráfico, pero sin decir qué es cada eje',
      'Con la unidad en el eje y los cinco lugares comparables de un vistazo',
      'Con la unidad, los tres momentos distinguidos y el orden elegido para que se lea algo',
    ],
  },
  {
    id: 'propuesta',
    label: 'La propuesta',
    weight: 4,
    color: 'blue',
    levels: [
      'Dice que hay mucho ruido',
      'Propone algo, sin decir de qué medición sale',
      'Propone algo que se puede hacer el lunes, apoyado en el gráfico',
      'Propone algo para el lunes, dice de qué medición sale y cómo se sabría si funcionó',
    ],
  },
  {
    id: 'defensa',
    label: 'Contarlo al curso',
    detail: 'Cuenta qué midieron y responde lo que le pregunten. No se evalúa la timidez: se evalúa si puede explicar por qué eligieron esos lugares y esos momentos, y qué harían distinto.',
    weight: 2,
    color: 'purple',
    levels: [
      'Lee la propuesta en voz alta sin contar cómo llegaron',
      'Cuenta con sus palabras dónde midieron, aunque se saltee por qué ahí',
      'Explica por qué esos cinco lugares y esos tres momentos, y se banca una pregunta del curso',
      'Explica las decisiones y el resultado, responde las preguntas sin perder el hilo y reconoce en voz alta qué medición les quedó floja y qué harían distinto la próxima vez',
    ],
  },
]

export function RubricRail({ mode }: { mode: RubricMode }) {
  const [criteria, setCriteria] = useState(initialCriteria)
  const [reached, setReached] = useState<Record<string, number>>({})
  const [asking, setAsking] = useState<Criterion | null>(null)
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
    <>
      <Rubric
        criteria={criteria}
        onRemove={setAsking}
        onAdd={draft => setCriteria(cs => [...cs, {
          ...draft,
          id: `c${Date.now()}`,
          color: labelColors[cs.length % labelColors.length],
        }])}
      >
        <Rubric.Title>Qué vamos a mirar</Rubric.Title>
      </Rubric>

      <ConfirmDialog
        open={!!asking}
        onCancel={() => setAsking(null)}
        onConfirm={() => {
          if (asking) remove(asking)
          setAsking(null)
        }}
      >
        <ConfirmDialog.Header>
          <ConfirmDialog.Title>¿Sacamos "{asking?.label}"?</ConfirmDialog.Title>
        </ConfirmDialog.Header>
        <ConfirmDialog.Body>
          Se va con sus {counted(asking?.levels.length ?? 0, ['renglón', 'renglones'])}, y lo que
          valía se reparte entre los demás. Vas a poder deshacerlo desde el aviso.
        </ConfirmDialog.Body>
        <ConfirmDialog.Footer>
          <ConfirmDialog.Cancel />
          <ConfirmDialog.Confirm>Sacar</ConfirmDialog.Confirm>
        </ConfirmDialog.Footer>
      </ConfirmDialog>
    </>
  )
}
