import { Accordion, AccordionItem } from '@melu/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

export function AccordionStory() {
  return (
    <Page
      title="Accordion"
      kind="Navegación"
      imports="import { Accordion, AccordionItem } from '@melu/ui'"
      lead="Filas que se leen de a una y que la mayoría no va a abrir: las preguntas frecuentes, los detalles de una configuración, lo que está de más en la pantalla pero tiene que estar en algún lado."
    >
      <Section
        title="Cómo se arma"
        note="Es un `<details>` nativo, así que abre sin JavaScript y el buscador del navegador —Ctrl+F— encuentra lo que hay adentro aunque esté cerrado. El chevron gira, que es lo único que hace falta para saber si una fila está abierta."
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
        title="Varias abiertas a la vez"
        note="Ninguna fila cierra a las otras. Cerrar lo que alguien abrió a propósito es la clase de ayuda que nadie pidió: si el contenido es largo, lo que sobra es texto, no aperturas."
      >
        <Accordion>
          <AccordionItem summary="Quién ve la actividad" defaultOpen>
            Los espacios en los que la publiques, y nadie más. Cambiarlo después no avisa de nuevo.
          </AccordionItem>
          <AccordionItem summary="Cómo se califica" defaultOpen>
            Con la rúbrica que elijas, o con una nota suelta si no elegís ninguna.
          </AccordionItem>
        </Accordion>
      </Section>

      <Note title="Acordeón o solapas">
        Un acordeón con tres filas que siempre se abren las tres es una lista con pasos de más: eso
        es texto, no un acordeón. Y si las filas se comparan entre sí, van en
        {' '}<a className="underline underline-offset-2" href="#tabs">Tabs</a>.
      </Note>

      <Section title="Props">
        <Props of={['AccordionItem', 'Accordion']} />
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
