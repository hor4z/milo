import { useState } from 'react'
import { SelfAssessment, type Criterion } from '@milo/ui/self-assessment'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const criteria: Criterion[] = [
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
    id: 'cuentas',
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
    id: 'equipo',
    label: 'El trabajo en equipo',
    weight: 2,
    color: 'teal',
    levels: [
      'Lo hizo una sola persona',
      'Alguien quedó afuera de las decisiones',
      'Todos participan y cada uno puede contar lo que hizo el resto',
      'Todos participan y se repartieron el trabajo por lo que cada uno sabe hacer',
    ],
  },
]

export function SelfAssessmentStory() {
  const [value, setValue] = useState<Record<string, number>>({ idea: 2 })

  return (
    <Page
      title="SelfAssessment"
      kind="Datos"
      imports="import { SelfAssessment } from '@milo/ui/self-assessment'"
      lead="Dónde se ubica quien entrega, aspecto por aspecto, contra la misma rúbrica con la que lo van a mirar. No es la nota que se va a sacar: es para ver qué falta antes de entregar."
    >
      <Section
        title="Cómo se arma"
        note="Toma los mismos `Criterion` que `Rubric` y `RubricReview`, así que lo que el docente escribe es lo que el estudiante lee. Lo que cambia es el momento y el gesto: acá no se corrige, se dice dónde estoy."
      >
        <Panel>
          <Variant name="a medio ubicar" note="Elegí un nivel en otro aspecto: el de arriba se cierra y el tramo de la barra se llena.">
            <Stack width="sm">
              <SelfAssessment
                criteria={criteria}
                value={value}
                onChange={(id, level) => setValue(v => ({ ...v, [id]: level }))}
              >
                <SelfAssessment.Title>Dónde estás</SelfAssessment.Title>
              </SelfAssessment>
            </Stack>
          </Variant>
        </Panel>
        <Note>
          Los cuatro niveles son excluyentes y por eso van con opción única: son cuatro
          descripciones del mismo estado y solo una es cierta. Nadie logra Inicial camino a
          Excelente, así que marcar uno no puede dejar marcados los de arriba. Para lo que sí se va
          cumpliendo de a pasos está `Checklist`, que es otra cosa y tiene su propia vista.
        </Note>
        <Note>
          La barra de arriba cuenta aspectos ubicados, no niveles alcanzados: es el progreso de
          llenar la autoevaluación y no una calificación. Por eso es de un solo color y no del color
          de cada aspecto como en la vista del docente, donde el color ata cada tramo con su
          tarjeta.
        </Note>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<SelfAssessment
  criteria={aspectos}
  value={donde}
  onChange={(id, nivel) => ubicar(id, nivel)}
>
  <SelfAssessment.Title>Dónde estás</SelfAssessment.Title>
</SelfAssessment>`} />
      </Section>

      <Section title="Props">
        <Props of="SelfAssessment" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Pasale los mismos aspectos que la rúbrica del docente: en cuanto los textos se separan, el estudiante se prepara para otra cosa de la que lo van a mirar.</Practices.Do>
          <Practices.Do>Dejala abierta antes de entregar y no después: sirve para corregir el trabajo, no para adivinar la nota.</Practices.Do>
          <Practices.Dont>No la uses para corregir: lo que acá se elige es de quien entrega, y mezclarlo con lo que puso el docente borra de quién era cada cosa. Para corregir está `RubricReview`.</Practices.Dont>
          <Practices.Dont>No le pongas un número al final: son cuatro descripciones, y la cifra las reemplaza por algo que se lee solo.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Cada aspecto es un botón con `aria-expanded` y `aria-controls`, y toma su nombre del título de al lado.</A11y.Item>
          <A11y.Item>Los niveles son un `radiogroup` nombrado con el aspecto: una sola parada de tabulación y las flechas mueven entre ellos.</A11y.Item>
          <A11y.Item>Plegado, el aspecto dice en cuál quedó o que está sin ubicar, así que no hace falta abrirlo para saberlo.</A11y.Item>
          <A11y.Item>La barra de arriba es decorativa: lo que cuenta está escrito al lado, en "3 aspectos sin ubicar".</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
