import { useState } from 'react'
import { Rubric, type Criterion } from '@milo/ui/rubric'
import { labelColors } from '@milo/ui/lib/colors'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const base: Criterion[] = [
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

export function RubricStory() {
  const [criteria, setCriteria] = useState(base)

  return (
    <Page
      title="Rubric"
      kind="Datos"
      imports="import { Rubric } from '@milo/ui/rubric'"
      lead="Con qué se mira un trabajo: los aspectos, cuánto vale cada uno y qué se ve en cada nivel. La escribe quien corrige y la lee quien entrega, así que dice lo mismo de los dos lados."
    >
      <Section
        title="Cómo se arma"
        note="Los aspectos entran como dato y no como hijos, igual que en `TaskList`: son una lista que alguien guarda y ordena, no contenido escrito a mano. Lo único que va como hijo es el nombre, que es texto de la pantalla."
      >
        <Panel>
          <Variant name="editable" note="Con `onAdd` aparece el alta y con `onRemove` el tacho de cada aspecto. Probá agregar uno: la barra se reparte de nuevo mientras movés el peso.">
            <Stack width="sm">
              <Rubric
                criteria={criteria}
                onRemove={c => setCriteria(cs => cs.filter(x => x.id !== c.id))}
                onAdd={draft => setCriteria(cs => [...cs, {
                  ...draft,
                  id: `c${Date.now()}`,
                  color: labelColors[cs.length % labelColors.length],
                }])}
              >
                <Rubric.Title>Qué vamos a mirar</Rubric.Title>
              </Rubric>
            </Stack>
          </Variant>
          <Variant name="de solo lectura" note="Sin los dos callbacks la rúbrica se lee y nada más, que es como la ve quien no la escribió.">
            <Stack width="sm">
              <Rubric criteria={base} defaultOpen={false}>
                <Rubric.Title>Qué vamos a mirar</Rubric.Title>
              </Rubric>
            </Stack>
          </Variant>
        </Panel>
        <Note>
          Plegada deja a la vista el nombre, el contador y la barra entera: la rúbrica completa en
          una línea. Por eso la barra vive afuera del cuerpo y no adentro.
        </Note>
      </Section>

      <Section
        title="La barra mide el peso, no el nivel"
        note="Cada tramo es un aspecto y su ancho es lo que vale contra los demás, que es una cantidad de verdad. Los niveles son categorías en orden, así que van escritos adentro del aspecto y no repartidos en una barra: un nivel no es una porción de nada. El color nombra al aspecto y ata su tramo con su tarjeta."
      />

      <Section title="Cómo se escribe">
        <Example code={`<Rubric
  criteria={aspectos}
  onAdd={draft => guardar({ ...draft, id: nuevoId(), color: 'green', icon: 'label' })}
  onRemove={c => sacar(c.id)}
>
  <Rubric.Title>Qué vamos a mirar</Rubric.Title>
</Rubric>`} />
      </Section>

      <Section title="Props">
        <Props of="Rubric" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Escribí los descriptores como evidencia, en frase sin verbo: "las tres, con el error estimado" dice qué hacer, "muy bien" no.</Practices.Do>
          <Practices.Do>Acordate de que cada descriptor se lee dos veces: acá lo usa quien corrige para elegir el nivel, y en la devolución lo lee quien entregó como el próximo paso, si quedó un escalón más abajo.</Practices.Do>
          <Practices.Do>El porcentaje sale de los pesos, así que sumá siempre 100 sin escribirlo: cambiá un peso y los demás se acomodan solos.</Practices.Do>
          <Practices.Do>Sacar un aspecto no pregunta: avisá con un `Toast` con "Deshacer", que es lo que el sistema usa para lo que se puede volver atrás.</Practices.Do>
          <Practices.Dont>No la uses para lo que se cumple o no se cumple: una condición de seguridad va en un `Callout`, porque graduarla la vuelve negociable.</Practices.Dont>
          <Practices.Dont>No le pongas número a cada nivel: el orden ya lo dice la posición, y el número invita a leer la rúbrica como una nota.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>La cabecera es un botón con `aria-expanded` y `aria-controls`, y toma su nombre del título de al lado.</A11y.Item>
          <A11y.Item>Plegada, el cuerpo va con `inert`: no junta foco ni lo lee nadie.</A11y.Item>
          <A11y.Item>La barra es decorativa (`aria-hidden`), así que cada aspecto dice su porcentaje en un texto que solo alcanza un lector de pantalla.</A11y.Item>
          <A11y.Item>El alta abre con el foco en el primer campo y `Escape` la cierra, devolviendo el foco al botón que la abrió.</A11y.Item>
          <A11y.Item>El tacho dice a qué aspecto pertenece: "Sacar Gráfico de la rúbrica", no "Sacar".</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
