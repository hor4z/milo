import { useState } from 'react'
import { RubricReview, type Criterion, type Mark } from '@milo/ui/rubric-review'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const criteria: Criterion[] = [
  {
    id: 'datos',
    label: 'Toma de datos',
    weight: 4,
    color: 'green',
    icon: 'timer',
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
    icon: 'analytics',
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
    icon: 'description',
    levels: [
      'El resultado, sin explicación',
      'La pendiente tiene que ver con la gravedad',
      'Por qué la pendiente da la mitad de la gravedad',
      'Comparado con los 9,8 del libro, con la diferencia discutida',
    ],
  },
]

const amelia = { name: 'Amelia', assistant: true }
const ana = { name: 'Ana Pérez', src: '/avatars/04.webp' }

const devuelta: Record<string, Mark> = {
  datos: {
    level: 2,
    notes: [
      { id: 'n1', by: amelia, text: 'Están las tres mediciones y el error estimado. Para el último nivel falta decir de dónde sale ese error.' },
      { id: 'n2', by: ana, text: 'La tabla quedó muy clara. Sumale el cálculo y queda completo.' },
    ],
  },
  grafico: {
    level: 3,
    notes: [{ id: 'n3', by: ana, text: 'Impecable: la recta marcada y la pendiente despejada.' }],
  },
  explicacion: {
    level: 1,
    notes: [{ id: 'n4', by: amelia, text: 'Decís que la pendiente tiene que ver con la gravedad, pero no por qué da la mitad.' }],
  },
}

export function RubricReviewStory() {
  const [marks, setMarks] = useState<Record<string, Mark>>({ datos: { level: 2 } })

  return (
    <Page
      title="RubricReview"
      kind="Datos"
      imports="import { RubricReview } from '@milo/ui/rubric-review'"
      lead="Cómo le fue a un trabajo contra su rúbrica: en qué nivel cayó cada aspecto y qué le dijeron. La misma pieza sirve para corregir y para leer la devolución, porque es la misma información vista desde los dos lados."
    >
      <Section
        title="Corrigiendo"
        note="Con `onMark` los niveles se eligen y con `onNote` se puede comentar. La barra de arriba se llena mientras se corrige: cada tramo es un aspecto, su ancho es lo que vale y lo lleno es hasta dónde llegó el trabajo. No hay nota ni puntaje, y eso no es un olvido: el número convierte cuatro descripciones en una cifra que se lee sola."
      >
        <Panel>
          <Variant name="a medio corregir" note="Elegí un nivel en Gráfico y mirá cómo se llena su tramo.">
            <Stack width="sm">
              <RubricReview
                criteria={criteria}
                marks={marks}
                by={ana}
                onMark={(id, level) => setMarks(m => ({ ...m, [id]: { ...m[id], level } }))}
                onNote={(id, text) => setMarks(m => ({
                  ...m,
                  [id]: {
                    ...m[id],
                    notes: [...(m[id]?.notes ?? []), { id: `n${Date.now()}`, by: ana, text }],
                  },
                }))}
              >
                <RubricReview.Title>Entrega de Bruno Díaz</RubricReview.Title>
              </RubricReview>
            </Stack>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="La devolución"
        note="Sin los callbacks, la misma pieza es lo que abre quien entregó: el nivel donde cayó cada aspecto, lo que le dijeron y, debajo, qué le falta para el nivel que sigue. Eso último es lo único que vuelve útil a una devolución: sin el paso siguiente escrito, la rúbrica solo explica una nota."
      >
        <Panel>
          <Variant name="lo que ve quien entregó">
            <Stack width="sm">
              <RubricReview criteria={criteria} marks={devuelta}>
                <RubricReview.Title>Cómo te fue</RubricReview.Title>
              </RubricReview>
            </Stack>
          </Variant>
        </Panel>
        <Note>
          Un comentario lo puede escribir una persona o un agente, y los dos pueden comentar el
          mismo aspecto: cambia la firma y nada más. El agente se anuncia como asistente para que no
          se lo confunda con alguien del curso, y lo que escribe queda a la vista del docente antes
          de que el estudiante lo lea.
        </Note>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<RubricReview
  criteria={aspectos}
  marks={loCorregido}
  by={quienCorrige}
  onMark={(id, level) => marcar(id, level)}
  onNote={(id, text) => comentar(id, text)}
>
  <RubricReview.Title>Entrega de Bruno Díaz</RubricReview.Title>
</RubricReview>`} />
      </Section>

      <Section title="Props">
        <Props of="RubricReview" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Comentá al lado del aspecto que lo motiva: un comentario general al final se lee como un veredicto y no como una ayuda.</Practices.Do>
          <Practices.Do>Dejá el nivel sin marcar mientras no se corrigió: el vacío es un estado y la cabecera lo dice ("1 de 3 aspectos").</Practices.Do>
          <Practices.Do>Firmá siempre lo que escribe un agente: quien lee tiene derecho a saber si eso lo miró una persona.</Practices.Do>
          <Practices.Dont>No la uses para poner una nota: si el producto necesita una cifra, va aparte y no adentro de la devolución.</Practices.Dont>
          <Practices.Dont>No escondas los niveles que no alcanzó: son los que dicen qué hacer la próxima vez.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Corrigiendo, los niveles de cada aspecto son un `radiogroup` con una sola parada de tabulación y las flechas para moverse.</A11y.Item>
          <A11y.Item>Leyendo, el nivel alcanzado lleva `aria-current`, así que no depende del color de fondo.</A11y.Item>
          <A11y.Item>La barra es decorativa: lo que dice está escrito en cada aspecto.</A11y.Item>
          <A11y.Item>El campo de comentario dice sobre qué aspecto es, porque hay uno por tarjeta.</A11y.Item>
          <A11y.Item>La firma de un agente se lee como texto ("asistente") y no solo como un glifo.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
