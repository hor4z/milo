import { useState } from 'react'
import { CriterionCard, type Criterion } from '@milo/ui/criterion-card'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const grafico: Criterion = {
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
}

const medicion: Criterion = {
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
}

export function CriterionCardStory() {
  const [open, setOpen] = useState<string | null>('grafico')

  return (
    <Page
      title="CriterionCard"
      kind="Datos"
      imports="import { CriterionCard } from '@milo/ui/criterion-card'"
      lead="Un aspecto adentro de una rúbrica: la marca, el nombre y, plegados, sus renglones. Cerrada ocupa una fila, así que una rúbrica de ocho aspectos mide lo mismo que una de dos."
    >
      <Section
        title="Cómo se arma"
        note="Es controlada a propósito: quien la contiene decide cuál está abierta, así que puede dejar una sola y mantener el alto del panel. `Rubric` hace eso, y además la abre cuando alguien enfoca su tramo en la barra."
      >
        <Panel>
          <Variant name="una abierta por vez" note="Tocá la flecha de la otra: la primera se cierra sola.">
            <Stack width="sm">
              <CriterionCard
                criterion={grafico}
                total={15}
                open={open === 'grafico'}
                onToggle={() => setOpen(o => (o === 'grafico' ? null : 'grafico'))}
                onRemove={() => {}}
              />
              <CriterionCard
                criterion={medicion}
                total={15}
                open={open === 'medicion'}
                onToggle={() => setOpen(o => (o === 'medicion' ? null : 'medicion'))}
                onRemove={() => {}}
              />
            </Stack>
          </Variant>
          <Variant name="con descripción" note="`detail` se lee recién al abrirla, arriba de los renglones. Plegada sigue siendo una fila, que es lo que la pieza promete.">
            <Stack width="sm">
              <CriterionCard criterion={medicion} total={15} open onToggle={() => {}} />
            </Stack>
          </Variant>
          <Variant name="de solo lectura" note="Sin `onRemove` no hay tacho: es la misma tarjeta para quien no escribió la rúbrica.">
            <Stack width="sm">
              <CriterionCard criterion={grafico} total={15} open onToggle={() => {}} />
            </Stack>
          </Variant>
        </Panel>
        <Note>
          El nombre y la descripción son dos campos y no uno porque se leen en momentos distintos:
          el nombre es lo único que se ve con el aspecto plegado, así que entra en una línea, y la
          descripción se lee al abrirlo. Los dos tienen tope, y los dos topes los declara la pieza
          en `criterionLimits`: 56 y 220. Un aspecto que necesita más que eso son dos aspectos.
        </Note>
        <Note>
          El porcentaje no se ve: lo dibuja la barra de la rúbrica, que es donde el largo significa
          algo. Acá vive en un texto que solo alcanza un lector de pantalla, para que el dato no
          dependa de ver la barra.
        </Note>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<CriterionCard
  criterion={aspecto}
  total={sumaDeLosPesos}
  open={abierto === aspecto.id}
  onToggle={() => abrir(aspecto.id)}
  onRemove={() => sacar(aspecto.id)}
/>`} />
      </Section>

      <Section title="Props">
        <Props of="CriterionCard" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Dejá una sola abierta: la rúbrica se lee de arriba abajo y el panel no crece con cada aspecto.</Practices.Do>
          <Practices.Do>Si el nombre no entra en una línea, lo que sobra va en `detail` y no adentro del nombre: plegada la tarjeta muestra el nombre solo, y uno de cuatro renglones deja de ser una fila.</Practices.Do>
          <Practices.Do>Pasale `total` aunque no lo muestres: sin él, el porcentaje que escucha un lector de pantalla sería otro.</Practices.Do>
          <Practices.Dont>No le pongas número a cada renglón: el orden ya lo dice la posición, y el número invita a leer la rúbrica como una nota.</Practices.Dont>
          <Practices.Dont>No la uses suelta como tarjeta de cualquier cosa: es de una rúbrica, y lo que dice en voz alta ("vale 25% de la nota") solo tiene sentido ahí.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>La flecha es un botón con `aria-expanded` y `aria-controls`, y toma su nombre del título de al lado.</A11y.Item>
          <A11y.Item>Cerrada, los renglones van con `inert`: no juntan foco ni los lee nadie.</A11y.Item>
          <A11y.Item>El tacho dice a qué aspecto pertenece: "Sacar El gráfico de la rúbrica", no "Sacar".</A11y.Item>
          <A11y.Item>La marca de color es decorativa: el aspecto se reconoce por su nombre, no por su glifo.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
