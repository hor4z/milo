import { useState } from 'react'
import { Rubric, type Criterion } from '@milo/ui/rubric'
import { labelColors } from '@milo/ui/lib/colors'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const base: Criterion[] = [
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

export function RubricStory() {
  const [criteria, setCriteria] = useState(base)

  return (
    <Page
      title="Rubric"
      kind="Datos"
      imports="import { Rubric } from '@milo/ui/rubric'"
      lead="Con qué se mira un trabajo: los aspectos, cuánto vale cada uno y qué se ve en cada renglón. La escribe quien corrige y la lee quien entrega, así que dice lo mismo de los dos lados."
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
        title="La barra mide el peso, no lo logrado"
        note="Cada tramo es un aspecto y su ancho es lo que vale contra los demás, que es una cantidad de verdad. Los renglones son cosas que se cumplen o no, así que van escritos adentro del aspecto y no repartidos en una barra: cumplir uno no es una porción de nada. El color nombra al aspecto y ata su tramo con su tarjeta."
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
          <Practices.Do>Escribí los descriptores como evidencia, en frase sin verbo: "siempre con el mismo teléfono" dice qué hacer, "muy bien" no.</Practices.Do>
          <Practices.Do>Acordate de que cada descriptor se lee dos veces: acá lo tilda quien corrige, y en la devolución lo lee quien entregó como lo que le falta.</Practices.Do>
          <Practices.Do>El porcentaje sale de los pesos, así que sumá siempre 100 sin escribirlo: cambiá un peso y los demás se acomodan solos.</Practices.Do>
          <Practices.Do>Sacar un aspecto se lleva puestos sus cuatro renglones escritos a mano, así que preguntá antes con un `ConfirmDialog` que diga qué se va. En tono neutro y no en rojo: el aviso trae "Deshacer", y el rojo es para lo que no vuelve.</Practices.Do>
          <Practices.Dont>No la uses para lo que se cumple o no se cumple: una condición de seguridad va en un `Callout`, porque graduarla la vuelve negociable.</Practices.Dont>
          <Practices.Dont>No le pongas número a cada renglón: el orden ya lo dice la posición, y el número invita a leer la rúbrica como una nota.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>La cabecera es un botón con `aria-expanded` y `aria-controls`, y toma su nombre del título de al lado.</A11y.Item>
          <A11y.Item>Plegada, el cuerpo va con `inert`: no junta foco ni lo lee nadie.</A11y.Item>
          <A11y.Item>La barra es decorativa (`aria-hidden`), así que cada aspecto dice su porcentaje en un texto que solo alcanza un lector de pantalla.</A11y.Item>
          <A11y.Item>El alta abre con el foco en el primer campo y `Escape` la cierra, devolviendo el foco al botón que la abrió.</A11y.Item>
          <A11y.Item>El tacho dice a qué aspecto pertenece: "Sacar El gráfico de la rúbrica", no "Sacar".</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
