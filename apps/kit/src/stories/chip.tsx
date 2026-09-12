import { useState } from 'react'
import { Chip, labelColors } from '@melu/ui'
import { Page, Panel, Props, Section, Variant } from '../kit'

export function ChipStory() {
  const [chips, setChips] = useState(['Indagación', 'Proyecto', 'Taller'])

  return (
    <Page
      title="Chip"
      lead="28 de alto y radio 10. Es una etiqueta, no un botón: solo se vuelve accionable si recibe `onClick` o `onRemove`."
    >
      <Section
        title="Variantes"
        note="`color` toma una etiqueta de la familia viva, no un tinte lavado. Antes tomaba `tint: 1..6` y ahí estaba el bug: los tintes son el lavado de una superficie grande con un dibujo oscuro encima, y un chip es una marca chica que tiene que identificar de reojo. Con el tinte puesto, seis chips en una fila se veían todos del mismo gris apenas teñido."
      >
        <Panel>
          <Variant name="plano"><Chip>Indagación</Chip></Variant>
          <Variant name="colores">
            {labelColors.map(c => <Chip key={c} color={c}>{c}</Chip>)}
          </Variant>
          <Variant name="activo"><Chip active>Elegido</Chip></Variant>
          <Variant name="clickeable"><Chip onClick={() => {}}>Se toca</Chip></Variant>
          <Variant name="removible">
            {chips.map(c => (
              <Chip key={c} onRemove={() => setChips(cs => cs.filter(x => x !== c))}>{c}</Chip>
            ))}
            {chips.length === 0 && <span className="text-2xs text-ink-muted">se fueron todos — recargá para volver a verlos</span>}
          </Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'color', type: 'LabelColor', def: '—', note: 'una de las seis etiquetas vivas; sin esto va gris' },
          { name: 'active', type: 'boolean', note: 'pasa a tinta plena y pisa el color' },
          { name: 'onClick', type: '() => void', note: 'lo convierte en <button>' },
          { name: 'onRemove', type: '() => void', note: 'agrega la cruz' },
        ]} />
      </Section>
    </Page>
  )
}
