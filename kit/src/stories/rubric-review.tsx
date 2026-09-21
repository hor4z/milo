import { useState } from 'react'
import { RubricReview, type Criterion, type Mark } from '@milo/ui/rubric-review'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const criteria: Criterion[] = [
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

const amelia = { name: 'Amelia', assistant: true }
const ana = { name: 'Ana Pérez', src: '/avatars/04.webp' }

const devuelta: Record<string, Mark> = {
  datos: {
    met: [true, true, true, false],
    note: { by: amelia, text: 'Están las tres mediciones y el error estimado. Falta decir de dónde sale ese error.' },
  },
  grafico: {
    met: [true, true, true, true],
    note: { by: ana, text: 'Impecable: la recta marcada y la pendiente despejada.' },
  },
  explicacion: {
    met: [true, true, false, false],
    note: { by: amelia, text: 'Decís que la pendiente tiene que ver con la gravedad, pero no por qué da la mitad.' },
  },
}

export function RubricReviewStory() {
  const [marks, setMarks] = useState<Record<string, Mark>>({
    datos: { met: [true, true, true, false] },
  })

  return (
    <Page
      title="RubricReview"
      kind="Datos"
      imports="import { RubricReview } from '@milo/ui/rubric-review'"
      lead="Cómo le fue a un trabajo contra su rúbrica: qué cumplió de cada aspecto y qué le dijeron. La misma pieza sirve para corregir y para leer la devolución, porque es la misma información vista desde los dos lados."
    >
      <Section
        title="Corrigiendo"
        note="Con `onMet` los renglones se tildan, con `onNote` se comenta y con `onClearNote` se borra ese comentario. Es el mismo gesto que hace el estudiante con su lista, y a la derecha de cada nombre dice en qué anda ese aspecto, así que plegada la tarjeta igual se sabe qué falta corregir. La barra se llena con lo tildado: no hay nota ni puntaje, y eso no es un olvido."
      >
        <Panel>
          <Variant name="a medio corregir" note="Tildá algo en Gráfico y mirá cómo se llena su tramo.">
            <Stack width="sm">
              <RubricReview
                criteria={criteria}
                marks={marks}
                by={ana}
                onMet={(id, level, value) => setMarks(m => {
                  const aspecto = criteria.find(c => c.id === id)!
                  const met = [...(m[id]?.met ?? aspecto.levels.map(() => false))]
                  met[level] = value
                  return { ...m, [id]: { ...m[id], met } }
                })}
                onNote={(id, text) => setMarks(m => ({ ...m, [id]: { ...m[id], note: { by: ana, text } } }))}
                onClearNote={id => setMarks(m => ({ ...m, [id]: { ...m[id], note: undefined } }))}
              >
                <RubricReview.Title>Entrega</RubricReview.Title>
              </RubricReview>
            </Stack>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="La devolución"
        note="Sin los callbacks, la misma pieza es lo que abre quien entregó: qué renglones cumplió, cuáles no y qué le dijeron. Lo que falta no hay que escribirlo: son los renglones sin tildar, que están a la vista y dicen exactamente qué hacer la próxima vez."
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
  onMet={(id, renglon, cumple) => tildar(id, renglon, cumple)}
  onNote={(id, text) => comentar(id, text)}
  onClearNote={id => borrarComentario(id)}
>
  <RubricReview.Title>Entrega</RubricReview.Title>
</RubricReview>`} />
      </Section>

      <Section title="Props">
        <Props of="RubricReview" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Comentá al lado del aspecto que lo motiva: un comentario general al final se lee como un veredicto y no como una ayuda.</Practices.Do>
          <Practices.Do>Dejá el aspecto sin tocar mientras no se corrigió: "sin corregir" al lado del nombre es lo que le dice a quien corrige dónde quedó.</Practices.Do>
          <Practices.Do>Firmá siempre lo que escribe un agente: quien lee tiene derecho a saber si eso lo miró una persona.</Practices.Do>
          <Practices.Dont>No la uses para poner una nota: si el producto necesita una cifra, va aparte y no adentro de la devolución.</Practices.Dont>
          <Practices.Dont>No escondas los renglones sin tildar: son los que dicen qué hacer la próxima vez.</Practices.Dont>
          <Practices.Dont>No los tildes en rojo cuando no están: el vacío ya dice que falta, y una pantalla de cruces se lee como un veredicto.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Corrigiendo, cada renglón es una casilla adentro de su etiqueta: se toca el texto y se tilda.</A11y.Item>
          <A11y.Item>Leyendo, cada renglón dice "cumplido" o "todavía no" en un texto que solo alcanza un lector de pantalla: no depende de ver el tilde.</A11y.Item>
          <A11y.Item>La barra es decorativa: lo que dice está escrito en cada aspecto.</A11y.Item>
          <A11y.Item>El campo de comentario dice sobre qué aspecto es, porque hay uno por tarjeta.</A11y.Item>
          <A11y.Item>La firma de un agente se lee como texto ("asistente") y no solo como un glifo.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
