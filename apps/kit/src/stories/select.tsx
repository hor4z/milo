import { useState } from 'react'
import { Select } from '@melu/ui'
import { Block, Demo, Props, Section } from '../kit'

export function SelectStory() {
  const [nivel, setNivel] = useState('6.º grado')
  const [area, setArea] = useState('Matemática')
  const [largo, setLargo] = useState('Cualquiera con el link puede ver y comentar')

  return (
    <Section
      title="Select"
      note="Es un botón con un listbox propio, no un `<select>` nativo. `appearance: none` te saca la flecha, pero la lista desplegada la sigue dibujando el sistema operativo, así que en Linux aparece un control de GTK en medio de la interfaz: el campo se ve «sin estilo» por más que la caja esté bien."
    >
      <Block
        label="Variantes"
        note="El costo de no usar el nativo es traer el teclado a mano, que es lo que el nativo regalaba: flechas para moverse, Enter para elegir, Escape para salir, Home y End a los extremos. Probalo con el teclado."
      >
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="width 160">
            <Select value={nivel} onChange={setNivel} width={160} options={['4.º grado', '5.º grado', '6.º grado', '7.º grado']} />
          </Demo>
          <Demo label="al ancho del contenido">
            <Select value={area} onChange={setArea} options={['Matemática', 'Lengua', 'Ciencias', 'Geografía', 'Convivencia']} />
          </Demo>
          <div className="w-full max-w-[300px]">
            <Demo label="valor largo · se trunca">
              <Select
                value={largo}
                onChange={setLargo}
                width={280}
                options={['Solo yo', 'Todo el equipo', 'Cualquiera con el link puede ver y comentar']}
              />
            </Demo>
          </div>
        </div>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'value', type: 'string', note: 'obligatorio' },
          { name: 'onChange', type: '(v: string) => void' },
          { name: 'options', type: 'string[]', note: 'obligatorio' },
          { name: 'width', type: 'number', note: 'sin esto toma el ancho del contenido' },
        ]} />
      </Block>
    </Section>
  )
}
