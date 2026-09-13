import { useState } from 'react'
import { Chip, labelColors } from '@milo/ui'
import { A11y, Note, Page, Panel, Props, Section, Variant } from '../kit'

export function ChipStory() {
  const [chips, setChips] = useState(['Indagación', 'Proyecto', 'Taller'])

  return (
    <Page
      title="Chip"
      kind="Datos"
      imports="import { Chip } from '@milo/ui'"
      lead="28 de alto y radio 10. Es una etiqueta, no un botón: solo se vuelve accionable si recibe `onClick` o `onRemove`."
    >
      <Section
        title="Variantes"
        note="`color` toma el **par suave**: fondo apagado y tinta del mismo tono, anclada a 4.6:1. Un chip nunca viene solo —hay cinco en una fila— y seis rellenos vivos juntos compiten entre sí y con todo lo demás. El relleno vivo se quedó con el cuadradito de icono, donde la pieza es chica y el color tiene que gritar."
      >
        <Panel>
          <Variant name="plano"><Chip>Indagación</Chip></Variant>
          <Variant name="colores">
            {labelColors.map(c => <Chip key={c} color={c}>{c}</Chip>)}
          </Variant>
          <Variant name="con icono">
            <Chip color="green" icon="check">Corregida</Chip>
            <Chip color="orange" icon="schedule">Vence mañana</Chip>
            <Chip color="purple" icon="person">Nadia Britos</Chip>
          </Variant>
          <Variant name="con punto">
            <Chip color="blue" dot>En curso</Chip>
            <Chip color="pink" dot>Borrador</Chip>
          </Variant>
          <Variant name="activo"><Chip active>Elegido</Chip></Variant>
          <Variant name="clickeable"><Chip onClick={() => {}}>Se toca</Chip></Variant>
          <Variant name="removible">
            {chips.map(c => (
              <Chip key={c} onRemove={() => setChips(cs => cs.filter(x => x !== c))}>{c}</Chip>
            ))}
            {chips.length === 0 && <span className="text-meta text-ink-muted">se fueron todos — recargá para volver a verlos</span>}
          </Variant>
          <Variant name="las dos cosas">
            <Chip color="blue" onClick={() => {}} onRemove={() => {}}>Matemática</Chip>
            <Chip color="pink" onClick={() => {}} onRemove={() => {}}>Lengua</Chip>
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
        <Props of="Chip" />
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
