import { Accordion, AccordionItem, Breadcrumb, Tab, TabList, TabPanel, Tabs } from '@melu/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

export function TabsStory() {
  return (
    <Page
      title="Tabs, Accordion y Breadcrumb"
      kind="Navegación"
      imports="import { Tabs, TabList, Tab, TabPanel, Accordion, AccordionItem, Breadcrumb } from '@melu/ui'"
      lead="Dos formas de mostrar de a poco. Las solapas sirven cuando el contenido es del mismo tipo y se compara; el acordeón, cuando cada fila se lee sola y la mayoría no se va a abrir nunca."
    >
      <Section
        title="Solapas"
        note="El activo se marca con una línea y no con color: en una interfaz monocroma la línea distingue igual y no gasta el único acento que hay. Las flechas mueven el foco entre solapas y solo la activa entra en el orden de tabulación, que es lo que pide un tablist."
      >
        <Canvas>
          <Tabs defaultValue="entregas">
            <TabList>
              <Tab value="entregas">Entregas</Tab>
              <Tab value="rubrica">Rúbrica</Tab>
              <Tab value="ajustes">Ajustes</Tab>
            </TabList>
            <TabPanel value="entregas">
              <p className="text-xs font-medium text-ink-muted">Dieciocho entregas, cuatro sin mirar.</p>
            </TabPanel>
            <TabPanel value="rubrica">
              <p className="text-xs font-medium text-ink-muted">Cuatro criterios, cada uno de 1 a 4.</p>
            </TabPanel>
            <TabPanel value="ajustes">
              <p className="text-xs font-medium text-ink-muted">Quién puede ver la actividad y hasta cuándo.</p>
            </TabPanel>
          </Tabs>
        </Canvas>
      </Section>

      <Section
        title="Acordeón"
        note="Es un <details> nativo, así que abre sin JavaScript y el buscador del navegador encuentra lo que hay adentro. El chevron gira, que es lo único que hace falta para saber si una fila está abierta."
      >
        <Accordion>
          <AccordionItem summary="¿Qué pasa si publico sin fecha de cierre?" defaultOpen>
            La actividad queda abierta hasta que la cierres a mano. Los estudiantes pueden seguir entregando.
          </AccordionItem>
          <AccordionItem summary="¿Puedo corregir después de cerrar?">
            Sí. Cerrar solo impide entregas nuevas.
          </AccordionItem>
          <AccordionItem summary="¿Se avisa a los estudiantes?">
            Al publicar, sí. Al cerrar, no: la fecha ya estaba a la vista desde el principio.
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Breadcrumb"
        note="Dónde estás parado y cómo volver. El último item no es un link: es dónde estás, y va marcado con `aria-current`. Los de atrás sí, porque son la única forma de subir un nivel sin usar el botón del navegador."
      >
        <Canvas className="flex-col items-start gap-4">
          <Breadcrumb items={[
            { label: 'Espacios', onClick: () => {} },
            { label: 'Matemática · 4.º A', onClick: () => {} },
            { label: 'Fracciones equivalentes' },
          ]} />
          <Breadcrumb items={[{ label: 'Espacios', onClick: () => {} }, { label: 'Lengua · 6.º' }]} />
        </Canvas>
      </Section>

      <Note title="Cuál de los dos">
        Si las opciones se comparan entre sí —el mismo tipo de contenido para distintos recortes— van
        solapas. Si son preguntas sueltas que se leen de a una, va acordeón. Un acordeón con tres filas
        que siempre se abren las tres es una lista con pasos de más.
      </Note>

      <Section title="Props">
        <Props rows={[
          { name: 'Tabs · value', type: 'string', note: 'controlado; sin esto usa defaultValue' },
          { name: 'Tabs · defaultValue', type: 'string', note: 'la solapa abierta al entrar' },
          { name: 'Tabs · onValueChange', type: '(v: string) => void' },
          { name: 'Tab · value', type: 'string', required: true, note: 'ata la solapa a su panel' },
          { name: 'AccordionItem · summary', type: 'ReactNode', required: true, note: 'lo que se ve cerrado' },
          { name: 'AccordionItem · defaultOpen', type: 'boolean' },
          { name: 'Breadcrumb · items', type: '{ label, href?, onClick? }[]', required: true, note: 'de la raíz hasta acá; el último es dónde estás' },
        ]} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'La fila de solapas es un tablist y cada panel declara qué solapa lo nombra.',
          'Las flechas izquierda y derecha mueven el foco y dan la vuelta al llegar al final.',
          'Solo la solapa activa es tabulable: Tab entra al grupo y sale, no recorre las cinco.',
          'El acordeón es <details>, así que el estado abierto/cerrado lo anuncia el navegador.',
          'El Breadcrumb es un <nav> con su nombre, y el item actual lleva aria-current="page".',
        ]} />
      </Section>
    </Page>
  )
}
