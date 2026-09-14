import cls from './switch.module.css'
import { useState } from 'react'
import { Row, Switch } from '@milo/ui'
import { A11y, Note, Page, Panel, Props, Section, Variant } from '../kit'

export function SwitchStory() {
  const [on, setOn] = useState(true)
  const [off, setOff] = useState(false)

  return (
    <Page
      title="Switch"
      kind="Formularios"
      imports="import { Row, Switch } from '@milo/ui'"
      lead="Pista de 40×22 con 2 de padding, así que el pulgar es de 18 y viaja 18 exactos. La pista prendida va en el azul de marca, el mismo que el checkbox marcado: el naranja señala algo que pasó y no eligió nadie, y un switch prendido es lo contrario, es una decisión de quien lo usa."
    >
      <Section
        title="Estados"
        note="Lo que lo hace verse como una pieza física y no como un círculo pintado son las tres capas del pulgar: luz interior arriba, un halo corto alrededor y una sombra de contacto un píxel más abajo. La pista además lleva su propia sombra interior (más marcada en on que en off) para que el pulgar parezca hundido dentro."
      >
        <Panel>
          <Variant name="on"><Switch checked={on} onChange={setOn} label="Sugerencias" /></Variant>
          <Variant name="off"><Switch checked={off} onChange={setOff} label="Directorio" /></Variant>
          <Variant name="disabled">
            <Switch checked onChange={() => {}} disabled label="Fijo" />
            <Switch checked={false} onChange={() => {}} disabled label="Fijo" />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Con su etiqueta al lado"
        note="Un switch suelto no dice qué prende. En un panel va dentro de una `Row`, que pone la etiqueta a la izquierda y el control contra el borde derecho; en un formulario va dentro de un `Field`."
      >
        <div className={`${cls.rowBox} bg-surface`}>
          <Row label="Avisos por mail" hint="Cuando llega una entrega nueva">
            <Switch checked={on} onChange={setOn} label="Avisos por mail" />
          </Row>
          <Row label="Entregas fuera de fecha" hint="Después del cierre">
            <Switch checked={off} onChange={setOff} label="Entregas fuera de fecha" />
          </Row>
        </div>
      </Section>

      <Note title="Switch o Checkbox">
        El switch aplica en el momento: lo prendés y ya está. La casilla es parte de un formulario que
        se confirma después, con un botón. Si hay un "Guardar" abajo, va casilla; si el cambio pasa
        solo, va switch.
      </Note>

      <Section title="Props">
        <Props of="Switch" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'role="switch" con aria-checked: un lector dice "activado" y no "casilla marcada".',
          'El `label` lo nombra aunque en pantalla no haya texto al lado.',
        ]} />
      </Section>
    </Page>
  )
}
