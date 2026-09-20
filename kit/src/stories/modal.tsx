import { useState } from 'react'
import { Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader, ModalHint, ModalTitle, SettingsModal } from '@milo/ui'
import { A11y, Cluster, Demo, Footnote, Page, Props, Section } from '../kit'

export function ModalStory() {
  const [open, setOpen] = useState(false)
  const [narrowOpen, setNarrowOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <Page
      title="Modal"
      lead="El backdrop es blur de 3px más una capa que atenúa en vez de lavar: 14% en claro y 55% en oscuro, porque sobre un fondo ya oscuro un velo tenue no se ve. En los dos casos el contexto de abajo se sigue leyendo y el modal no se siente un cambio de página. El bloqueo de scroll compensa el ancho de la scrollbar, porque sin eso la página salta a la derecha justo al abrir."
      kind="Superficies"
      imports="import { Modal, ModalHeader, ModalTitle, ModalHint, ModalBody, ModalFooter } from '@milo/ui'"
    >
      <Section
        title="Vivo"
        note="Se enfoca el contenedor del diálogo y no su primer control: el navegador scrollea para traer a la vista lo que enfoca, así que enfocar 'el primero enfocable' abría el panel corrido 39px con la primera fila tapada. Para el caso que sí quiere un campo (la paleta de comandos) hay un `[data-autofocus]`."
      >
        <Cluster align="start">
          <Demo label="width 620">
            <Button variant="muted" onClick={() => setOpen(true)}>Abrir modal</Button>
            <Modal open={open} onClose={() => setOpen(false)} width={620}>
              <ModalHeader>
                <ModalTitle>Un modal de 620</ModalTitle>
                <ModalHint>Lo que el lector anuncia sale de ese título, no de una prop aparte.</ModalHint>
              </ModalHeader>
              <ModalBody>
                Probá Escape, y probá hacer scroll en la página de atrás: está bloqueado, y no hay
                salto lateral al abrir.
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button variant="solid" onClick={() => setOpen(false)}>Entendido</Button>
              </ModalFooter>
            </Modal>
          </Demo>

          <Demo label="width 420">
            <Button variant="muted" onClick={() => setNarrowOpen(true)}>Confirmación</Button>
            <Modal open={narrowOpen} onClose={() => setNarrowOpen(false)} width={420}>
              <ModalHeader>
                <ModalTitle>¿Eliminar la actividad?</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <ModalHint>Se va a borrar para todo el equipo.</ModalHint>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" size="sm" onClick={() => setNarrowOpen(false)}>Cancelar</Button>
                <Button variant="bad" size="sm" onClick={() => setNarrowOpen(false)}>Eliminar</Button>
              </ModalFooter>
            </Modal>
          </Demo>
        </Cluster>
      </Section>

      <Section
        title="El caso real: los ajustes"
        note="El mismo modal que usa la app: rail de 180 que no scrollea, panel que sí. Si scrollean los dos, al bajar en una sección larga desaparecen las secciones y no sabés dónde estás. Van en un modal y no en una página para no perder el contexto: al cerrar seguís donde estabas, con el scroll donde lo dejaste."
      >
        <Cluster align="start">
          <Demo label="width 594">
            <Button variant="muted" iconStart={<Icon name="tune" />} onClick={() => setSettingsOpen(true)}>Ajustes</Button>
            <SettingsModal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              user={{
                name: 'Ana Pérez',
                email: 'ana.perez@ejemplo.edu',
                alias: 'Profe Ana',
                school: 'Escuela N.º 12 · Distrito 7',
              }}
            />
          </Demo>
        </Cluster>
        <Footnote>
          Vive en el paquete y no en la app por la misma regla que deja al shell afuera: no lee{' '}
          <code>data.ts</code> ni el router. Lo único que necesita son las preferencias (que ya viven acá) y
          quién está mirando, que va por prop: el nombre y el correo de una persona real no son
          parte de un design system. Adentro hay un Select, que abre un flotante adentro de otro
          flotante: probalo, el listbox queda arriba del modal sin que nadie escriba un z-index.
        </Footnote>
      </Section>

      <Section
        title="Tres partes, y la del medio es la que scrollea"
        note="`ModalHeader` lleva el título y pone la X sola, `ModalBody` el contenido, `ModalFooter` los botones. El panel es una columna: header y footer no se mueven y el cuerpo scrollea cuando no entra, así que las acciones siguen a la vista en un modal largo. Antes el interior se armaba a mano en cada call site y la X flotaba afuera del panel con dos `!important`."
      >
        <Footnote>
          El `label` quedó para el caso sin título a la vista. Con `ModalTitle` no hace falta, y esa
          era la trampa vieja: la prop decía una cosa, el título otra, y el lector anunciaba la prop.
        </Footnote>
      </Section>

      <Section title="Props">
        <Props of={['Modal', 'ModalHeader', 'ModalTitle', 'ModalHint', 'ModalBody', 'ModalFooter']} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'role="dialog" con aria-modal, y el nombre sale del `ModalTitle` por `aria-labelledby`: una sola fuente, y la que se ve es la que se anuncia.',
          'Atrapa el foco mientras está abierto y lo devuelve al cerrarse.',
          'Se enfoca el contenedor y no el primer control: el navegador scrollea a lo que enfoca, y eso abría el panel corrido.',
          'Bloquea el scroll de la página compensando el ancho de la barra, así que nada salta al abrir.',
        ]} />
      </Section>
    </Page>
  )
}
