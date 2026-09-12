import { useState } from 'react'
import { IconButton, Kbd, TextField } from '@melu/ui'
import { Demo, Page, Props, Section } from '../kit'

export function TextFieldStory() {
  const [text, setText] = useState('Fracciones con la receta de la abuela')

  return (
    <Page
      title="TextField"
      lead="Plano: un fondo y una línea de un píxel, sin relieve. El campo fue un hueco y el volumen se fue a propósito — el relieve dice «esto sobresale» o «esto se aprieta», y un campo no es ninguna de las dos. Así se dibuja igual que el Select y que el buscador de la topbar. Al enfocarse no cambia de plano: se le tiñe el borde que ya tenía. El anillo del sistema es para una pieza sin borde propio; sobre un campo dibujaba una segunda línea azul a dos píxeles de la primera."
    >
      <Section title="Variantes">
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'solo', el: <TextField value={text} onChange={e => setText(e.target.value)} className="w-full" /> },
            { label: 'con icono', el: <TextField icon="search" placeholder="Buscar una actividad…" className="w-full" /> },
            { label: 'con suffix', el: <TextField placeholder="Duración" suffix={<Kbd>min</Kbd>} className="w-full" /> },
            { label: 'disabled', el: <TextField placeholder="No editable" disabled className="w-full" /> },
          ].map(v => (
            <div key={v.label} className="w-full max-w-[320px]">
              <Demo label={v.label}>{v.el}</Demo>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Las tres alturas"
        note="Las mismas del Button, con los mismos radios, iconos y tamaños de letra: un campo y el botón que lo acompaña en la misma fila tienen que medir lo mismo. Lo único distinto es el padding lateral — el texto de un botón está centrado y necesita aire de los dos lados, el de un campo arranca pegado a la izquierda."
      >
        <div className="flex flex-wrap gap-3">
          {(['sm', 'md', 'lg'] as const).map(s => (
            <div key={s} className="w-full max-w-[320px]">
              <Demo label={s}>
                <TextField size={s} icon="search" placeholder="Buscar una actividad…" className="w-full" />
              </Demo>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="El click y el foco"
        note="El input tapa la caja entera: un `<input>` mide lo que mide su línea de texto —16px— y adentro de una caja de 40 eso dejaba 12 muertos arriba y 12 abajo, así que media caja no recibía el click. Y el anillo de foco es del campo y no del input de adentro: si no, queda un rectángulo flotando adentro de la caja. Con un botón adentro, el campo no se enciende — la marca es del botón."
      >
        <div className="flex flex-wrap gap-3">
          <div className="w-full max-w-[320px]">
            <Demo label="con botón adentro">
              <TextField
                placeholder="Buscar…"
                className="w-full"
                suffix={<IconButton icon="close" label="Limpiar" variant="ghost" size="sm" />}
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section title="Props" note="Todo lo que acepta un `<input>` nativo pasa derecho: `value`, `onChange`, `placeholder`, `disabled`, `type`.">
        <Props rows={[
          { name: 'size', type: "'sm' | 'md' | 'lg'", note: '32 · 36 · 40, las del Button. Default lg' },
          { name: 'icon', type: 'IconName', note: 'a la izquierda, en gris' },
          { name: 'suffix', type: 'ReactNode', note: 'a la derecha: una unidad, un kbd, un botón' },
          { name: 'className', type: 'string', note: 'va al contenedor, no al input — para el ancho' },
        ]} />
      </Section>
    </Page>
  )
}
