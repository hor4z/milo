import { useState } from 'react'
import { CriterionCard, type Criterion } from '@milo/ui/criterion-card'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const datos: Criterion = {
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
}

const grafico: Criterion = {
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
}

export function CriterionCardStory() {
  const [open, setOpen] = useState<string | null>('datos')

  return (
    <Page
      title="CriterionCard"
      kind="Datos"
      imports="import { CriterionCard } from '@milo/ui/criterion-card'"
      lead="Un aspecto adentro de una rúbrica: la marca, el nombre y, plegados, sus niveles. Cerrada ocupa una fila, así que una rúbrica de ocho aspectos mide lo mismo que una de dos."
    >
      <Section
        title="Cómo se arma"
        note="Es controlada a propósito: quien la contiene decide cuál está abierta, así que puede dejar una sola y mantener el alto del panel. `Rubric` hace eso, y además la abre cuando alguien enfoca su tramo en la barra."
      >
        <Panel>
          <Variant name="una abierta por vez" note="Tocá la flecha de la otra: la primera se cierra sola.">
            <Stack width="sm">
              <CriterionCard
                criterion={datos}
                total={12}
                open={open === 'datos'}
                onToggle={() => setOpen(o => (o === 'datos' ? null : 'datos'))}
                onRemove={() => {}}
              />
              <CriterionCard
                criterion={grafico}
                total={12}
                open={open === 'grafico'}
                onToggle={() => setOpen(o => (o === 'grafico' ? null : 'grafico'))}
                onRemove={() => {}}
              />
            </Stack>
          </Variant>
          <Variant name="de solo lectura" note="Sin `onRemove` no hay tacho: es la misma tarjeta para quien no escribió la rúbrica.">
            <Stack width="sm">
              <CriterionCard criterion={grafico} total={12} open onToggle={() => {}} />
            </Stack>
          </Variant>
        </Panel>
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
          <Practices.Do>Pasale `total` aunque no lo muestres: sin él, el porcentaje que escucha un lector de pantalla sería otro.</Practices.Do>
          <Practices.Dont>No le pongas número a cada nivel: el orden ya lo dice la posición, y el número invita a leer la rúbrica como una nota.</Practices.Dont>
          <Practices.Dont>No la uses suelta como tarjeta de cualquier cosa: es de una rúbrica, y lo que dice en voz alta ("vale 25% de la nota") solo tiene sentido ahí.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>La flecha es un botón con `aria-expanded` y `aria-controls`, y toma su nombre del título de al lado.</A11y.Item>
          <A11y.Item>Cerrada, los niveles van con `inert`: no juntan foco ni los lee nadie.</A11y.Item>
          <A11y.Item>El tacho dice a qué aspecto pertenece: "Sacar Gráfico de la rúbrica", no "Sacar".</A11y.Item>
          <A11y.Item>La marca de color es decorativa: el aspecto se reconoce por su nombre, no por su glifo.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
