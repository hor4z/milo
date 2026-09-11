import { Kbd } from '@melu/ui'
import { Block, Demo, Props, Section } from '../kit'

export function KbdStory() {
  return (
    <Section
      title="Kbd"
      note="La tecla de un atajo. No se toca: marca. Por eso va hundida y no con el relieve de algo que sobresale."
    >
      <Block
        label="La pieza"
        note="11px, radio 6, hundido: anillo de un píxel, luz arriba y sombra interior abajo. Los blur son sub-píxel a propósito — con 1px, el labio de abajo se derrama hacia adentro y el borde inferior pasa a leerse de dos píxeles."
      >
        <Demo>
          <Kbd>⌘ K</Kbd>
          <Kbd>⌘ ,</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
        </Demo>
      </Block>

      <Block label="Props">
        <Props rows={[{ name: 'children', type: 'ReactNode' }]} />
      </Block>
    </Section>
  )
}
