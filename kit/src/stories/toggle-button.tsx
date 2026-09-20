import { useState } from 'react'
import { ToggleButton } from '@milo/ui/toggle-button'
import { A11y, Example, Page, Panel, Practices, Props, Section, Variant } from '../kit'

export function ToggleButtonStory() {
  const [bold, setBold] = useState(true)
  const [italic, setItalic] = useState(false)
  const [soloSinCorregir, setSoloSinCorregir] = useState(false)

  return (
    <Page
      title="ToggleButton"
      kind="Acciones"
      imports="import { ToggleButton } from '@milo/ui/toggle-button'"
      lead="Un botón que queda hundido. Dice en qué estado está algo, no que algo pasó: la negrita del editor, el filtro que está puesto, la vista que se está mirando."
    >
      <Section
        title="Cuándo va"
        note="Un estado que se prende y se apaga y se aplica al momento. Para elegir uno entre varios va `Segmented`; para una preferencia de ajustes, `Switch`."
      >
        <Panel>
          <Variant name="solo el glifo" note="En una barra de formato, que es donde más se usa.">
            <ToggleButton size="sm" pressed={bold} onPressedChange={setBold} icon="format_bold" label="Negrita" />
            <ToggleButton size="sm" pressed={italic} onPressedChange={setItalic} icon="format_italic" label="Cursiva" />
          </Variant>
          <Variant name="con texto" note="Un filtro que se prende y se apaga: hay un estado, no una opción entre varias.">
            <ToggleButton size="sm" pressed={soloSinCorregir} onPressedChange={setSoloSinCorregir} icon="filter_alt">
              Solo sin corregir
            </ToggleButton>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Los tres tamaños"
        note="36 · 40 · 44, los del `Button`. `sm` en una barra, `md` suelto en una pantalla, `lg` donde se toca con el dedo."
      >
        <Panel>
          <Variant name="sm · md · lg">
            <ToggleButton size="sm" pressed icon="format_bold" label="Negrita" />
            <ToggleButton size="md" pressed icon="format_bold" label="Negrita" />
            <ToggleButton size="lg" pressed icon="format_bold" label="Negrita" />
          </Variant>
          <Variant name="apagado" note="No responde y se ve que no responde.">
            <ToggleButton size="sm" pressed={false} disabled icon="format_bold" label="Negrita" />
          </Variant>
        </Panel>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`const [bold, setBold] = useState(false)
<ToggleButton pressed={bold} onPressedChange={setBold} icon="format_bold" label="Negrita" />`} />
      </Section>

      <Section title="Props">
        <Props of="ToggleButton" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Es controlado: el estado lo guarda quien lo usa, y `onPressedChange` recibe el estado nuevo.</Practices.Do>
          <Practices.Dont>Para prender y apagar una preferencia va `Switch`: se lee como una llave, no como una acción.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Lleva aria-pressed, así que un lector anuncia "activado" o "no activado" y no solo el nombre.</A11y.Item>
          <A11y.Item>Cuando adentro solo hay un glifo, `label` es obligatorio: sin eso el botón no dice nada.</A11y.Item>
          <A11y.Item>Con texto adentro el nombre sale del texto, así que `label` no lo pisa.</A11y.Item>
          <A11y.Item>Es type="button": adentro de un form no lo manda.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
