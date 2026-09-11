import { useState } from 'react'
import { Input, Kbd } from '@melu/ui'
import { Block, Demo, Props, Section } from '../kit'

export function InputStory() {
  const [text, setText] = useState('Fracciones con la receta de la abuela')

  return (
    <Section
      title="Input"
      note="40 de alto sobre fondo apagado, y al enfocarse pasa al papel con relieve en vez de dibujar un borde de color. El foco se marca cambiando el plano del campo, que es lo mismo que hace el resto del sistema."
    >
      <Block label="Variantes">
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'solo', el: <Input value={text} onChange={e => setText(e.target.value)} className="w-full" /> },
            { label: 'con icono', el: <Input icon="search" placeholder="Buscar una actividad…" className="w-full" /> },
            { label: 'con suffix', el: <Input placeholder="Duración" suffix={<Kbd>min</Kbd>} className="w-full" /> },
            { label: 'disabled', el: <Input placeholder="No editable" disabled className="w-full" /> },
          ].map(v => (
            <div key={v.label} className="w-full max-w-[320px]">
              <Demo label={v.label}>{v.el}</Demo>
            </div>
          ))}
        </div>
      </Block>

      <Block label="Props" note="Todo lo que acepta un `<input>` nativo pasa derecho: `value`, `onChange`, `placeholder`, `disabled`, `type`.">
        <Props rows={[
          { name: 'icon', type: 'IconName', note: 'a la izquierda, en gris' },
          { name: 'suffix', type: 'ReactNode', note: 'a la derecha: una unidad, un kbd, un botón' },
          { name: 'className', type: 'string', note: 'va al contenedor, no al input — para el ancho' },
        ]} />
      </Block>
    </Section>
  )
}
