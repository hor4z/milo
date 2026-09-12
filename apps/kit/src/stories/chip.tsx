import { useState } from 'react'
import { Chip, labelColors } from '@melu/ui'
import { A11y, Note, Page, Panel, Props, Section, Variant } from '../kit'

export function ChipStory() {
  const [chips, setChips] = useState(['Indagación', 'Proyecto', 'Taller'])

  return (
    <Page
      title="Chip"
      kind="Datos"
      imports="import { Chip } from '@melu/ui'"
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

      <Note title="Chip o Badge">
        Se parecen y hacen cosas distintas. El <code>Chip</code> identifica: es el nombre de una
        categoría, un método, una persona — y muchas veces se toca o se saca. El <code>Badge</code>{' '}
        dice en qué estado está algo: corregida, vence mañana, sin entregar. Uno lleva el color de su
        familia; el otro, el de su estado. Si el texto cambia según lo que pasó, es un badge.
      </Note>

      <Section title="Props">
        <Props rows={[
          { name: 'color', type: 'LabelColor', def: '—', note: 'una de las seis etiquetas vivas; sin esto va gris' },
          { name: 'active', type: 'boolean', note: 'pasa a tinta plena y pisa el color' },
          { name: 'onClick', type: '() => void', note: 'lo convierte en <button>' },
          { name: 'onRemove', type: '() => void', note: 'agrega la cruz' },
        ]} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Sin onClick ni onRemove es un <span>: no entra en el orden de tabulación algo que no hace nada.',
          'La cruz de quitar es un botón con su propio nombre, así que se puede usar con el teclado.',
          'Un chip que se toca y se saca son dos botones hermanos y no uno adentro del otro: anidados, tocar la cruz disparaba también el click del chip.',
          'El color nunca es la única marca: lo que identifica al chip es su texto.',
        ]} />
      </Section>
    </Page>
  )
}
