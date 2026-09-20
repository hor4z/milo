import { SplitButton } from '@milo/ui/split-button'
import { A11y, Example, Page, Panel, Practices, Props, Section, Variant } from '../kit'

export function SplitButtonStory() {
  return (
    <Page
      title="SplitButton"
      kind="Acciones"
      imports="import { SplitButton } from '@milo/ui/split-button'"
      lead="La acción que se hace casi siempre, y al lado las que casi nunca. Es lo que evita una fila de cinco botones donde cuatro no se tocan nunca."
    >
      <Section
        title="La pieza"
        note="El que manda queda a un clic y el resto a dos. Va cuando hay una acción que se hace casi siempre: publicar, exportar, guardar."
      >
        <Panel>
          <Variant name="brand" note="**La acción que manda** de una pantalla, con sus variantes al lado.">
            <SplitButton size="sm">
              <SplitButton.Action onClick={() => {}}>Publicar</SplitButton.Action>
              <SplitButton.Item icon="draft">Guardar como borrador</SplitButton.Item>
              <SplitButton.Item icon="schedule">Programar</SplitButton.Item>
            </SplitButton>
          </Variant>
          <Variant name="muted" note="Lo secundario: exportar, descargar, compartir.">
            <SplitButton size="sm" variant="muted">
              <SplitButton.Action onClick={() => {}}>Exportar</SplitButton.Action>
              <SplitButton.Item>Como PDF</SplitButton.Item>
              <SplitButton.Item>Como planilla</SplitButton.Item>
            </SplitButton>
          </Variant>
          <Variant name="apagado" note="Las dos mitades se apagan juntas.">
            <SplitButton size="sm" variant="muted" disabled>
              <SplitButton.Action>Publicar</SplitButton.Action>
              <SplitButton.Item icon="draft">Guardar como borrador</SplitButton.Item>
            </SplitButton>
          </Variant>
        </Panel>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<SplitButton>
  <SplitButton.Action onClick={publicar}>Publicar</SplitButton.Action>
  <SplitButton.Item icon="draft" onSelect={guardar}>Guardar como borrador</SplitButton.Item>
  <SplitButton.Item icon="schedule" onSelect={programar}>Programar</SplitButton.Item>
</SplitButton>`} />
      </Section>

      <Section title="Props">
        <Props of="SplitButton" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>La acción de adelante es la que se hace casi siempre; el resto va al menú.</Practices.Do>
          <Practices.Dont>Si las dos acciones pesan lo mismo, van dos botones y se acabó.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Las dos mitades van en un role="group" con el nombre de la acción principal.</A11y.Item>
          <A11y.Item>La flecha lleva aria-haspopup="menu" y aria-expanded, así que se anuncia como lo que es.</A11y.Item>
          <A11y.Item>La flecha tiene su propio nombre ("Más opciones de Publicar"): dos botones sin nombre al lado no se distinguen de oído.</A11y.Item>
          <A11y.Item>Apagar el componente apaga las dos mitades, no una sola.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
