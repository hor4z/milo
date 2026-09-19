import cls from './checkbox.module.css'
import { useState } from 'react'
import { Checkbox } from '@milo/ui'
import { A11y, Page, Panel, Props, Section, Stack, Variant } from '../kit'

export function CheckboxStory() {
  const [spaces, setSpaces] = useState<string[]>(['Ciencias'])
  const [partial, setPartial] = useState(false)
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [c, setC] = useState(true)

  return (
    <Page
      title="Checkbox"
      kind="Formularios"
      imports="import { Checkbox } from '@milo/ui'"
      lead="Caja de 18, la medida del pulgar del switch, con el radio `sm`: el mismo del kbd y el más chico que la escala tiene. Es el que corresponde: sobre un cuadrado de 18, el escalón siguiente deja cuatro píxeles de lado recto por lado y la casilla se lee redonda, que es la forma de la opción única."
    >
      <Section
        title="Estados"
        note="Apagada es un campo hundido, igual que un kbd. Prendida pasa al azul con el tilde en blanco y pierde el relieve: lo hundido invita a apretar, y una casilla ya marcada no invita, informa. El azul porque es el único control que confirma una elección de quien lo usa."
      >
        <Panel>
          <Variant name="off / on">
            <Checkbox checked={b} onChange={setB} label="Sin marcar" />
            <Checkbox checked={a} onChange={setA} label="Marcada" />
          </Variant>
          <Variant name="indeterminate"><Checkbox checked={partial} indeterminate={!partial} onChange={setPartial} label="Parcial" /></Variant>
          <Variant name="disabled">
            <Checkbox checked onChange={() => {}} disabled label="Fija" />
            <Checkbox checked={false} onChange={() => {}} disabled label="Fija" />
          </Variant>
        </Panel>
      </Section>

      <Section title="En una fila" note="El `<label>` envolviendo la casilla hace que el texto también sea zona de click, que es la mitad del área útil. El tilde va a 14 y no a 16: el tamaño hay que mirarlo con el trazo incluido, que agrega media línea de cada lado, y a 16 tocaba las esquinas de la caja de 18.">
        <Panel>
          <Variant name="con etiqueta">
            <label className={cls.singleLabel}>
              <Checkbox checked={c} onChange={setC} />
              Compartir la receta con el equipo
            </label>
          </Variant>
          <Variant name="lista">
            <Stack gap="sm">
              {['Geografía', 'Ciencias', 'Matemática'].map(x => (
                <label key={x} className={cls.itemLabel}>
                  <Checkbox
                    checked={spaces.includes(x)}
                    onChange={v => setSpaces(e => (v ? [...e, x] : e.filter(n => n !== x)))}
                  />
                  {x}
                </label>
              ))}
            </Stack>
          </Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props of="Checkbox" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es un botón con role="checkbox" y aria-checked, así que un lector lo anuncia con su estado.',
          'El `label` lo nombra; sin él, un cuadrado tildado no dice de qué es.',
          'Espacio lo alterna, como cualquier casilla nativa.',
        ]} />
      </Section>
    </Page>
  )
}
