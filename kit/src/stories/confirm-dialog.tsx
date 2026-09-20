import { useState } from 'react'
import { Button } from '@milo/ui/button'
import { ConfirmDialog } from '@milo/ui/confirm-dialog'
import { Icon } from '@milo/ui/icon'
import { useToast } from '@milo/ui/toast'
import { A11y, Demo, Example, Grid, Note, Page, Practices, Props, Section } from '../kit'

export function ConfirmStory() {
  const [open, setOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const { toast } = useToast()
  return (
    <Page
      title="ConfirmDialog"
      kind="Superficies"
      imports="import { ConfirmDialog } from '@milo/ui/confirm-dialog'"
      lead="La pregunta antes de algo que no se deshace. Mismas partes que el Modal, sin X: la salida segura ya está a la vista y es el botón de cancelar."
    >
      <Section
        title="Vivo"
        note="El título nombra lo que se va a tocar. Con `tone=&quot;bad&quot;` el foco arranca en cancelar, porque con el foco puesto en Borrar un Enter de más borra."
      >
        <Grid min={300}>
          <Demo label='tone="bad"'>
            <Button variant="bad" iconStart={<Icon name="delete" />} onClick={() => setOpen(true)}>Borrar la actividad</Button>
            <ConfirmDialog
              open={open}
              onCancel={() => setOpen(false)}
              onConfirm={() => {
                setOpen(false)
                toast({ title: 'Actividad borrada', tone: 'ok' })
              }}
              tone="bad"
            >
              <ConfirmDialog.Header>
                <ConfirmDialog.Title>¿Borrar "Fracciones equivalentes"?</ConfirmDialog.Title>
              </ConfirmDialog.Header>
              <ConfirmDialog.Body>
                Se borran también las 18 entregas que ya llegaron. No se puede deshacer.
              </ConfirmDialog.Body>
              <ConfirmDialog.Footer>
                <ConfirmDialog.Cancel />
                <ConfirmDialog.Confirm>Borrar</ConfirmDialog.Confirm>
              </ConfirmDialog.Footer>
            </ConfirmDialog>
          </Demo>

          <Demo label='tone="neutral"'>
            <Button variant="brand" iconStart={<Icon name="send" />} onClick={() => setPublishOpen(true)}>Publicar sin fecha</Button>
            <ConfirmDialog
              open={publishOpen}
              onCancel={() => setPublishOpen(false)}
              onConfirm={() => {
                setPublishOpen(false)
                toast({ title: 'Actividad publicada', body: 'Queda abierta hasta que la cierres', tone: 'ok' })
              }}
            >
              <ConfirmDialog.Header>
                <ConfirmDialog.Title>¿Publicar sin fecha de cierre?</ConfirmDialog.Title>
              </ConfirmDialog.Header>
              <ConfirmDialog.Body>
                Queda abierta hasta que la cierres a mano, y los estudiantes pueden seguir entregando.
              </ConfirmDialog.Body>
              <ConfirmDialog.Footer>
                <ConfirmDialog.Cancel />
                <ConfirmDialog.Confirm>Publicar</ConfirmDialog.Confirm>
              </ConfirmDialog.Footer>
            </ConfirmDialog>
          </Demo>
        </Grid>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`
<ConfirmDialog open={open} onCancel={cerrar} onConfirm={borrar} tone="bad">
  <ConfirmDialog.Header>
    <ConfirmDialog.Title>¿Borrar "Fracciones equivalentes"?</ConfirmDialog.Title>
  </ConfirmDialog.Header>
  <ConfirmDialog.Body>
    Se borran también las 18 entregas que ya llegaron.
  </ConfirmDialog.Body>
  <ConfirmDialog.Footer>
    <ConfirmDialog.Cancel />
    <ConfirmDialog.Confirm>Borrar</ConfirmDialog.Confirm>
  </ConfirmDialog.Footer>
</ConfirmDialog>
`} />
      </Section>

      <Note title="Antes de preguntar, fijate si se puede deshacer">
        Preguntar cuesta un click siempre; deshacer cuesta un click solo cuando alguien se equivocó.
        Si la acción se puede revertir, va derecho con un [Toast](#toast) que ofrezca "Deshacer". El
        diálogo se guarda para lo que no tiene vuelta.
      </Note>

      <Section title="Props">
        <Props of="ConfirmDialog" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Los botones son partes y no props porque la regla de foco es de la pieza: con `tone="bad"` el foco arranca en cancelar.</Practices.Do>
          <Practices.Dont>No le pongas una X: la salida segura ya está a la vista y es cancelar.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Va como role="alertdialog": se anuncia con más urgencia que un diálogo común, y el nombre sale del título por `aria-labelledby`.</A11y.Item>
          <A11y.Item>Con tone="bad" el foco arranca en Cancelar: con el foco en "Borrar", un Enter de más lo borra. Eso lo resuelven las dos partes de botón, no el call site.</A11y.Item>
          <A11y.Item>No lleva X: la salida segura ya está a la vista y es el botón de cancelar.</A11y.Item>
          <A11y.Item>El foco no se escapa del diálogo mientras está abierto.</A11y.Item>
          <A11y.Item>Escape cancela, que es la salida segura.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
