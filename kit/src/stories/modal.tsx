import { useState } from 'react'
import { Button, Field, Icon, Modal, ModalBody, ModalFooter, ModalHeader, ModalHint, ModalTitle, SettingsModal, TextField } from '@milo/ui'
import { A11y, Demo, Example, Grid, Note, Page, Props, Section } from '../kit'

export function ModalStory() {
  const [open, setOpen] = useState(false)
  const [narrowOpen, setNarrowOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [nombre, setNombre] = useState('Física · 5.º B')

  return (
    <Page
      title="Modal"
      kind="Superficies"
      imports="import { Modal, ModalHeader, ModalTitle, ModalHint, ModalBody, ModalFooter } from '@milo/ui'"
      lead="Tres partes: la cabecera con el título y la X, el cuerpo, y los botones abajo. El panel es una columna, así que el cuerpo es lo único que scrollea y las acciones siguen a la vista. El ancho sale de tres, no de un número suelto."
    >
      <Section
        title="Vivo"
        note="Probá Escape, y probá scrollear la página de atrás: está bloqueado y no hay salto lateral al abrir."
      >
        <Grid min={300}>
          <Demo label="md · 620, el de siempre">
            <Button variant="muted" onClick={() => setOpen(true)}>Abrir modal</Button>
            <Modal open={open} onClose={() => setOpen(false)} size="md">
              <ModalHeader>
                <ModalTitle>Un modal de 620</ModalTitle>
                <ModalHint>Lo que el lector anuncia sale de ese título.</ModalHint>
              </ModalHeader>
              <ModalBody>
                El cuerpo es lo que scrollea cuando el contenido no entra. La cabecera y los botones
                se quedan donde están.
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button variant="brand" onClick={() => setOpen(false)}>Entendido</Button>
              </ModalFooter>
            </Modal>
          </Demo>

          <Demo label="sm · 420, una pregunta o un campo">
            <Button variant="muted" onClick={() => setNarrowOpen(true)}>Renombrar</Button>
            <Modal open={narrowOpen} onClose={() => setNarrowOpen(false)} size="sm">
              <ModalHeader>
                <ModalTitle>Renombrar el espacio</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Field label="Nombre" hint="Lo ven los 28 del curso.">
                  <TextField value={nombre} onChange={e => setNombre(e.target.value)} />
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" size="sm" onClick={() => setNarrowOpen(false)}>Cancelar</Button>
                <Button variant="brand" size="sm" onClick={() => setNarrowOpen(false)}>Guardar</Button>
              </ModalFooter>
            </Modal>
          </Demo>

          <Demo label="md · el caso real">
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
        </Grid>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`
<Modal open={open} onClose={cerrar} size="md">
  <ModalHeader>
    <ModalTitle>Un modal de 620</ModalTitle>
    <ModalHint>La línea de apoyo, si hace falta.</ModalHint>
  </ModalHeader>
  <ModalBody>
    El contenido.
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={cerrar}>Cancelar</Button>
    <Button variant="brand" onClick={guardar}>Entendido</Button>
  </ModalFooter>
</Modal>
`} />
      </Section>

      <Note title="Modal o ConfirmDialog">
        El modal es para lo que pide hacer algo: un formulario corto, unos ajustes, elegir. Si lo
        único que hace es preguntar "¿seguro?" y ofrecer dos salidas, eso es un
        [ConfirmDialog](#confirm), que además pone el foco donde corresponde y se anuncia como
        `alertdialog`.
      </Note>

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
