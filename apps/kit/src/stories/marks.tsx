import { Avatar, Icon, Kbd } from '@melu/ui'
import { Block, Demo, Props, Section } from '../kit'

export function MarksStory() {
  return (
    <Section
      title="Kbd, Avatar e Icon"
      note="Las tres piezas chicas que no son controles: no se tocan, marcan."
    >
      <Block label="Kbd" note="11px, radio 6, hundido: anillo de un píxel, luz arriba y sombra interior abajo. Los blur son sub-píxel a propósito — con 1px, el labio de abajo se derrama hacia adentro y el borde inferior pasa a leerse de dos píxeles.">
        <Demo>
          <Kbd>⌘ K</Kbd>
          <Kbd>⌘ ,</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
        </Demo>
      </Block>

      <Block label="Avatar" note="El tinte sale del nombre, no de un random: si saliera de un random, la misma persona cambiaría de color en cada render y el color dejaría de identificar a nadie.">
        <Demo>
          <Avatar name="Horacio Rivero" size={24} />
          <Avatar name="Horacio Rivero" size={34} />
          <Avatar name="Horacio Rivero" size={44} />
          <Avatar name="Melina Duarte" size={44} />
          <Avatar name="Equipo Timonel" size={44} />
        </Demo>
      </Block>

      <Block
        label="Icon"
        note="Set propio de contornos, grilla de 24, 20px y trazo 1. La prop `weight` sube a 1.5 donde el icono va en gris: un trazo fino encierra aire y se apaga al lado del texto. Por lo mismo hay un --icon-muted más oscuro que el gris del texto."
      >
        <Demo>
          <span className="flex items-center gap-2">
            <Icon name="search" size={20} />
            <span className="text-2xs text-ink-muted">weight 1 · en tinta</span>
          </span>
          <span className="flex items-center gap-2">
            <Icon name="search" size={20} weight={1.5} className="text-icon-muted" />
            <span className="text-2xs text-ink-muted">weight 1.5 · icon-muted</span>
          </span>
        </Demo>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'Kbd · children', type: 'ReactNode' },
          { name: 'Avatar · name', type: 'string', note: 'de acá salen la inicial y el tinte' },
          { name: 'Avatar · size', type: 'number', def: '40' },
          { name: 'Icon · name', type: 'IconName', note: '39 iconos en el set' },
          { name: 'Icon · size', type: 'number', def: '20' },
          { name: 'Icon · weight', type: 'number', def: '1', note: '1.5 cuando el icono va en gris' },
        ]} />
      </Block>
    </Section>
  )
}
