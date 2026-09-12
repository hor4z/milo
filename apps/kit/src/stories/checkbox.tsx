import { useState } from 'react'
import { Checkbox } from '@milo/ui'
import { A11y, Page, Panel, Props, Section, Variant } from '../kit'

export function CheckboxStory() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [c, setC] = useState(true)

  return (
    <Page
      title="Checkbox"
      kind="Formularios"
      imports="import { Checkbox } from '@milo/ui'"
      lead="Caja de 18, la medida del pulgar del switch. El radio es `xs` (5) y no `sm` (6), que es el del kbd: sobre un cuadrado de 18, un radio de 6 deja solo 6px de lado plano de los 18 y la casilla se lee redonda. El kbd puede llevar 6 porque es más ancho que alto y le sobran lados rectos."
    >
      <Section
        title="Estados"
        note="Apagada es un campo hundido, igual que un kbd. Prendida pasa al azul de marca con el tilde en blanco y pierde el relieve, y eso es deliberado: lo hundido invita a apretar, y una casilla ya marcada no invita a nada, informa. El azul porque es el único control que confirma una elección de quien lo usa, y el azul es lo que el sistema reserva para eso."
      >
        <Panel>
          <Variant name="off / on">
            <Checkbox checked={b} onChange={setB} label="Sin marcar" />
            <Checkbox checked={a} onChange={setA} label="Marcada" />
          </Variant>
          <Variant name="indeterminate"><Checkbox checked={false} indeterminate onChange={() => {}} label="Parcial" /></Variant>
          <Variant name="disabled">
            <Checkbox checked onChange={() => {}} disabled label="Fija" />
            <Checkbox checked={false} onChange={() => {}} disabled label="Fija" />
          </Variant>
        </Panel>
      </Section>

      <Section title="En una fila" note="El `<label>` envolviendo la casilla hace que el texto también sea zona de click, que es la mitad del área útil del control. El tilde va a 12: el tamaño hay que calcularlo con el trazo incluido, porque agrega media línea de cada lado. A 16 ocupaba 12 de los 18 de la caja y quedaba casi tocando las esquinas; a 12 ocupa 9 y deja 4.5 de aire por lado.">
        <Panel>
          <Variant name="con etiqueta">
            <label className="flex items-center gap-2 text-body font-medium">
              <Checkbox checked={c} onChange={setC} />
              Compartir la receta con el equipo
            </label>
          </Variant>
          <Variant name="lista">
            <div className="flex flex-col gap-2">
              {['Geografía', 'Ciencias', 'Matemática'].map(x => (
                <label key={x} className="flex items-center gap-2 text-body font-medium">
                  <Checkbox checked={x === 'Ciencias'} onChange={() => {}} />
                  {x}
                </label>
              ))}
            </div>
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
