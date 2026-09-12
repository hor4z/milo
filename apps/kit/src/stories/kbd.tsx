import { Kbd } from '@melu/ui'
import { Demo, Page, Props, Section } from '../kit'

export function KbdStory() {
  return (
    <Page
      title="Kbd"
      kind="Superficies"
      imports="import { Kbd } from '@melu/ui'"
      lead="La tecla de un atajo. No se toca: marca. Por eso va hundida y no con el relieve de algo que sobresale."
    >
      <Section
        title="La pieza"
        note="11px, radio 6, hundido: anillo de un píxel, luz arriba y sombra interior abajo. Los blur son sub-píxel a propósito — con 1px, el labio de abajo se derrama hacia adentro y el borde inferior pasa a leerse de dos píxeles."
      >
        <Demo>
          <Kbd>⌘ K</Kbd>
          <Kbd>⌘ ,</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
        </Demo>
      </Section>

      <Section title="Props">
        <Props rows={[{ name: 'children', type: 'ReactNode' }]} />
      </Section>
    </Page>
  )
}
