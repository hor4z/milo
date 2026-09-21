import { useState } from 'react'
import { RubricReview, type Criterion, type Mark } from '@milo/ui/rubric-review'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const criteria: Criterion[] = [
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
]

const amelia = { name: 'Amelia', assistant: true }
const ana = { name: 'Ana Pérez', src: '/avatars/04.webp' }

const devuelta: Record<string, Mark> = {
  medicion: {
    level: 2,
    note: { by: amelia, text: 'Los cinco lugares en los tres momentos y siempre el mismo teléfono. Para el nivel de arriba falta anotar qué pasaba alrededor.' },
  },
  grafico: {
    level: 3,
    note: { by: ana, text: 'Impecable: la unidad en el eje y los tres momentos distinguidos.' },
  },
  propuesta: {
    level: 1,
    note: { by: amelia, text: 'Proponés cortinas en la biblioteca, pero no decís de qué medición sale.' },
  },
}

export function RubricReviewStory() {
  const [marks, setMarks] = useState<Record<string, Mark>>({
    medicion: { level: 2 },
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
        note="Con `onLevel` se elige el nivel, con `onNote` se comenta y con `onClearNote` se borra ese comentario. Los cuatro niveles son excluyentes: se tilda uno y los otros se apagan, porque son cuatro descripciones del mismo estado y solo una es cierta. A la derecha del nombre dice en cuál quedó, así que plegada la tarjeta igual se sabe qué falta corregir. La barra se llena hasta el nivel elegido: no hay nota ni puntaje, y eso no es un olvido."
      >
        <Panel>
          <Variant name="a medio corregir" note="Elegí un nivel en El gráfico y mirá cómo se llena su tramo. Solo uno queda tildado: los cuatro son excluyentes.">
            <Stack width="sm">
              <RubricReview
                criteria={criteria}
                marks={marks}
                by={ana}
                onLevel={(id, level) => setMarks(m => ({ ...m, [id]: { ...m[id], level } }))}
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
        note="Sin los callbacks, la misma pieza es lo que abre quien entregó: qué renglones cumplió, cuáles no y qué le dijeron. Lo que falta no hay que escribirlo: es el renglón de abajo del que quedó tildado, que está a la vista y dice exactamente qué hacer la próxima vez."
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
