import { useState } from 'react'
import { Checkbox, Radio, RadioGroup } from '@melu/ui'
import { A11y, Page, Panel, Props, Section, Variant } from '../kit'

export function RadioStory() {
  const [uno, setUno] = useState<'a' | 'b'>('b')
  const [modo, setModo] = useState<'todas' | 'abiertas' | 'cerradas'>('abiertas')
  const [suelto, setSuelto] = useState<'si' | 'no'>('si')
  const [con, setCon] = useState(true)

  return (
    <Page
      title="Radio · RadioGroup"
      kind="Formularios"
      imports="import { Radio } from '@melu/ui'"
      lead="La elección de una entre varias. Es 18, la misma medida del Checkbox y del pulgar del switch, así una fila con los tres queda pareja."
    >
      <Section
        title="El grupo"
        note="Las opciones van sueltas sobre el papel, sin píldora gris detrás. Una pista apagada con la pieza elegida flotando adentro es la receta del Segmented, y un radio metido ahí es el mismo control dibujado dos veces: opciones cortas que se comparan de un vistazo son un Segmented; opciones que necesitan su propio texto al lado son este grupo."
      >
        <Panel>
          <Variant name="dos opciones">
            <RadioGroup
              label="Dos opciones"
              value={uno}
              onChange={setUno}
              options={[{ value: 'a', label: 'La primera' }, { value: 'b', label: 'La segunda' }]}
            />
          </Variant>
          <Variant name="tres">
            <RadioGroup
              label="Tres opciones"
              value={modo}
              onChange={setModo}
              options={[
                { value: 'todas', label: 'Todas' },
                { value: 'abiertas', label: 'Abiertas' },
                { value: 'cerradas', label: 'Cerradas' },
              ]}
            />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Es el checkbox en redondo"
        note="Mismo relleno azul prendido, misma receta hundida apagado, misma medida de 18. Lo único que cambia es la forma y la marca de adentro: el checkbox lleva un tilde, el radio un disco blanco. Dos piezas que dicen lo mismo — «esto lo elegí yo» — no pueden dibujarse con dos recetas distintas, o la fila que las tiene juntas se lee como dos sistemas."
      >
        <Panel>
          <Variant name="radio vs checkbox">
            <Radio checked={con} onChange={() => setCon(true)} label="Prendido" />
            <Radio checked={!con} onChange={() => setCon(false)} label="Apagado" />
            <span className="ml-4 inline-flex items-center gap-3">
              <Checkbox checked onChange={() => {}} label="Checkbox prendido" />
              <Checkbox checked={false} onChange={() => {}} label="Checkbox apagado" />
            </span>
          </Variant>
        </Panel>
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          El azul es el círculo de afuera y el blanco el de adentro, no al revés: con el papel
          afuera y el punto azul adentro la pieza pesa lo mismo prendida que apagada, porque lo
          único que cambia es el disco del medio. Con el relleno afuera, la elegida se ve de una en
          toda la fila. Y va sin anillo, que era justo lo que lo separaba del checkbox.
        </p>
      </Section>

      <Section
        title="Con etiqueta al lado"
        note="El caso para el que existe el radio y no el Segmented: cada opción con su propio texto."
      >
        <Panel>
          <Variant name="con etiqueta">
            <span className="flex items-center gap-5">
              <label className="flex items-center gap-2 text-xs font-medium text-ink">
                <Radio checked={suelto === 'si'} onChange={() => setSuelto('si')} label="Sí, avisarme" />
                Sí, avisarme
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-ink">
                <Radio checked={suelto === 'no'} onChange={() => setSuelto('no')} label="No hace falta" />
                No hace falta
              </label>
            </span>
          </Variant>
          <Variant name="deshabilitado">
            <Radio checked onChange={() => {}} disabled label="Prendido deshabilitado" />
            <Radio checked={false} onChange={() => {}} disabled label="Apagado deshabilitado" />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="El teclado"
        note="Es el de un grupo de radios y no el de una lista de botones: una sola parada de tabulación para todo el grupo —la elegida— y las flechas mueven y eligen a la vez. Es la diferencia entre tabular cuatro veces para pasar un grupo y tabular una. El foco se mueve con la elección: si se quedara atrás, la flecha siguiente saldría del lugar equivocado."
      >
        <Panel>
          <Variant name="probalo">
            <RadioGroup
              label="Probá las flechas"
              value={modo}
              onChange={setModo}
              options={[
                { value: 'todas', label: 'Todas' },
                { value: 'abiertas', label: 'Abiertas' },
                { value: 'cerradas', label: 'Cerradas' },
              ]}
            />
          </Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'Radio · checked', type: 'boolean', note: 'obligatorio: es controlado' },
          { name: 'Radio · onChange', type: '() => void', note: 'sin valor: el radio solo se prende' },
          { name: 'Radio · label', type: 'string', note: 'al aria-label: el texto visible entero, no un resumen' },
          { name: 'Radio · disabled', type: 'boolean' },
          { name: 'RadioGroup · value', type: 'T', note: 'obligatorio' },
          { name: 'RadioGroup · onChange', type: '(v: T) => void', note: 'obligatorio' },
          { name: 'RadioGroup · options', type: '{ value, label, disabled? }[]', note: 'obligatorio' },
          { name: 'RadioGroup · label', type: 'string', note: 'al aria-label del grupo' },
        ]} />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'role="radio" con aria-checked y nombre propio.',
          'El anillo del control sin elegir va en tinta y no en gris: sobre un tinte, el gris se ve sucio.',
        ]} />
      </Section>
    </Page>
  )
}
