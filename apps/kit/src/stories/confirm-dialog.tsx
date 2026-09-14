import { useState } from 'react'
import { Button, ConfirmDialog, useToast } from '@milo/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

export function ConfirmStory() {
  const [open, setOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const { toast } = useToast()
  return (
    <Page
      title="ConfirmDialog"
      kind="Superficies"
      imports="import { ConfirmDialog } from '@milo/ui'"
      lead="La pregunta antes de algo que no se deshace. Es un modal con una forma fija, porque una confirmación siempre es lo mismo: qué se va a hacer, sobre qué, y dos salidas."
    >
      <Section
        title="Vivo"
        note="El título nombra lo que se va a tocar: '¿Borrar esta actividad?' obliga a acordarse de cuál estabas mirando. Va como `alertdialog` y no como `dialog`: un lector de pantalla lo anuncia con más urgencia, que es lo que corresponde cuando lo que sigue no tiene vuelta atrás."
      >
        <Canvas center>
          <Button variant="bad" icon="delete" onClick={() => setOpen(true)}>Borrar la actividad</Button>
        </Canvas>
        <ConfirmDialog
          open={open}
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setOpen(false)
            toast({ title: 'Actividad borrada', tone: 'ok' })
          }}
          title="¿Borrar 'Fracciones equivalentes'?"
          body="Se borran también las 18 entregas que ya llegaron. No se puede deshacer."
          confirmLabel="Borrar"
          tone="bad"
        />
      </Section>

      <Section
        title="El otro tono"
        note="`neutral` es para lo que se puede deshacer pero conviene mirar dos veces: publicar, cerrar, invitar. El botón de confirmar va sólido y el foco arranca ahí, porque la respuesta esperada es que sí."
      >
        <Canvas center>
          <Button variant="solid" icon="send" onClick={() => setPublishOpen(true)}>Publicar sin fecha</Button>
        </Canvas>
        <ConfirmDialog
          open={publishOpen}
          onCancel={() => setPublishOpen(false)}
          onConfirm={() => {
            setPublishOpen(false)
            toast({ title: 'Actividad publicada', body: 'Queda abierta hasta que la cierres', tone: 'ok' })
          }}
          title="¿Publicar sin fecha de cierre?"
          body="La actividad queda abierta hasta que la cierres a mano, y los estudiantes pueden seguir entregando."
          confirmLabel="Publicar"
        />
      </Section>

      <Note title="Antes de preguntar, fijate si se puede deshacer">
        Preguntar cuesta un click siempre; deshacer cuesta un click solo cuando alguien se
        equivocó. Si la acción se puede revertir, va derecho con un
        [Toast](#toast) que ofrezca
        "Deshacer". El diálogo se guarda para lo que no tiene vuelta.
      </Note>

      <Section title="Props">
        <Props of="ConfirmDialog" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Va como role="alertdialog": se anuncia con más urgencia que un diálogo común.',
          'Con tone="bad" el foco arranca en Cancelar: con el foco en "Borrar", un Enter de más lo borra.',
          'El foco no se escapa del diálogo mientras está abierto.',
          'Escape cancela, que es la salida segura.',
          'El botón dice el verbo de lo que va a pasar: "Borrar" y no "Aceptar".',
        ]} />
      </Section>
    </Page>
  )
}
