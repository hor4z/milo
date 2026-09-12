import { useState } from 'react'
import { Button, ConfirmDialog, useToast } from '@melu/ui'
import { A11y, Canvas, Page, Props, Section } from '../kit'

export function ConfirmStory() {
  const [abierto, setAbierto] = useState(false)
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

      <Section title="Props">
        <Props rows={[
          { name: 'title', type: 'string', required: true, note: 'la pregunta, con el nombre de lo que se toca' },
          { name: 'body', type: 'ReactNode', note: 'qué más se lleva puesto' },
          { name: 'confirmLabel', type: 'string', def: "'Aceptar'", note: 'el verbo de lo que va a pasar, no «Sí»' },
          { name: 'tone', type: "'neutral' | 'bad'", def: "'neutral'", note: 'bad pinta el botón de confirmar' },
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
