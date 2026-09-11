import { useState } from 'react'
import { Checkbox, Radio, RadioGroup } from '@melu/ui'
import { Block, Panel, Props, Section, Variant } from '../kit'

export function RadioStory() {
  const [uno, setUno] = useState<'a' | 'b'>('b')
  const [modo, setModo] = useState<'todas' | 'abiertas' | 'cerradas'>('abiertas')
  const [suelto, setSuelto] = useState<'si' | 'no'>('si')
  const [con, setCon] = useState(true)

  return (
    <Section
      title="Radio · RadioGroup"
      note="La elección de una entre varias. Es 18, la misma medida del Checkbox y del pulgar del switch, así una fila con los tres queda pareja."
    >
      <Block
        label="Adentro de una píldora"
        note="Con `track` el grupo va adentro de una pista apagada, que es la receta de la pista del Segmented — mismo fondo y mismo padding — porque es la misma idea: un contenedor apagado con la pieza elegida flotando adentro."
      >
        <Panel>
          <Variant name="dos opciones">
            <RadioGroup
              track
              label="Dos opciones"
              value={uno}
              onChange={setUno}
              options={[{ value: 'a', label: 'La primera' }, { value: 'b', label: 'La segunda' }]}
            />
          </Variant>
          <Variant name="tres">
            <RadioGroup
              track
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
      </Block>

      <Block
        label="Prendido es el pulgar del slider"
        note="El disco claro con relieve y un punto azul adentro. No es lo mismo que el checkbox, que se llena entero de azul, y la diferencia no es de gusto: una casilla llena sigue leyéndose como casilla, pero un círculo lleno de azul deja de leerse como radio — lo que dice «radio» es el anillo con algo adentro. Así que el azul va donde puede ir sin romper la forma, que es el punto. El color es el mismo de siempre y por la misma regla: es lo que el usuario prendió o confirmó."
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
          Apagado va con el anillo en tinta al 8% y no con un gris opaco: el radio vive tanto
          sobre el papel como adentro de una pista apagada, y un gris opaco que funciona sobre uno
          se ve como una línea sucia sobre el otro.
        </p>
      </Block>

      <Block
        label="Sueltos"
        note="Sin `track`, que es lo normal cuando cada opción lleva su etiqueta al lado."
      >
        <Panel>
          <Variant name="con etiqueta">
            <span className="flex items-center gap-5">
              <label className="flex items-center gap-2 text-xs font-medium text-ink">
                <Radio checked={suelto === 'si'} onChange={() => setSuelto('si')} label="Sí" />
                Sí, avisarme
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-ink">
                <Radio checked={suelto === 'no'} onChange={() => setSuelto('no')} label="No" />
                No hace falta
              </label>
            </span>
          </Variant>
          <Variant name="deshabilitado">
            <Radio checked onChange={() => {}} disabled label="Prendido deshabilitado" />
            <Radio checked={false} onChange={() => {}} disabled label="Apagado deshabilitado" />
          </Variant>
        </Panel>
      </Block>

      <Block
        label="El teclado"
        note="Es el de un grupo de radios y no el de una lista de botones: una sola parada de tabulación para todo el grupo —la elegida— y las flechas mueven y eligen a la vez. Es la diferencia entre tabular cuatro veces para pasar un grupo y tabular una. El foco se mueve con la elección: si se quedara atrás, la flecha siguiente saldría del lugar equivocado."
      >
        <Panel>
          <Variant name="probalo">
            <RadioGroup
              track
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
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'Radio · checked', type: 'boolean', note: 'obligatorio: es controlado' },
          { name: 'Radio · onChange', type: '() => void', note: 'sin valor: el radio solo se prende' },
          { name: 'Radio · label', type: 'string', note: 'al aria-label' },
          { name: 'Radio · disabled', type: 'boolean' },
          { name: 'RadioGroup · value', type: 'T', note: 'obligatorio' },
          { name: 'RadioGroup · onChange', type: '(v: T) => void', note: 'obligatorio' },
          { name: 'RadioGroup · options', type: '{ value, label, disabled? }[]', note: 'obligatorio' },
          { name: 'RadioGroup · track', type: 'boolean', note: 'adentro de una píldora apagada' },
          { name: 'RadioGroup · label', type: 'string', note: 'al aria-label del grupo' },
        ]} />
      </Block>
    </Section>
  )
}
