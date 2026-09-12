import { useState } from 'react'
import { Button, ConfirmDialog, useToast } from '@melu/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

export function ConfirmStory() {
  const [abierto, setAbierto] = useState(false)
  const [publicar, setPublicar] = useState(false)
  const { toast } = useToast()
  return (
    <Page
      title="ConfirmDialog"
      kind="Superficies"
      imports="import { ConfirmDialog } from '@melu/ui'"
      lead="La pregunta antes de algo que no se deshace. Es un modal con una forma fija, porque una confirmación siempre es lo mismo: qué se va a hacer, sobre qué, y dos salidas."
    >
      <Section
        title="Vivo"
        note="El título nombra lo que se va a tocar: «¿Borrar esta actividad?» obliga a acordarse de cuál estabas mirando. Va como `alertdialog` y no como `dialog` — un lector de pantalla lo anuncia con más urgencia, que es lo que corresponde cuando lo que sigue no tiene vuelta atrás."
      >
        <Canvas className="flex justify-center">
          <Button variant="bad" icon="delete" onClick={() => setAbierto(true)}>Borrar la actividad</Button>
        </Canvas>
        <ConfirmDialog
          open={abierto}
          onCancel={() => setAbierto(false)}
          onConfirm={() => {
            setAbierto(false)
            toast({ title: 'Actividad borrada', tone: 'ok' })
          }}
          title="¿Borrar «Fracciones equivalentes»?"
          body="Se borran también las 18 entregas que ya llegaron. No se puede deshacer."
          confirmLabel="Borrar"
          tone="bad"
        />
      </Section>

      <Section
        title="El otro tono"
        note="`neutral` es para lo que se puede deshacer pero conviene mirar dos veces: publicar, cerrar, invitar. El botón de confirmar va sólido y el foco arranca ahí, porque la respuesta esperada es que sí."
      >
        <Canvas className="flex justify-center">
          <Button variant="solid" icon="send" onClick={() => setPublicar(true)}>Publicar sin fecha</Button>
        </Canvas>
        <ConfirmDialog
          open={publicar}
          onCancel={() => setPublicar(false)}
          onConfirm={() => {
            setPublicar(false)
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
        {' '}<a className="underline underline-offset-2" href="#toast">Toast</a> que ofrezca
        «Deshacer». El diálogo se guarda para lo que no tiene vuelta.
      </Note>

      <Section title="Props">
        <Props rows={[
          { name: 'open', type: 'boolean', required: true },
          { name: 'onCancel', type: '() => void', required: true, note: 'lo llaman Cancelar, el velo y Escape' },
          { name: 'onConfirm', type: '() => void', required: true },
          { name: 'title', type: 'string', required: true, note: 'la pregunta, con el nombre de lo que se toca' },
          { name: 'body', type: 'ReactNode', note: 'qué más se lleva puesto' },
          { name: 'confirmLabel', type: 'string', def: "'Aceptar'", note: 'el verbo de lo que va a pasar, no «Sí»' },
          { name: 'cancelLabel', type: 'string', def: "'Cancelar'" },
          { name: 'tone', type: "'neutral' | 'bad'", def: "'neutral'", note: 'bad pinta el botón de confirmar y arranca el foco en Cancelar' },
        ]} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Va como role="alertdialog": se anuncia con más urgencia que un diálogo común.',
          'Con tone="bad" el foco arranca en Cancelar: con el foco en «Borrar», un Enter de más lo borra.',
          'El foco no se escapa del diálogo mientras está abierto.',
          'Escape cancela, que es la salida segura.',
          'El botón dice el verbo de lo que va a pasar: «Borrar» y no «Aceptar».',
        ]} />
      </Section>
    </Page>
  )
}
