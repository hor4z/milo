import { Accordion } from '@milo/ui/accordion'
import { A11y, Note, Page, Props, Section } from '../kit'

export function AccordionStory() {
  return (
    <Page
      title="Accordion"
      kind="Navegación"
      imports="import { Accordion } from '@milo/ui/accordion'"
      lead="Filas que se leen de a una y que la mayoría no va a abrir: las preguntas frecuentes, los detalles de una configuración, lo que está de más en la pantalla pero tiene que estar en algún lado."
    >
      <Section
        title="Cómo se arma"
        note="Es un `<details>` nativo, así que abre sin JavaScript y el buscador del navegador (Ctrl+F) encuentra lo que hay adentro aunque esté cerrado. El chevron gira, que es lo único que hace falta para saber si una fila está abierta."
      >
        <Accordion>
          <Accordion.Item defaultOpen>
            <Accordion.Summary>¿Qué pasa si publico sin fecha de cierre?</Accordion.Summary>
            <Accordion.Body>La actividad queda abierta hasta que la cierres a mano. Los estudiantes pueden seguir entregando.</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Summary>¿Puedo corregir después de cerrar?</Accordion.Summary>
            <Accordion.Body>Sí. Cerrar solo impide entregas nuevas.</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Summary>¿Se avisa a los estudiantes?</Accordion.Summary>
            <Accordion.Body>Al publicar, sí. Al cerrar, no: la fecha ya estaba a la vista desde el principio.</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Section>

      <Section
        title="Varias abiertas a la vez"
        note="Ninguna fila cierra a las otras: cada `<details>` es independiente."
      >
        <Accordion>
          <Accordion.Item defaultOpen>
            <Accordion.Summary>Quién ve la actividad</Accordion.Summary>
            <Accordion.Body>Los espacios en los que la publiques, y nadie más. Cambiarlo después no avisa de nuevo.</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item defaultOpen>
            <Accordion.Summary>Cómo se califica</Accordion.Summary>
            <Accordion.Body>Con la rúbrica que elijas, o con una nota suelta si no elegís ninguna.</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Section>

      <Note title="Acordeón o solapas">
        Un acordeón con tres filas que siempre se abren las tres es una lista con pasos de más: eso
        es texto, no un acordeón. Y si las filas se comparan entre sí, van en
        [Tabs](#tabs).
      </Note>

      <Section title="Props">
        <Props of="Accordion" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es <details> y <summary>, así que el estado abierto o cerrado lo anuncia el navegador sin ayuda.',
          'Enter y espacio abren y cierran, y el foco se ve con el mismo anillo que el resto del sistema.',
          'El contenido cerrado sigue estando en el documento: Ctrl+F lo encuentra.',
        ]} />
      </Section>
    </Page>
  )
}
