import { IconButton } from '@melu/ui'
import { Block, Panel, Props, Section, Variant } from '../kit'

export function IconButtonStory() {
  return (
    <Section
      title="IconButton"
      note="Cuadrado y con radio 10, no 12: un icono suelto en un contenedor de radio 12 se ve descentrado, porque no tiene texto que balancee la curva."
    >
      <Block label="Variantes" note="`label` es obligatorio. Un botón que solo tiene un icono no dice nada sin él, ni para un lector de pantalla ni para quien duda qué hace.">
        <Panel>
          <Variant name="ghost">
            <IconButton icon="sliders" label="Ajustes" />
            <IconButton icon="sliders" label="Ajustes" size="sm" />
          </Variant>
          <Variant name="raised">
            <IconButton icon="pencil" label="Editar" variant="raised" />
            <IconButton icon="pencil" label="Editar" variant="raised" size="sm" />
          </Variant>
          <Variant name="solid"><IconButton icon="check" label="Aceptar" variant="solid" /></Variant>
          <Variant name="muted"><IconButton icon="more" label="Más" variant="muted" /></Variant>
        </Panel>
      </Block>

      <Block label="Estados" note="`dot` es el puntito de «hay algo nuevo», y es uno de los pocos usos del acento en toda la interfaz.">
        <Panel>
          <Variant name="active"><IconButton icon="filter" label="Filtrar" active /></Variant>
          <Variant name="dot"><IconButton icon="bell" label="Novedades" dot /></Variant>
          <Variant name="disabled"><IconButton icon="trash" label="Eliminar" disabled /></Variant>
        </Panel>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'icon', type: 'IconName', note: 'obligatorio' },
          { name: 'label', type: 'string', note: 'obligatorio: va al aria-label y al title' },
          { name: 'variant', type: "'ghost' | 'raised' | 'solid' | 'muted'", def: "'ghost'" },
          { name: 'size', type: "'sm' | 'md'", def: "'md'", note: '32 · 40' },
          { name: 'dot', type: 'boolean', note: 'el punto de acento arriba a la derecha' },
          { name: 'active', type: 'boolean', note: 'solo cambia el ghost, que pasa a muted' },
        ]} />
      </Block>
    </Section>
  )
}
