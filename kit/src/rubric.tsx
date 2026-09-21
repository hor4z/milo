import cls from './rubric.module.css'
import { useState } from 'react'
import { SelfAssessment } from '@milo/ui/self-assessment'
import { ConfirmDialog } from '@milo/ui/confirm-dialog'
import { Rubric, type Criterion } from '@milo/ui/rubric'
import { useToast } from '@milo/ui/toast'
import { labelColors } from '@milo/ui/lib/colors'
import { counted } from '@milo/ui/lib/number'

/** Quién mira la rúbrica: uno la define, el otro se prepara con ella. */
export type RubricMode = 'teacher' | 'student'

const initialCriteria: Criterion[] = [
  {
    id: 'idea',
    label: 'La idea',
    weight: 3,
    color: 'green',
    levels: [
      'Poco clara: no se entiende qué vende ni a quién',
      'Se entiende qué vende, pero no por qué alguien lo compraría',
      'Clara y posible: se entiende qué vende, a quién y por qué',
      'Clara, posible y propia: hace algo que los que ya están no hacen',
    ],
  },
  {
    id: 'presupuesto',
    label: 'El presupuesto',
    detail: 'Se mira que los $100.000 estén repartidos con criterio y que la cuenta cierre, no que se hayan gastado todos.',
    weight: 4,
    color: 'teal',
    levels: [
      'No logra organizarlo: faltan gastos o la suma no cierra',
      'Están los gastos, con varios errores de cuenta',
      'La cuenta cierra y entra en los $100.000',
      'La cuenta cierra y cada gasto está justificado con lo que va a vender',
    ],
  },
  {
    id: 'matematica',
    label: 'Las cuentas',
    weight: 5,
    color: 'blue',
    levels: [
      'No logra resolverlas',
      'Resuelve algunas y necesita ayuda para el resto',
      'Resuelve bien costos, precio y ganancia',
      'Resuelve todo y llega al punto de equilibrio sin que se lo pidan dos veces',
    ],
  },
  {
    id: 'investigacion',
    label: 'La investigación',
    weight: 3,
    color: 'purple',
    levels: [
      'No investiga: el cuadro está vacío o inventado',
      'Nombra competidores, sin datos de ninguno',
      'Compara dos competidores reales con datos de los dos',
      'Compara con datos y saca de ahí qué va a hacer distinto',
    ],
  },
  {
    id: 'decisiones',
    label: 'Las decisiones',
    detail: 'Cada decisión del proyecto pide un porqué: el precio, el reparto del capital y qué hacer cuando la materia prima aumenta.',
    weight: 4,
    color: 'pink',
    levels: [
      'No logra justificarlas: elige sin decir por qué',
      'Justifica con lo que le parece, sin datos',
      'Justifica con argumentos y con números del proyecto',
      'Justifica con números y dice qué pasaría si se hubiera decidido al revés',
    ],
  },
  {
    id: 'creatividad',
    label: 'La publicidad',
    weight: 3,
    color: 'orange',
    levels: [
      'Sin elaboración: dice "comprá mi producto"',
      'Tiene los datos pero no convence a nadie',
      'Convence: dice para qué le sirve al que la ve',
      'Convence y se reconoce sola: tiene una idea propia, no una plantilla',
    ],
  },
  {
    id: 'equipo',
    label: 'El trabajo en equipo',
    weight: 2,
    color: 'green',
    levels: [
      'Poca participación: lo hizo una sola persona',
      'Participación desigual: alguien quedó afuera de las decisiones',
      'Todos participan y cada uno puede contar lo que hizo el resto',
      'Todos participan y se repartieron el trabajo por lo que cada uno sabe hacer',
    ],
  },
  {
    id: 'comunicacion',
    label: 'La presentación',
    detail: 'Son siete minutos y ocho preguntas para contestar. No se evalúa la timidez: se evalúa si el proyecto se entiende y si se banca una repregunta.',
    weight: 4,
    color: 'teal',
    levels: [
      'No logra explicar el proyecto',
      'Lo explica con dificultad y no contesta las preguntas',
      'Explica con claridad y contesta lo que le preguntan',
      'Explica con claridad, contesta con números y reconoce qué parte es la más floja',
    ],
  },
]

export function RubricRail({ mode }: { mode: RubricMode }) {
  const [criteria, setCriteria] = useState(initialCriteria)
  const [reached, setReached] = useState<Record<string, number>>({})
  const [asking, setAsking] = useState<Criterion | null>(null)
  const { toast } = useToast()

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
          Ubicate en cada aspecto antes de entregar: va uno solo por aspecto. No es la nota, y el
          renglón de abajo del que elegís es exactamente lo que te falta.
        </p>

        <SelfAssessment
          criteria={criteria}
          value={reached}
          onChange={(id, level) => setReached(r => ({ ...r, [id]: level }))}
        >
          <SelfAssessment.Title>Dónde estás</SelfAssessment.Title>
        </SelfAssessment>
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
