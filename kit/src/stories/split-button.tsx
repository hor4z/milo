import { SplitButton } from '@milo/ui/split-button'
import { A11y, Canvas, Cluster, Example, Page, Props, Section } from '../kit'

const otras = [
  { label: 'Guardar como borrador', icon: 'draft' as const },
  { label: 'Programar para el lunes', icon: 'schedule' as const },
  { label: 'Descartar', icon: 'delete', danger: true } as const,
]

export function SplitButtonStory() {
  return (
    <Page
      title="SplitButton"
      kind="Acciones"
      imports="import { SplitButton } from '@milo/ui/split-button'"
      lead="La acción que se hace casi siempre, y al lado las que casi nunca."
    >
      <Section
        title="Para qué sirve"
        note="Es lo que evita una fila de cinco botones donde cuatro no se tocan nunca. El que manda queda a la vista y con un clic; el resto está a dos. Si las acciones pesan lo mismo, no va: ahí van dos botones y se acabó."
      >
        <Canvas>
          <Cluster>
            <SplitButton label="Publicar" items={otras} onClick={() => {}} />
            <SplitButton label="Exportar" variant="muted" items={otras} onClick={() => {}} />
          </Cluster>
        </Canvas>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<SplitButton
  label="Publicar"
  onClick={publicar}
  items={[
    { label: 'Guardar como borrador', icon: 'draft' },
    { label: 'Programar', icon: 'schedule' },
  ]}
/>`} />
      </Section>

      <Section title="Props">
        <Props of="SplitButton" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Las dos mitades van en un role="group" con el nombre de la acción principal.',
          'La flecha lleva aria-haspopup="menu" y aria-expanded, así que se anuncia como lo que es y no como otro botón.',
          'La flecha tiene su propio nombre ("Más opciones de Publicar"): dos botones sin nombre al lado no se distinguen de oído.',
          'Apagar el componente apaga las dos mitades, no una sola.',
        ]} />
      </Section>
    </Page>
  )
}
