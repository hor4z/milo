import { useState } from 'react'
import { Switch } from '@melu/ui'
import { Block, Panel, Props, Section, Variant } from '../kit'

export function SwitchStory() {
  const [on, setOn] = useState(true)
  const [off, setOff] = useState(false)

  return (
    <Section
      title="Switch"
      note="Pista de 40×22 con 2 de padding, así que el pulgar es de 18 y viaja 18 exactos. La pista prendida va en el azul de marca, el mismo que el checkbox marcado: el ámbar señala algo que pasó y no eligió nadie, y un switch prendido es lo contrario — es una decisión de quien lo usa."
    >
      <Block
        label="Estados"
        note="Lo que lo hace verse como una pieza física y no como un círculo pintado son las tres capas del pulgar: luz interior arriba, un halo corto alrededor y una sombra de contacto un píxel más abajo. La pista además lleva su propia sombra interior —más marcada en on que en off— para que el pulgar parezca hundido dentro."
      >
        <Panel>
          <Variant name="on"><Switch checked={on} onChange={setOn} label="Sugerencias" /></Variant>
          <Variant name="off"><Switch checked={off} onChange={setOff} label="Directorio" /></Variant>
          <Variant name="disabled">
            <Switch checked onChange={() => {}} disabled label="Fijo" />
            <Switch checked={false} onChange={() => {}} disabled label="Fijo" />
          </Variant>
        </Panel>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'checked', type: 'boolean', note: 'obligatorio' },
          { name: 'onChange', type: '(v: boolean) => void', note: 'obligatorio' },
          { name: 'label', type: 'string', note: 'al aria-label' },
          { name: 'disabled', type: 'boolean' },
          { name: 'id', type: 'string', note: 'para asociarlo a una etiqueta externa' },
        ]} />
      </Block>
    </Section>
  )
}
