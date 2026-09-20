import cls from './radio.module.css'
import { useState } from 'react'
import { Checkbox } from '@milo/ui/checkbox'
import { Radio } from '@milo/ui/radio'
import { A11y, Example, Footnote, Page, Panel, Practices, Props, Section, Variant } from '../kit'

export function RadioStory() {
  const [compared, setCompared] = useState(true)
  const [one, setOne] = useState<'a' | 'b'>('b')
  const [mode, setMode] = useState<'todas' | 'abiertas' | 'cerradas'>('abiertas')
  const [loose, setLoose] = useState<'si' | 'no'>('si')
  const [withHint, setWithHint] = useState(true)

  return (
    <Page
      title="Radio · RadioGroup"
      kind="Formularios"
      imports="import { Radio } from '@milo/ui/radio'"
      lead="La elección de una entre varias. Es 18, la misma medida del Checkbox y del pulgar del switch, así una fila con los tres queda pareja."
    >
      <Section
        title="El grupo"
        note="Las opciones van sueltas sobre el papel, sin píldora gris detrás: esa es la receta del `Segmented`, y un radio metido ahí es el mismo control dibujado dos veces. Opciones cortas que se comparan de un vistazo son un Segmented; opciones que necesitan su propio texto al lado son este grupo."
      >
        <Panel>
          <Variant name="dos opciones">
            <Radio.Group
              label="Dos opciones"
              value={one}
              onChange={setOne}
              options={[{ value: 'a', label: 'La primera' }, { value: 'b', label: 'La segunda' }]}
            />
          </Variant>
          <Variant name="tres">
            <Radio.Group
              label="Tres opciones"
              value={mode}
              onChange={setMode}
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
        note="Mismo relleno azul prendido, misma caja vacía con su línea apagado, misma medida de 18. Lo único que cambia es la marca de adentro: un tilde o un disco. Dos piezas que dicen lo mismo ('esto lo elegí yo') no pueden dibujarse con dos recetas distintas."
      >
        <Panel>
          <Variant name="radio vs checkbox">
            <Radio checked={withHint} onChange={() => setWithHint(true)} label="Prendido" />
            <Radio checked={!withHint} onChange={() => setWithHint(false)} label="Apagado" />
            <span className={cls.checkboxPair}>
              <Checkbox checked={compared} onChange={setCompared} label="Checkbox prendido" />
              <Checkbox checked={!compared} onChange={v => setCompared(!v)} label="Checkbox apagado" />
            </span>
          </Variant>
        </Panel>
        <Footnote>
          El azul es el círculo de afuera y el blanco el de adentro, no al revés: con el papel
          afuera y el punto azul adentro la pieza pesa lo mismo prendida que apagada, porque lo
          único que cambia es el disco del medio. Con el relleno afuera, la elegida se ve de una en
          toda la fila. Y va sin anillo, que era justo lo que lo separaba del checkbox.
        </Footnote>
      </Section>

      <Section
        title="Con etiqueta al lado"
        note="El caso para el que existe el radio y no el Segmented: cada opción con su propio texto."
      >
        <Panel>
          <Variant name="con etiqueta">
            <span className={cls.looseGroup}>
              <label className={cls.yesLabel}>
                <Radio checked={loose === 'si'} onChange={() => setLoose('si')} label="Sí, avisarme" />
                Sí, avisarme
              </label>
              <label className={cls.noLabel}>
                <Radio checked={loose === 'no'} onChange={() => setLoose('no')} label="No hace falta" />
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
        note="Es el de un grupo de radios y no el de una lista de botones: una sola parada de tabulación para todo el grupo, y las flechas mueven y eligen a la vez. El foco se mueve con la elección: si se quedara atrás, la flecha siguiente saldría del lugar equivocado."
      >
        <Panel>
          <Variant name="probalo">
            <Radio.Group
              label="Probá las flechas"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'todas', label: 'Todas' },
                { value: 'abiertas', label: 'Abiertas' },
                { value: 'cerradas', label: 'Cerradas' },
              ]}
            />
          </Variant>
        </Panel>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`const [modo, setModo] = useState('individual')

<Radio.Group
  value={modo}
  onChange={setModo}
  label="Cómo se entrega"
  options={[
    { value: 'individual', label: 'Individual' },
    { value: 'grupal', label: 'En grupo' },
  ]}
/>`} />
      </Section>

      <Section title="Props">
        <Props of="Radio" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Van adentro de un `Radio.Group`, que es lo que le da el roving al teclado.</Practices.Do>
          <Practices.Dont>Con más de cinco opciones va un `Select`: cinco radios ocupan media pantalla.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>role="radio" con aria-checked y nombre propio.</A11y.Item>
          <A11y.Item>El anillo del control sin elegir va en tinta y no en gris: sobre un tinte, el gris se ve sucio.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
