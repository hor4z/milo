import { Tab, TabList, TabPanel, Tabs } from '@milo/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

export function TabsStory() {
  return (
    <Page
      title="Tabs"
      kind="Navegación"
      imports="import { Tabs, TabList, Tab, TabPanel } from '@milo/ui'"
      lead="Un mismo lugar que muestra contenidos que se comparan entre sí: las entregas, la rúbrica y los ajustes de una actividad. Lo que no se compara no va en solapas — va en una pantalla aparte o en un `Accordion`."
    >
      <Section
        title="Cómo se arma"
        note="El activo se marca con una línea y no con color: en una interfaz monocroma la línea distingue igual y no gasta el único acento que hay. `value` ata cada solapa con su panel, y es lo mismo que un lector de pantalla usa para decir cuál de los tres estás leyendo."
      >
        <Canvas>
          <Tabs defaultValue="entregas">
            <TabList>
              <Tab value="entregas">Entregas</Tab>
              <Tab value="rubrica">Rúbrica</Tab>
              <Tab value="ajustes">Ajustes</Tab>
            </TabList>
            <TabPanel value="entregas">
              <p className="text-body font-medium text-ink-muted">Dieciocho entregas, cuatro sin mirar.</p>
            </TabPanel>
            <TabPanel value="rubrica">
              <p className="text-body font-medium text-ink-muted">Cuatro criterios, cada uno de 1 a 4.</p>
            </TabPanel>
            <TabPanel value="ajustes">
              <p className="text-body font-medium text-ink-muted">Quién puede ver la actividad y hasta cuándo.</p>
            </TabPanel>
          </Tabs>
        </Canvas>
      </Section>

      <Section
        title="Controlado"
        note="Sin `value` las solapas se acuerdan solas cuál está abierta, que es lo que hace falta casi siempre. Con `value` y `onValueChange` la decisión es de afuera: cuando la solapa abierta tiene que salir de la URL, o cuando algo más de la pantalla la cambia."
      >
        <Canvas>
          <Tabs defaultValue="semana" onValueChange={() => {}}>
            <TabList>
              <Tab value="semana">Esta semana</Tab>
              <Tab value="mes">Este mes</Tab>
              <Tab value="todo">Todo</Tab>
            </TabList>
            <TabPanel value="semana">
              <p className="text-body font-medium text-ink-muted">79 entregas en cuatro espacios.</p>
            </TabPanel>
            <TabPanel value="mes">
              <p className="text-body font-medium text-ink-muted">312 entregas, 289 corregidas.</p>
            </TabPanel>
            <TabPanel value="todo">
              <p className="text-body font-medium text-ink-muted">Desde marzo: 1.204 entregas.</p>
            </TabPanel>
          </Tabs>
        </Canvas>
      </Section>

      <Note title="Solapas o acordeón">
        Si las opciones se comparan entre sí —el mismo tipo de contenido para distintos recortes— van
        solapas. Si son preguntas sueltas que se leen de a una y la mayoría no se va a abrir nunca, va
        un <a className="underline underline-offset-2" href="#accordion">Accordion</a>.
      </Note>

      <Section title="Props">
        <Props of={['Tabs', 'Tab', 'TabPanel']} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'La fila de solapas es un tablist y cada panel declara qué solapa lo nombra.',
          'Las flechas izquierda y derecha mueven el foco y dan la vuelta al llegar al final.',
          'Solo la solapa activa es tabulable: Tab entra al grupo y sale, no recorre las cinco.',
          'El panel es tabulable, así que se puede leer con teclado aunque adentro no haya nada que tocar.',
        ]} />
      </Section>
    </Page>
  )
}
