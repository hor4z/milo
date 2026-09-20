import { useState } from 'react'
import { ToggleButton } from '@milo/ui/toggle-button'
import { A11y, Canvas, Cluster, Example, Page, Props, Section, Variant } from '../kit'

export function ToggleButtonStory() {
  const [bold, setBold] = useState(true)
  const [italic, setItalic] = useState(false)
  const [vista, setVista] = useState(false)

  return (
    <Page
      title="ToggleButton"
      kind="Acciones"
      imports="import { ToggleButton } from '@milo/ui/toggle-button'"
      lead="Un botón que queda hundido. Dice en qué estado está algo, no que algo pasó: la negrita del editor, el filtro que está puesto, la columna que se está mostrando."
    >
      <Section
        title="Cuándo va este y no otro"
        note="Es un `Button` que recuerda: lleva `aria-pressed`, así que un lector anuncia si está activado. Para elegir uno entre varios va `Segmented`, que además trae las flechas del teclado. Para prender y apagar una preferencia va `Switch`, que se lee como una llave de luz y no como una acción."
      >
        <Canvas>
          <Cluster>
            <ToggleButton pressed={bold} onPressedChange={setBold} icon="format_bold" label="Negrita" />
            <ToggleButton pressed={italic} onPressedChange={setItalic} icon="format_italic" label="Cursiva" />
            <ToggleButton pressed={vista} onPressedChange={setVista} icon="grid_view">Grilla</ToggleButton>
          </Cluster>
        </Canvas>
      </Section>

      <Section title="Los tres tamaños" note="La misma escalera que el resto de los controles: 36, 40 y 44.">
        <Canvas>
          <Cluster>
            <Variant name="sm"><ToggleButton size="sm" pressed icon="format_bold" label="Negrita" /></Variant>
            <Variant name="md"><ToggleButton size="md" pressed icon="format_bold" label="Negrita" /></Variant>
            <Variant name="lg"><ToggleButton size="lg" pressed icon="format_bold" label="Negrita" /></Variant>
          </Cluster>
        </Canvas>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`const [bold, setBold] = useState(false)

<ToggleButton
  pressed={bold}
  onPressedChange={setBold}
  icon="format_bold"
  label="Negrita"
/>`} />
      </Section>

      <Section title="Props">
        <Props of="ToggleButton" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Lleva aria-pressed, así que un lector anuncia "activado" o "no activado" y no solo el nombre.',
          'Cuando adentro solo hay un glifo, `label` es obligatorio: sin eso el botón no dice nada.',
          'Con texto adentro el nombre sale del texto, así que `label` no lo pisa.',
          'Es type="button": adentro de un form no lo manda.',
        ]} />
      </Section>
    </Page>
  )
}
